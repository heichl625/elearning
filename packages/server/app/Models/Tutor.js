'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use('Database')

class Tutor extends Model {

    static boot() {
        super.boot()

        // this.addTrait('SoftDelete')
        // this.addTrait("@provider:Lucid/UpdateOrCreate")
    }

    static async get(user, page, limit, keywords) {

        let tutors;

        if (user.role === 'admin') {
            if (limit !== 'all') {
                tutors = await Database
                    .select('tutors.*', 'course_developers.display_name as course_developer_name')
                    .from('tutors')
                    .leftJoin('course_developers', 'tutors.course_developer_id', 'course_developers.id')
                    .whereNull('tutors.deleted_at')
                    .where(function () {
                        if (keywords) {
                            this
                                .where('tutors.name', 'LIKE', '%' + keywords + '%')
                                .orWhere('tutors.email', 'LIKE', '%' + keywords + '%')
                                .orWhere('tutors.description', 'LIKE', '%' + keywords + '%')
                                .orWhere('course_developers.display_name', 'LIKE', '%' + keywords + '%')
                        }
                    })
                    .paginate(page, limit)
            } else {
                tutors = await Database
                    .select('tutors.*', 'course_developers.display_name as course_developer_name')
                    .from('tutors')
                    .leftJoin('course_developers', 'tutors.course_developer_id', 'course_developers.id')
                    .whereNull('tutors.deleted_at')
                    .where(function () {
                        if (keywords) {
                            this
                                .where('tutors.name', 'LIKE', '%' + keywords + '%')
                                .orWhere('tutors.email', 'LIKE', '%' + keywords + '%')
                                .orWhere('tutors.description', 'LIKE', '%' + keywords + '%')
                                .orWhere('course_developers.display_name', 'LIKE', '%' + keywords + '%')
                        }
                    })
            }

        } else {

            if (limit !== 'all') {
                tutors = await Database
                    .select('tutors.*', 'course_developers.display_name as course_developer_name')
                    .from('tutors')
                    .leftJoin('course_developers', 'tutors.course_developer_id', 'course_developers.id')
                    .where(function () {
                        this
                            .where('tutors.course_developer_id', user.course_developer_id)
                            .whereNull('tutors.deleted_at')
                    })
                    .where(function () {
                        if (keywords) {
                            this
                                .where('tutors.name', 'LIKE', '%' + keywords + '%')
                                .orWhere('tutors.email', 'LIKE', '%' + keywords + '%')
                                .orWhere('tutors.description', 'LIKE', '%' + keywords + '%')
                                .orWhere('course_developers.display_name', 'LIKE', '%' + keywords + '%')
                        }
                    })
                    .paginate(page, limit)
            } else {
                tutors = await Database
                    .select('tutors.*', 'course_developers.display_name as course_developer_name')
                    .from('tutors')
                    .leftJoin('course_developers', 'tutors.course_developer_id', 'course_developers.id')
                    .where(function () {
                        this
                            .where('tutors.course_developer_id', user.course_developer_id)
                            .whereNull('tutors.deleted_at')
                    })
                    .where(function () {
                        if (keywords) {
                            this
                                .where('tutors.name', 'LIKE', '%' + keywords + '%')
                                .orWhere('tutors.email', 'LIKE', '%' + keywords + '%')
                                .orWhere('tutors.description', 'LIKE', '%' + keywords + '%')
                                .orWhere('course_developers.display_name', 'LIKE', '%' + keywords + '%')
                        }
                    })
            }

        }

        if (limit !== 'all') {
            tutors.data.forEach(tutor => {
                tutor.created_at.setTime(tutor.created_at.getTime() + (8 * 60 * 60 * 1000));
                tutor.updated_at.setTime(tutor.updated_at.getTime() + (8 * 60 * 60 * 1000));
                if (tutor.deleted_at) {
                    tutor.deleted_at.setTime(tutor.deleted_at.getTime() + (8 * 60 * 60 * 1000));
                }
            })
        } else {
            tutors.forEach(tutor => {
                tutor.created_at.setTime(tutor.created_at.getTime() + (8 * 60 * 60 * 1000));
                tutor.updated_at.setTime(tutor.updated_at.getTime() + (8 * 60 * 60 * 1000));
                if (tutor.deleted_at) {
                    tutor.deleted_at.setTime(tutor.deleted_at.getTime() + (8 * 60 * 60 * 1000));
                }
            })
        }

        return tutors;
    }

    static async getTutorById(id) {
        const tutor = await Database
            .select('*')
            .from('tutors')
            .where('id', id)
            .whereNull('deleted_at')

        return tutor[0];
    }

    static async getTutorByEmail(email) {
        const tutor = await Database
            .select('*')
            .from('tutors')
            .where('email', email)
            .whereNull('deleted_at')

        return tutor[0]
    }

    static async add(tutor) {
        const id = await Database
            .insert(tutor)
            .into('tutors')

        return id
    }

    static async addAdminID(tutor_id, admin_id) {
        const affectedRow = await Database
            .table('tutors')
            .where('id', tutor_id)
            .update('admin_user_id', admin_id);

        return affectedRow
    }

    static async edit(id, tutorData) {
        const affectedRow = await Database
            .table('tutors')
            .where('id', id)
            .update(tutorData)

        return affectedRow
    }

    static async delete(id, date) {
        const affectedRow = await Database
            .table('tutors')
            .where('id', id)
            .update('deleted_at', date)

        return affectedRow
    }

}

module.exports = Tutor
