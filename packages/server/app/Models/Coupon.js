'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use('Database')

class Coupon extends Model {

    static boot() {
        super.boot()

        // this.addTrait('SoftDelete')
        // this.addTrait("@provider:Lucid/UpdateOrCreate")
    }

    static async get(page, limit, keywords) {

        let coupons;

        if (keywords) {
            coupons = await Database
                .select('*')
                .from('coupons')
                .whereNull('deleted_at')
                .where(function () {
                    this
                        .where('title', 'LIKE', '%' + keywords + '%')
                        .orWhere('description', 'LIKE', '%' + keywords + '%')
                        .orWhere('code', 'LIKE', '%' + keywords + '%')
                })
                .paginate(page, limit)
        } else {
            coupons = await Database
                .select('*')
                .from('coupons')
                .whereNull('deleted_at')
                .paginate(page, limit)
        }

        // coupons.data.forEach(coupon => {
        //     coupon.created_at.setTime(coupon.created_at.getTime() + (8 * 60 * 60 * 1000));
        //     coupon.updated_at.setTime(coupon.updated_at.getTime() + (8 * 60 * 60 * 1000));
        //     if (coupon.deleted_at) {
        //         coupon.deleted_at.setTime(course.deleted_at.getTime() + (8 * 60 * 60 * 1000));
        //     }
        // })

        return coupons
    }

    static async add(couponData) {
        const id = await Database.insert(couponData).into('coupons');
        return id;
    }

    static async getCouponById(id) {
        const coupon = await Database
            .select('*')
            .from('coupons')
            .where({ id: id })
            .whereNull('deleted_at')

        return coupon[0];
    }

    static async edit(id, couponData) {
        const affectedRow = await Database
            .table('coupons')
            .where({ id: id })
            .update(couponData)

        return affectedRow;
    }


    static async delete(id, deleted_at) {
        const affectedRow = await Database
            .table('coupons')
            .where({ id: id })
            .update({ deleted_at: deleted_at })

        return affectedRow;
    }

}

module.exports = Coupon
