'use strict'

const STRIPE_SK = require('../../../Utils/StripeToken'); 
const stripe = require('stripe')(STRIPE_SK());
const Models = use('App/Controllers/Http/ModelController')
const { v4: uuidv4 } = require('uuid');
const Configs = use('App/Controllers/Http/ConfigController');
const HelperFunction = use('App/Controllers/Http/HelperFunctionController')
const Helpers = use('Helpers');
const moment = require('moment-timezone');
const nodemailer = require("nodemailer");
const Hashids = require('hashids/cjs')
const hashids = new Hashids('', 10)

const setPendingTransactionInvalid = async (user_id, course_id) => {
    let transactionDetails = await Models.TransactionDetail
        .query()
        .select('transactions.id as transaction_id')
        .leftJoin('transactions', 'transaction_details.transaction_id', 'transactions.id')
        .where('transactions.user_id', user_id)
        .where(function () {
            this
                .where(function () {
                    this
                        .where('transactions.status', 'pending')
                        .whereNull('transactions.proof')
                })
                .orWhere('transactions.status', 'failed')
        })
        .where('transaction_details.course_id', course_id)
        .whereNull('transaction_details.deleted_at')
        .whereNull('transactions.deleted_at')
        .fetch();

    transactionDetails = transactionDetails.toJSON();

    if (transactionDetails && transactionDetails.length > 0) {
        for(const transactionDetail of transactionDetails){
            let transaction = await Models.Transaction.find(transactionDetail.transaction_id)

            transaction.status = 'invalid';
            await transaction.save();
        }
    }


}

class CheckoutController {

    async confirmPurchase({ request, response, auth }) {

        let userAuth = auth.authenticator('user')

        let user = await userAuth.getUser();

        let { cart, coupon, method, holder_name, proof, billing_info } = request.all();

        let charges = 0;
        let discount = coupon ? coupon.discount : 0

        if (cart.length > 0) {

            for (let i = 0; i < cart.length; i++) {

                if (moment(new Date()).tz('Asia/Hong_Kong').diff(moment(cart[i].discount_end)) > 0 && cart[0].discount_price) {
                    return response.json({
                        error: {
                            PRICE_CHANGED: true
                        }
                    })
                }

                if (cart[i].discount_start && moment(cart[i].discount_start).diff(moment(new Date()).tz("Asia/Hong_Kong")) <= 0 && moment(cart[i].discount_end).diff(moment(new Date()).tz("Asia/Hong_Kong")) > 0 && cart[i].discount_price) {
                    charges += cart[i].discount_price;
                } else if (!cart[i].discount_start && cart[i].discount_price) {
                    charges += cart[i].discount_price;
                } else {
                    charges += cart[i].price
                }
            }

        }

        let transaction = new Models.Transaction();

        transaction.user_id = user.id;
        transaction.sub_total = charges;
        transaction.total = charges - discount;
        transaction.method = method;
        transaction.holder_name = holder_name;
        transaction.proof = proof || null;
        transaction.status = method === 'creditcard' ? 'verified' : 'pending'
        transaction.first_name = billing_info.first_name;
        transaction.last_name = billing_info.last_name;
        transaction.company = billing_info.company || null;
        transaction.country = billing_info.country;
        transaction.address = billing_info.address;
        transaction.city = billing_info.city;
        transaction.district = billing_info.district;
        transaction.post_code = billing_info.post_code || null;

        await transaction.save();

        let transactionDetailArr = [];

        if (cart.length > 0) {

            for (let i = 0; i < cart.length; i++) {
                let transactionDetail = new Models.TransactionDetail();

                transactionDetail.transaction_id = transaction.id;
                transactionDetail.course_id = hashids.decode(cart[i].course_id)[0];

                if (cart[i].discount_price) {
                    transactionDetail.price = cart[i].discount_price;
                } else {
                    transactionDetail.price = cart[i].price
                }

                await transactionDetail.save()
                transactionDetail.course_id = hashids.encode(transactionDetail.course_id)

                if(transaction.proof){
                    setPendingTransactionInvalid(user.id, hashids.decode(cart[i].course_id)[0]);
                }

                if (method === 'creditcard') {

                    let courseEnrollment = new Models.CourseEnrollment()

                    courseEnrollment.user_id = user.id;
                    courseEnrollment.course_id = hashids.decode(cart[i].course_id)[0];
                    courseEnrollment.finished = false;

                    await courseEnrollment.save()

                }

                await Models.Cart
                    .query()
                    .where('user_id', user.id)
                    .where('course_id', hashids.decode(cart[i].course_id)[0])
                    .where('deleted_at', null)
                    .update({ deleted_at: HelperFunction.DateParser.toSQLForm(new Date()) })

                transactionDetailArr.push(transactionDetail);
            }

        }

        if (coupon) {
            let couponUsage = new Models.CouponUsage()

            couponUsage.coupon_id = coupon.id;
            couponUsage.user_id = user.id;
            couponUsage.transaction_id = transaction.id;

            await couponUsage.save()
        }

        //send Email
        if (proof) {
            let transporter = nodemailer.createTransport(Configs.Email.mailConfig);
            const info = await transporter.sendMail({
                from: '"MeLearn.Guru noreply@enrichculture.com',
                to: user.email,
                subject: `[No reply]MeLearn.Guru：訂單正在處理(訂單編號：#${transaction.id})`,
                html: Configs.Email.template.handlingOrder(cart, transaction, transactionDetailArr, user, coupon),
                // attachments: [{
                //     filename: `logo_email.png`,
                //     path: __dirname + '/../../../../public/assest/logo_email_long.png',
                //     cid: 'logo'
                // }]
            })
        }


        return response.json({
            transaction,
            transactionDetailArr
        })
    }

    async updatePurchase({ request, response, auth }) {

        let userAuth = auth.authenticator('user')

        let user = await userAuth.getUser();

        let { transaction_id, cart, coupon, method, holder_name, proof } = request.all();

        let charges = 0;
        let discount = coupon ? coupon.discount : 0

        if (cart.length > 0) {

            for (let i = 0; i < cart.length; i++) {
                if (cart[i].discount_price) {
                    charges += cart[i].discount_price
                } else {
                    charges += cart[i].price
                }
            }

        }

        let transaction = await Models.Transaction.find(transaction_id);

        transaction.user_id = user.id;
        transaction.sub_total = charges;
        transaction.total = charges - discount;
        transaction.method = method;
        transaction.holder_name = holder_name;
        transaction.proof = proof || null;
        transaction.status = 'pending';

        await transaction.save();

        let transactionDetailArr = [];

        if (cart.length > 0) {

            for (let i = 0; i < cart.length; i++) {
                let transactionDetail = await Models.TransactionDetail
                    .query()
                    .where('course_id', hashids.decode(cart[i].course_id)[0])
                    .where('transaction_id', transaction_id)
                    .first();


                transactionDetail.price = cart[i].discount_price || cart[i].price;

                await transactionDetail.save()

                transaction.course_id = cart[i].course_id

                if (method === 'creditcard') {

                    let courseEnrollment = new Models.CourseEnrollment()

                    courseEnrollment.user_id = user.id;
                    courseEnrollment.course_id = hashids.decode(cart[i].course_id)[0];
                    courseEnrollment.finished = false;

                    await courseEnrollment.save()

                }

                transactionDetailArr.push(transactionDetail);
            }

        }

        if (coupon) {
            let couponUsage = await Models.CouponUsage
                .query()
                .where('transaction_id', transaction_id)
                .first();

            if (couponUsage) {
                couponUsage.coupon_id = coupon.id;
                await couponUsage.save()
            } else {
                let newCouponUsage = new Models.CouponUsage();
                newCouponUsage.coupon_id = coupon.id;
                newCouponUsage.user_id = user.id;
                newCouponUsage.transaction_id = transaction_id
                await newCouponUsage.save()
            }

        }

        //send Email
        if (proof) {
            let transporter = nodemailer.createTransport(Configs.Email.mailConfig);
            const info = await transporter.sendMail({
                from: '"MeLearn.Guru noreply@enrichculture.com',
                to: user.email,
                subject: `[No reply]MeLearn.Guru：訂單正在處理(訂單編號：#${transaction.id})`,
                html: Configs.Email.template.handlingOrder(cart, transaction, transactionDetailArr, user, coupon),
                // attachments: [{
                //     filename: `logo_email.png`,
                //     path: __dirname + '/../../../../public/assest/logo_email_long.png',
                //     cid: 'logo'
                // }]
            })
        }

        return response.json({
            transaction,
            transactionDetailArr
        })

    }

    async uploadProof({ request, response, auth }) {

        let userAuth = auth.authenticator('user');
        let user = await userAuth.getUser();

        if (request.file('proof_file')) {

            const newImage = request.file('proof_file', {
                type: ['image'],
                size: '3mb'
            });
            await newImage.move(Helpers.appRoot() + '/uploads/payment_proof', {
                name: `${user.id}_payment_proof_${new Date().getTime()}.${newImage.subtype}`
            })

            if (!newImage.moved()) {
                return response.json({ error: newImage.error() })
            }

            return response.json({ url: '/uploads/payment_proof/' + newImage.fileName })

        }

    }

    async createTransaction({ request, response, auth }) {

        let userAuth = auth.authenticator('user');
        let user = await userAuth.getUser();

        let { cart, coupon, method, holder_name, proof, billing_info } = request.all();

        let charges = 0;
        let discount = coupon ? coupon.discount : 0



        if (cart.length > 0) {

            for (let i = 0; i < cart.length; i++) {

                // if(moment(new Date()).tz('Asia/Hong_Kong').diff(moment(cart[i].discount_end)) >= 0 && cart[0].discount_price){
                //     return response.json({ error: {
                //         PRICE_CHANGED: true
                //     }})
                // }

                //Check if course price displayed on frontend = price stored on db
                let currentCourseData = await Models.Course.find(hashids.decode(cart[i].course_id)[0]);
                let currentCoursePrice = currentCourseData.discount_price || currentCourseData.price;

                let displayedPrice = cart[i].discount_price || cart[i].price;

                if (currentCoursePrice !== displayedPrice) {
                    return response.json({
                        error: {
                            PRICE_CHANGED: true
                        }
                    })
                }



                if (cart[i].discount_start && moment(cart[i].discount_start).diff(moment(new Date()).tz("Asia/Hong_Kong")) <= 0 && moment(cart[i].discount_end).diff(moment(new Date()).tz("Asia/Hong_Kong")) > 0 && cart[i].discount_price) {
                    charges += cart[i].discount_price;
                } else if (!cart[i].discount_start && cart[i].discount_price) {
                    charges += cart[i].discount_price;
                } else {
                    charges += cart[i].price
                }
            }

        }

        try {
            let transaction = new Models.Transaction();

            transaction.user_id = user.id;
            transaction.sub_total = charges;
            transaction.total = charges - discount;
            transaction.method = method;
            transaction.holder_name = holder_name;
            transaction.proof = proof || null;
            transaction.status = 'pending'
            transaction.first_name = billing_info.first_name;
            transaction.last_name = billing_info.last_name;
            transaction.company = billing_info.company || null;
            transaction.country = billing_info.country;
            transaction.address = billing_info.address;
            transaction.city = billing_info.city;
            transaction.district = billing_info.district;
            transaction.post_code = billing_info.post_code || null;

            await transaction.save();

            transaction = transaction.toJSON();

            let details = [];

            if (cart.length > 0) {
                console.log("creating new transaction")
                for (let i = 0; i < cart.length; i++) {
                    let transactionDetail = new Models.TransactionDetail();

                    transactionDetail.transaction_id = transaction.id;
                    transactionDetail.course_id = hashids.decode(cart[i].course_id)[0];

                    if (cart[i].discount_price) {
                        transactionDetail.price = cart[i].discount_price;
                    } else {
                        transactionDetail.price = cart[i].price
                    }

                    await transactionDetail.save()
                    details.push(transactionDetail.toJSON());
                }

            }

            let couponUsage
            if (coupon) {
                couponUsage = new Models.CouponUsage()

                couponUsage.coupon_id = coupon.id;
                couponUsage.user_id = user.id;
                couponUsage.transaction_id = transaction.id;
                couponUsage.status = 'pending'

                await couponUsage.save()
            }

            console.log({transaction, details, coupon, couponUsage})

            return response.json({ transaction: transaction })
        } catch (err) {
            console.log(err);
        }


    }

    async payWithCreditCard({ request, response, auth }) {

        let userAuth = auth.authenticator('user');
        let user = await userAuth.getUser();

        let { transaction_id, card, rememberCard, selectedCard } = request.all();

        let paymentIntent;

        let transaction = await Models.Transaction
            .query()
            .where('id', transaction_id)
            .first();

        try {


            if (!user.stripe_id && rememberCard === true) {
                const customer = await stripe.customers.create({
                    email: user.email
                })

                user.stripe_id = customer.id;
                await user.save();
            }

            if (!selectedCard) {
                const paymentMethod = await stripe.paymentMethods.create({
                    type: 'card',
                    card: card,
                    billing_details:{
                        email: user.email
                    } 

                })
                if (rememberCard === true) {
                    await stripe.paymentMethods.attach(
                        paymentMethod.id,
                        { customer: user.stripe_id }
                    )
                }

                if (user.stripe_id) {
                    paymentIntent = await stripe.paymentIntents.create({
                        amount: transaction.total * 100,
                        currency: 'hkd',
                        payment_method: paymentMethod.id,
                        customer: user.stripe_id,
                        confirm: true,
                        description: 'MeLearn Transaction_id: #' + transaction.id
                    })
                } else {
                    paymentIntent = await stripe.paymentIntents.create({
                        amount: transaction.total * 100,
                        currency: 'hkd',
                        payment_method: paymentMethod.id,
                        confirm: true,
                        description: 'MeLearn Transaction_id: #' + transaction.id
                    })
                }


            } else {

                paymentIntent = await stripe.paymentIntents.create({
                    amount: transaction.total * 100,
                    currency: 'hkd',
                    customer: user.stripe_id,
                    payment_method: selectedCard.id,
                    confirm: true,
                    description: 'MeLearn Transaction_id: #' + transaction.id
                })


            }

            console.log("========================= Stripe Payment Intent Response ============================");
            console.log(paymentIntent);

            if (paymentIntent.status === 'succeeded') {
                transaction.status = 'verified';
                await transaction.save();

                let courses = [];

                let courseList = await Models.TransactionDetail
                    .query()
                    .where('transaction_id', transaction.id)
                    .fetch();



                for (const course of courseList.toJSON()) {

                    let course_id = course.course_id

                    //If user purchased a course which already in pending transaction state, change that pending state to invalid
                    await setPendingTransactionInvalid(user.id, course_id);

                    //Add Course Enrollment Record
                    let courseEnrollment = new Models.CourseEnrollment()
                    courseEnrollment.user_id = user.id;
                    courseEnrollment.course_id = course_id;
                    courseEnrollment.finished = 0;
                    courseEnrollment.quiz_finished = 0;
                    await courseEnrollment.save();

                    let courseInfo = await Models.Course.find(course_id);
                    courses.push(courseInfo.toJSON());

                    await Models.Cart
                        .query()
                        .where('user_id', user.id)
                        .where('course_id', course_id)
                        .whereNull('deleted_at')
                        .update({
                            deleted_at: HelperFunction.DateParser.toSQLForm(new Date())
                        })
                }

                let coupon;
                let couponUsage = await Models.CouponUsage.findBy('transaction_id', transaction.id);
                if (couponUsage) {
                    couponUsage.status = 'applied';
                    await couponUsage.save();
                    coupon = await Models.Coupon.find(couponUsage.coupon_id);
                }


                try{
                    let transporter = nodemailer.createTransport(Configs.Email.mailConfig);
                    const info = await transporter.sendMail({
                        from: '"MeLearn.Guru noreply@enrichculture.com',
                        to: user.email,
                        subject: `[No reply]MeLearn.Guru：購物收據 (訂單編號：#${transaction.id})`,
                        html: Configs.Email.template.shoppingReceipt(courses, transaction, courseList.toJSON(), user, coupon?.toJSON()),
                        // attachments: [{
                        //     filename: `logo_email.png`,
                        //     path: __dirname + '/../../../../public/assest/logo_email_long.png',
                        //     cid: 'logo'
                        // }]
                    })
    
                    //Send Notification To Enrich Admin
                    await transporter.sendMail({
                        from: '"MeLearn.Guru noreply@enrichculture.com',
                        to: process.env.NODE_ENV === 'production'? 'payment@enrichculture.com' : 'leo.lo@innopage.com',
                        subject: `[MeLearn.guru] 用戶付款通知 （訂單編號： #${transaction.id})`,
                        html: Configs.Email.template.enrichNotification(courses, transaction, courseList.toJSON(), user, coupon?.toJSON()),
                        attachments: [{
                            filename: `logo_email.png`,
                            path: __dirname + '/../../../../public/assest/logo_email_long.png',
                            cid: 'logo'
                        }]
                    })
                }catch(err){
                    console.log("Sending receipt Error");
                    console.log(err)
                }
                
            }

            return response.json({ paymentIntent: paymentIntent, transaction: transaction });
        } catch (err) {
            console.log(err);

            transaction.status = 'failed';
            await transaction.save()

            return response.json({ error: err })
        }



    }

    async alipayCallback({ request, response, auth }) {

        let userAuth = auth.authenticator('user');
        let user = await userAuth.getUser();

        console.log("===================== Alipay Payment Gateway Response =======================");
        console.log(request.all());

        let { merchant_reference, status } = request.all();
        let transaction_id = parseInt(merchant_reference.replace('#', ''));

        let transaction = await Models.Transaction.find(transaction_id);

        try {
            if (status === '1') {
                transaction.status = 'verified';
                transaction.method = 'alipay'

                await transaction.save();

                let courseList = await Models.TransactionDetail
                    .query()
                    .where('transaction_id', transaction.id)
                    .fetch()

                let courses = [];

                for (const course of courseList.toJSON()) {

                    let course_id = course.course_id

                    //If user purchased a course which already in pending transaction state, change that pending state to invalid
                    await setPendingTransactionInvalid(user.id, course_id);

                    //Add Course Enrollment Record
                    let courseEnrollment = new Models.CourseEnrollment();
                    courseEnrollment.user_id = user.id;
                    courseEnrollment.course_id = course_id;
                    courseEnrollment.finished = 0;
                    courseEnrollment.quiz_finished = 0;
                    await courseEnrollment.save();

                    let courseInfo = await Models.Course.find(course_id);
                    courses.push(courseInfo.toJSON());

                    await Models.Cart
                        .query()
                        .where('course_id', course_id)
                        .where('user_id', user.id)
                        .whereNull('deleted_at')
                        .update({
                            'deleted_at': HelperFunction.DateParser.toSQLForm(new Date())
                        })
                }

                let coupon;
                let couponUsage = await Models.CouponUsage.findBy('transaction_id', transaction.id);
                if (couponUsage) {
                    couponUsage.status = 'applied';
                    await couponUsage.save();
                    coupon = await Models.Coupon.find(couponUsage.coupon_id);
                }



                let transporter = nodemailer.createTransport(Configs.Email.mailConfig);
                const info = await transporter.sendMail({
                    from: '"MeLearn.Guru noreply@enrichculture.com',
                    to: user.email,
                    subject: `[No reply]MeLearn.Guru：購物收據 (訂單編號：#${transaction.id})`,
                    html: Configs.Email.template.shoppingReceipt(courses, transaction, courseList.toJSON(), user, coupon?.toJSON()),
                    // attachments: [{
                    //     filename: `logo_email.png`,
                    //     path: __dirname + '/../../../../public/assest/logo_email_long.png',
                    //     cid: 'logo'
                    // }]
                })

                //Send Notification To Enrich Admin
                await transporter.sendMail({
                    from: '"MeLearn.Guru noreply@enrichculture.com',
                    to: 'payment@enrichculture.com',
                    subject: `[MeLearn.guru] 用戶付款通知 （訂單編號： #${transaction.id})`,
                    html: Configs.Email.template.enrichNotification(courses, transaction, courseList.toJSON(), user, coupon?.toJSON()),
                    attachments: [{
                        filename: `logo_email.png`,
                        path: __dirname + '/../../../../public/assest/logo_email_long.png',
                        cid: 'logo'
                    }]
                })

            } else {

                //TODO 
                //handle failed case
                if (status === 2) {
                    transaction.status = 'failed';
                    await transaction.save();
                }
            }

            return response.redirect(`${process.env.BASE_URL || 'http://localhost:3000'}/checkout-finished?transaction_id=${transaction_id}`)

        } catch (err) {
            console.log(err);
            return response.redirect(`${process.env.BASE_URL || 'http://localhost:3000'}/checkout-finished?transaction_id=${transaction_id}`)
        }

    }

    async checkPendingTransaction({ request, response, auth }) {
        let userAuth = auth.authenticator('user')
        let user = await userAuth.getUser();

        let { courses, transaction_id } = request.all();


        for (const course of courses) {

            let course_id = hashids.decode(course.course_id)[0]

            let transactions = await Models.Transaction
                .query()
                .select('transaction_details.course_id')
                .leftJoin('transaction_details', 'transactions.id', 'transaction_details.transaction_id')
                .where('transaction_details.course_id', course_id)
                .where('transactions.user_id', user.id)
                .where(function () {
                    this
                        .where(function () {
                            this
                                .where('transactions.status', 'pending')
                                .whereNull('transactions.proof')
                        })
                        .orWhere('transactions.status', 'failed')
                })
                .where(function () {
                    if (transaction_id) {
                        this
                            .whereNot('transactions.id', transaction_id)
                    }
                })
                .whereNull('transactions.deleted_at')
                .whereNull('transaction_details.deleted_at')
                .fetch();

            if (transactions.toJSON().length > 0) {
                return response.json({
                    error: {
                        PENDING_TRANSACTION: true
                    }
                })
            }

        }

        return response.json({ next: true })
    }

}

module.exports = CheckoutController
