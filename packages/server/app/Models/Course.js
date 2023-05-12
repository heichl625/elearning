'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use('Database')
const HelperFunctions = use('App/Controllers/Http/HelperFunctionController');
const Hashids = require('hashids/cjs')
const hashids = new Hashids()


class Course extends Model {
    static boot() {
        super.boot()

        // this.addTrait('SoftDelete')
        // this.addTrait("@provider:Lucid/UpdateOrCreate")

    }

    static get table() {
        return 'courses'
    }
    static get incrementing() {
        return true
    }
    static get hidden() {
        return ['created_at', 'updated_at', 'deleted_at']
    }

    static async getCourses(keywords, category, sortby, instructor, type) {

        let sortMap = {
            field: 'courses.created_at',
            order: 'desc'
        }

        switch(sortby){
            case 'oldest':
                sortMap = {
                    field: 'courses.created_at',
                    order: 'asce'
                }
                break;
            default:
                break;

        }

        let courseList = await Database
            .select('courses.*', 'tutors.avator as tutor_avator', 'tutors.name as tutor_name')
            .from('courses')
            .leftJoin('tutors', 'courses.tutor_id', 'tutors.id')
            .where('courses.published', 1)
            .whereNull('courses.deleted_at')
            .where(function(){
                    if(type === 'earlybird'){
                        this
                            .where('courses.discount_text', '早鳥價')
                    }
                    if(keywords){
                        this
                            .where('courses.title', 'LIKE', '%'+keywords+'%')
                            .orWhere('tutors.name', 'LIKE', '%'+keywords+'%')
                    }
                    if(instructor){
                        this
                            .where('tutors.id', instructor)
                    }
                }
            )
            .orderBy(sortMap.field, sortMap.order)

        courseList.forEach(course => {
            course.current_price = course.discount_price ? course.discount_price : course.price;
        })

        if(sortby === 'cheapest'){
            courseList.sort((a,b) => a.current_price-b.current_price);
        }

        if(sortby === 'mostexpensive'){
            courseList.sort((a,b) => b.current_price-a.current_price);
        }

        if(category){

            let course_categories = await Database
                .select('course_id')
                .from('course_categories')
                .where('category_id', category)
            let courseCatArr = course_categories.map(course => course.course_id);
            
            courseList = courseList.filter(course => courseCatArr.includes(course.id))

        }

        // let courseList = await Database
        //     .select('courses.*', 'tutors.name as tutor_name', 'tutors.avator as tutor_avator')
        //     .from('courses')
        //     .leftJoin('tutors', 'courses.tutor_id', 'tutors.id')
        //     .whereNull('courses.deleted_at');

        // courseList.forEach(course => {
        //     course.created_at.setTime(course.created_at.getTime() + (8 * 60 * 60 * 1000));
        //     course.updated_at.setTime(course.updated_at.getTime() + (8 * 60 * 60 * 1000));
        //     if (course.deleted_at) {
        //         course.deleted_at.setTime(course.deleted_at.getTime() + (8 * 60 * 60 * 1000));
        //     }
        // })


        return courseList;


    }

    static async cmsGetCourses(user, page, limit) {

        let courseList;

        if (user.role === 'admin') {
            if(page && limit){
                courseList = await Database
                .select('courses.*', 'tutors.name as tutor_name')
                .from('courses')
                .leftJoin('tutors', 'courses.tutor_id', 'tutors.id')
                .whereNull('courses.deleted_at')
                .paginate(page, limit)
            }else{
                courseList = await Database
                .select('courses.*', 'tutors.name as tutor_name')
                .from('courses')
                .leftJoin('tutors', 'courses.tutor_id', 'tutors.id')
                .whereNull('courses.deleted_at')
            }
           
        } else {
            if(page && limit){
                courseList = await Database
                .select('courses.*', 'tutors.name as tutor_name')
                .from('courses')
                .leftJoin('tutors', 'courses.tutor_id', 'tutors.id')
                .where('tutors.course_developer_id', user.course_developer_id)
                .whereNull('courses.deleted_at')
                .paginate(page, limit);
            }else{
                courseList = await Database
                .select('courses.*', 'tutors.name as tutor_name')
                .from('courses')
                .leftJoin('tutors', 'courses.tutor_id', 'tutors.id')
                .where('tutors.course_developer_id', user.course_developer_id)
                .whereNull('courses.deleted_at')
            }
            
        }

        if(page && limit){
            courseList.data.forEach(course => {
                course.created_at.setTime(course.created_at.getTime() + (8 * 60 * 60 * 1000));
                course.updated_at.setTime(course.updated_at.getTime() + (8 * 60 * 60 * 1000));
                if (course.deleted_at) {
                    course.deleted_at.setTime(course.deleted_at.getTime() + (8 * 60 * 60 * 1000));
                }
            })
        }else{
            courseList.forEach(course => {
                course.created_at.setTime(course.created_at.getTime() + (8 * 60 * 60 * 1000));
                course.updated_at.setTime(course.updated_at.getTime() + (8 * 60 * 60 * 1000));
                if (course.deleted_at) {
                    course.deleted_at.setTime(course.deleted_at.getTime() + (8 * 60 * 60 * 1000));
                }
            })
        }

       


        return courseList;

    }

    static async getCourseCard(id){

        let course = await Database
            .select('courses.*', 'tutors.name as tutor_name', 'tutors.avator as tutor_avator')
            .from('courses')
            .leftJoin('tutors', 'courses.tutor_id', 'tutors.id')
            .where('courses.id', id)
            .whereNull('courses.deleted_at')


        let enrolledNum = await Database
            .from('course_enrollments')
            .count('* as total_student')
            .where('course_id', id)

        try {
            if (course[0]?.discount_start) {
                course[0].discount_start = course[0].discount_start.toISOString().slice(0, 10);
            }
            if (course[0]?.discount_end) {
                course[0].discount_end = course[0].discount_end.toISOString().slice(0, 10);
            }
            if (course[0]?.course_start) {
                course[0].course_start = course[0].course_start.toISOString().slice(0, 10);
            }
        } catch (err) {
            console.log(err);
        }

        if(course[0]){
            return { ...course[0], total_student: enrolledNum[0].total_student };
        }else{
            return
        }
    }

    static async getCourse(id) {

        let course = await Database
            .select('courses.*', 'tutors.course_developer_id as course_developer_id', 'tutors.id as tutor_id', 'tutors.avator', 'tutors.name')
            .from('courses')
            .leftJoin('tutors', 'courses.tutor_id', 'tutors.id')
            .where('courses.id', id)
            .where('courses.published', 1)
            .whereNull('courses.deleted_at');

        try {
            if (course[0]?.discount_start) {
                course[0].discount_start = course[0].discount_start.toISOString().slice(0, 10);
            }
            if (course[0]?.discount_end) {
                course[0].discount_end = course[0].discount_end.toISOString().slice(0, 10);
            }
            if (course[0]?.course_start) {
                course[0].course_start = course[0].course_start.toISOString().slice(0, 10);
            }
        } catch (err) {
            console.log(err);
        }
        return course;

    }

    static async cmsGetCourse(id) {

        let course = await Database
            .select('courses.*', 'tutors.course_developer_id as course_developer_id', 'tutors.id as tutor_id', 'tutors.avator', 'tutors.name')
            .from('courses')
            .leftJoin('tutors', 'courses.tutor_id', 'tutors.id')
            .where('courses.id', id)
            .whereNull('courses.deleted_at');

        try {
            if (course[0]?.discount_start) {
                course[0].discount_start = course[0].discount_start.toISOString().slice(0, 10);
            }
            if (course[0]?.discount_end) {
                course[0].discount_end = course[0].discount_end.toISOString().slice(0, 10);
            }
            if (course[0]?.course_start) {
                course[0].course_start = course[0].course_start.toISOString().slice(0, 10);
            }
        } catch (err) {
            console.log(err);
        }
        return course;

    }

    static async createCourse(data) {

        const result = await Database.insert(data).into('courses');
        return result
    }

    static async editCourse(id, courseData, user) {

        const course_developer_id = await Database
            .select('tutors.course_developer_id')
            .from('courses')
            .leftJoin('tutors', 'courses.tutor_id', 'tutors.id')
            .where('courses.id', id)
            .whereNull('courses.deleted_at')


        if (user.role !== 'admin' && course_developer_id[0] !== user.course_developer_id) {
            return 'Unauthorized'
        }

        let affectedRow = await Database.table('courses').where('id', id).update(courseData);
        return affectedRow;

    }

    static async deleteCourse(id, user) {

        const date = HelperFunctions.DateParser.toSQLForm(new Date());
        const course_developer_id = await Database
            .select('tutors.course_developer_id')
            .from('courses')
            .leftJoin('tutors', 'courses.tutor_id', 'tutors.id')
            .where('courses.id', id)
            .whereNull('courses.deleted_at')

        if (user.role !== 'admin' && course_developer_id[0] !== user.course_developer_id) {
            return 'Unauthorized'
        }

        let course = await Database
            .table('courses')
            .where('id', id)
            .update('deleted_at', date)
        return course;
    }

    static async getEnrolledCourses(user_id) {

        const enrolledCourses = await Database
            .select('courses.*')
            .from('courses')
            .leftJoin('transaction_details', 'transaction_details.course_id', 'courses.id')
            .leftJoin('transactions', 'transactions.id', 'transaction_details.transaction_id')
            .where('transactions.user_id', user_id)
            .whereNull('courses.deleted_at')
            .whereNull('transaction_details.deleted_at')
            .whereNull('transactions.deleted_at')

        return enrolledCourses;

    }

    static async searchCourses(keywords, page, limit) {

        const courses = await Database
            .select('courses.*', 'tutors.name as tutor_name', 'tutors.avator as tutor_avator')
            .from('courses')
            .leftJoin('tutors', 'tutors.id', 'courses.tutor_id')
            .whereNull('courses.deleted_at')
            .where(function () {
                this
                    .where('courses.title', 'LIKE', '%' + keywords + '%')
                    .orWhere('tutors.name', 'LIKE', '%' + keywords + '%')
                    .orWhere('courses.target', 'LIKE', '%' + keywords + '%')
                    .orWhere('courses.learn', 'LIKE', '%' + keywords + '%')
                    .orWhere('courses.lesson_key', 'LIKE', '%' + keywords + '%')
            })
            .paginate(page, limit)

        return courses;

    }

    static async getTopSellingCourses(startDate, endDate) {

        const courses = await Database
            .select('course_enrollments.course_id', 'courses.*', 'tutors.avator as tutor_avator', 'tutors.name as tutor_name')
            .from('course_enrollments')
            .leftJoin('courses', 'course_enrollments.course_id', 'courses.id')
            .leftJoin('tutors', 'courses.tutor_id', 'tutors.id')
            .where(function () {
                this
                    .where('course_enrollments.created_at', '>=', startDate)
                    .where('course_enrollments.created_at', '<=', endDate)
                    .where('courses.published', 1)
                    .whereNull('courses.deleted_at')
                    .whereNull('tutors.deleted_at')
            })
            .count('* as total_sale')
            .groupBy('course_enrollments.course_id')
            .orderBy('total_sale', 'desc')
            .limit(4)

        return courses;
    }

    static async getStudentNumber(id){

        const count = await Database
            .from('course_enrollments')
            .where('course_id', id)
            .count('* as total')

        return count[0].total

    }

    static async getNewCourses() {

        const courses = await Database
            .select('courses.*', 'tutors.avator as tutor_avator', 'tutors.name as tutor_name')
            .from('courses')
            .leftJoin('tutors', 'courses.tutor_id', 'tutors.id')
            .where('courses.published', 1)
            .whereNull('courses.deleted_at')
            .whereNull('tutors.deleted_at')
            .orderBy('courses.created_at', 'desc')
            .limit(4);

        return courses;

    }

    static async getEarlyBirdCourses() {

        const courses = await Database
            .select('courses.*', 'tutors.avator as tutor_avator', 'tutors.name as tutor_name')
            .from('courses')
            .leftJoin('tutors', 'courses.tutor_id', 'tutors.id')
            .where('discount_text', '早鳥價')
            .where('courses.published', 1)
            .whereNull('courses.deleted_at')
            .whereNull('tutors.deleted_at')
            .orderBy('courses.created_at', 'desc')
            .limit(4);

        return courses;

    }
}

module.exports = Course
