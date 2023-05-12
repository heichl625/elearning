'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use('Database');

class FinishedLesson extends Model {

    static async getFinishedLessonList(course_id, user_id){

        const finishedLessonList = await Database
            .select('finished_lessons.*')
            .from('finished_lessons')
            .leftJoin('lessons', 'lessons.id', 'finished_lessons.lesson_id')
            .where('lessons.course_id', course_id)
            .where('finished_lessons.user_id', user_id)
            .whereNull('finished_lessons.deleted_at')

        return finishedLessonList;

    }

}

module.exports = FinishedLesson
