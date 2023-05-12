'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Models = use('App/Controllers/Http/ModelController')


class CourseDeveloperAccess {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ response, auth, session }, next) {
    // call next to advance the request

    // let user = await auth.getUser()
    let aid = session.get('cms_aid');
    let user = await Models.AdminUser.find(aid);

    if(user.role === 'tutor'){
      return response.redirect('/')
    }

    await next()
  }
}

module.exports = CourseDeveloperAccess
