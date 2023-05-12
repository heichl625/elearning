'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use('Database');

class InboxMessage extends Model {

    static async getUnreadMessages(){
        let instructors = await Database.raw(`SELECT tutors.name, tutors.email, count(inbox_messages.id) as unread_msg from inbox_messages left join tutors on inbox_messages.tutor_id = tutors.id where inbox_messages.read = 0 and inbox_messages.sent_by = 'user' and inbox_messages.deleted_at is null and tutors.deleted_at is null group by inbox_messages.tutor_id;`)
        return instructors[0];
    }

    static async tutorGetStudents (tutor_id){

        let students = await Database
            .table('inbox_messages')
            .distinct('inbox_messages.user_id')
            .where('inbox_messages.tutor_id', tutor_id) 

        return students;

    }

    static async getLastMessageTime(tutor_id, user_id){

        let messages = await Database
            .select('created_at')
            .from('inbox_messages')
            .where('tutor_id', tutor_id)
            .where('user_id', user_id)

        return messages[messages?.length-1]?.created_at;

    }
}

module.exports = InboxMessage
