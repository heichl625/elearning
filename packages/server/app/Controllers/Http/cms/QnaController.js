'use strict'

const Models = use('App/Controllers/Http/ModelController')
const moment = require('moment');
const HelperFunction = use('App/Controllers/Http/HelperFunctionController')


class QnaController {

    async index({ view }) {

        let questions = await Models.Qna
            .query()
            .whereNull('deleted_at')
            .orderBy('created_at')
            .fetch()

        questions = questions.toJSON().map(question => ({
            ...question,
            updated_at: moment(question.updated_at).format('DD/MM/YYYY HH:mm:ss A')
        }))

        return view.render('qna', { questions: questions })

    }

    async add_form({ view }) {

        return view.render('pages/qna/add')

    }

    async add({ request, response, session }) {

        let { question, answer } = request.all();

        try {
            let newQuestion = new Models.Qna()

            newQuestion.question = question;
            newQuestion.answer = answer;

            await newQuestion.save();

            return response.redirect('/cms/qna')

        } catch (err) {
            session.flash({ error: err.toString() })
            return response.redirect('back')
        }

    }

    async edit_form({ params, view }) {

        let { id } = params;

        let question = await Models.Qna.find(id);

        console.log(question.toJSON())

        return view.render('pages/qna/edit', { question: question.toJSON() })

    }

    async edit({ params, request, response, session }) {

        let { id } = params;

        let { question, answer } = request.all();

        try {
            let oldQuestion = await Models.Qna.find(id);
            oldQuestion.question = question;
            oldQuestion.answer = answer;

            await oldQuestion.save();

            return response.redirect('/cms/qna')
        } catch (err) {
            session.flash({ error: err.toString() })
            return response.redirect('back')
        }

    }

    async delete({params, response, session}){

        let { id } = params;

        try{
            let question = await Models.Qna.find(id);
            question.deleted_at = HelperFunction.DateParser.toSQLForm(new Date());
            await question.save();
            session.flash({notification: '常見問題已刪除'})
            return response.redirect('back')
        }catch(err){
            session.flash({error: err.toString()})
            return response.redirect('back')
        }
        

    }

}

module.exports = QnaController
