"use strict"
const Task = use('Task')
const Models = use('App/Controllers/Http/ModelController');
const HelperFunction = use('App/Controllers/Http/HelperFunctionController')



class ClearPromotion extends Task {

    static get schedule() {
        return "19 16 * * *";
    }

    async handle() {
        try {
            
            let promotion = await Models.PromotionDiscount.find(1);

            let coupon_id = promotion.coupon_id;

            if(coupon_id){
                let coupon = await Models.Coupon
                    .query()
                    .where('id', coupon_id)
                    .where('expiry_on', '<=', HelperFunction.DateParser.toSQLForm(new Date()))
                    .whereNull('deleted_at')
                    .fetch()

                if(coupon.toJSON().length > 0){
                    promotion.title = null;
                    promotion.description = null;
                    promotion.coupon_id = null;
                    promotion.promo_img = null;
                    promotion.created_at = null;
                    promotion.updated_at = null;

                    await promotion.save();
                }
            }


        } catch (e) {
            console.log(e)
        }
    }

}

module.exports = ClearPromotion