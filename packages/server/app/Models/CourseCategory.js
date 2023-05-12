'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use('Database')

class CourseCategory extends Model {

    static async getCourses(id, page, limit, keywords){

        let courses;

        if(keywords){
            courses = await Database
            .select('courses.*', 'tutors.id as tutor_id', 'tutors.name as tutor_name')
            .from('course_categories')
            .innerJoin('courses', 'courses.id', 'course_categories.course_id')
            .innerJoin('tutors', 'tutors.id', 'courses.tutor_id')
            .where(function(){
                this
                    .where('course_categories.category_id', id)
                    .whereNull('courses.deleted_at')
            })
            .where(function () {
                this
                    .where('courses.title', 'LIKE', '%'+keywords+'%')
                    .orWhere('courses.description', 'LIKE', '%'+keywords+'%')
                    .orWhere('tutors.name', 'LIKE', '%'+keywords+'%')
            })
            .paginate(page, limit)
        }else{
            courses = await Database
            .select('courses.*', 'tutors.id as tutor_id', 'tutors.name as tutor_name')
            .from('course_categories')
            .innerJoin('courses', 'courses.id', 'course_categories.course_id')
            .innerJoin('tutors', 'tutors.id', 'courses.tutor_id')
            .where('course_categories.category_id', id)
            .whereNull('courses.deleted_at')
            .paginate(page, limit)
        }

        return courses
    }

    static async getCourseCategories(course_id){

        let categories = await Database
            .select('categories.id', 'categories.name')
            .from('course_categories')
            .leftJoin('categories', 'course_categories.category_id', 'categories.id')
            .where('course_categories.course_id', course_id)
        
        
        return categories;

    }
}

module.exports = CourseCategory
