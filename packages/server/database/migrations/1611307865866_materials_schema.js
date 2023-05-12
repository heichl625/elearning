'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MaterialsSchema extends Schema {
  up () {
    this.createIfNotExists('materials', (table) => {
      table.increments()
      table.integer('course_id').unsigned().references('id').inTable('courses').onDelete('cascade')
      table.integer('lesson_id').unsigned().references('id').inTable('lessons').onDelete('cascade')
      table.string('file_name', 50)
      table.string('url')
      table.timestamps()
      table.datetime('deleted_at').nullable()
    })
  }

  down () {
    this.drop('materials')
  }
}

module.exports = MaterialsSchema
