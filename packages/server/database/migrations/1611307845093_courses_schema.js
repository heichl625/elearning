'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CoursesSchema extends Schema {
  up () {
    this.createIfNotExists('courses', (table) => {
      table.increments()
      table.string('title')
      table.integer('tutor_id')
      table.text('description')
      table.string('video_url')
      table.integer('duration')
      table.integer('price')
      table.integer('discount_price').nullable()
      table.string('discount_text').nullable()
      table.datetime('discount_start').nullable()
      table.datetime('discount_end').nullable()
      table.datetime('course_start').nullable()
      table.boolean('display_number')
      table.string('cover_img'),
      table.string('background_img')
      table.string('certificate').nullable()
      table.integer('total_sale')
      table.timestamps()
      table.datetime('deleted_at').nullable()
    })
  }

  down () {
    this.drop('courses')
  }
}

module.exports = CoursesSchema
