'use strict'
const Models = use('App/Controllers/Http/ModelController');
const HelperFunction = use('App/Controllers/Http/HelperFunctionController');


class CouponController {

    async checkCoupon({request, response, auth}){

        let { couponCode, user_id } = request.all();

        let now = HelperFunction.DateParser.toSQLForm(new Date())

        let coupon = await Models.Coupon
        .query()
        .where('code', couponCode)
        .where('start_on', '<=', now)
        .where('expiry_on', '>', now)
        .where('deleted_at', null)
        .first();

        if(!coupon){
            return response.json({error: '優惠券已過期或不存在'})
        }

        if(user_id){
            let couponeUsage = await Models.CouponUsage
            .query()
            .where('coupon_id', coupon.id)
            .where('user_id', user_id)
            .where('deleted_at', null)
            .first()
    
            if(couponeUsage){
                return response.json({error: '你已於之前的交易中使用過，優惠券不能重覆使用'})
            }    
        }
        
        return response.json({ coupon: coupon });

    }

}

module.exports = CouponController
