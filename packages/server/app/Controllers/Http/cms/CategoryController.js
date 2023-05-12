'use strict'
const Models = use('App/Controllers/Http/ModelController');
const HelperFunction = use('App/Controllers/Http/HelperFunctionController');
const moment = require("moment-timezone");

class CategoryController {

    async index({view, request}){

        let page = request.input('page') || 1;
        let limit = request.input('limit') || 10;
        let keywords = request.input('keywords');

        let categoriesFetched;

        if(keywords){
            categoriesFetched = await Models.Category
            .query()
            .where('deleted_at', null)
            .where('name', 'LIKE', '%'+keywords+'%')
            .paginate(page, limit)
        }else{
            categoriesFetched = await Models.Category
            .query()
            .where('deleted_at', null)
            .paginate(page, limit)
        }
        

        let categories = categoriesFetched.toJSON();

        return view.render('category', { categories: categories.data, currentPage: categories.page, lastPage: categories.lastPage, limit: limit, keywords: keywords});
    }

    async getCourses({request, params, view, session}){

        let page = request.input('page') || 1
        let limit = request.input('limit') || 10
        let keywords = request.input('keywords')

        try{

            const courses = await Models.CourseCategory.getCourses(params.id, page, limit, keywords);
            console.log(courses);

            courses.data = courses.data.map(course => ({
                ...course,
                updated_at: moment(courses.updated_at).format("YYYY-MM-DD HH:mm:ss")
            }))
            const category = await Models.Category.find(params.id);

            return view.render('pages/category/courses', {courses: courses.data, id: params.id, categoryTitle: category.name, currentPage: courses.page, lastPage: courses.lastPage, limit: limit})
        }catch(err){
            console.log(err)
            session.flash({error: '未能取得此類別的課程'});
            return view.render('pages/category/courses')
        }

    }

    async add({request, response, session}){
        
        let { name } = request.all()

        try{
            const category = new Models.Category();
            category.name = name;
            category.save()
            session.flash({notification: '己新增課程類別： '+name})
    
        }catch(err){
            session.flash({error: '未能成功新增課程類別'})
        }
        return response.redirect('/cms/category')
    }

    async getEdit({ params, view }){

        let category = await Models.Category.find(params.id)

        return view.render('pages/category/edit', {category: category})

    }

    async edit({request, response, params, session}){


        let {name} = request.all();

        try{
            let category = await Models.Category.find(params.id)
            category.name = name
            category.save()

            session.flash({notification: '已成功修改課程類別'})
        }catch(err){
            session.flash({error: '已成功修改課程類別'})
        }

        return response.redirect('/cms/category')
        

    }

    async delete({params, response, session}){

        try{
            let category = await Models.Category.find(params.id)
            let now = HelperFunction.DateParser.toSQLForm(new Date());
            category.deleted_at = now
            category.save()

            session.flash({notification: '已成功刪除課程類別'})
        }catch(err){
            console.log(err);
            session.flash({error: '未能成功刪除課程類別'})
        }

        return response.redirect('/cms/category')

    }

}

module.exports = CategoryController
