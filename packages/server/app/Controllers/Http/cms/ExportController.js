'use strict'
const { parse } = require('json2csv');
const Models = use('App/Controllers/Http/ModelController')
const Helpers = use("Helpers")
const fs = require('fs')
const util = require('util')
const writeFilePromisified = util.promisify(fs.writeFile);
const moment = require('moment-timezone')

class ExportController {

    async index({ request, response, view, session }) {

        let type = request.input('type');
        let month = request.input('month');
        console.log(month);

        let courses = await Models.Course
            .query()
            .whereNull('deleted_at')
            .fetch();
        courses = courses.toJSON();

        let instructors = await Models.Tutor
            .query()
            .whereNull('deleted_at')
            .fetch();
        instructors = instructors.toJSON();

        let fileName;

        if (type) {
            switch (type) {
                case 'user':
                    fileName = await this.exportUserRecord();
                    break;
                case 'transaction':
                    fileName = await this.exportTransactionRecord();
                    break;
                default:
                    break;
            }

            if(fileName){
                return response.attachment(Helpers.appRoot()+'/export_data/' + fileName)
            }else{
                session.flash({ error: '沒有任何紀錄'})
                return response.redirect('back')
            }
        }

        return view.render('exports', { courses, instructors })
    }

    async sales_per_day({ request, response, session }){
        let { start_date, end_date } = request.all();

        if(!start_date || !end_date){
            session.flash({ error: '必須輸入日期'})
            return response.redirect('back');
        }

        let fileName = await this.exportSalesByDate(start_date, end_date);

        if(fileName){
            return response.attachment(Helpers.appRoot()+'/export_data/' + fileName)
        }else{
            session.flash({ error: '所選月份沒有任何紀錄'})
            return response.redirect('back')
        }
    }

    async sales_by_courses({ request, response, session }){
        let { course_id } = request.all();

        if(!course_id){
            session.flash({ error: '必須選擇課程'})
            return response.redirect('back');
        }

        let fileName = await this.exportSalesByCourse(course_id);

        if(fileName){
            return response.attachment(Helpers.appRoot()+'/export_data/' + fileName)
        }else{
            session.flash({ error: '所選課程沒有任何紀錄'})
            return response.redirect('back')
        }
    }

    async sales_by_instructor({ request, response, session }){
        let { instructor_id } = request.all();

        if(!instructor_id){
            session.flash({ error: '必須選擇導師'})
            return response.redirect('back');
        }

        let fileName = await this.exportSalesByInstructor(instructor_id);

        if(fileName){
            return response.attachment(Helpers.appRoot()+'/export_data/' + fileName)
        }else{
            session.flash({ error: '所選導師沒有任何紀錄'})
            return response.redirect('back')
        }
    }

    async exportUserRecord() {

        const fields = ['id', 'username', 'email', 'role', 'area_code', 'phone', 'gender', 'first_name', 'last_name', 'birthday_month', 'occupation', 'monthly_income', 'phone_verified', 'billing_first_name', 'billing_last_name', 'billing_company', 'billing_country', 'billing_address', 'billing_city', 'billing_district', 'billing_post_code', 'created_at', 'updated_at', 'interest']
        const opts = { fields };

        try {
            let users = await Models.User.query().whereNull('deleted_at').fetch();

            users = users.toJSON();

            for(const user of users){
                let userInterest = await Models.UsersInterest.findBy('user_id', user.id);
                
                user.interest = [];
                if(userInterest){
                    userInterest = userInterest.toJSON();
                    if (userInterest.invest == 1) {
                        user.interest.push('股票/投資')
                    }
                    if (userInterest.home_ownership == 1) {
                        user.interest.push('海外樓市/置業')
                    }
                    if (userInterest.marketing == 1) {
                        user.interest.push('市場營銷')
                    }
                    if (userInterest.business_management == 1) {
                        user.interest.push('工商管理')
                    }
                    if (userInterest.career == 1) {
                        user.interest.push('職場')
                    }
                    if (userInterest.health == 1) {
                        user.interest.push('健康/保健')
                    }
                    if (userInterest.education == 1) {
                        user.interest.push('親子/升學')
                    }
                    if (userInterest.travel == 1) {
                        user.interest.push('旅遊')
                    }
                }
                
                user.interest = user.interest.join(',')

                delete user.password;
                delete user.login_token;
                delete user.facebook_id;
                delete user.google_id;
                delete user.stripe_id;
                delete user.reset_pw_token;
                delete user.education_level;
                delete user.living_area;
                delete user.receive_info;

            }

            if(users.length === 0){
                return null
            }


            const fileName =`users_record_${moment().format(
                "YYYYMMDD_HHmmss"
              )}.csv`

            let csv = "\ufeff"+parse(users, opts);

            await writeFilePromisified(Helpers.appRoot()+'/export_data/'+fileName, csv, 'utf8')
            .catch(err => {
                console.log(err);
            })

            return fileName

        }catch(err){
            console.log(err);
        }
    }

    async exportTransactionRecord(){

        const fields = ['id', 'user_id', 'username', 'user_email', 'sub_total', 'total', 'purchased_courses', 'submitted_proof', 'method', 'holder_name', 'status', 'first_name', 'last_name', 'company', 'country', 'address', 'district', 'post_code', 'created_at', 'updated_at']
        const opts = { fields };

        try{
            let transactions = await Models.Transaction.query().whereNull('deleted_at').fetch();

            transactions = transactions.toJSON();
    
            for(const transaction of transactions){
    
                let user = await Models.User.find(transaction.user_id);
                user = user.toJSON();
    
                transaction.username = user.username;
                transaction.user_email = user.email;
                
                let transactionDetails = await Models.TransactionDetail.query().where('transaction_id', transaction.id).fetch();
                transactionDetails = transactionDetails.toJSON();
    
                transaction.purchased_courses = [];
                for(const detail of transactionDetails){
                    let course = await Models.Course.find(detail.course_id);
                    course = course.toJSON();
    
                    transaction.purchased_courses.push(`${course.title}: HK$${detail.price}`)
                }
    
                transaction.submitted_proof = (transaction.method === 'bank-transfer' || transaction.method === 'fps') ? (transaction.proof ? "true" : "false") : null 
                transaction.purchased_courses = transaction.purchased_courses.join(",")
                
                delete transaction.deleted_at
                delete transaction.proof
            }

            if(transactions.length === 0){
                return null
            }

            const fileName =`transactions_record_${moment().format(
                "YYYYMMDD_HHmmss"
              )}.csv`

            let csv = "\ufeff"+parse(transactions, opts);

            await writeFilePromisified(Helpers.appRoot()+'/export_data/'+fileName, csv, 'utf8')
            .catch(err => {
                console.log(err);
            })

            return fileName

        }catch(err){
            console.log(err)
        }
        

    }

    async exportSalesByDate(start_date, end_date){
        
        const fields = ['transaction_id', 'user_id', 'username', 'user_email', 'sub_total', 'total', 'method', 'status', 'created_at', 'updated_at', 'courses']
        const opts = { fields };

        try{
            let records = await Models.Transaction.getSalesByDate(moment(start_date).format('YYYY-MM-DD HH:mm:ss'), moment(end_date).format('YYYY-MM-DD HH:mm:ss'))
    
            for(const record of records){
                record.transaction_id = record.id;
                record.created_at = moment(record.created_at).format('YYYY-MM-DD HH:mm:ss')
                record.updated_at = moment(record.updated_at).format('YYYY-MM-DD HH:mm:ss')
                delete record.id
                delete record.deleted_at;
                delete record.post_code;
                delete record.address;
                delete record.city;
                delete record.district;
                delete record.country;
                delete record.company;
                delete record.holder_name;
                delete record.first_name;
                delete record.last_name;
                delete record.company;
                delete record.proof;
            }

            if(records.length === 0){
                return null
            }
            
            const fileName =`sales_record_${moment(start_date).format(
                "YYYYMMDD"
              )}_${moment(end_date).format(
                "YYYYMMDD"
              )}.csv`

            let csv = "\ufeff"+parse(records, opts);

            await writeFilePromisified(Helpers.appRoot()+'/export_data/'+fileName, csv, 'utf8')
            .catch(err => {
                console.log(err);
            })

            return fileName

        }catch(err){
            console.log(err);
        }

    }

    

    async exportSalesByCourse(course_id){

        const fields = ['course_id', 'user_id','first_name', 'last_name', 'area_code' ,'phone', 'email', 'method', 'transaction_id', 'course_price', 'total','created_at', 'transaction_status', 'updated_at']
        const opts = { fields };

        try{

            let course = await Models.Course.find(course_id);

            let records = await Models.Transaction.getSalesByCourse(course_id);

            if(records.length === 0){
                return null
            }

            for(const record of records){
                record.created_at = moment(record.created_at).format('YYYY-MM-DD HH:mm:ss')
                record.updated_at = moment(record.updated_at).format('YYYY-MM-DD HH:mm:ss')
                delete record.id;
                // delete record.course_id;
                delete record.deleted_at;
            }
            
            const fileName =`sales_${course.title}_${moment().format(
                "YYYYMMDD"
              )}.csv`

              console.log(parse(records, opts))

            let csv = "\ufeff"+parse(records, opts);

            await writeFilePromisified(Helpers.appRoot()+'/export_data/'+fileName, csv, 'utf8')
            .catch(err => {
                console.log(err);
            })

            return fileName
            
        }catch(err){
            console.log(err);
        }

    }

    async exportSalesByInstructor(instructor_id){
        const fields = ['instructor_id', 'user_id' ,'course_id','course_name', 'first_name', 'last_name', 'area_code', 'phone', 'email', 'method', 'transaction_id', 'course_price', 'total', 'created_at', 'transaction_status', 'updated_at']
        const opts = { fields };

        try{
            let instructor = await Models.Tutor.find(instructor_id);
            let records = await Models.Transaction.getSalesByInstructor(instructor_id);

            if(records.length === 0){
                return null
            }

            for(const record of records){

                record.created_at = moment(record.created_at).format('YYYY-MM-DD HH:mm:ss')
                record.updated_at = moment(record.updated_at).format('YYYY-MM-DD HH:mm:ss')
                delete record.id;
                // delete record.course_id;
                delete record.deleted_at;
            }
            
            const fileName =`sales_${instructor.name}_${moment().format(
                "YYYYMMDD"
              )}.csv`

            let csv = "\ufeff"+parse(records, opts);

            await writeFilePromisified(Helpers.appRoot()+'/export_data/'+fileName, csv, 'utf8')
            .catch(err => {
                console.log(err);
            })

            return fileName
            
        }catch(err){
            console.log(err);
        }
    }


}

module.exports = ExportController
