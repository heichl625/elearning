'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use('Database')

class Cart extends Model {

    static async getCartDetail(user_id){

        const cart = await Database
        .select('carts.course_id', 'courses.title', 'courses.price', 'courses.discount_price', 'tutors.name as tutor_name', 'courses.cover_img', 'courses.discount_text', 'tutors.avator as tutor_avator')
        .from('carts')
        .leftJoin('courses', 'carts.course_id', 'courses.id')
        .leftJoin('tutors', 'courses.tutor_id', 'tutors.id')
        .where('carts.user_id', user_id)
        .whereNull('carts.deleted_at')

        return cart;

    }


}

module.exports = Cart
