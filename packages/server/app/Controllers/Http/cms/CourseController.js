'use strict'
const Helpers = use('Helpers')
const Models = use('App/Controllers/Http/ModelController')
const Env = use('Env');
const HelperFunctions = use('App/Controllers/Http/HelperFunctionController');
const moment = require('moment-timezone');
const Hashids = require('hashids/cjs')
const hashids = new Hashids('', 10)

class CourseController {

    async index({ request, view, auth, session }) {

        let page = request.input('page') || 1
        let limit = request.input('limit') || 10
        let keywords = request.input('keywords');

        // let user = await auth.getUser();
        let aid = session.get('cms_aid');
        let user = await Models.AdminUser.find(aid);
        let courseList

        if(keywords){
            courseList = await Models.Course.searchCourses(keywords, page, limit)
        }else{
            courseList = await Models.Course.cmsGetCourses(user, page, limit);
        }

        courseList.data = courseList.data.map(course => ({
            ...course,
            hash_id: hashids.encode(course.id),
        }))

        return view.render('courses', { courseList: courseList.data, lastPage: courseList.lastPage, currentPage: courseList.page, limit: limit, keywords: keywords })

    }

    async getAdd({ view, auth, session }) {

        // let user = await auth.getUser();
        let aid = session.get('cms_aid');
        let user = await Models.AdminUser.find(aid);
        let tutors;
        let categories = await Models.Category
            .query()
            .where('deleted_at', null)
            .fetch()

        tutors = await Models.Tutor.get(user, 1, 'all');

        return view.render('pages/courses/add', { tutors: tutors, categories: categories.toJSON() })
    }

    async add({ request, response, view, session }) {

        let { title, published, display_number, discount_text, category, ...rest } = request.all();

        let filePath = '/uploads/'

        const cover_img = request.file('cover_img', {
            type: ['image'],
            size: '5mb'
        });

        await cover_img.move(Helpers.publicPath('uploads'), {
            name: `${title.replace(/ /g, "_")}_cover_${new Date().getTime()}.${cover_img.subtype}`
        })

        if (!cover_img.moved()) {
            session.flash({ error: '未能成功建立新課程，請再嘗試: ' + cover_img.error().message})
            return response.redirect('/cms/courses/add')
        }

        const date = HelperFunctions.DateParser.toSQLForm(new Date());

        let data = {
            ...rest,
            title: title,
            cover_img: filePath + cover_img.fileName,
            display_number: display_number ? true : false,
            discount_text: discount_text === '-' ? null : discount_text,
            published: published ? true : false,
            created_at: date,
            updated_at: date,
        }

        try {
            let id = await Models.Course.createCourse(data);

            if (!id) {
                session.flash({ error: '未能成功建立新課程，請再嘗試' })
                return response.redirect('/cms/courses/add')
            }

            category.forEach(async category_id => {

                let newCourseCategory = new Models.CourseCategory();
                newCourseCategory.course_id = id;
                newCourseCategory.category_id = category_id;

                await newCourseCategory.save()
            })

            session.flash({ notification: '成功建立新課程' })
            return response.redirect('/cms/courses')




        } catch (error) {
            console.log(error)
            session.flash({ error: '未能成功建立新課程，請再嘗試' })
            return response.redirect('/cms/courses/add')
        }


    }

    async getEdit({ params, view, auth, session, response }) {

        // let user = await auth.getUser();
        let aid = session.get('cms_aid');
        let user = await Models.AdminUser.find(aid);
        let tutors;

        let course = await Models.Course.cmsGetCourse(params.id);

        if (user.role !== 'admin') {
            if (course[0].course_developer_id !== user.course_developer_id) {
                session.flash({ error: '你沒有權限存取此頁面' })
                return response.redirect('/cms/courses');
            }
        }

        tutors = await Models.Tutor.get(user, 1,'all');

        let categories = await Models.Category.query()
            .where('deleted_at', null)
            .fetch()

        let course_categories = await Models.CourseCategory.query()
            .where('course_id', params.id)
            .fetch()

        return view.render('pages/courses/edit', { course: course[0], tutors: tutors, categories: categories.toJSON(), course_categories: course_categories.toJSON().map(cat => cat.category_id) })

    }

    async edit({ request, response, params, view, session, auth }) {

        let { title, display_number, published, discount_text, deleted_certificate, category, ...restData } = request.all();
        let extraData = {};
        // let user = await auth.getUser();
        let aid = session.get('cms_aid');
        let user = await Models.AdminUser.find(aid);

        const date = HelperFunctions.DateParser.toSQLForm(new Date());

        let filePath = '/uploads/'

        if (request.file('cover_img')) {

            const newImage = request.file('cover_img', {
                type: ['image'],
                size: '5mb'
            });
            await newImage.move(Helpers.publicPath('uploads'), {
                name: `${title.replace(/ /g, "_")}_cover_${new Date().getTime()}.${newImage.subtype}`
            })
            if (!newImage.moved()) {
                session.flash({ error: '未能成功建立新課程，請再嘗試: ' + newImage.error().message})
                return response.redirect('/cms/courses/add')
            } else {
                extraData.cover_img = filePath + newImage.fileName;
            }

        }


        const courseData = {
            ...restData,
            ...extraData,
            title: title,
            display_number: display_number ? true : false,
            published: published ? true : false,
            discount_text: discount_text === '-' ? null : discount_text,
            updated_at: date,
        }

        try {
            let affectedRow = await Models.Course.editCourse(params.id, courseData, user);
            let courses = await Models.Course.find(params.id);
            if (affectedRow === 0 || affectedRow === 'Unauthorized') {
                session.flash({ error: '未能成功修改課程內容' })
                return response.redirect(`/cms/courses/edit/${params.id}`)
            }

            await Models.CourseCategory
                .query()
                .where('course_id', params.id)
                .delete();

            category.forEach(async category_id => {
                let newCourseCategory = new Models.CourseCategory();
                newCourseCategory.category_id = category_id;
                newCourseCategory.course_id = params.id;

                await newCourseCategory.save()
            })


            session.flash({ notification: '成功修改課程內容' })
            return response.redirect('/cms/courses')
        }
        catch (error) {
            session.flash({ error: '未能成功修改課程內容' })
            console.log(error)
            return response.redirect(`/cms/courses/edit/${params.id}`)
        }

    }

    async delete({ params, response, view, session, auth }) {

        // let user = await auth.getUser();
        let aid = session.get('cms_aid');
        let user = await Models.AdminUser.find(aid);

        try {
            let result = await Models.Course.deleteCourse(params.id, user)
            if (result === 0) {
                session.flash({ error: '未能成功刪除課程內容' })
            } else {
                if (result === 'Unauthorized') {
                    session.flash({ error: '你沒有刪除此課程的權限' })
                } else {
                    session.flash({ notification: '成功刪除課程內容' })
                }
            }
            return response.redirect('/cms/courses')
        } catch (error) {
            console.log(error)
            session.flash({ error: '未能成功刪除課程內容' })
            return response.redirect('/cms/courses')
        }

    }

    async quizIndex({ params, view }){

        let { course_id } = params;

        let questions = [];

        let questionsFetched = await Models.QuizQuestion
            .query()
            .where('course_id', course_id)
            .whereNull('deleted_at')
            .fetch();

        for(const question of questionsFetched.toJSON()){

            let options = {};

            let optionFetched = await Models.QuizOption
                .query()
                .where('question_id', question.id)
                .whereNull('deleted_at')
                .fetch();

            for (const option of optionFetched.toJSON()){
               options[option.option] = option
            }

            questions.push({
                ...question,
                options: options
            })

        }

        return view.render(`pages/courses/quiz`, { questions: questions, course_id: course_id});

    }

    async addQuizQuestion({ params, request, response}){
        
        let { course_id } = params;
        
        let { question, answer, a, b, c, d } = request.all();

        let newQuestion = new Models.QuizQuestion();

        newQuestion.question = question;
        newQuestion.answer = answer;
        newQuestion.course_id = course_id;

        await newQuestion.save();

        let optionsArr = [a,b,c,d];

        for(let i = 0; i<optionsArr.length; i++){
            let newOption = new Models.QuizOption();
            switch(i){
                case 0:
                    newOption.option = 'a';
                    break;
                case 1:
                    newOption.option = 'b';
                    break;
                case 2:
                    newOption.option = 'c';
                    break;
                case 3:
                    newOption.option = 'd';
                    break;
                default:
                    break;
            }
            newOption.question_id = newQuestion.id;
            newOption.description = optionsArr[i]
            await newOption.save();
        }

        return response.redirect(`/cms/courses/${course_id}/quiz/`);

    }

    async editQuestionIndex({params, view}){

        let { question_id, course_id } =  params;

        let question = await Models.QuizQuestion.find(question_id);
        let options = await Models.QuizOption
            .query()
            .where('question_id', question_id)
            .whereNull('deleted_at')
            .orderBy('option')
            .fetch();

        return view.render('pages/courses/edit-quiz', { question: question, options: options.toJSON(), course_id: course_id})

    }

    async editQuestion({params, request, response, session}){


        let { question_id, course_id } =  params;
        let { question, a, b, c, d, answer } = request.all();

        try{
            let questionFetched = await Models.QuizQuestion.find(question_id);
            questionFetched.question = question;
            questionFetched.answer = answer;
            await questionFetched.save();

    
            let optionsArr = ['a', 'b', 'c', 'd'];
    
            for(const option of optionsArr){
                let optionFetched = await Models.QuizOption
                    .query()
                    .where('option', option)
                    .where('question_id', question_id)
                    .whereNull('deleted_at')
                    .first();
                
                switch(option){
                    case 'a':
                        optionFetched.description = a;
                        break;
                    case 'b':
                        optionFetched.description = b;
                        break;
                    case 'c':
                        optionFetched.description = c;
                        break;
                    case 'd':
                        optionFetched.description = d;
                    default: 
                        break;
                }
    
                await optionFetched.save();
            }
            
            session.flash({notification: '已成功修改題目'})
            return response.redirect(`/cms/courses/${course_id}/quiz`);
        }catch(err){
            console.log(err);
            session.flash({error: '未能成功修改題目'+err.code})
            return response.redirect(`/cms/courses/${course_id}/quiz`)
        }
    }

    async deleteQuestion({params, response, session}){

        let { course_id, question_id } = params;

        try{
            let question = await Models.QuizQuestion.find(question_id);
            question.deleted_at = moment.tz('Asia/Hong_Kong').format('YYYY-MM-DD HH:mm:ss')
    
            await question.save();
    
            await Models.QuizOption
                .query()
                .where('question_id', question_id)
                .whereNull('deleted_at')
                .update({
                    deleted_at: moment.tz('Asia/Hong_Kong').format('YYYY-MM-DD HH:mm:ss')
                })
    
            session.flash({notification: '已成功刪除問題'})
            return response.redirect(`/cms/courses/${course_id}/quiz`)
        }catch(err){
            console.log(err);
            session.flash({error: '未能成功刪除問題'+err})
            return response.redirect(`/cms/courses/${course_id}/quiz`)
        }

        
    }
}

module.exports = CourseController
