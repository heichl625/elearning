'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use('Database')

class Lesson extends Model {

  static boot() {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
  }

  static async getLesson(id, user) {
    let lesson = await Database
      .select('lessons.*', 'courses.title as course_title', 'courses.tutor_id as tutor_id')
      .from('lessons')
      .leftJoin('courses', 'lessons.course_id', 'courses.id')
      .where('lessons.id', id)
      .whereNull('lessons.deleted_at');

    let tutor_id = lesson[0].tutor_id;
    let tutor;
    if(user.role !== 'admin'){
      tutor = await Database
      .select('*')
      .from('tutors')
      .where('id', tutor_id)
      .where('course_developer_id', user.course_developer_id)
      .whereNull('deleted_at')
    }else{
      tutor = await Database
      .select('*')
      .from('tutors')
      .where('id', tutor_id)
      .whereNull('deleted_at')
    }


    if(tutor.length === 0){
      return 'Unauthorized'
    }

    return lesson
  }


  static async searchLessonsByCourse(id, user, keywords, page, limit) {

    let course = await Database
      .select('tutors.course_developer_id')
      .from('courses')
      .leftJoin('tutors', 'courses.tutor_id', 'tutors.id')
      .where('courses.id', id)
      .whereNull('courses.deleted_at')

    if(course[0].course_developer_id !== user.course_developer_id && user.role !== 'admin'){
      return 'Unauthorized'
    }

    let result = await Database
      .select('lessons.*')
      .from('lessons')
      .leftJoin('courses', 'lessons.course_id', 'courses.id')
      .where(function () {
        this
          .where('courses.id', id)
          .whereNull('lessons.deleted_at')
      })
      .where(function (){
        this
          .where('lessons.title', 'LIKE', '%'+keywords+'%')
          .orWhere('lessons.description', 'LIKE', '%'+keywords+'%')
      })
      .orderBy('lessons.order')
      .paginate(page, limit)


    let courseTitle = await Database
      .select('title')
      .from('courses')
      .where('id', id)
      .whereNull('deleted_at')



    return {
      lessonList: result,
      courseTitle: courseTitle[0].title
    }
  }

  static async getLessonsByCourse(id, user, page, limit) {

    let course = await Database
      .select('tutors.course_developer_id')
      .from('courses')
      .leftJoin('tutors', 'courses.tutor_id', 'tutors.id')
      .where('courses.id', id)
      .whereNull('courses.deleted_at')

    if(course[0].course_developer_id !== user.course_developer_id && user.role !== 'admin'){
      return 'Unauthorized'
    }

    let result = await Database
      .select('lessons.*')
      .from('lessons')
      .leftJoin('courses', 'lessons.course_id', 'courses.id')
      .where('courses.id', id)
      .whereNull('lessons.deleted_at')
      .orderBy('lessons.order')
      .paginate(page, limit)


    let courseTitle = await Database
      .select('title')
      .from('courses')
      .where('id', id)
      .whereNull('deleted_at')



    return {
      lessonList: result,
      courseTitle: courseTitle[0].title
    }
  }

  static async createLesson(lessonData) {
    let result = await Database.insert(lessonData).into('lessons');
    return result;
  }

  static async getLatestID() {
    let id = await Database.from('lessons').getMax('id');
    return id;
  }

  static async editLesson(lessonData, id, user) {

    const tutor = await Database
      .select('tutors.course_developer_id')
      .from('lessons')
      .leftJoin('courses', 'lessons.course_id', 'courses.id')
      .leftJoin('tutors', 'courses.tutor_id', 'tutors.id')
      .where('lessons.id', id)
      .whereNull('lessons.deleted_at')

    if(tutor[0].course_developer_id !== user.course_developer_id && user.role !== 'admin'){
      return 'Unauthorized'
    }

    const affectedRows = await Database
      .table('lessons')
      .where('id', id)
      .update(lessonData)

    return affectedRows;

  }

  static async deleteLesson(lesson_id, course_id, user) {

    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const tutor = await Database
      .select('tutors.course_developer_id')
      .from('courses')
      .leftJoin('tutors', 'courses.tutor_id', 'tutors.id')
      .where('courses.id', course_id)
      .whereNull('courses.deleted_at')

    if(tutor[0].course_developer_id !== user.course_developer_id && user.role !== 'admin'){
      return 'Unauthorized'
    }

    const affectedRows = await Database
      .table('lessons')
      .where('id', lesson_id)
      .update('deleted_at', date)

    return affectedRows;
  }



}

module.exports = Lesson
