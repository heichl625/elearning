"use strict"
const Task = use('Task')
const Models = use('App/Controllers/Http/ModelController');
const nodemailer = require("nodemailer");
const Configs = use('App/Controllers/Http/ConfigController');
const HelperFunction = use('App/Controllers/Http/HelperFunctionController')


class CartReminderEmail extends Task {

    static get schedule() {
        return "59 23 * * 7";
    }

    async handle() {
        try {
            let userList = await Models.Cart
                .query()
                .distinct('user_id')
                .whereNull('deleted_at')
                .fetch();

            

            for (const userItem of userList.toJSON()) {

                let user = await Models.User.find(userItem.user_id);

                let cartItems = await Models.Cart
                    .query()
                    .leftJoin('courses', 'carts.course_id', 'courses.id')
                    .where('carts.user_id', user.id)
                    .whereNull('carts.deleted_at')
                    .whereNull('courses.deleted_at')
                    .fetch();
                
                
                
                let transporter = nodemailer.createTransport(Configs.Email.mailConfig);
                await transporter.sendMail({
                    from: '"MeLearn.Guru noreply@enrichculture.com',
                    to: user.email,
                    subject: `還欠一click，就可開啟MeLearn.guru課程！`,
                    html: Configs.Email.template.cartReminder(user.username, cartItems.toJSON()),
                    attachments: [...cartItems.toJSON().map(item => {
                        return {
                            filename: `${item.course_id}.png`,
                            path: __dirname + '/../../public' +item.cover_img,
                            cid: `${item.course_id}`
                        }
                    })]
                }, (err, info) => {
                    console.log('=================== SENDING CART REMINDER EMAIL ===========================');
                    console.log('target: ' + user.email)
                    console.log('time: ' + HelperFunction.DateParser.toSQLForm(new Date()))
                    if(err){
                        console.log('status: failed')
                        console.log('error: ' + err.toString())
                    }else{
                        console.log(info)
                        
                    }
                })

                

            }


        } catch (e) {
            console.log(e)
        }
    }

}

module.exports = CartReminderEmail