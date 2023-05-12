'use strict'

const HelperFunction = use('App/Controllers/Http/HelperFunctionController');
const Models = use('App/Controllers/Http/ModelController');

const moment = require('moment');

class CouponController {

    async index({ request, view }) {

        let page = request.input('page') || 1;
        let limit = request.input('limit') || 10;
        let keywords = request.input('keywords');

        let coupons = await Models.Coupon.get(page, limit, keywords);

        let couponsData = coupons?.data?.map(coupon => {
            let now = moment().tz("Asia/Hong_Kong")
            let isValid = true;
            if(moment(coupon.expiry_on) <= now || moment(coupon.start_on) >= now){
                isValid = false;
            }else{
            }



            return {
                ...coupon,
                created_at: moment(coupon.created_at).format('YYYY-MM-DD HH:mm:ss'),
                updated_at: moment(coupon.updated_at).format('YYYY-MM-DD HH:mm:ss'),
                expiry_on: moment(coupon.expiry_on).format('YYYY-MM-DD HH:mm:ss'),
                start_on: moment(coupon.start_on).format('YYYY-MM-DD HH:mm:ss'),
                isValid: isValid
            }
        })


        return view.render('coupons', { coupons: couponsData, currentPage: coupons.page, lastPage: coupons.lastPage, limit: limit, keywords: keywords, currentDate: new Date() });

    }

    async add({ request, response, session }) {

        let { start_on, expiry_on, ...rest } = request.all();

        let parsedStart_on = moment(start_on).format('YYYY-MM-DD HH:mm:ss');
        let parsedExpiry_on = moment(expiry_on).format('YYYY-MM-DD HH:mm:ss');
        let now = moment().format('YYYY-MM-DD HH:mm:ss')



        try {
            let id = await Models.Coupon.add({
                ...rest,
                start_on: parsedStart_on,
                expiry_on: parsedExpiry_on,
                created_at: now,
                updated_at: now
            })

            console.log(id)

            if (!id) {
                session.flash({ error: '未能成功加入新優惠券' })
                return response.redirect('/cms/coupons/add')
            }

            session.flash({ notification: '成功加入新優惠券' })
            return response.redirect('/cms/coupons')
        } catch (error) {
            session.flash({ error: '未能成功加入新優惠券' })
            return response.redirect('/cms/coupons/add')
        }


    }

    async getEdit({ params, view }) {

        console.log(moment().format('YYYY-MM-DD HH:mm:ss'))

        let coupon = await Models.Coupon.getCouponById(params.id);

        coupon.start_on = HelperFunction.DateParser.toHTMLForm(coupon.start_on);
        coupon.expiry_on = HelperFunction.DateParser.toHTMLForm(coupon.expiry_on);

        return view.render(`pages/coupons/edit`, { coupon: coupon })
    }

    async edit({ params, response, request, session }) {

        let { start_on, expiry_on, ...rest } = request.all();

        let parsedStart_on = moment(start_on).format('YYYY-MM-DD HH:mm:ss');
        let parsedExpiry_on = moment(expiry_on).format('YYYY-MM-DD HH:mm:ss');
        let now = moment().format('YYYY-MM-DD HH:mm:ss');


        try {
            let affectedRow = await Models.Coupon.edit(params.id, {
                ...rest,
                start_on: parsedStart_on,
                expiry_on: parsedExpiry_on,
                // updated_at: now
            })

            if (affectedRow !== 1) {
                session.flash({ error: '未能成功修改優惠券資料' })
                return response.redirect('/cms/coupons/add')
            } else {
                session.flash({ notification: '成功修改優惠券資料' })
                return response.redirect('/cms/coupons')
            }

        } catch (error) {
            session.flash({ error: '未能成功修改優惠券資料' })
            return response.redirect('/cms/coupons/add')
        }

    }

    async delete({ params, response, session }) {

        let deleted_at = moment().format('YYYY-MM-DD HH:mm:ss');

        try {
            let affectedRow = await Models.Coupon.delete(params.id, deleted_at)

            if (affectedRow !== 1) {
                session.flash({ error: '未能成功刪除優惠券資料' })
            } else {
                session.flash({ notification: '成功刪除優惠券資料' })
            }
            return response.redirect('/cms/coupons')
        } catch (error) {
            session.flash({ error: '未能成功刪除優惠券資料' })
            return response.redirect('/cms/coupons')
        }


    }

}

module.exports = CouponController
