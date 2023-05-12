'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use('Database')

class CourseDeveloper extends Model {

    static async get(page, limit, keywords){
        let CourseDevelopers = await Database
        .select('*')
        .from('course_developers')
        .whereNull('deleted_at')
        .where(function(){
            if(keywords){
                this
                    .where('display_name', 'LIKE', '%'+keywords+'%')
                    .orWhere('email', 'LIKE', '%'+keywords+'%')
            }
        })
        .paginate(page, limit)

        return CourseDevelopers
    }

    static async add(data){
        let id = await Database
        .insert(data)
        .into('course_developers')

        return id;
    }

    static async getCourseDeveloperByEmail(email){
        let courseDeveloper = await Database
        .select('*')
        .from('course_developers')
        .where('email', email)
        .whereNull('deleted_at')

        return courseDeveloper[0];
    }

}

module.exports = CourseDeveloper
