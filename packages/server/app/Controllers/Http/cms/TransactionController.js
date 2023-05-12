'use strict'

const { findOrNew } = require("@adonisjs/lucid/src/Lucid/Model");

const Models = use('App/Controllers/Http/ModelController')
const HelperFunction = use('App/Controllers/Http/HelperFunctionController')
const Helpers = use('Helpers');
const fs = use('fs');
const FileType = require('file-type');
const nodemailer = require("nodemailer");
const Configs = use('App/Controllers/Http/ConfigController');

const setPendingTransactionInvalid = async (user_id, course_id) => {
    let transactionDetails = await Models.TransactionDetail
        .query()
        .select('transactions.id as transaction_id')
        .leftJoin('transactions', 'transaction_details.transaction_id', 'transactions.id')
        .where('transactions.user_id', user_id)
        .where(function(){
            this
                .where(function(){
                    this
                        .where('transactions.status', 'pending')
                        .whereNull('transactions.proof')
                })
                .orWhere('transactions.status', 'failed')
        })
        .where('transaction_details.course_id', course_id)
        .whereNull('transaction_details.deleted_at')
        .whereNull('transactions.deleted_at')
        .fetch();

    transactionDetails = transactionDetails.toJSON();

 
    if(transactionDetails){
        for(let detail of transactionDetails){
            let transaction = await Models.Transaction.find(detail.transaction_id)

            transaction.status = 'invalid';
            await transaction.save();
        }
    }
}

class TransactionController {

    async index({ request, view }) {
        let status = request.input('status') || '';
        let limit = request.input('limit') || 10;
        let page = request.input('page') || 1;
        let keywords = request.input('keywords') || ''

        let transactions = await Models.Transaction.getRecords(status, page, limit, keywords);

        transactions.data.forEach(transaction => {
            switch (transaction.status) {
                case 'pending':
                    if(transaction.proof){
                        transaction.status = '待確認';
                    }else{
                        transaction.status = '未完成付款';
                    }
                    break;
                case 'verified':
                    transaction.status = '已確認';
                    break;
                case 'failed':
                    transaction.status = '失敗';
                    break;
                case 'refunding':
                    transaction.status = '退款中';
                    break;
                case 'invalid':
                    transaction.status = '已失效';
                    break;
                case 'refunded':
                    transaction.status = '已退款';
                    break;
                default:
                    break;
            }
            switch (transaction.method) {
                case 'fps':
                    transaction.method = '轉數快'
                    break;
                case 'banktransfer':
                    transaction.method = '銀行轉帳'
                    break;
                case 'creditcard':
                    transaction.method = '信用卡'
                    break;
                default:
                    break;
            }
        })

        return view.render('transactions', { transactions: transactions.data, currentPage: transactions.page, lastPage: transactions.lastPage, limit: limit, status: status, keywords: keywords })
    }

    async getPendingTransactionNumber({ response }){

        //Get transaction number which is in pending state and have proof submitted
        try{
            let transaction = await Models.Transaction
            .query()
            .where('status', 'pending')
            .whereNotNull('proof')
            .count('id as pendingNumber')

            return response.json({ pendingNumber: transaction[0].pendingNumber});
        }catch(err){
            console.log(err);
            return response.json({ error: err});

        }
    }

    async getTransactionDetail({ params, view }) {

        let { id } = params;

        let transaction = await Models.Transaction.getTransactionDetail(id);
        let transactionDetails = await Models.TransactionDetail.getDetails(id);
        const readFileSync = Helpers.promisify(fs.readFileSync)
        const writeFileSync = Helpers.promisify(fs.writeFileSync)

        switch (transaction[0].method) {
            case 'creditcard':
                transaction[0].method = '信用卡'
                break;
            case 'banktransfer':
                transaction[0].method = '銀行轉帳'
                break;
            case 'fps':
                transaction[0].method = '轉數快'
                break;
            default:
                break;
        }

        switch (transaction[0].status) {
            case 'pending':
                if(transaction[0].proof){
                    transaction[0].status = '待確認';
                }else{
                    transaction[0].status = '未完成付款';
                }
                break;
            case 'verified':
                transaction[0].status = '已確認';
                break;
            case 'failed':
                transaction[0].status = '失敗';
                break;
            case 'invalid':
                transaction[0].status = '已失效';
                break;
            case 'refunding':
                transaction[0].status = '退款中';
                break;
            case 'refunded':
                transaction[0].status = '已退款';
                break;
            default:
                break;
        }

        if (transaction[0].proof) {
            let mime;
            let buffer;

            try{
                buffer = await fs.readFileSync(Helpers.appRoot() + transaction[0].proof)

                mime = await FileType.fromBuffer(buffer);
            }catch(err){
                console.log(err);
            }

            return view.render('pages/transactions/detail', { transaction: transaction[0], transactionDetails: transactionDetails, buffer: buffer?.toString('base64'), mime: mime })

        }


        return view.render('pages/transactions/detail', { transaction: transaction[0], transactionDetails: transactionDetails })

    }

    async changeStatus({ request, response, session, params }) {

        let { id } = params;
        let { status } = request.all();

        try {
            let transaction = await Models.Transaction.find(id);
            let transactionDetails = await Models.TransactionDetail
                .query()
                .where('transaction_id', id)
                .fetch();

            transaction.status = status;
            await transaction.save();

            if (status === 'verified') {
                transactionDetails.toJSON().forEach(async detail => {

                    //If user purchased a course which already in pending transaction state, change that pending state to invalid
                    await setPendingTransactionInvalid(transaction.user_id, detail.course_id);

                    //Add Course Enrollment Record

                    let courseEnrollment = new Models.CourseEnrollment();
                    courseEnrollment.user_id = transaction.user_id;
                    courseEnrollment.course_id = detail.course_id;
                    courseEnrollment.finished = false;
                    await courseEnrollment.save()

                })

                let courses = [];
                for(const course of transactionDetails.toJSON()){
                    let courseInfo = await Models.Course.find(course.course_id);
                    courses.push(courseInfo.toJSON());
                }

                let coupon;
                let couponUsage = await Models.CouponUsage.findBy('transaction_id', transaction.id);
                if(couponUsage){
                    couponUsage.status = 'applied';
                    await couponUsage.save();
                    coupon = await Models.Coupon.find(couponUsage.coupon_id);
                }
                
                let user = await Models.User.find(transaction.user_id);

                let transporter = nodemailer.createTransport(Configs.Email.mailConfig);
                const info = await transporter.sendMail({
                    from: '"MeLearn.Guru noreply@enrichculture.com',
                    to: user.email,
                    subject: `[No reply]MeLearn.Guru：購物收據 (訂單編號：#${transaction.id})`,
                    html: Configs.Email.template.shoppingReceipt(courses, transaction, transactionDetails.toJSON(), user.toJSON(), coupon?.toJSON()),
                    // attachments: [{
                    //     filename: `logo_email.png`,
                    //     path: __dirname + '/../../../../public/assest/logo_email_long.png',
                    //     cid: 'logo'
                    // }]
                })
            } else {
                transactionDetails.toJSON().forEach(async detail => {
                    let courseEnrollment = await Models.CourseEnrollment
                        .query()
                        .where('user_id', transaction.user_id)
                        .where('course_id', detail.course_id)
                        .delete();

                    // await courseEnrollment.save()
                })

            }



            session.flash({ notification: '成功更改交易狀態' })
            return response.redirect('/cms/transactions/' + id)
        } catch (err) {
            console.log(err);
            session.flash({ error: '未能更改交易狀態：' + err })
            return response.redirect('/cms/transactions/' + id)
        }

    }

}

module.exports = TransactionController
