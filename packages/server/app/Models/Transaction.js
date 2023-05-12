'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use('Database')

class Transaction extends Model {

    static async getRecordNumber(course_id, user_id) {

        let record = await Database
        .from('transactions')
        .leftJoin('transaction_details', 'transaction_details.transaction_id', 'transactions.id')
        .where('transactions.user_id', user_id)
        .where('transaction_details.course_id', course_id)
        .whereNull('transactions.deleted_at')
        .count('* as total')


        return record[0].total
    }

    static async getRecords(status, page, limit, keywords){

        let records = await Database
            .select('users.email', 'transactions.*')
            .from('transactions')
            .leftJoin('users', 'users.id', 'transactions.user_id')
            .where(function () {
                if(status){
                    this
                        .where('transactions.status', status)
                }
            })
            .where(function(){
                if(keywords){
                    this
                        .where('users.email', 'LIKE', '%'+keywords+'%')
                        .orWhere('users.phone', 'LIKE', '%'+keywords+'%')
                        .orWhere('users.username', 'LIKE', '%'+keywords+'%')
                }
            })
            .orderBy('transactions.created_at', 'desc')
            .paginate(page, limit)


        return records;
    }

    static async getTransactionDetail(id){

        let transaction = await Database
            .select('users.email', 'users.phone', 'users.area_code', 'transactions.*')
            .from('transactions')
            .leftJoin('users', 'users.id', 'transactions.user_id')
            .where('transactions.id', id)
            .whereNull('transactions.deleted_at')

        return transaction;

    }

    static async getSales(xUnit){
        let sales;
        
        switch(xUnit){
            case 'date':
                try{
                    sales = await Database.raw(`select SUM(total) as sum, DATE(created_at) as date from transactions where status = 'verified' and created_at > now() - interval 1 month group by DATE(created_at)`)
                }catch(err){
                    console.log(err);
                }
               
                break;
            default: 
                break;
        }

        return sales[0]
    }

    static async getSalesByDate(startDate, endDate){
        try{
            let transactions = await Database.raw(`select * from transactions where updated_at >= "${startDate}" and updated_at < "${endDate}"`);
            let records = [];

            console.log(transactions[0]);

            for(const transaction of transactions[0]){
                let courseList = await Database
                    .select('courses.title as course_title')
                    .from('transaction_details')
                    .leftJoin('courses', 'transaction_details.course_id', 'courses.id')
                    .where('transaction_details.transaction_id', transaction.id)
                    .whereNull('transaction_details.deleted_at')
                // console.log({courseList: courseList.map(course => course.course_title)})
                let user = await Database
                .select('username', 'email')
                .from('users')
                .where('id', transaction.user_id)
                
                records.push({
                    ...transaction,
                    username: user[0].username,
                    user_email: user[0].email,
                    courses: courseList.map(course => course.course_title).join(', ')
                })
            }

            console.log(records);

            return records
        }catch(err){
            console.log(err)
        }
    }

    static async getSalesByCourse(course_id){
        try{

            let records = await Database
                .select('transaction_details.course_id as course_id','users.id as user_id','transactions.first_name', 'transactions.last_name', 'users.area_code', 'users.phone', 'users.email', 'transactions.method', 'transactions.id as transaction_id', 'transaction_details.price as course_price', 'transactions.total', 'transactions.created_at', 'transactions.status as transaction_status', 'transactions.updated_at')
                .from('transaction_details')
                .leftJoin('transactions', 'transaction_details.transaction_id', 'transactions.id')
                .leftJoin('users', 'transactions.user_id', 'users.id')
                .where('transaction_details.course_id', course_id)
                .whereNot('transactions.status', 'invalid')
                .whereNull('transaction_details.deleted_at')
                .whereNull('transactions.deleted_at')
                

            console.log("Fetching sales by course")

            // let courses = await Database.raw(`select COUNT(transaction_details.id) as total_sales, courses.id as course_id, courses.title as course_title from transaction_details left join transactions on transaction_details.transaction_id = transactions.id left join courses on transaction_details.course_id = courses.id where courses.deleted_at is null and transaction_details.deleted_at is null and transactions.deleted_at is null and transactions.status = 'verified' group by course_id`)
            console.log({records});
            return records;
        }catch(err){
            console.log(err);
        }
    }

    static async getSalesByInstructor(instructor_id){
        try{
            let records = await Database
                .select('courses.tutor_id as instructor_id', 'courses.id as course_id','users.id as user_id','courses.title as course_name', 'transactions.first_name', 'transactions.last_name', 'users.area_code', 'users.phone', 'users.email', 'transactions.method', 'transactions.id as transaction_id', 'transaction_details.price as course_price', 'transactions.total', 'transactions.created_at', 'transactions.status as transaction_status', 'transactions.updated_at')
                .from('transaction_details')
                .leftJoin('courses', 'transaction_details.course_id', 'courses.id')
                .leftJoin('transactions', 'transaction_details.transaction_id', 'transactions.id')
                .leftJoin('users', 'transactions.user_id', 'users.id')
                .where('courses.tutor_id', instructor_id)
                .whereNot('transactions.status', 'invalid')
                .whereNull('transaction_details.deleted_at')
                .whereNull('transactions.deleted_at')
            // let instructors = await Database.raw(`select COUNT(transaction_details.id) as total_sales,tutors.id as instructor_id, tutors.name as instructor_name from transaction_details left join transactions on transaction_details.transaction_id = transactions.id left join courses on transaction_details.course_id = courses.id left join tutors on courses.tutor_id = tutors.id where courses.deleted_at is null and transactions.deleted_at is null and transaction_details.deleted_at is null and tutors.deleted_at is null and transactions.status = 'verified' group by instructor_id`)

            console.log(records)
            return records
        }catch(err){
            console.log(err);
        }
    }

    static async getTotalSales(){
        try{
            let total_sales = await Database.raw(`select SUM(transactions.total) as total_sales from transactions where transactions.deleted_at is null and status='verified'`)
            return total_sales[0][0].total_sales;
        }catch(err){
            console.log(err);
        }
    }


}

module.exports = Transaction
