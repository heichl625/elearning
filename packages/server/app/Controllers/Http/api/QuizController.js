'use strict'
const Models = use('App/Controllers/Http/ModelController');
const Hashids = require('hashids/cjs')
const hashids = new Hashids('', 10)

class QuizController {

    async getQuizQuestions({ response, request, auth }){

        let { course_id } = request.all();
        let userAuth = auth.authenticator('user')
        let user = await userAuth.getUser();

        course_id = hashids.decode(course_id)[0];

        try{

            let questions = [];

            let questionsFetched = await Models.QuizQuestion
                .query()
                .where('course_id', course_id)
                .whereNull('deleted_at')
                .fetch()

            for(const question of questionsFetched.toJSON()){
                let optionsFetched = await Models.QuizOption
                    .query()
                    .where('question_id', question.id)
                    .whereNull('deleted_at')
                    .fetch()
                
                questions.push({
                    ...question,
                    course_id: hashids.encode(question.course_id),
                    options: optionsFetched.toJSON()
                })
            }

            let course = await Models.Course.find(course_id);
            course.id = hashids.encode(course.id);

            let answeredLength = await Models.AnsweredQuiz
                .query()
                .where('user_id', user.id)
                .where('course_id', course_id)
                .whereNull('deleted_at')
                .getCount();

            return response.json({questions: questions, course: course, answered: answeredLength > 0 ? true : false});


        }catch(err){
            console.log(err);
            return response.json({error: err})
        }

    }

    async saveQuizAnswers({request, auth, response}){

        let userAuth = auth.authenticator('user')
        let user = await userAuth.getUser();

        let { answers, course_id } = request.all();

        course_id = hashids.decode(course_id)[0]


        try{

            if((Math.floor(answers.filter(answer => answer.status === 'correct').length /answers.length*100)) >= 70){
                let courseEnrollment = await Models.CourseEnrollment
                    .query()
                    .where('user_id', user.id)
                    .where('course_id', course_id)
                    .whereNull('deleted_at')
                    .first()
                
                courseEnrollment.quiz_finished = 1;
                await courseEnrollment.save();
                
            }

            for(const answer of answers){

                let originalAnswer = await Models.AnsweredQuiz
                    .query()
                    .where('user_id', user.id)
                    .where('question_id', answer.question_id)
                    .whereNull('deleted_at')
                    .first();

                if(originalAnswer){
                    originalAnswer.option = answer.option;
                    originalAnswer.status = answer.status;
                    await originalAnswer.save();
                }else{
                    let user_answer = new Models.AnsweredQuiz();
    
                    user_answer.user_id = user.id;
                    user_answer.question_id = answer.question_id;
                    user_answer.option = answer.option;
                    user_answer.course_id = course_id;
                    user_answer.status = answer.status;
        
                    await user_answer.save();
                }

                
            }
            return response.json({message: 'successfuly added answers'})
        }catch(err){
            console.log(err)
            return response.json({error: err})
        }

    }

    async getSubmittedAnswers({request, response, auth}){
        let userAuth = auth.authenticator('user')
        let user = await userAuth.getUser();

        let { course_id } = request.all();

        course_id = hashids.decode(course_id)[0]

        try{
            
            let answeredQuizs = await Models.AnsweredQuiz
                .query()
                .where('course_id', course_id)
                .where('user_id', user.id)
                .whereNull('deleted_at')
                .fetch();

            answeredQuizs = answeredQuizs.toJSON().map(quizs => ({
                ...quizs,
                course_id: hashids.encode(quizs.course_id)
            }));

            return response.json({answers: answeredQuizs})

        }catch(err){
            console.log(err);
            return response.json({error: err})
        }
    }

}

module.exports = QuizController
