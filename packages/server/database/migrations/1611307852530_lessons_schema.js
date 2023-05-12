'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LessonsSchema extends Schema {
  up () {
    this.createIfNotExists('lessons', (table) => {
      table.increments()
      table.integer('course_id').unsigned().references('id').inTable('courses').onDelete('cascade')
      table.string('title')
      table.text('description')
      table.string('video_url')
      table.integer('order')
      table.boolean('trial')
      table.timestamps()
      table.datetime('deleted_at').nullable()
    })
  }

  down () {
    this.drop('lessons')
  }
}

module.exports = LessonsSchema
