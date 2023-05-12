'use strict'

const { resolve } = require('path')

const Env = use('Env')


module.exports = {

  assetDirectory: resolve(process.cwd(), Env.getOrFail('CLIENT_ASSET_DIRECTORY')),
  // moduleDirectory: resolve(process.cwd(), Env.getOrFail('MODULE_DIRECTORY'))

}
