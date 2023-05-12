import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { setPopup, setPopupPage, setRedirectUrl } from 'redux/actions/global_setting'

//component
import PopupTitle from 'components/PopupTitle';

//styles
import FinishedAllLessonsStyles from './FinishedAllLessons.module.scss';

const FinishedAllLessons = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const redirect_url = useSelector(store => store.global_setting.redirect_url)

    const startLater = () => {
        dispatch(setPopup(false));
    }

    const startQuiz = () => {
        dispatch(setPopup(false));
        history.push(redirect_url);
    }

    useEffect(() => {
        return () => {
            dispatch(setPopupPage(''));
            dispatch(setRedirectUrl(''))
        }
        
    }, [])


    return (
        <div className={FinishedAllLessonsStyles.container}>
            <PopupTitle title='已完成所有課堂!'/>
            <p className={FinishedAllLessonsStyles.msg}>你已完成所有課堂！立即開始課程測驗並答對超過70%的問題，便可領取課程證書。</p>
            <div className={FinishedAllLessonsStyles.btnGroup}>
                <button className={FinishedAllLessonsStyles.startLaterBtn} onClick={startLater}>稍後開始</button>
                <button className={FinishedAllLessonsStyles.startQuizBtn} onClick={startQuiz}>開始課程測驗</button>
            </div>
        </div>
    )
}

export default FinishedAllLessons
