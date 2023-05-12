import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Axios from 'axios';

//redux
import { useDispatch, useSelector } from 'react-redux';
import { setPopup, setPopupPage, setRedirectUrl } from 'redux/actions/global_setting';


// Component
import TopBar from 'components/Quiz/TopBar';
import QuestionList from 'components/Quiz/QuestionList'
import QuizFooter from 'components/Quiz/QuizFooter';

//styles
import QuizStyles from './Quiz.module.scss';
import { setAnswers, setStatus, setSubmitted } from 'redux/actions/quiz';


const Quiz = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const submitted = useSelector(store => store.quiz.submitted);

    let { course_id } = useParams();
    const [questions, setQuestions] = useState([]);
    const [course, setCourse] = useState();
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {

        let mounted = true;

        const getQuestion = async () => {
            await Axios.post('/api/get-questions', {
                course_id: course_id
            })
            .then(res => res.data)
            .then(data => {
                if(!data.error){

                    if(mounted){
                        setQuestions(data.questions)
                        setCourse(data.course)
                        document.title = `課程測驗：${data.course.title} - MeLearn.Guru`
                        if(data.answered){
                            dispatch(setSubmitted(true));
                        }
                    }
                    
                }
            })
            if(mounted){
                setIsLoading(false);
            }
        }

        const getLessonToStart = async () => {
            return await  Axios.post('/api/get-lesson-to-start', {
                course_id: course_id
            })
            .then(res => res.data)
            .then(data => {
                if(data.lessonToStart){
                    return data.lessonToStart.id
                }else{
                    return
                }
            })
        }

        Axios.post('/api/check-quiz-exist', {
            course_id: course_id
        })
        .then(res => res.data)
        .then(async data => {
            if(data.hasQuiz){
                Axios.post('/api/check-course-finished', {
                    course_id: course_id
                })
                .then(res => res.data)
                .then(async data => {
                    if(data.finished === 0 && mounted){
                        let lesson_id = await getLessonToStart();
        
                        dispatch(setRedirectUrl(`/courses/${course_id}/lessons/${lesson_id}`))
                        dispatch(setPopupPage('course-not-finished'))
                        dispatch(setPopup(true))
                    }else{
                        getQuestion();
                    }
                })
            }else{
                let lesson_id = await getLessonToStart();
                history.push(`/courses/${course_id}/lessons/${lesson_id}`)
            }
        })

        

        return () => {
            dispatch(setSubmitted(false))
            mounted = false;
        }

    }, [])

    useEffect(() => {

        let mounted = true;

        if(submitted){
            Axios.post('/api/get-submitted-answers',{
                course_id: course_id
            })
            .then(res => res.data)
            .then(data => {
                if(!data.error && mounted){
                    dispatch(setAnswers(data.answers))
                    if(Math.floor(data.answers.filter(answer => answer.status === 'correct').length / data.answers.length*100) < 70){
                        dispatch(setStatus('failed'))
                        dispatch(setPopupPage('finished-quiz'))
                        dispatch(setPopup(true))
                    }
                }
            })
        }

        return () => {
            mounted = false;
        }

    }, [submitted])

    return (
        <div className={QuizStyles.container}>
            <TopBar course={course} questionNum={questions?.length} isLoading={isLoading}/>
            <QuestionList questions={questions} isLoading={isLoading}/>
            {!isLoading && !submitted && <QuizFooter  questionNum={questions?.length}/>}
        </div>
    )
}

export default Quiz
