'use strict'

const Response = require('@adonisjs/framework/src/Response')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Models = use('App/Controllers/Http/ModelController')

class AdminAccess {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ view, response, auth, session }, next) {
    // call next to advance the request
    let aid = session.get('cms_aid');
    let user = await Models.AdminUser.find(aid);

    if(user.role !== 'tutor'){
      return response.redirect('/cms')
    }else{
        view.share({
            user: user
        })
    }

    await next()
  }
}

module.exports = AdminAccess
