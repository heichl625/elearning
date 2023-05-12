'use strict'

const { v4: uuidv4 } = require('uuid');

const Models = use('App/Controllers/Http/ModelController')
const HelperFunctions = use('App/Controllers/Http/HelperFunctionController');
const Encryption = use('Encryption');

class UserController {

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

    async showAllUser({ request, view, session }) {

        let page = request.input('page') || 1;
        let limit = request.input('limit') || 10;
        let keywords = request.input('keywords');

        let usersFetched;

        if(keywords){
            usersFetched = await Models.User
                .query()
                .where(function(){
                    this
                        .where('username', 'LIKE', '%'+keywords+'%')
                        .orWhere('email', 'LIKE', '%'+keywords+'%')
                        .orWhere('phone', 'LIKE', '%'+keywords+'%')
                })
                .paginate(page, limit)
        }else{
            usersFetched = await Models.User.query().paginate(page, limit);
        }

        let users = usersFetched.toJSON();

        if (users.data.length === 0) {
            session.flash({ error: '暫未有任何註冊用戶' })
            return view.render('/users')
        }

        return view.render('/users', { users: users.data, currentPage: users.page, lastPage: users.lastPage, limit: limit,keywords: keywords })
    }

    async getUserDetail({ params, view }) {

        let userData = await Models.User.find(params.id)

        switch (userData.monthly_income) {
            case 10000:
                userData.monthly_income = "$10,000或以下";
                break;
            case 20000:
                userData.monthly_income = "$10,001 - $20,000"
                break;
            case 30000:
                userData.monthly_income = "$20,001 - $30,000"
                break;
            case 40000:
                userData.monthly_income = "$30,001 - $40,000"
                break;
            case 40000:
                userData.monthly_income = "$40,001 - $50,000"
                break;
            case 50000:
                userData.monthly_income = "$50,001或以上"
                break;

        }

        let usersInterestData = await Models.UsersInterest.findBy('user_id', params.id)
        let usersPromoSettingData = await Models.UsersPromoSetting.findBy('user_id', params.id)

        return view.render('/pages/users/detail', {
            userData: userData,
            userInterestData: usersInterestData,
            usersPromoSettingData: usersPromoSettingData
        })
    }

    async delete({ session, params, response }) {

        let user = await Models.User.find(params.id);

        if (user) {
            user.deleted_at = HelperFunctions.DateParser.toSQLForm(new Date())
            user.save();
            session.flash({ notification: '已停用用戶 ' + user.username })
            return response.redirect('/cms/users');
        } else {
            session.flash({ error: '發生錯誤，未能停用用戶' + user.username })
            return response.redirect('/cms/users');
        }

    }

    async enable({ session, params, response }){
        let user = await Models.User.find(params.id);

        if (user) {
            user.deleted_at = null
            user.save();
            session.flash({ notification: '已啟用用戶 ' + user.username })
            return response.redirect('/cms/users');
        } else {
            session.flash({ error: '發生錯誤，未能啟用用戶' + user.username })
            return response.redirect('/cms/users');
        }
    }
}

module.exports = UserController
