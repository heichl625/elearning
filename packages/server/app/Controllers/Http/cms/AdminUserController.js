'use strict'

const { session } = require("../../../../config/auth");

const Models = use('App/Controllers/Http/ModelController')
const HelperFunctions = use('App/Controllers/Http/HelperFunctionController')
const Encryption = use("Encryption")
const Hash = use('Hash')


class AdminUserController {

    async register({ request }) {

        let { email, password, course_developer_id } = request.all();


        try {
            let adminUser = new Models.AdminUser();
            adminUser.email = email;
            adminUser.password = password;
            adminUser.course_developer_id = course_developer_id;
            adminUser.role = 'admin';
            await adminUser.save();

            await Models.User.create({
                email: email,
                password: password,
                username: 'admin'+adminUser.id,
                role: 'admin'
            })
            return 'success'
        }
        catch (err) {
            console.log(err);
            return 'failed'
        }

    }

    async login({ request, response, view , session }) {

        const { email, password } = request.all()

        //  try{
        //         if(await auth.attempt(email, password)){
        //             let adminUser = await Models.AdminUser.findBy('email', email);
        //             let accessToken = await auth.generate(adminUser);
        //         }
                
        // }catch(err){
        //     console.log(err);
        // }
        // return response.redirect('/cms')

        let userArray = await Models.AdminUser.getUserByEmail(email);
        if (userArray.length > 0) {

            const dbEmail = userArray[0].email
            const dbPassword = userArray[0].password

            if (email === dbEmail && await Hash.verify(password, dbPassword)) {
                try {
                    session.put('cms_email', userArray[0].email);
                    session.put('cms_aid', userArray[0].id)
                    // await auth.login(userArray[0]);

                    return response.redirect('/cms')
                } catch (err) {
                    return response.redirect('/cms')
                }

            } else {
                return view.render('login', { 'error_msg': '電郵或密碼輸入錯誤' })
            }
           
            

        }

        return view.render('login', { 'error_msg': '此電郵並未註冊' })
    }

    async logout({ response, session }) {
        try {
            session.put('cms_email', '');
            session.put('cms_aid', '')
        } catch (error) {
            console.log(error)
        }
        return response.route('/cms/login')

    }

    async changePassword({ request, response, session }){
        const { current_password, new_password, confirm_new_password } = request.all();

        let aid = session.get('cms_aid');
        let user = await Models.AdminUser.find(aid);

        if(new_password !== confirm_new_password){
            session.flash({error: '確認密碼不相同'})
            return response.redirect('/cms/change-password');
        }

        if(await Hash.verify(current_password, user.password)){
            user.password = new_password;
            await user.save();
            session.flash({ notification: '成功更改密碼'})
        }else{
            session.flash({ error: '密碼不正確'})
        }
        return response.redirect('/cms/change-password');
    }

    async registerAdminUser({ request, response, auth, view, session }) {
        const { email, password, confirmPassword, role } = request.all()
        let error_msg = '註冊時發生錯誤';
        const now = HelperFunctions.DateParser.toSQLForm(new Date());
        

        if (password !== confirmPassword) {
            return view.render('/register', { 'error_msg': '密碼與確認密碼不相同' })
        }

        try {
            
            if(role === 'tutor'){
                const tutor = await Models.Tutor.getTutorByEmail(email);
                let tutor_id;
                if (!tutor) {
                    return view.render('/register', { 'error_msg': '你的電郵尚未被授權，請聯絡MeLearn.guru了解' })
                }
                tutor_id = tutor.id;
                
    
                const adminUser = new Models.AdminUser()
                adminUser.email = email;
                adminUser.password = password;
                adminUser.role = 'tutor';
                adminUser.course_developer_id = tutor.course_developer_id;
                await adminUser.save();

                await Models.Tutor.addAdminID(tutor_id, adminUser.id);
            }else{
                const courseDeveloper = await Models.CourseDeveloper.getCourseDeveloperByEmail(email);
                let courseDeveloper_id;
                if(!courseDeveloper){
                    return view.render('/register', { 'error_msg': '你的電郵尚未被授權，請聯絡MeLearn.guru了解' })
                }
                courseDeveloper_id = courseDeveloper.id;

                const adminUser = new Models.AdminUser()
                adminUser.email = email;
                adminUser.password = password;
                adminUser.role = 'course_developer';
                adminUser.course_developer_id = course_developer_id;
                await adminUser.save()

                await Models.User.create({
                    email: email,
                    password: password,
                    username: 'course_developer_'+adminUser.id,
                    role: 'course_developer'
                })
            }
        } catch(err) {
            if (err.code === 'ER_DUP_ENTRY') {
                error_msg += ': 此電郵已被註冊'
            }
            console.log(err);
            return view.render('/register', { 'error_msg': error_msg })
        }

        let userArray = await Models.AdminUser.getUserByEmail(email);
        session.put('cms_aid', userArray[0].id);
        session.put('cms_email', userArray[0].email);
        return response.redirect('/cms');
    }

}

module.exports = AdminUserController
