'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Models = use('App/Controllers/Http/ModelController')

class AuthRedirect{

    async handle({ response, view, session }, next) {
        // call next to advance the request
        try {
          let aid = session.get('cms_aid');
          let email = session.get('cms_email');

          if(!aid || !email){
            return response.redirect('/cms/login');
          }

          const adminUser = await Models.AdminUser.find(aid);
          const user = await Models.User.findBy('email', adminUser.email);

          view.share({
            user: adminUser,
            login_token: user ? user.login_token : null
          })
        } catch (error) {
          // custom error response
          console.log(error)
          return response.redirect('/cms/login')
        }
        await next()
    }
}

module.exports = AuthRedirect