"use strict"
const Task = use('Task')
const Models = use('App/Controllers/Http/ModelController');
const nodemailer = require("nodemailer");
const Configs = use('App/Controllers/Http/ConfigController');

class InboxReminderEmail extends Task {

    static get schedule() {
        return "59 23 * * *";
    }

    async handle(){
        try{
            let instructors = await Models.InboxMessage.getUnreadMessages();

            for(const instructor of instructors){
                let transporter = nodemailer.createTransport(Configs.Email.mailConfig);
                await transporter.sendMail({
                    from: '"MeLearn.Guru noreply@enrichculture.com',
                    to: instructor.email,
                    subject: `[MeLearn.Guru] 你有未讀的信息`,
                    html: Configs.Email.template.unreadMsgReminder(instructor.name, instructor.unread_msg),
                    // attachments: [{
                    //     filename: `logo_email.png`,
                    //     path: __dirname + '/../../public/assest/logo_email_long.png',
                    //     cid: 'logo'
                    // }]
                }, (err, info) => {
                    console.log('========================= SENDING INBOX REMINDER EMAIL TO INSTRUCTOR ========================')
                    console.log('target: ' + instructor.email)
                    if(err){
                        console.log('status: failed')
                        console.log(err)
                    }else{
                        console.log('status: success')
                        console.log(info)
                    }
                })
            }
        }catch(err){
            console.log(err);
        }
        
    }

}

module.exports = InboxReminderEmail