'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');
const Database = use('Database');

class Comment extends Model {

    static async getAllComments(page, limit, keywords) {

        let comments;

        if (keywords) {
            comments = await Database
                .select('comments.*', 'users.email', 'users.last_name', 'users.first_name', 'courses.title', 'tutors.name as tutor_name')
                .from('comments')
                .leftJoin('users', 'comments.user_id', 'users.id')
                .leftJoin('courses', 'comments.course_id', 'courses.id')
                .leftJoin('tutors', 'courses.tutor_id', 'tutors.id')
                .whereNull('comments.deleted_at')
                .where(function () {
                    this
                        .where('courses.title', 'LIKE', '%' + keywords + '%')
                        .orWhere('tutors.name', 'LIKE', '%' + keywords + '%')
                })
                .orderBy('comments.created_at', 'desc')
                .paginate(page, limit)
        } else {
            comments = await Database
                .select('comments.*', 'users.email', 'users.last_name', 'users.first_name', 'courses.title', 'tutors.name as tutor_name')
                .from('comments')
                .leftJoin('users', 'comments.user_id', 'users.id')
                .leftJoin('courses', 'comments.course_id', 'courses.id')
                .leftJoin('tutors', 'courses.tutor_id', 'tutors.id')
                .whereNull('comments.deleted_at')
                .orderBy('comments.created_at', 'desc')
                .paginate(page, limit)
        }

        return comments;

    }

    static async getComments(id) {

        let comments = await Database
            .select('comments.rating', 'comments.comment', 'comments.created_at', 'users.last_name', 'users.first_name')
            .from('comments')
            .leftJoin('users', 'comments.user_id', 'users.id')
            .where('comments.course_id', id)
            .where('comments.status', 'show')
            .whereNull('comments.deleted_at')

        return comments;

    }

    static async getCommentById(id) {

        let comment = await Database
            .select('comments.*', 'users.email', 'users.last_name', 'users.first_name', 'courses.title', 'tutors.name as tutor_name')
            .from('comments')
            .leftJoin('users', 'comments.user_id', 'users.id')
            .leftJoin('courses', 'comments.course_id', 'courses.id')
            .leftJoin('tutors', 'courses.tutor_id', 'tutors.id')
            .whereNull('comments.deleted_at')
            .where('comments.id', id)
        
        return comment

    }

}

module.exports = Comment
