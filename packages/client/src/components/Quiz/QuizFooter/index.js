import React from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { setPopup, setPopupPage } from 'redux/actions/global_setting'
import { setStatus } from 'redux/actions/quiz';

//styles
import QuizFooterStyles from './QuizFooter.module.scss';

const QuizFooter = ({questionNum}) => {

    const dispatch = useDispatch();

    const answers = useSelector(store => store.quiz.answers);
    const { course_id } = useParams();

    const submitQuiz = () => {
        if(answers.length !== questionNum){
            alert('請回答所有題目');
            return
        }

        if(Math.floor(answers?.filter(answer => answer.status === 'correct').length/questionNum*100) < 70){
            dispatch(setStatus('failed'))
            Axios.post('/api/save-quiz-answers', {
                answers: answers,
                course_id: course_id
            })
            .catch(err => {
                console.log(err)
            })
        }else{
            dispatch(setStatus('passed'))
            Axios.post('/api/save-quiz-answers', {
                answers: answers,
                course_id: course_id
            })
            .catch(err => {
                console.log(err)
            })
            
        }

        dispatch(setPopupPage('finished-quiz'))
        dispatch(setPopup(true));

    }

    return (
        <div className={QuizFooterStyles.container}>
            <div className={QuizFooterStyles.quizProgressContainer}>
                <div className={QuizFooterStyles.quizProgress}>
                    <p className={QuizFooterStyles.progressTitle}>已完成題目</p>
                    <p className={QuizFooterStyles.progressCount}>{answers?.length}<span className={QuizFooterStyles.progressTotal}>/{questionNum}</span></p>
                </div>
                <div className={QuizFooterStyles.quizProgress}>
                    <p className={QuizFooterStyles.progressTitle}>已獲得分數</p>
                    <p className={QuizFooterStyles.progressCount}>{Math.floor(answers?.filter(answer => answer.status === 'correct').length/questionNum*100)}<span className={QuizFooterStyles.progressTotal}>/100</span></p>
                </div>
            </div>
            <button className={`${QuizFooterStyles.submitBtn} ${questionNum !== answers.length ? QuizFooterStyles.disableBtn : ''}`} onClick={submitQuiz}>提交</button>
        </div>
    )
}

export default QuizFooter
