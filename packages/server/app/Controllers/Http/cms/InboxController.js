'use strict'

const Models = use('App/Controllers/Http/ModelController')
const fs = use('fs');
const Helpers = use('Helpers');
const FileType = require('file-type');

class InboxController {

    async index({ request, view, auth, session }) {

        // let user = await auth.getUser();
        let aid = session.get('cms_aid');
        let user = await Models.AdminUser.find(aid);
        let user_id = request.input('user_id') || '';

        let tutor = await Models.Tutor.findBy('email', user.email);
        let messages = [];

        let studentsFetched = await Models.InboxMessage.tutorGetStudents(tutor.id);
        let students = [];

        for (const item of studentsFetched) {
            let lastMsgTime = await Models.InboxMessage.getLastMessageTime(tutor.id, item.user_id);
            let unreadMsg = await Models.InboxMessage
                .query()
                .where('user_id', item.user_id)
                .where('tutor_id', tutor.id)
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
                .where('tutor_id', tutor.id)
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
                    
                    message.dateStr = new Date(message.created_at).toLocaleDateString();
                    message.date = new Date(message.created_at).getDate();
                    message.month = new Date(message.created_at).getMonth() + 1;
                    message.year = new Date(message.created_at).getFullYear();
                    message.hours = `${new Date(message.created_at).getHours() < 10 ? '0' : ''}${new Date(message.created_at).getHours()}`;
                    message.minutes = `${new Date(message.created_at).getMinutes() < 10 ? '0' : ''}${new Date(message.created_at).getMinutes()}`;
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

            await Models.InboxMessage
                .query()
                .where('user_id', user_id)
                .where('tutor_id', tutor.id)
                .where('sent_by', 'user')
                .where('read', 0)
                .update({ read: 1 })

        }


        return view.render('inbox', { students: students, user_id: user_id, messages: messages })

    }

    async downloadFile({ request, response }) {

        let body = request.raw();

        let { path } = JSON.parse(body)

        const buffer = await fs.readFileSync(Helpers.appRoot() + path);
        const b64 = buffer.toString('base64')
        let mime = await FileType.fromBuffer(buffer);

        let url = `data:${mime.mime};base64,${b64}`;

        return response.json({
            url: url
        })

    }

    async tutorSendMessage({ request, response, auth, session }) {

        // let adminUser = await auth.getUser();
        let aid = session.get('cms_aid');
        let adminUser = await Models.AdminUser.find(aid);

        let tutor = await Models.Tutor.findBy('email', adminUser.email);

        let { user_id, message } = request.all();

        let image;
        let file;

        if (request.file('image')) {

            image = request.file('image', {
                type: ['image'],
                size: '5mb'
            });
            await image.move(Helpers.appRoot() + '/uploads/inbox/images', {
                name: `${new Date().getDate()}${new Date().getMonth() + 1}${new Date().getFullYear()}${new Date().getTime()}_${image.clientName}`
            })
            if (!image.moved()) {
                return response.json({ error: image.error() })
            }
        }

        if (request.file('file')) {
            file = request.file('file', {
                file: '5mb'
            })

            await file.move(Helpers.appRoot() + '/uploads/inbox/files', {
                name: `${new Date().getDate()}${new Date().getMonth() + 1}${new Date().getFullYear()}${new Date().getTime()}_${file.clientName}`
            })
            if (!file.moved()) {
                return response.json({ error: file.error() })
            }
        }

        let newMessage = new Models.InboxMessage();

        newMessage.sent_by = 'tutor';
        newMessage.message = message;
        newMessage.user_id = user_id;
        newMessage.tutor_id = tutor.id;
        newMessage.file_name = file?.clientName || null;
        newMessage.file_url = file ? '/uploads/inbox/files/' + file.fileName : null;
        newMessage.img_url = image ? '/uploads/inbox/images/' + image.fileName : null;
        newMessage.read = 0;

        await newMessage.save()

        return response.redirect('/cms/inbox?user_id=' + user_id);
    }

}

module.exports = InboxController
