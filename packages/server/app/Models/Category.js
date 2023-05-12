'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use('Database')

class Category extends Model {

    static async get(){

        let result = []

        let categories = await Database
            .select('*')
            .from('categories')
            .whereNull('deleted_at')

        for(const category of categories){
            let courseNumber = await Database
                .from('course_categories')
                .leftJoin('courses', 'course_categories.course_id', 'courses.id')
                .whereNull('course_categories.deleted_at')
                .whereNull('courses.deleted_at')
                .where('courses.published', 1)
                .where('course_categories.category_id', category.id)
                .count('course_categories.course_id as course_number')
            result.push({
                ...category,
                course_number: courseNumber[0].course_number
            })
        }


        return result;

    }

}

module.exports = Category
