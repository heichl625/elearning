'use strict'
const Models = use('App/Controllers/Http/ModelController')
const HelperFunctions = use('App/Controllers/Http/HelperFunctionController')
const moment = require("moment-timezone");

class CourseDeveloperController {

    async index({request, view}){

        let page = request.input('page') || 1;
        let limit = request.input('limit') || 10;
        let keywords = request.input('keywords')
        
        let course_developers = await Models.CourseDeveloper.get(page, limit, keywords);

        course_developers.data = course_developers.data.map(developer => ({
            ...developer,
            created_at: moment(developer.created_at).format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment(developer.updated_at).format('YYYY-MM-DD HH:mm:ss')
        }))

        return view.render('coursedevelopers', {course_developers: course_developers.data, currentPage: course_developers.page, lastPage: course_developers.lastPage, limit: limit, keywords: keywords})

    }

    async add({request, response, session}){

        let now = HelperFunctions.DateParser.toSQLForm(new Date())

        try{
            await Models.CourseDeveloper.add({
                ...request.all(),
                created_at: now,
                updated_at: now
            })
            
            session.flash({notification: '成功加入新的課程管理員'})
            return response.redirect('/cms/course_developers');
            
        }catch(err){
            console.log(err);
            session.flash({error: err})
            return response.redirect('/cms/course_developers/add')
        }

    }

    async getEdit({params, view, session}){

        let { id } = params;

        try{
            let course_developer = await Models.CourseDeveloper.find(id);

            return view.render('pages/coursedevelopers/edit', {course_developer: course_developer.toJSON()})
        }catch(err){
            console.log(err);
        }

    }

    async edit({params, request, response, session}){
        let { id } = params;

        let { display_name, email } = request.all();

        try{
            let course_developer = await Models.CourseDeveloper.find(id);

            course_developer.email = email;
            course_developer.display_name = display_name;

            await course_developer.save();

            session.flash({notification: '成功修改課程管理員'});
            return response.redirect('/cms/course_developers')
        }catch(err){
            console.log(err);
            session.flash({ error: '未能成功修改課程管理員' + err})
            return response.redirect('/cms/course_developers')
        }
    }

    async delete({params, response, session}){

        let { id } = params;

        let now = HelperFunctions.DateParser.toSQLForm(new Date())

        try{
            let course_developer = await Models.CourseDeveloper.find(id);

            course_developer.deleted_at = now;

            await course_developer.save();
            session.flash({notification: '成功刪除課程管理員'})
            return response.redirect('/cms/course_developers')
        }catch(err){
            console.log(err);
            session.flash({error: '韓能成功刪除課程管理員: ' + err})
            return response.redirect('/cms/course_developers')
        }

    }

}

module.exports = CourseDeveloperController
