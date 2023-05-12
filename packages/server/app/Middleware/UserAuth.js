'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Models = use('App/Controllers/Http/ModelController');

class UserAuth {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response, auth }, next) {
    // call next to advance the request

    try{
      let userAuth = auth.authenticator('user')
      await userAuth.check()

      let user = await userAuth.getUser();

      let token = request.header('Authorization');

      if(token !== user.login_token){
        return response.json({
          token: token,
          error: '已有另一個裝置登入你的帳戶',
          user: user
      })
      }

    }catch(err){
      console.log(err)
    }

    await next()
  }
}

module.exports = UserAuth
