'use strict'

const { v1: uuidv1, v4: uuidv4 } = require('uuid');

const Models = use('App/Controllers/Http/ModelController')
const HelperFunctions = use('App/Controllers/Http/HelperFunctionController');
const Configs = use('App/Controllers/Http/ConfigController');
const Hash = use('Hash');
const Axios = require("axios");
const xmlParser = require('xml2js').parseString;
const nodemailer = require("nodemailer");
const moment = require('moment-timezone');
const stripe = require('stripe')('sk_test_51ILP43I9fIfkJNmASzchDipuXdD59Mze5KJIFH1Qbvw1TYEaobO44TliqVgHco42Yt3Zg2BvWrTaMgMlJswFQvqT00W2Zsbw9U');
const Hashids = require('hashids/cjs')
const hashids = new Hashids('', 10)


class UserController {

    async auth({ request, response, auth }) {
        let userAuth = auth.authenticator('user')


        try {
            let user = await userAuth.getUser()
            return response.json(user);
        } catch (err) {
            return response.json({ error: '未登入' })
        }

    }

    async register({ request, response, auth }) {

        const { email, password, confirmPassword, area_code, phone, username, receive_info } = request.all();
        const now = HelperFunctions.DateParser.toSQLForm(new Date());

        let userAuth = auth.authenticator('user')

        let checkUsername = await Models.User.findBy('username', username);
        let checkOldUsername = await Models.OldUser.findBy('user_login', username);

        if (checkUsername || checkOldUsername) {
            return response.json({ error: { DUP_USERNAME: '此用戶名稱已經被註冊， 請選擇另一個名稱' } })
        }

        let checkEmail = await Models.User.findBy('email', email);
        let checkOldEmail = await Models.OldUser.findBy('user_email', email)

        if (checkEmail || checkOldEmail) {
            return response.json({ error: { INVALID_EMAIL: '此電郵已經被註冊， 請選擇另一個電郵' } })
        }

        if (!email.split('@')[1]) {
            return response.json({ error: { INVALID_EMAIL: '請輸入有效的電郵地址' } })
        }

        if (!password) {
            return response.json({ error: { EMTPY_PW: '請輸入密碼' } })
        }

        if (password !== confirmPassword) {
            return response.json({ error: { PW_NOT_MATCH: '密碼不相符' } })
        }

        let phoneRegex = /^\d+$/;
        if (!phoneRegex.test(phone)) {
            return response.json({ error: { INVALID_PHONE: '無效的電話號碼' } })
        }

        let EmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if (!EmailRegex.test(email)) {
            return response.json({ error: { INVALID_EMAIL: '無效的電郵地址' } })
        }

        try {

            const user = await Models.User.create({
                email: email,
                password: password,
                phone: phone,
                username: username,
                area_code: area_code,
                role: 'user',
                receive_info: receive_info
            })

            if (!user) {

                return response.json({ error: '未能成功註冊' })
            }

            let transporter = nodemailer.createTransport(Configs.Email.mailConfig);

            const info = await transporter.sendMail({
                from: '"MeLearn.Guru noreply@enrichculture.com',
                to: email,
                subject: '[No Reply]歡迎加入MeLearn.guru',
                html: Configs.Email.template.registration(user),
                // attachments: [{
                //     filename: `logo_email.png`,
                //     path: __dirname + '/../../../../public/assest/logo_email_long.png',
                //     cid: 'logo'
                // }]
            })

            user.verification_code = Math.floor(100000 + Math.random() * 900000);
            await user.save();


            // SEND SMS
            if (process.env.NODE_ENV === 'production') {
                const message = `你的MeLearn.guru一次性密碼為${user.verification_code}. 請在MeLearn.guru上輸入此一次性密碼以登入系統。謝謝！`;
                const phone_to_sent = `${user.area_code.split('+')[1]}${user.phone}`;

                let encodedUsername = encodeURIComponent('enrichdigital');
                let encodedPassword = encodeURIComponent('ed321#');
                let encodedMessage = encodeURIComponent(message);
                let encodedTelephone = encodeURIComponent(phone_to_sent);
                let url = `https://api3.ablemobile.com/service/smsapi.asmx/SendSMS?Username=${encodedUsername}&Password=${encodedPassword}&Message=${encodedMessage}&Hex=&Telephone=${encodedTelephone}&UserDefineNo=000&Sender=`

                let smsState = await Axios.get(url)
                    .then(async res => {
                        let xml = res.data;
                        let state
                        xmlParser(xml, (err, result) => {
                            if (result.ReturnValue.State[0] == 1) {
                                state = 'success';
                            } else {
                                state = 'failed'
                            }
                        })
                        return state;

                    })
                    .catch(err => {
                        console.log(err);
                        return response.json({ error: err })
                    })

                if (smsState === 'success') {
                    return response.json({ next: '2fa' });
                } else {
                    return response.status(200).json({ error: '未能成功登入' })
                }
            } else {
                return response.json({ next: '2fa', code: user.verification_code });
            }

        } catch (error) {
            console.log(error)
            return response.json({ error: '未能成功註冊' })
        }


    }

    async login({ request, response, auth }) {

        let { emailOrUsername, password } = request.all();

        if (!password || !emailOrUsername) {
            return response.json({ error: '請輸入電郵/用戶名稱及密碼' })
        }

        let email;
        let username;
        let user
        let userAuth = auth.authenticator("user");

        if (emailOrUsername.split('@').length > 1) {
            email = emailOrUsername
        } else {
            username = emailOrUsername
        }

        try {
            if (email) {
                user = await Models.User.findBy('email', email);
            }
            if (username) {
                user = await Models.User.findBy('username', username);
            }

            if (!user) {
                let oldUser;

                if (email) {
                    oldUser = await Models.OldUser.findBy('user_email', email)
                }

                if (username) {
                    oldUser = await Models.OldUser.findBy('user_login', username)
                }


                if (oldUser) {
                    user = new Models.User();

                    user.email = oldUser.user_email;
                    user.username = oldUser.user_login;
                    user.role = 'user';

                    await user.save()

                    return response.json({ next: 'reset_pw', oldUser: oldUser })
                }

                return response.json({ error: { NOT_EXIST: '不存在的用戶名稱/電郵' } })
            } else {

                if (user.deleted_at) {
                    return response.json({ error: { AC_BANNED: '你的用戶已被停用，請聯絡MeLearn.Guru' } })
                }


                if (!user.password && !user.facebook_id && !user.google_id) {
                    return response.json({
                        next: 'reset_pw', oldUser: {
                            user_email: user.email,
                            user_login: user.username
                        }
                    })
                }

                try {
                    let checkPassword = await Hash.verify(password, user.password)

                    if (checkPassword) {
                        user.verification_code = Math.floor(100000 + Math.random() * 900000);
                        await user.save()
                        // -------------- Send SMS ------------------//
                        if (process.env.NODE_ENV === 'production' && user.role !== 'admin') {
                            const message = `你的MeLearn.guru一次性密碼為${user.verification_code}. 請在MeLearn.guru上輸入此一次性密碼以登入系統。謝謝！`;
                            const phone = `${user.area_code.split('+')[1]}${user.phone}`;

                            let encodedUsername = encodeURIComponent('enrichdigital');
                            let encodedPassword = encodeURIComponent('ed321#');
                            let encodedMessage = encodeURIComponent(message);
                            let encodedTelephone = encodeURIComponent(phone);
                            let url = `https://api3.ablemobile.com/service/smsapi.asmx/SendSMS?Username=${encodedUsername}&Password=${encodedPassword}&Message=${encodedMessage}&Hex=&Telephone=${encodedTelephone}&UserDefineNo=000&Sender=`;

                            let smsState = await Axios.get(url)
                                .then(async res => {
                                    let xml = res.data;
                                    let state;
                                    xmlParser(xml, (err, result) => {
                                        if (result.ReturnValue.State[0] == 1) {
                                            state = 'success';
                                        } else {
                                            state = 'failed'
                                        }
                                    })
                                    return state;
                                })
                                .catch(err => {
                                    console.log(err);
                                    return response.json({ error: err })
                                })


                            if (smsState === 'success') {
                                return response.status(200).json({ next: '2fa', phone: user.phone, area_code: user.area_code, email: user.email });
                            } else {
                                return response.status(200).json({ error: '未能成功登入' })
                            }
                        } else {

                            if (user.role === 'admin') {
                                await userAuth.remember(true).login(user);
                                user.login_token = uuidv4();
                                user.verification_code = null;
                                await user.save()
                                return response.status(200).json({ next: 'admin-authed', phone: user.phone, area_code: user.area_code, email: user.email, user: user });
                            }
                            return response.status(200).json({ next: '2fa', phone: user.phone, area_code: user.area_code, email: user.email, code: user.verification_code });
                        }


                    } else {
                        return response.json({ error: { INCORRECT_PW: '錯誤的密碼' } })
                    }

                } catch (err) {
                    console.log(err);

                    return response.json({ error: '未能成功登入' })

                }
            }

        } catch (error) {
            console.log(error)
            return response.json({ error: '未能成功登入' })
        }

    }

    async completeMissingFields({ response, request, auth }) {

        let userAuth = auth.authenticator('user');

        let { email, phone, area_code, username, facebook_id, google_id } = request.all();

        let userByUsername = await Models.User.findBy('username', username)
        if (userByUsername) {
            return response.json({ error: { DUP_USERNAME: '此用戶名稱已經被註冊， 請選擇另一個名稱' } })
        }

        let EmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!EmailRegex.test(email)) {
            return response.json({ error: { INVALID_EMAIL: '無效的電郵地址' } })
        }

        let userByEmail = await Models.User.findBy('email', email);
        if (userByEmail) {
            return response.json({ error: { INVALID_EMAIL: '此電郵已經被註冊， 請選擇另一個電郵' } })
        }


        let phoneRegex = /^\d+$/;
        if (!phoneRegex.test(phone)) {
            return response.json({ error: { INVALID_PHONE: '無效的電話號碼' } })
        }

        try {

            let currentUser;

            if (facebook_id) {
                currentUser = await Models.User.findBy('facebook_id', facebook_id)
            } else if (google_id) {
                currentUser = await Models.User.findBy('google_id', google_id)
            }

            if (currentUser) {
                currentUser.email = email;
                currentUser.phone = phone;
                currentUser.area_code = area_code;
                // currentUser.login_token = uuidv4();
                currentUser.username = username;

                await currentUser.save()
                await userAuth.remember(true).login(currentUser);

                let transporter = nodemailer.createTransport(Configs.Email.mailConfig);

                const info = await transporter.sendMail({
                    from: '"MeLearn.Guru noreply@enrichculture.com',
                    to: email,
                    subject: '[No Reply]歡迎加入MeLearn.guru',
                    html: Configs.Email.template.registration(currentUser),
                    // attachments: [{
                    //     filename: `logo_email.png`,
                    //     path: __dirname + '/../../../../public/assest/logo_email_long.png',
                    //     cid: 'logo'
                    // }]
                })


                //Send SMS
                currentUser.verification_code = Math.floor(100000 + Math.random() * 900000);
                await currentUser.save()
                if (process.env.NODE_ENV === 'production') {

                    const message = `你的MeLearn.guru一次性密碼為${currentUser.verification_code}. 請在MeLearn.guru上輸入此一次性密碼以登入系統。謝謝！`;
                    const phone_to_sent = `${currentUser.area_code.split('+')[1]}${currentUser.phone}`;

                    let encodedUsername = encodeURIComponent('enrichdigital');
                    let encodedPassword = encodeURIComponent('ed321#');
                    let encodedMessage = encodeURIComponent(message);
                    let encodedTelephone = encodeURIComponent(phone_to_sent);
                    let url = `https://api3.ablemobile.com/service/smsapi.asmx/SendSMS?Username=${encodedUsername}&Password=${encodedPassword}&Message=${encodedMessage}&Hex=&Telephone=${encodedTelephone}&UserDefineNo=000&Sender=`

                    let smsState = await Axios.get(url)
                        .then(async res => {
                            let xml = res.data;
                            let state
                            xmlParser(xml, (err, result) => {
                                if (result.ReturnValue.State[0] == 1) {
                                    state = 'success';
                                } else {
                                    state = 'failed'
                                }
                            })
                            return state;

                        })
                        .catch(err => {
                            console.log(err);
                            return response.json({ error: err })
                        })

                    if (smsState === 'success') {
                        return response.json({ next: '2fa', email: currentUser.email, phone: currentUser.phone, area_code: currentUser.area_code });
                    } else {
                        return response.status(200).json({ error: '未能成功登入' })
                    }
                } else {
                    return response.json({
                        next: '2fa',
                        code: currentUser.verification_code,
                        email: currentUser.email,
                        phone: currentUser.phone,
                        area_code: currentUser.area_code
                    });
                }

            } else {
                response.json({ error: '未能成功註冊' })
            }


        } catch (err) {
            console.log(err);
            return response.json({ error: err.code })

        }

    }

    async socialPlatformLogin({ response, request, auth }) {

        let userAuth = auth.authenticator('user');

        let { email, userID, platform } = request.all();

        try {
            let user;

            //Reject Old wordpress user using facebook/google signin
            if (email) {
                let oldUser = await Models.OldUser
                    .query()
                    .where('user_email', email)
                    .first()

                if (oldUser) {
                    return response.json({ error: '你需要使用電郵登入' })
                }
            }

            //Find user By email;
            if (email) {
                user = await Models.User
                    .query()
                    .where('email', email)
                    .where('deleted_at', null)
                    .first()
            } else { //Find user By facebook id;
                if (platform === 'facebook') {
                    user = await Models.User
                        .query()
                        .where('facebook_id', userID)
                        .where('deleted_at', null)
                        .first()
                }
                if (platform === 'google') {
                    user = await Models.User
                        .query()
                        .where('google_id', userID)
                        .where('deleted_at', null)
                        .first()
                }

            }

            if (user) {

                if (platform === 'facebook') {
                    if (!user.facebook_id) {
                        user.facebook_id = userID;
                    }
                }
                if (platform === 'google') {
                    if (!user.google_id) {
                        user.google_id = userID;
                    }
                }

                if (!user.email || !user.phone) {
                    await user.save()
                    return response.json({ user: user, missing_fields: true })
                } else {
                    // user.login_token = uuidv4();
                    // await user.save()
                    // await userAuth.remember(true).login(user);


                    //Send SMS
                    user.verification_code = Math.floor(100000 + Math.random() * 900000);
                    await user.save();

                    if (process.env.NODE_ENV === 'production') {
                        const message = `你的MeLearn.guru一次性密碼為${user.verification_code}. 請在MeLearn.guru上輸入此一次性密碼以登入系統。謝謝！`;
                        const phone = `${user.area_code.split('+')[1]}${user.phone}`;

                        let encodedUsername = encodeURIComponent('enrichdigital');
                        let encodedPassword = encodeURIComponent('ed321#');
                        let encodedMessage = encodeURIComponent(message);
                        let encodedTelephone = encodeURIComponent(phone);
                        let url = `https://api3.ablemobile.com/service/smsapi.asmx/SendSMS?Username=${encodedUsername}&Password=${encodedPassword}&Message=${encodedMessage}&Hex=&Telephone=${encodedTelephone}&UserDefineNo=000&Sender=`;

                        let smsState = await Axios.get(url)
                            .then(async res => {
                                let xml = res.data;
                                let state;
                                xmlParser(xml, (err, result) => {
                                    if (result.ReturnValue.State[0] == 1) {
                                        state = 'success';
                                    } else {
                                        state = 'failed'
                                    }
                                })
                                return state;
                            })
                            .catch(err => {
                                console.log(err);
                                return response.json({ error: err })
                            })

                        if (smsState === 'success') {

                            return response.json({ next: '2fa', phone: user.phone, area_code: user.area_code, email: user.email })
                        } else {
                            return response.json({ error: '未能重新發送短訊，請重試' })
                        }
                    } else {
                        if (user.role === 'admin') {
                            await userAuth.remember(true).login(user);
                            user.login_token = uuidv4();
                            user.verification_code = null;
                            await user.save()
                            return response.status(200).json({ next: 'admin-authed', phone: user.phone, area_code: user.area_code, email: user.email, user: user });
                        }
                        return response.status(200).json({ next: '2fa', phone: user.phone, area_code: user.area_code, email: user.email, code: user.verification_code });
                    }
                }
            } else {
                user = new Models.User();
                user.role = 'user';
                if (platform === 'facebook') {
                    user.facebook_id = userID;
                }
                if (platform === 'google') {
                    user.google_id = userID;
                }

                user.role = 'user';
                await user.save();
                return response.json({ user: user, missing_fields: true })
            }
        } catch (err) {
            console.log(err);
            return response.json({ error: err })
        }

    }

    async resend2fa({ request, response }) {

        let { email } = request.all();

        try {
            let user = await Models.User.findBy('email', email);
            if (user) {
                user.verification_code = Math.floor(100000 + Math.random() * 900000);
                await user.save()


                if (process.env.NODE_ENV === 'production') {
                    const message = `你的MeLearn.guru一次性密碼為${user.verification_code}. 請在MeLearn.guru上輸入此一次性密碼以登入系統。謝謝！`;
                    const phone = `${user.area_code.split('+')[1]}${user.phone}`;

                    let encodedUsername = encodeURIComponent('enrichdigital');
                    let encodedPassword = encodeURIComponent('ed321#');
                    let encodedMessage = encodeURIComponent(message);
                    let encodedTelephone = encodeURIComponent(phone);
                    let url = `https://api3.ablemobile.com/service/smsapi.asmx/SendSMS?Username=${encodedUsername}&Password=${encodedPassword}&Message=${encodedMessage}&Hex=&Telephone=${encodedTelephone}&UserDefineNo=000&Sender=`;

                    let smsState = await Axios.get(url)
                        .then(async res => {
                            let xml = res.data;
                            let state;
                            xmlParser(xml, (err, result) => {
                                if (result.ReturnValue.State[0] == 1) {
                                    state = 'success';
                                } else {
                                    state = 'failed'
                                }
                            })
                            return state;
                        })
                        .catch(err => {
                            console.log(err);
                            return response.json({ error: err })
                        })

                    if (smsState === 'success') {
                        return response.json({ message: '已重新發送驗証碼至' + user.phone })
                    } else {
                        return response.json({ error: '未能重新發送短訊，請重試' })
                    }
                } else {
                    return response.json({ message: '已重新發送驗証碼至' + user.phone, code: user.verification_code })
                }


            } else {
                return response.json({ error: '未找到以此電郵註冊的帳戶' })
            }
        } catch (err) {
            console.log(err);
            return response.json({ error: err })
        }
    }

    async verify2fa({ request, response, auth }) {

        let { code, email } = request.all();

        let userAuth = auth.authenticator('user')

        try {
            let user = await Models.User.findBy('email', email);

            if (user.verification_code === code) {

                if (!user.phone_verified) {
                    user.phone_verified = true
                }
                await userAuth.remember(true).login(user);
                user.login_token = uuidv4();
                user.verification_code = null;
                await user.save()
                return response.json({ user: user });
            } else {

                return response.json({ error: { INCORRECT_CODE: '錯誤的驗証碼' } })
            }
        } catch (err) {
            console.log(err);
            return response.status(401)
        }



    }

    async updateOldUserPhone({ request, response, auth }) {

        let { email, username, inputData } = request.all()
        let userAuth = auth.authenticator('user');

        try {
            let user = await Models.User.findBy('email', email);

            let phoneRegex = /^\d+$/;
            if (!phoneRegex.test(inputData.phone)) {
                return response.json({ error: { INVALID_PHONE: '無效的電話號碼' } })
            }

            user.area_code = inputData.areaCode;
            user.phone = inputData.phone;
            user.verification_code = Math.floor(100000 + Math.random() * 900000);

            let userEnrolledRecord = await Models.OldEnrolledCourse
                .query()
                .where('email', user.email)
                .fetch()

            let recordArr = userEnrolledRecord.toJSON()

            recordArr.forEach(async record => {

                let newEnrolledRecord = new Models.CourseEnrollment();
                newEnrolledRecord.user_id = user.id,
                    newEnrolledRecord.course_id = record.course_id,
                    newEnrolledRecord.finished = record.course_completed === 'YES' ? 1 : 0

                await newEnrolledRecord.save()

            })

            let transporter = nodemailer.createTransport(Configs.Email.mailConfig);

            let reset_pw_token = uuidv1();

            user.reset_pw_token = reset_pw_token;
            await user.save();

            const info = await transporter.sendMail({
                from: '"MeLearn.Guru noreply@enrichculture.com',
                to: user.email,
                subject: 'MeLearn.Guru的重設密碼請求',
                html: Configs.Email.template.forgotPassword(user.username, reset_pw_token),
                // attachments: [{
                //     filename: `logo_email.png`,
                //     path: __dirname + '/../../../../public/assest/logo_email_long.png',
                //     cid: 'logo'
                // }]
            })

            //Send SMS
            if (process.env.NODE_ENV === 'production') {
                const message = `你的MeLearn.guru一次性密碼為${user.verification_code}. 請在MeLearn.guru上輸入此一次性密碼以登入系統。謝謝！`;
                const phone = `${user.area_code.split('+')[1]}${user.phone}`;

                let encodedUsername = encodeURIComponent('enrichdigital');
                let encodedPassword = encodeURIComponent('ed321#');
                let encodedMessage = encodeURIComponent(message);
                let encodedTelephone = encodeURIComponent(phone);
                let url = `https://api3.ablemobile.com/service/smsapi.asmx/SendSMS?Username=${encodedUsername}&Password=${encodedPassword}&Message=${encodedMessage}&Hex=&Telephone=${encodedTelephone}&UserDefineNo=000&Sender=`;
                let smsState = await Axios.get(url)
                    .then(async res => {
                        let xml = res.data;
                        let state
                        xmlParser(xml, (err, result) => {
                            if (result.ReturnValue.State[0] == 1) {
                                state = 'success';
                            } else {
                                state = 'failed'
                            }
                        })
                        return state;
                    })
                    .catch(err => {
                        console.log(err);
                        return response.json({ error: err })
                    })
                if (smsState === 'success') {
                    return response.json({ user: user })
                } else {
                    return response.json({ error: '未能重新發送短訊，請重試' })
                }
            } else {
                return response.json({ user: user, code: user.verification_code })
            }

        } catch (err) {
            console.log(err)
            return response.json({ error: '未能成功更改密碼' })
        }



    }


    async logout({ auth, response }) {
        let userAuth = auth.authenticator('user');
        try {
            await userAuth.logout()
            return response.json({ message: '已成功登出' })
        } catch (error) {
            return response.json({ error: '未能成功登出' })
        }

    }

    async update({ request, response, auth }) {

        const userAuth = auth.authenticator('user');
        const now = HelperFunctions.DateParser.toSQLForm(new Date())

        const {
            phone,
            gender,
            first_name,
            last_name,
            birthday_month,
            education_level,
            occupation,
            monthly_income,
            living_area,
            invest,
            home_ownership,
            marketing,
            business_management,
            career,
            health,
            education,
            travel,
            other_interest,
            interested_tutor,
            book,
            activity,
            whatsapp,
            promo_email,
            other_method
        } = request.all()

        const userData = {
            phone,
            gender,
            first_name,
            last_name,
            birthday_month,
            education_level,
            occupation,
            monthly_income,
            living_area
        }

        const userInterestData = {
            invest,
            home_ownership,
            marketing,
            business_management,
            career,
            health,
            education,
            travel,
            other_interest,
            interested_tutor
        }

        const userPromoData = {
            book,
            activity,
            whatsapp,
            promo_email,
            other_method
        }

        const oldUser = await userAuth.getUser();

        try {
            let user = await Models.User.find(oldUser.id);
            let usersInterest = await Models.UsersInterest.findBy('user_id', oldUser.id)
            let usersPromoSetting = await Models.UsersPromoSetting.findBy('user_id', oldUser.id)
            user.merge({
                ...userData,
                updated_at: now
            })
            await user.save()
            usersInterest.merge({
                ...userInterestData,
                updated_at: now
            })
            await usersInterest.save()
            usersPromoSetting.merge({
                ...userPromoData,
                updated_at: now
            })
            await usersPromoSetting.save()

            return response.json({ user: user });
        } catch (error) {
            return response.json({ error: '未能成功更改個人資料' })
        }

    }

    async getFavourite({ response, auth }) {

        let userAuth = auth.authenticator('user');

        let user = await userAuth.getUser();

        let favourite_courses = await Models.FavouriteCourse.getFavourite(user.id);

        let courseArr = favourite_courses.map(course => course.course_id)

        let courses = [];

        for (let i = 0; i < courseArr.length; i++) {
            let newItem = await Models.Course.getCourseCard(courseArr[i])
            if (newItem) {
                courses.push({
                    ...newItem,
                    id: hashids.encode(newItem.id)
                })
            }
        }

        return response.json({ favourite_courses: courses });
    }

    async setFavourite({ request, response, auth }) {

        let userAuth = auth.authenticator('user');

        let { course_id } = request.all();

        let user = await userAuth.getUser();

        course_id = hashids.decode(course_id)[0]


        let favouriteItem = await Models.FavouriteCourse
            .query()
            .where('course_id', course_id)
            .where('user_id', user.id)
            .first()

        if (favouriteItem) {
            if (favouriteItem.deleted_at) {
                favouriteItem.deleted_at = null;
                await favouriteItem.save();
            } else {
                favouriteItem.deleted_at = HelperFunctions.DateParser.toSQLForm(new Date())
                await favouriteItem.save();
            }
        }


        if (!favouriteItem) {
            favouriteItem = new Models.FavouriteCourse
            favouriteItem.course_id = course_id;
            favouriteItem.user_id = user.id;
            await favouriteItem.save()
        }




        let favourite_courses = await Models.FavouriteCourse.getFavourite(user.id);

        let courseArr = favourite_courses.map(course => course.course_id)

        let courses = [];

        for (let i = 0; i < courseArr.length; i++) {
            let course = await Models.Course.getCourseCard(courseArr[i]);
            if (course) {
                courses.push({
                    ...course,
                    id: hashids.encode(course.id)
                })
            }
        }

        return response.json({ favourite_courses: courses });

    }

    async getCart({ response, auth }) {

        const userAuth = auth.authenticator('user');

        const user = await userAuth.getUser();

        let cart = await Models.Cart.getCartDetail(user.id);

        cart = cart.map(item => ({
            ...item,
            course_id: hashids.encode(item.course_id)
        }))

        return response.json({ cart: cart });

    }

    async updateCart({ request, response, auth }) {

        const userAuth = auth.authenticator('user');

        const user = await userAuth.getUser();
        let { course_id } = request.all();

        course_id = hashids.decode(course_id)[0]

        const now = HelperFunctions.DateParser.toSQLForm(new Date());

        const cart = await Models.Cart
            .query()
            .where('course_id', course_id)
            .where('user_id', user.id)
            .first()

        if (cart) {
            if (cart.deleted_at) {
                cart.deleted_at = null;
                cart.updated_at = now;
            } else {
                cart.deleted_at = now;
                cart.updated_at = now;
            }
            await cart.save();
            cart.course_id = hashids.encode(cart.course_id)
            return response.json({
                cart: cart
            })
        } else {
            let newCart = new Models.Cart

            newCart.course_id = course_id;
            newCart.user_id = user.id;

            await newCart.save()
            return response.json({
                cart: newCart
            })
        }

    }

    async getEnrolledCourses({ response, auth }) {

        let userAuth = auth.authenticator('user')

        let user = await userAuth.getUser();

        let enrolledCourses = await Models.CourseEnrollment.get(user.id)

        enrolledCourses = enrolledCourses.map(course => ({
            ...course,
            id: hashids.encode(course.id)
        }))

        return response.json({
            enrolledCourses
        })

    }

    async getEnrolledCoursesDetail({ response, auth }) {

        let userAuth = auth.authenticator('user')

        let user = await userAuth.getUser();

        let enrolledCourses = await Models.CourseEnrollment.getEnrolledCourseDetail(user.id);

        enrolledCourses = enrolledCourses.map(course => ({
            ...course,
            course_id: hashids.encode(course.course_id)
        }))

        return response.json({
            enrolledCourses: enrolledCourses
        })

    }

    async forgotPassword({ request, response }) {

        let { emailOrUsername } = request.all();

        let user;

        if (emailOrUsername.split('@')[1]) {
            user = await Models.User
                .query()
                .where('email', emailOrUsername)
                .where('deleted_at', null)
                .first();
        } else {
            user = await Models.User
                .query()
                .where('username', emailOrUsername)
                .where('deleted_at', null)
                .first();
        }

        if (!user) {
            return response.json({ error: '此電郵並未註冊成MeLearn.guru的用戶' })
        }

        let transporter = nodemailer.createTransport(Configs.Email.mailConfig);

        let reset_pw_token = uuidv1();

        user.reset_pw_token = reset_pw_token;
        await user.save();

        const info = await transporter.sendMail({
            from: '"MeLearn.Guru noreply@enrichculture.com',
            to: user.email,
            subject: 'MeLearn.Guru的重設密碼請求',
            html: Configs.Email.template.forgotPassword(user.username, reset_pw_token),
            // attachments: [{
            //     filename: `logo_email.png`,
            //     path: __dirname + '/../../../../public/assest/logo_email_long.png',
            //     cid: 'logo'
            // }]
        })
        return response.json({ message: 'email sent', sampleMailAddress: nodemailer.getTestMessageUrl(info) })

    }

    async resetPassword({ request, response }) {

        let { token, password, confirmPassword } = request.all();


        if (password !== confirmPassword) {
            return response.json({ error: '密碼與確認密碼不相同' })
        }

        let user = await Models.User
            .query()
            .where('reset_pw_token', token)
            .where('deleted_at', null)
            .first();

        try {
            user.password = password
            user.reset_pw_token = null
            await user.save()
            let transporter = nodemailer.createTransport(Configs.Email.mailConfig);
            const info = await transporter.sendMail({
                from: '"MeLearn.Guru noreply@enrichculture.com',
                to: user.email,
                subject: '[No reply] MeLearn.guru成功更改密碼',
                html: Configs.Email.template.changePasswordSuccess(user.username),
                // attachments: [{
                //     filename: `logo_email.png`,
                //     path: __dirname + '/../../../../public/assest/logo_email_long.png',
                //     cid: 'logo'
                // }]
            })
            return response.json({ message: '成功更改密碼，請重新登入MeLearn.guru' })
        } catch (err) {
            console.log(err);
            return response.json({ error: '未能成功更改密碼，請重試' })
        }

    }

    async getTransactionNumber({ auth, response }) {
        let userAuth = auth.authenticator('user');

        let user = await userAuth.getUser();

        try {
            let transactionNum = await Models.Transaction
                .query()
                .where('user_id', user.id)
                .getCount();

            return response.json({ transaction: transactionNum })
        } catch (err) {
            console.log(err);
            return response.json({ error: err })
        }

    }

    async getBillingDetail({ auth, response }) {

        let userAuth = auth.authenticator('user');

        let user = await userAuth.getUser();

        return response.json({
            billing_info: {
                billing_last_name: user.billing_last_name,
                billing_first_name: user.billing_first_name,
                billing_country: user.billing_country,
                billing_address: user.billing_address,
                billing_city: user.billing_city,
                billing_district: user.billing_district,
                billing_post_code: user.billing_post_code,
                billing_company: user.billing_company
            }
        })

    }

    async updateBillingAddress({ auth, response, request }) {

        let userAuth = auth.authenticator('user');

        let user = await userAuth.getUser();
        let { billing_address } = request.all();

        try {
            user.billing_first_name = billing_address.first_name;
            user.billing_last_name = billing_address.last_name;
            user.billing_company = billing_address.company || null;
            user.billing_country = billing_address.country;
            user.billing_address = billing_address.address;
            user.billing_city = billing_address.city;
            user.billing_district = billing_address.district;
            user.billing_post_code = billing_address.post_code || null;

            await user.save();
            return response.json({ user: user })
        } catch (err) {
            console.log(err.code);
            return response.json({ error: err })
        }
    }

    async updateExtraUserData({ auth, response, request }) {

        let userAuth = auth.authenticator('user');

        let user = await userAuth.getUser();

        let { personal_data } = request.all();

        try {
            user.gender = personal_data.gender;
            user.birthday_month = personal_data.birthday_month;
            user.monthly_income = personal_data.income;
            user.occupation = personal_data.occupation;
            user.first_name = personal_data.first_name;
            user.last_name = personal_data.last_name;

            await user.save();

            let userInterest = await Models.UsersInterest.findBy('user_id', user.id);
            if (!userInterest) {
                userInterest = new Models.UsersInterest();
            }

            for (let i = 0; i < personal_data.interests.length; i++) {
                userInterest[personal_data.interests[i]] = true;
            }
            userInterest.user_id = user.id;

            await userInterest.save();

            return response.json({ user: user })

        } catch (err) {
            console.log(err);
            return response.json({ error: err })
        }

    }

    async getPurchaseRecord({ auth, response }) {

        let userAuth = auth.authenticator('user');
        let user = await userAuth.getUser();

        let orders = await Models.Transaction
            .query()
            .where('user_id', user.id)
            .orderBy('created_at', 'desc')
            .fetch();

        return response.json({ orders: orders.toJSON() });

    }

    async checkEnroll({ request, response }) {

        let { course_id, user_id } = request.all();

        course_id = hashids.decode(course_id)[0]

        try {
            let courseEnrollment = await Models.CourseEnrollment
                .query()
                .where('user_id', user_id)
                .where('course_id', course_id)
                .first();

            courseEnrollment = {
                ...courseEnrollment,
                id: hashids.encode(courseEnrollment.course_id)
            }

            if (courseEnrollment) {
                return response.json({ isEnrolled: true, courseEnrollment: courseEnrollment })
            } else {
                return response.json({ isEnrolled: false })
            }

        } catch (err) {
            return response.json({ error: err })
        }

    }

    async getFinishedLessons({ request, response }) {

        let { course_id, user_id } = request.all();

        course_id = hashids.decode(course_id)[0]

        try {

            let finishedLessons = await Models.FinishedLesson.getFinishedLessonList(course_id, user_id);

            finishedLessons = finishedLessons.map(lesson => ({
                ...lesson,
                lesson_id: hashids.encode(lesson.lesson_id)
            }))


            return response.json({ finishedLessons: finishedLessons })

        } catch (err) {
            console.log(err);
            return response.json({ error: err });
        }

    }

    async finishLesson({ request, response, auth }) {

        let userAuth = auth.authenticator('user');
        let user = await userAuth.getUser();

        let { lesson_id, course_id } = request.all();

        course_id = hashids.decode(course_id)[0]
        lesson_id = hashids.decode(lesson_id)[0]

        try {

            let lesson = await Models.FinishedLesson.findOrCreate(
                { lesson_id: lesson_id, user_id: user.id },
                { lesson_id: lesson_id, user_id: user.id }
            );

            lesson.lesson_id = hashids.encode(lesson.lesson_id)
            lesson.course_id = hashids.encode(lesson.course_id)
            // await lesson.save()

            let courseEnrollment = await Models.CourseEnrollment
                .query()
                .where('course_id', course_id)
                .where('user_id', user.id)
                .first();

            let finishedLessons = await Models.FinishedLesson.getFinishedLessonList(course_id, user.id);
            console.log('finshed lessons: ' + finishedLessons.length);
            let lessonsNum = await Models.Lesson
                .query()
                .where('course_id', course_id)
                .whereNull('deleted_at')
                .getCount();
            console.log(' lessons num: ' + lessonsNum);


            if (finishedLessons.length === lessonsNum) {
                courseEnrollment.finished = 1
                courseEnrollment.certificate_token = uuidv4();
            }

            courseEnrollment.last_lesson = moment().tz("Asia/Hong_Kong").format('YYYY-MM-DD HH:mm:ss')

            await courseEnrollment.save()

            return response.json({ lesson: lesson, finished: courseEnrollment.finished })
        } catch (err) {
            console.log(err);
            return response.json({ error: err })
        }

    }

    async getLessonToStart({ request, response, auth }) {


        let userAuth = auth.authenticator('user');
        let user = await userAuth.getUser();

        let { course_id } = request.all();

        course_id = hashids.decode(course_id)[0]

        try {

           
            const finishedLessonsFetched = await Models.FinishedLesson
                .query()
                .where('user_id', user.id)
                .fetch();
                console.log({finishedLessonsFetched})

            const finishedLessons = finishedLessonsFetched.toJSON();

            const lessonListFetched = await Models.Lesson
                .query()
                .where('course_id', course_id)
                .orderBy('order')
                .fetch()

            const lessonList = lessonListFetched.toJSON();
            console.log({lessonList})


            let lessonToStart = lessonList[0];

            console.log(lessonToStart)

            if (finishedLessons.length !== lessonList.length) {
                for (const lesson of lessonList) {
                    if (!finishedLessons.find(finishedlesson => finishedlesson.lesson_id === lesson.id)) {
                        lessonToStart = lesson;
                        break;
                    }
                }
            }

            lessonToStart.course_id = hashids.encode(lessonToStart.course_id);
            lessonToStart.id = hashids.encode(lessonToStart.id)



            return response.json({ lessonToStart: lessonToStart });

        } catch (err) {
            console.log(err);
            return response.json({ error: err })
        }


    }

    async getEnrolledCourseInstructors({ response, auth }) {

        let userAuth = auth.authenticator('user');
        let user = await userAuth.getUser();

        try {
            let instructors = await Models.CourseEnrollment.getEnrolledCourseInstructors(user.id)

            return response.json({ instructors: instructors })
        } catch (err) {
            console.log(err)
            return response.json({ error: err })
        }

    }

    async getUserUnreadMessages({ request, response, auth }) {

        let userAuth = auth.authenticator('user');
        let user = await userAuth.getUser();

        try {
            let unreadMsg = await Models.InboxMessage
                .query()
                .select('*')
                .where('user_id', user.id)
                .where('sent_by', 'tutor')
                .where('read', 0)
                .fetch()

            return response.json({ unreadMsg: unreadMsg.toJSON() })
        } catch (err) {
            console.log(err)
            return response.json({ error: err })
        }

    }

    async checkCourseFinished({ request, response, auth }) {

        let userAuth = auth.authenticator('user');
        let user = await userAuth.getUser();

        let { course_id } = request.all();

        course_id = hashids.decode(course_id)[0]

        try {


            // let quizFinished = false;

            // //Check Quiz Marks
            // let answeredQuiz = await Models.AnsweredQuiz
            //     .query()
            //     .where('user_id', user.id)
            //     .where('course_id', course_id)
            //     .whereNull('deleted_at')
            //     .fetch()

            // answeredQuiz = answeredQuiz.toJSON();

            // let correctAnswerNumber = answeredQuiz.filter(answer => answer.status === 'correct').length;

            // if((correctAnswerNumber/answeredQuiz.length) >= 0.7){
            //     quizFinished = true
            // }
            

            let courseEnrollment = await Models.CourseEnrollment
                .query()
                .where('user_id', user.id)
                .where('course_id', course_id)
                .whereNull('deleted_at')
                .first()
            
           

            return response.json({ finished: courseEnrollment.finished })

        } catch (err) {
            console.log(err);
            return response.json({ error: err })
        }

    }

    async getCertificates({ response, auth }) {

        const checkQuizFinished = async (course_id, user_id) => {

            //Check Quiz Marks
            let answeredQuiz = await Models.AnsweredQuiz
                .query()
                .where('user_id', user_id)
                .where('course_id', course_id)
                .whereNull('deleted_at')
                .fetch()

            answeredQuiz = answeredQuiz.toJSON();

            let correctAnswerNumber = answeredQuiz.filter(answer => answer.status === 'correct').length;

            if((correctAnswerNumber/answeredQuiz.length) >= 0.7){
                return true
            }

            return false
        }

        let userAuth = auth.authenticator('user');
        let user = await userAuth.getUser();

        let finishedCourses = [];
        let certificates = [];

        try {
            let enrolledCourses = await Models.CourseEnrollment
                .query()
                .where('user_id', user.id)
                .whereNull('deleted_at')
                .fetch();

            for (const course of enrolledCourses.toJSON()) {

                let isQuizFinished =  checkQuizFinished(course.course_id, user.id)

                if (course.finished === 1 && isQuizFinished) {
                    finishedCourses.push(course);
                } else if (course.finished === 1 && !isQuizFinished) {

                    let quizQuestionNum = await Models.QuizQuestion
                        .query()
                        .where('course_id', course.course_id)
                        .getCount();

                    if (quizQuestionNum === 0) {
                        finishedCourses.push(course);
                    }

                }
            }

            for (const course of finishedCourses) {

                let courseInfo = await Models.Course.find(course.course_id);
                let tutorInfo = await Models.Tutor.find(courseInfo.toJSON().tutor_id);
                let lessonNumber = await Models.Lesson
                    .query()
                    .where('course_id', course.course_id)
                    .whereNull('deleted_at')
                    .getCount();

                certificates.push({
                    course_title: courseInfo.toJSON().title,
                    tutor_name: tutorInfo.toJSON().name,
                    lesson_number: lessonNumber,
                    issue_date: course.last_lesson,
                    certificate_token: course.certificate_token
                })

            }

            return response.json({ certificates: certificates })
        } catch (err) {
            console.log(err);
            return response.json({ error: err })
        }

    }

    async getProfile({ response, auth }) {

        let userAuth = auth.authenticator('user');
        let user = await userAuth.getUser();

        try {

            let userInterests = await Models.UsersInterest
                .query()
                .where('user_id', user.id)
                .whereNull('deleted_at')
                .first();

            let keys = Object.keys(userInterests ? userInterests.toJSON() : {});

            keys = keys.filter(key => (key !== 'id' && key !== 'user_id' && key !== 'interested_tutor' && key !== 'other' && key !== 'created_at' && key !== 'updated_at' && key !== 'deleted_at'));

            let interests = [];

            for (const key of keys) {
                if (userInterests.toJSON()[key] === 1) {
                    interests.push(key)
                }
            }

            return response.json({ user: user, interests: interests })


        } catch (err) {
            console.log(err)
            return response.json({ error: err })
        }


    }

    async updateProfile({ response, request, auth }) {

        let userAuth = auth.authenticator('user');
        let user = await userAuth.getUser();

        let { data } = request.all();

        try {

            let checkUsername = await Models.User
                .query()
                .where('username', data.username)
                .whereNull('deleted_at')
                .first()
            if (checkUsername && checkUsername.username !== user.username) {
                return response.json({ error: { DUP_USERNAME: '此用戶名稱已經被註冊， 請選擇另一個名稱' } })
            }

            let checkEmail = await Models.User
                .query()
                .where('email', data.email)
                .whereNull('deleted_at')
                .first()

            if (checkEmail && checkEmail.email !== user.email) {
                return response.json({ error: { INVALID_EMAIL: '此電郵已經被註冊， 請選擇另一個電郵' } })
            }

            if (!data.email.split('@')[1]) {
                return response.json({ error: { INVALID_EMAIL: '請輸入有效的電郵地址' } })
            }


            user.first_name = data.first_name;
            user.last_name = data.last_name;
            user.username = data.username;
            user.email = data.email;
            user.area_code = data.area_code;
            user.phone = data.phone;
            user.gender = data.gender;
            user.birthday_month = data.birthday_month;
            user.monthly_income = data.income;
            user.occupation = data.occupation;

            await user.save();

            let userInterests = await Models.UsersInterest
                .query()
                .where('user_id', user.id)
                .whereNull('deleted_at')
                .first()

            if (userInterests) {

                userInterests.invest = 0;
                userInterests.home_ownership = 0;
                userInterests.marketing = 0;
                userInterests.business_management = 0;
                userInterests.career = 0;
                userInterests.health = 0;
                userInterests.education = 0;
                userInterests.travel = 0;

                for (const interest of data.interests) {

                    userInterests[interest] = 1;

                }

                await userInterests.save();


            }

            return response.json({
                user: user,
                interests: data.interests
            })
        } catch (err) {
            console.log(err);
            return response.json({ error: err })
        }

    }

    async updateProfileWithPhone({ request, response, auth }) {
        let userAuth = auth.authenticator('user');
        let user = await userAuth.getUser();

        let { code, email, username, first_name, last_name, area_code, phone, gender, birthday_month, interests, income, occupation } = request.all();

        try {

            if (code !== user.verification_code) {
                return response.json({ error: { INCORRECT_CODE: '錯誤的驗証碼' } })
            }


            user.first_name = first_name;
            user.last_name = last_name;
            user.username = username;
            user.email = email;
            user.area_code = area_code;
            user.phone = phone;
            user.gender = gender;
            user.birthday_month = birthday_month;
            user.monthly_income = income;
            user.occupation = occupation;

            await user.save();

            let userInterests = await Models.UsersInterest
                .query()
                .where('user_id', user.id)
                .whereNull('deleted_at')
                .first()

            if (userInterests) {

                userInterests.invest = 0;
                userInterests.home_ownership = 0;
                userInterests.marketing = 0;
                userInterests.business_management = 0;
                userInterests.career = 0;
                userInterests.health = 0;
                userInterests.education = 0;
                userInterests.travel = 0;

                for (const interest of interests) {

                    userInterests[interest] = 1;

                }

                await userInterests.save();

            }

            return response.json({
                user: user,
                interests: interests
            })
        } catch (err) {
            console.log(err);
            return response.json({ error: err })
        }
    }

    async updateProfileCheckValid({ request, response, auth }) {
        let userAuth = auth.authenticator('user');
        let user = await userAuth.getUser();

        let { username, email, phone, area_code } = request.all();

        let checkUsername = await Models.User
            .query()
            .where('username', username)
            .whereNull('deleted_at')
            .first()
        if (checkUsername && checkUsername.username !== user.username) {
            return response.json({ error: { DUP_USERNAME: '此用戶名稱已經被註冊， 請選擇另一個名稱' } })
        }

        let checkEmail = await Models.User
            .query()
            .where('email', email)
            .whereNull('deleted_at')
            .first()

        if (checkEmail && checkEmail.email !== user.email) {
            return response.json({ error: { INVALID_EMAIL: '此電郵已經被註冊， 請選擇另一個電郵' } })
        }

        let EmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!EmailRegex.test(email)) {
            return response.json({ error: { INVALID_EMAIL: '請輸入有效的電郵地址' } })
        }

        if (phone !== user.phone || area_code !== user.area_code) {

            user.verification_code = Math.floor(100000 + Math.random() * 900000);
            await user.save()

            //Send SMS
            if (process.env.NODE_ENV === 'production') {
                const message = `你的MeLearn.guru一次性密碼為${user.verification_code}. 請在MeLearn.guru上輸入此一次性密碼以登入系統。謝謝！`;
                const new_phone = `${area_code.split('+')[1]}${phone}`;
                let encodedUsername = encodeURIComponent('enrichdigital');
                let encodedPassword = encodeURIComponent('ed321#');
                let encodedMessage = encodeURIComponent(message);
                let encodedTelephone = encodeURIComponent(new_phone);
                let url = `https://api3.ablemobile.com/service/smsapi.asmx/SendSMS?Username=${encodedUsername}&Password=${encodedPassword}&Message=${encodedMessage}&Hex=&Telephone=${encodedTelephone}&UserDefineNo=000&Sender=`;

                let smsState = await Axios.get(url)
                    .then(async res => {
                        let xml = res.data;
                        let state
                        xmlParser(xml, (err, result) => {
                            if (result.ReturnValue.State[0] == 1) {
                                state = 'success';
                            } else {
                                state = 'failed'
                            }
                        })
                        return state;
                    })
                    .catch(err => {
                        console.log(err);
                        return response.json({ error: err })
                    })
                if (smsState === 'success') {
                    return response.json({ next: '2fa' })
                } else {
                    return response.json({ error: '未能重新發送短訊，請重試' })
                }
            } else {
                return response.json({ next: '2fa', code: user.verification_code })
            }

        }

        return response.json({ next: 'edit' })


    }

    async changePassword({ request, response, auth }) {

        let userAuth = auth.authenticator('user');
        let user = await userAuth.getUser();

        let { current_password, new_password, confirm_new_password } = request.all();

        const correctOldPassword = await Hash.verify(current_password, user.password);

        if (correctOldPassword === false) {
            return response.json({ error: { INCORRECT_PW: '密碼不正確' } })
        }

        const isSame = await Hash.verify(current_password, new_password);

        if (isSame) {
            return response.json({ error: { INCORRECT_PW: '新密碼與舊密碼必須不相同' } })
        }

        if (new_password !== confirm_new_password) {
            return response.json({ error: { NEW_PASSWORD_NOT_MATCH: '確認新密碼不相符' } })
        }

        user.password = new_password;

        await user.save();
        let transporter = nodemailer.createTransport(Configs.Email.mailConfig);
        const info = await transporter.sendMail({
            from: '"MeLearn.Guru noreply@enrichculture.com',
            to: user.email,
            subject: '[No reply] MeLearn.guru成功更改密碼',
            html: Configs.Email.template.changePasswordSuccess(user.username),
            attachments: [{
                filename: `logo_email.png`,
                path: __dirname + '/../../../../public/assest/logo_email_long.png',
                cid: 'logo'
            }]
        })

        return response.json({ msg: 'password changed' })

    }

    async getBillingAddress({ response, auth }) {

        let userAuth = auth.authenticator('user');
        let user = await userAuth.getUser();

        return response.json({
            billing_address: {
                billing_first_name: user.billing_first_name,
                billing_last_name: user.billing_last_name,
                billing_company: user.billing_company,
                billing_address: user.billing_address,
                billing_country: user.billing_country,
                billing_city: user.billing_city,
                billing_district: user.billing_district,
                billing_post_code: user.billing_post_code
            }
        })


    }

    async getCreditCardList({ response, auth }) {

        let userAuth = auth.authenticator('user');
        let user = await userAuth.getUser();

        if (user.stripe_id) {
            const methods = await stripe.paymentMethods.list({
                customer: user.stripe_id,
                type: 'card'
            })

            let cards = [];
            for (let item of methods.data) {
                if (!cards.find(cardItem => cardItem.fingerprint === item.card.fingerprint)) {
                    cards.push({
                        id: item.id,
                        brand: item.card.brand,
                        exp_month: item.card.exp_month,
                        exp_year: item.card.exp_year,
                        last4: item.card.last4,
                        name: item.billing_details.name,
                        fingerprint: item.card.fingerprint
                    })
                }
            }
            return response.json({ cards: cards })

        } else {
            return response.json({ error: 'NO_CREDIT_CARD_SAVED' })
        }

    }

    async removeCard({ request, response, auth }) {

        let userAuth = auth.authenticator('user');
        let user = await userAuth.getUser();

        let { id } = request.all();

        await stripe.paymentMethods.detach(id);


        if (user.stripe_id) {
            const methods = await stripe.paymentMethods.list({
                customer: user.stripe_id,
                type: 'card'
            })

            const cards = methods.data.map(item => ({
                id: item.id,
                brand: item.card.brand,
                exp_month: item.card.exp_month,
                exp_year: item.card.exp_year,
                last4: item.card.last4,
                name: item.billing_details.name
            }));

            return response.json({ cards: cards })

        } else {
            return response.json({ error: 'NO_CREDIT_CARD_SAVED' })
        }
    }

    async addCard({ request, response, auth }) {

        let userAuth = auth.authenticator('user');
        let user = await userAuth.getUser();

        let { number, exp_month, exp_year, cvc } = request.all();

        const methods = await stripe.paymentMethods.list({
            customer: user.stripe_id,
            type: 'card'
        })



        try {
            const paymentMethod = await stripe.paymentMethods.create({
                type: 'card',
                card: {
                    number: number,
                    exp_month: exp_month,
                    exp_year: exp_year,
                    cvc: cvc
                }
            })

            if (methods.data.length > 0 && methods.data.find(item => item.card.fingerprint === paymentMethod.card.fingerprint)) {
                return response.json({ error: '您已有儲存此卡號的記錄，如需要更新此卡，請先把舊有的記錄移除' })
            }

            if (!user.stripe_id) {
                const customer = await stripe.customers.create({
                    email: user.email
                })
                user.stripe_id = customer.id;
                await user.save();
            }

            await stripe.paymentMethods.attach(
                paymentMethod.id,
                { customer: user.stripe_id }
            )

            return response.json({ msg: 'Added card successfully' })
        } catch (err) {
            return response.json({ error: err })
        }

    }
    async getUserIP({ request, response }) {

        return response.send(request.ip())
    }

    async getCourseDeveloperID({ request, response, auth }) {
        let userAuth = auth.authenticator('user');
        let user = await userAuth.getUser();

        let course_developer = await Models.CourseDeveloper.findBy('email', user.email)

        return response.json({ course_developer_id: course_developer.id })
    }

    async getPendingCourses({ response, auth }) {

        let userAuth = auth.authenticator('user');
        let user = await userAuth.getUser();

        let pendingCourses = await Models.Transaction
            .query()
            .select('transaction_details.course_id as course_id')
            .leftJoin('transaction_details', 'transactions.id', 'transaction_details.transaction_id')
            .where('transactions.user_id', user.id)
            .where('transactions.status', 'pending')
            .where(function () {
                this
                    .where('transactions.method', 'bank-transfer')
                    .orWhere('transactions.method', 'fps')
            })
            .whereNotNull('transactions.proof')
            .whereNull('transactions.deleted_at')
            .whereNull('transaction_details.deleted_at')
            .fetch();

        pendingCourses = pendingCourses.toJSON().map(item => hashids.encode(item.course_id));

        return response.json({ pendingCourses: pendingCourses })

    }


}


module.exports = UserController
