'use strict'

const Models = use('App/Controllers/Http/ModelController'); 


class CategoryController {

    async get({response}){

        let categories = await Models.Category.get()

        let totalCourseNumber = await Models.Course
            .query()
            .where('published', 1)
            .whereNull('deleted_at')
            .getCount();

        return response.json({categories: categories, totalCourseNumber: totalCourseNumber})

    }

}

module.exports = CategoryController
