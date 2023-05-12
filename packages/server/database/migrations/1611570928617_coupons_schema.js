'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CouponsSchema extends Schema {
  up () {
    this.createIfNotExists('coupons', (table) => {
      table.increments()
      table.string('title')
      table.string('description')
      table.datetime('start_on')
      table.datetime('expiry_on')
      table.string('code').unique()
      table.integer('discount')
      table.timestamps()
    })
  }

  down () {
    this.drop('coupons')
  }
}

module.exports = CouponsSchema
