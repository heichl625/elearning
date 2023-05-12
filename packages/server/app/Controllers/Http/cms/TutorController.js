'use strict'

const Models = use('App/Controllers/Http/ModelController')
const Helpers = use('Helpers')
const HelperFunction = use('App/Controllers/Http/HelperFunctionController')
const fs = use('fs');
const FileType = require('file-type');


class TutorController {

    async index({view, auth, request, session}){

        let page = request.input('page') || 1;
        let limit = request.input('limit') || 10;
        let keywords = request.input('keywords');

        // let user = await auth.getUser()
        let aid = await session.get('cms_aid');
        let user = await Models.AdminUser.find(aid);

        let tutors = await Models.Tutor.get(user, page, limit, keywords);

        return view.render('/tutors', {tutors: tutors.data, currentPage: tutors.page, lastPage: tutors.lastPage, limit: limit, keywords: keywords});

    }

    async getAdd({view}){

        let course_developers = await Models.CourseDeveloper.get();

        return view.render('pages/tutors/add', {course_developers: course_developers.data});
    }

    async add({request, response, session}){

        let { name } = request.all();

        const avator = request.file('avator', {
            type: ['image'],
            size: '5mb'
        });

        await avator.move(Helpers.publicPath('uploads/avators'), {
            name: `${name.replace(/ /g,"_")}_avator_${new Date().getTime()}.${avator.subtype}`    
        })

        if(!avator.moved()){
            session.flash({error: '未能成功上傳導師頭像: ' + avator.error().message})
            return response.redirect('/cms/tutors/add')
        }

        const now = HelperFunction.DateParser.toSQLForm(new Date());

        try{
            const id = await Models.Tutor.add({
                ...request.all(),
                avator: '/uploads/avators/' + avator.fileName,
                created_at: now,
                updated_at: now
            })
    
            if(!id){
                session.flash({error: '未能成功加入新導師'})
                return response.redirect('/cms/tutors/add')
            }
            session.flash({notification: '成功加入新導師'})
            return response.redirect('/cms/tutors')
        }catch(err){
            session.flash({error: '未能成功加入新導師'})
            return response.redirect('/cms/tutors/add')
        }

        

    }

    async getEdit({view, params}){

        let tutor = await Models.Tutor.getTutorById(params.id)
        let course_developers = await Models.CourseDeveloper.get()

        if(!tutor || !course_developers){
            return response.json({error: 'Failed to obtain tutor data'})
        }

        return view.render(`pages/tutors/edit`, {tutor: tutor, course_developers: course_developers.data})

    }

    async edit({request, response, params, session}){

        let { name } = request.all();

        let extraData = {};

        const avator = request.file('avator', {
            type: ['image'],
            size: '5mb'
        });

        if(avator){

            await avator.move(Helpers.publicPath('uploads/avators'), {
                name: `${name.replace(/ /g,"_")}_avator_${new Date().getTime()}.${avator.subtype}`    
            })
    
            if(!avator.moved()){
                session.flash({error: '未能成功上傳導師頭像' + avator.error().message})
                return response.redirect('/cms/tutors/add')
            }

            extraData.avator = '/uploads/avators/'+avator.fileName

        }
        
        const now = HelperFunction.DateParser.toSQLForm(new Date());


        try{
            const affectedRow = await Models.Tutor.edit(params.id, {
                ...request.all(),
                ...extraData,
                updated_at: now
            })
    
            if(affectedRow !== 1){
                session.flash({error: '未能成功修改導師資料'})
                return response.redirect('/cms/tutors/edit')
            }
    
            session.flash({notification: '成功修改導師資料'})
            return response.redirect('/cms/tutors')
        }catch(error){
            session.flash({error: '未能成功修改導師資料'})
            return response.redirect('/cms/tutors/edit')
        }
        

    }

    async delete({response, params, session}){

        const now = HelperFunction.DateParser.toSQLForm(new Date())

        try{
            const affectedRow = await Models.Tutor.delete(params.id, now)

            if(affectedRow !== 1){
                session.flash({error: '未能成功刪除導師資料'})
            }
            else{
                session.flash({notification: '成功刪除導師資料'})
            }
            
            return response.redirect('/cms/tutors')
        }catch(error){
            session.flash({error: '未能成功刪除導師資料'})
            return response.redirect('/cms/tutors')
        }
        
    }

    async tutorInbox({request, params, view}){
        let { id } = params;
        let user_id = request.input('user_id') || '';
        let messages = [];
        let studentsFetched = await Models.InboxMessage.tutorGetStudents(id);
        let students = [];

        for (const item of studentsFetched) {
            let lastMsgTime = await Models.InboxMessage.getLastMessageTime(id, item.user_id);
            let unreadMsg = await Models.InboxMessage
                .query()
                .where('user_id', item.user_id)
                .where('tutor_id', id)
                .where('sent_by', 'user')
                .where('read', 0)
                .getCount();

            students.push({
                user_id: item.user_id,
                lastMsgTime: lastMsgTime,
                unreadMsg: unreadMsg
            })
        }

        students.sort((a, b) => a.lastMsgTime > b.lastMsgTime);

        if (user_id) {
            let messagesFetched = await Models.InboxMessage
                .query()
                .where('user_id', user_id)
                .where('tutor_id', id)
                .whereNull('deleted_at')
                .orderBy('created_at')
                .fetch()

            for (const message of messagesFetched.toJSON()) {
                if (message.img_url) {
                    try{
                        const buffer = await fs.readFileSync(Helpers.appRoot() + message.img_url)
                        const b64 = buffer.toString('base64')
                        let mime = await FileType.fromBuffer(buffer);
                        message.img_url = `data:${mime.mime};base64,${b64}`
                    }catch(err){
                        console.log(err);
                    }
                    
                    // message.dateStr = message.created_at.toLocaleDateString();
                    // message.date = message.created_at.getDate();
                    // message.month = message.created_at.getMonth() + 1;
                    // message.year = message.created_at.getFullYear();
                    // message.hours = `${message.created_at.getHours() < 10 ? '0' : ''}${message.created_at.getHours()}`;
                    // message.minutes = `${message.created_at.getMinutes() < 10 ? '0' : ''}${message.created_at.getMinutes()}`;
                }


                messages.push({
                    ...message,
                    dateStr: new Date(message.created_at).toLocaleDateString(),
                    date: new Date(message.created_at).getDate(),
                    months: new Date(message.created_at).getMonth() + 1,
                    year: new Date(message.created_at).getFullYear(),
                    hours: `${new Date(message.created_at).getHours() < 10 ? '0' : ''}${new Date(message.created_at).getHours()}`,
                    minutes: `${new Date(message.created_at).getMinutes() < 10 ? '0' : ''}${new Date(message.created_at).getMinutes()}`
                });
            }
        }

        return view.render('inbox', { students: students, user_id: user_id, messages: messages })


    }

}

module.exports = TutorController
