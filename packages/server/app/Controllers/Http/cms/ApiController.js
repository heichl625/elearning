'use strict'

const Models = use('App/Controllers/Http/ModelController')

class ApiController {

    async getCourses({response}){

        let courses = await Models.Course
            .query()
            .where('deleted_at', null)
            .fetch()
        
        return response.json({
            courses: courses.toJSON()
        })

    }

}

module.exports = ApiController
