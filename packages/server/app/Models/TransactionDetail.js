'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use('Database')

class TransactionDetail extends Model {

    static async getDetails(id){

        let transactionDetail = await Database
            .select('transaction_details.*', 'courses.title as course_title', 'courses.cover_img', 'tutors.name as tutor_name', 'courses.price as course_price', 'courses.discount_price as course_discount_price', 'courses.discount_text', 'tutors.avator', 'courses.duration')
            .from('transaction_details')
            .leftJoin('courses', 'courses.id', 'transaction_details.course_id')
            .leftJoin('tutors', 'tutors.id', 'courses.tutor_id')
            .where('transaction_details.transaction_id', id)

        return transactionDetail;
    }
}

module.exports = TransactionDetail
