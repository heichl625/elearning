'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use('Database')

class FavouriteCourse extends Model {

    static async getFavourite(user_id) {

        const favouriteCourses = await Database
            .select('course_id')
            .from('favourite_courses')
            .where('user_id', user_id)
            .whereNull('deleted_at')

        return favouriteCourses;

    }

}

module.exports = FavouriteCourse
