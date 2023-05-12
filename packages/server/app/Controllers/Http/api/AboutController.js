'use strict'

const Models = use('App/Controllers/Http/ModelController');


class AboutController {

    async frequentlyAsked({ response }) {

        try{
            let questions = await Models.Qna
                .query()
                .whereNull('deleted_at')
                .orderBy('created_at')
                .fetch();

            questions = questions.toJSON();

            return response.json({ questions: questions })
        }catch(err){
            return response.json({ error: err.toString()})
        }
    }

}

module.exports = AboutController
