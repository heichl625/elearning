'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use('Database')

class CourseEnrollment extends Model {

    static async get(user_id) {

        const enrolledCourses = await Database
            .select('courses.*')
            .from('courses')
            .leftJoin('course_enrollments', 'course_enrollments.course_id', 'courses.id')
            .where('course_enrollments.user_id', user_id)
            .whereNull('course_enrollments.deleted_at')

        return enrolledCourses;

    }

    static async getEnrolledCourseDetail(user_id) {

        let courses = [];

        let enrolledCourses = await Database
            .select('course_enrollments.course_id', 'courses.cover_img', 'courses.title', 'tutors.name as tutor_name')
            .from('course_enrollments')
            .leftJoin('courses', 'course_enrollments.course_id', 'courses.id')
            .leftJoin('tutors', 'courses.tutor_id', 'tutors.id')
            .where('course_enrollments.user_id', user_id)
            .whereNull('course_enrollments.deleted_at')
            .whereNull('courses.deleted_at')
            .whereNull('tutors.deleted_at')

        for (const course of enrolledCourses) {
            let lessonNum = await Database
                .table('lessons')
                .where('course_id', course.course_id)
                .whereNull('deleted_at')
                .count('* as count')
            let progressCount = await Database
                .table('finished_lessons')
                .distinct('finished_lessons.lesson_id')
                .leftJoin('lessons', 'finished_lessons.lesson_id', 'lessons.id')
                .leftJoin('courses', 'lessons.course_id', 'courses.id')
                .where('finished_lessons.user_id', user_id)
                .where('courses.id', course.course_id)
                .whereNull('lessons.deleted_at')
                .whereNull('courses.deleted_at')
                .whereNull('finished_lessons.deleted_at')
            
            let answeredQuiz = await Database
                .table('answered_quizs')
                .where('user_id', user_id)
                .where('course_id', course.course_id)
                .whereNull('deleted_at');
            let quizQuestions = await Database
                .table('quiz_questions')
                .where('course_id', course.course_id)
                .whereNull('deleted_at');

            courses.push({
                ...course,
                lessonNum: lessonNum[0].count,
                progressCount: progressCount.length,
                answeredQuiz: answeredQuiz,
                hasQuiz: quizQuestions.length > 0 ? true : false
            })
        }

        return courses;
    }

    static async getEnrolledCourseInstructors(user_id) {

        const instructors = await Database
            .table('tutors')
            .distinct('tutors.*')
            .leftJoin('courses', 'tutors.id', 'courses.tutor_id')
            .leftJoin('course_enrollments', 'courses.id', 'course_enrollments.course_id')
            .where('course_enrollments.user_id', user_id)
            .whereNull('tutors.deleted_at')

        return instructors;
    }

    static async getSharedCertificates(token) {

        const certificates = await Database
            .raw(`select courses.id as id, courses.title as course_title, COUNT(lessons.id) as lesson_number, tutors.name as tutor_name, MAX(course_enrollments.last_lesson) as issue_date, course_enrollments.user_id, course_enrollments.certificate_token from course_enrollments left join courses on course_enrollments.course_id = courses.id left join lessons on courses.id = lessons.course_id left join tutors on courses.tutor_id = tutors.id where course_enrollments.certificate_token = ? and lessons.deleted_at is null group by courses.id, course_enrollments.user_id`, [token])
        return certificates[0];
    }

}

module.exports = CourseEnrollment
