'use strict'

const Models = use('App/Controllers/Http/ModelController')
const Hashids = require('hashids/cjs')
const hashids = new Hashids('', 10)

class TransactionController {

    async getTransactionDetailById({ request, response }) {

        let { id } = request.all();

        let details = await Models.TransactionDetail.getDetails(id);

        let courseList = [];
        for (const detail of details) {
            let lessonNum = await Models.Lesson
                .query()
                .where('course_id', detail.course_id)
                .getCount()

            courseList.push({
                ...detail,
                course_id: hashids.encode(detail.course_id),
                lesson_num: lessonNum
            })
        }

        return response.json({ courseList: courseList })

    }

    async getTransaction({request, response}){

        let {transaction_id} = request.all();

        let transaction = await Models.Transaction.find(transaction_id);

        let details = await Models.TransactionDetail.getDetails(transaction_id);

        let courseList = [];

        for(const detail of details){
            let lessonNum = await Models.Lesson
                .query()
                .where('course_id', detail.course_id)
                .getCount()

            courseList.push({
                ...detail,
                course_id: hashids.encode(detail.course_id),
                lesson_num: lessonNum
            })
        }

        return response.json({ transaction: {
            ...transaction.toJSON(),
            details: courseList
        }})

    }

    async getTransactionCoupon({ request, response }) {

        let { id } = request.all();

        try {
            let couponUsage = await Models.CouponUsage
                .query()
                .where('transaction_id', id)
                .whereNull('deleted_at')
                .first()

            if (couponUsage) {
                let coupon = await Models.Coupon.find(couponUsage.coupon_id);
                return response.json({ coupon: coupon })
            } else {
                return response.json({ msg: 'No Coupon Used' })
            }
        }catch(err){
            return response.json({ error: err })
        }
        

    }


}

module.exports = TransactionController
