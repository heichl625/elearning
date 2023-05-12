import React from 'react';
import { useHistory } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux'; 
import { clearAnswers, setSubmitted } from 'redux/actions/quiz';
import { setPopup } from 'redux/actions/global_setting'

//component
import PopupTitle from 'components/PopupTitle';

//styles
import FinishedQuizStyles from './FinishedQuiz.module.scss';

const FinishedQuiz = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const answers = useSelector(store => store.quiz.answers);
    const status = useSelector(store => store.quiz.status)

    const startAgain = () => {
        dispatch(clearAnswers())
        dispatch(setPopup(false));
    }

    const checkAnswer = () => {
        dispatch(setSubmitted(true));
        dispatch(setPopup(false));
    }

    const viewCertificate = () => {
        dispatch(setPopup(false));
        history.push('/profile/certificate')
    }

    return (
        <div className={FinishedQuizStyles.container}>
            <PopupTitle title={status === 'passed' ? '恭喜你!' : '再次努力！'} />
            <p className={FinishedQuizStyles.msg}>{status === 'passed' ? '你已成功通過測驗並獲得課程證書。' : 
            '你未能成功通過測驗並獲得課程證書，請再次嘗試。'}</p>
            <div className={FinishedQuizStyles.result}>
                <p className={FinishedQuizStyles.resultTitle}>你的成績</p>
                <p className={FinishedQuizStyles.marks}>{Math.floor(answers.filter(answer => answer.status === 'correct').length/answers.length*100)}/100分</p>
            </div>
            {status === 'failed'  && <button className={FinishedQuizStyles.startAgainBtn} onClick={startAgain}>重新測驗</button>}
            {status === 'passed' && <div className={FinishedQuizStyles.btnGroup}>
                <button className={FinishedQuizStyles.certBtn} onClick={viewCertificate}>查看我的證書</button>
                <button className={FinishedQuizStyles.answerBtn} onClick={checkAnswer}>查看答案</button>
            </div>}
        </div>
    )
}

export default FinishedQuiz
