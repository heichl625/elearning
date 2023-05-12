'use strict'
const Models = use('App/Controllers/Http/ModelController')
const Hashids = require('hashids/cjs')
const hashids = new Hashids('', 10)


class LessonController {

    async index({ request, view, auth, session }) {

        let page = request.input('page') || 1;
        let limit = request.input('limit') || 10;
        let keywords = request.input('keywords');

        // let user = await auth.getUser();
        let aid = await session.get('cms_aid');
        let user = await Models.AdminUser.find(aid);
        
        let courseList;
        
        if(keywords){
            courseList = await Models.Course.searchCourses(keywords, page, limit)
        }else{
            courseList = await Models.Course.cmsGetCourses(user, page, limit);
        }
        
        return view.render('lessons', { courseList: courseList.data, lastPage: courseList.lastPage, currentPage: courseList.page, limit: limit, keywords: keywords });

    }

    async indexByCourse({ view, params, auth, session,response, request }) {

        let page = request.input('page') || 1;
        let limit = request.input('limit') || 10;
        let keywords = request.input('keywords');

        // const user = await auth.getUser();
        let aid = await session.get('cms_aid');
        let user = await Models.AdminUser.find(aid);

        let result;

        if(keywords){
            result = await Models.Lesson.searchLessonsByCourse(params.id, user, keywords, page, limit);
        }else{
            result = await Models.Lesson.getLessonsByCourse(params.id, user, page, limit);
        }

        result.lessonList.data = result.lessonList.data.map(lesson => ({
            ...lesson,
            hash_id: hashids.encode(lesson.id),
            hash_course_id: hashids.encode(lesson.course_id)
        }))

        if(result === 'Unauthorized'){
            session.flash({'error': '你沒有權限查看此頁'})
            return response.redirect('/cms/lessons')
        }

        return view.render('pages/lessons/bycourse', { lessonList: result.lessonList.data, courseTitle: result.courseTitle,  lastPage: result.lessonList.lastPage, currentPage: result.lessonList.page, limit: limit, keywords: keywords, id: params.id});
    }

    async addView({ view, auth, session }) {

        // let user = await auth.getUser()
        let aid = await session.get('cms_aid');
        let user = await Models.AdminUser.find(aid);

        const courseList = await Models.Course.cmsGetCourses(user);

        return view.render('pages/lessons/add', { courseList: courseList })

    }

    async add({ request, response, session }) {

        const { materials, title, course_id, description, video_url, order, trial } = request.all();

        console.log(materials)

        const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const lessonData = {
            title,
            course_id,
            description,
            video_url,
            order,
            trial: trial ? true : false,
            created_at: date,
            updated_at: date
        }

        try {
            let id = await Models.Lesson.createLesson(lessonData);
            if (!id) {
                session.flash({ error: '未能成功建立課堂' })
                return response.redirect('/cms/lessons/add');
            }
            await Models.Material.createMaterial(materials, course_id, id, date);
            session.flash({notification: '成功建立課堂'})
            return response.redirect(`/cms/courses/${course_id}/lessons`)
        } catch (error) {
            session.flash({ error: '未能成功建立課堂' })
            return response.redirect('/cms/lessons/add');
        }

    }

    async getEdit({ view, params, auth, response, session }) {

        // const user = await auth.getUser();
        let aid = await session.get('cms_aid');
        let user = await Models.AdminUser.find(aid);

        const lesson = await Models.Lesson.getLesson(params.id, user);

        if(lesson === 'Unauthorized'){
            session.flash({'error': '你沒有權限到訪此頁'})
            return response.redirect('/cms/lessons')
        }

        const courses = await Models.Course.cmsGetCourses(user);
        const materials = await Models.Material.getMaterialsByLesson(params.id, lesson[0].course_id)

        return view.render(`pages/lessons/edit`, { lesson: lesson[0], courses: courses, materials: materials })

    }

    async edit({ request, response, auth, params, session }) {

        const { materials, title, course_id, description, video_url, order, trial } = request.all();

        const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

        console.log(materials)

        // const user = await auth.getUser()
        let aid = await session.get('cms_aid');
        let user = await Models.AdminUser.find(aid);

        const lessonData = {
            title,
            course_id,
            description,
            video_url,
            order,
            trial: trial ? true : false,
            updated_at: date
        }

        try {
            let affectedRows = await Models.Lesson.editLesson(lessonData, params.id, user);
            if (affectedRows === 0) {
                session.flash({ error: '未能成功修改課堂' })
                return response.redirect(`/cms/lessons/edit/${params.id}`)
            }else if(affectedRows === 'Unauthorized'){
                session.flash({ error: '你沒有權限修改此課堂' })
                return response.redirect(`/cms/lessons`)
            }
            await Models.Material.createMaterial(materials, course_id, params.id, date);
            session.flash({ notification: '成功修改課堂' })
            return response.redirect(`/cms/courses/${course_id}/lessons`)
        } catch (error) {
            session.flash({ error: '未能成功修改課堂: ' + error.toString() })
            return response.redirect(`/cms/lessons/edit/${params.id}`)
        }


    }

    async delete({ response, params, auth, session }) {

        // let user = await auth.getUser();
        let aid = await session.get('cms_aid');
        let user = await Models.AdminUser.find(aid);

        try{
            let affectedRows = await Models.Lesson.deleteLesson(params.lesson_id, params.course_id, user);
            if (affectedRows !== 1) {
                session.flash({ error: '未能成功刪除課堂' })
            } else if(affectedRows === 'Unauthorized'){
                session.flash({'error': '你沒有權限刪除此課堂'})
            }else {
                session.flash({ notification: '成功刪除課堂' })
            }
            return response.redirect(`/cms/courses/${params.course_id}/lessons`);
        }catch(error){
            console.log(error)
            session.flash({ error: '未能成功刪除課堂' })
            return response.redirect(`/cms/courses/${params.course_id}/lessons`);
        }

    }

}

module.exports = LessonController
