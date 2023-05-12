'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use('Database');

class PromotionDiscount extends Model {

    static async getCurrentPromo(){

        let currentPromo = await Database
            .select('promotion_discounts.*', 'coupons.code as coupon_code')
            .from('promotion_discounts')
            .leftJoin('coupons', 'coupons.id', 'promotion_discounts.coupon_id')
            .where('promotion_discounts.id', 1)

        return currentPromo;
    }

}

module.exports = PromotionDiscount
