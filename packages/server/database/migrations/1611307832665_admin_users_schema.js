'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AdminUsersSchema extends Schema {
  up () {
    this.createIfNotExists('admin_users', (table) => {
      table.increments()
      table.string('email').unique()
      table.string('password')
      table.timestamps()
      table.datetime('deleted_at').nullable()
    })
  }

  down () {
    this.drop('admin_users')
  }
}

module.exports = AdminUsersSchema
