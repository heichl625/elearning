'use strict'
const Models = use('App/Controllers/Http/ModelController');
const fs = use('fs');
const moment = require('moment-timezone');
const Helpers = use('Helpers');
const FileType = require('file-type');
const nodemailer = require("nodemailer");
const Configs = use('App/Controllers/Http/ConfigController');


class InboxMessageController {

    async userGetMessage({ request, response, auth }) {

        let userAuth = auth.authenticator('user');
        let user = await userAuth.getUser();

        let { tutor_id } = request.all();

        try {

            let processedMsgs = [];

            let msgs = await Models.InboxMessage
                .query()
                .where('tutor_id', tutor_id)
                .where('user_id', user.id)
                .orderBy('created_at')
                .fetch()

            for (const msg of msgs.toJSON()) {

                let img_url;
                let file_url;

                if (msg.img_url) {
                    try{
                        const buffer = await fs.readFileSync(Helpers.appRoot() + msg.img_url)
                        const b64 = buffer.toString('base64')
                        let mime = await FileType.fromBuffer(buffer);
    
    
                        img_url = `data:${mime.mime};base64,${b64}`
                    }catch(err){
                        console.log(err);
                    }
                    
                }

                processedMsgs.push({ ...msg, img_url: img_url })
            }

            await Models.InboxMessage
                .query()
                .where('tutor_id', tutor_id)
                .where('user_id', user.id)
                .where('sent_by', 'tutor')
                .where('read', 0)
                .update({read: 1});

            return response.json({ msgs: processedMsgs })
        } catch (err) {
            console.log(err);
            return response.json({ error: err })
        }

    }

    async sendByUser({ request, response, auth }) {

        let userAuth = auth.authenticator('user');
        let user = await userAuth.getUser();

        let { message, tutor_id } = request.all();

        let image;
        let file;

        if (request.file('image')) {

            image = request.file('image', {
                type: ['image'],
                size: '5mb'
            });
            await image.move(Helpers.appRoot()+'/uploads/inbox/images', {
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

            await file.move(Helpers.appRoot()+'/uploads/inbox/files', {
                name: `${new Date().getDate()}${new Date().getMonth() + 1}${new Date().getFullYear()}${new Date().getTime()}_${file.clientName}`
            })
            if (!file.moved()) {
                return response.json({ error: file.error() })
            }
        }

        let newMessage = new Models.InboxMessage();

        newMessage.sent_by = 'user';
        newMessage.message = message;
        newMessage.user_id = user.id;
        newMessage.tutor_id = tutor_id;
        newMessage.file_name = file?.clientName || null;
        newMessage.file_url = file ? '/uploads/inbox/files/' + file.fileName : null;
        newMessage.img_url = image ? '/uploads/inbox/images/' + image.fileName : null;
        newMessage.read = 0;

        await newMessage.save()

        let instructor = await Models.Tutor.find(tutor_id);

        let transporter = nodemailer.createTransport(Configs.Email.mailConfig);
            const info = await transporter.sendMail({
                from: '"MeLearn.Guru noreply@enrichculture.com',
                to: process.env.NODE_ENV === 'production' ? instructor.email : 'leo.lo@innopage.com',
                subject: `[No reply]MeLearn.Guru：收到來自用戶#${user.id}的信息`,
                html: Configs.Email.template.receivedNewMessage(user.id, newMessage, instructor.name),
                // attachments: [{
                //     filename: `logo_email.png`,
                //     path: __dirname + '/../../../../public/assest/logo_email_long.png',
                //     cid: 'logo'
                // }]
            })
        

        if(newMessage.img_url){
            try{
                const buffer = await fs.readFileSync(Helpers.appRoot() + newMessage.img_url)
                const b64 = buffer.toString('base64')
                let mime = await FileType.fromBuffer(buffer);
                newMessage.img_url = `data:${mime.mime};base64,${b64}`
            }catch(err){
                console.log(err)
            }
            
        }

        return response.json({ message: newMessage });
    }

    async downloadFile({request, response}){

        let { path } = request.all();

        const buffer = await fs.readFileSync(Helpers.appRoot() + path);
        const b64 = buffer.toString('base64')
        let mime = await FileType.fromBuffer(buffer);

        let url = `data:${mime.mime};base64,${b64}`;
        
        return response.json({
            url: url
        })
        

    }

}

module.exports = InboxMessageController
