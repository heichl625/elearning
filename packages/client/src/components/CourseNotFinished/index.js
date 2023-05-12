import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { setPopup, setPopupPage, setRedirectUrl } from 'redux/actions/global_setting';

//component
import PopupTitle from 'components/PopupTitle';

//styles
import CourseNotFinishedStyles from './CourseNotFinished.module.scss';

const CourseNotFinished = () => {

    const history = useHistory();
    const dispatch = useDispatch()
    
    const redirect_url = useSelector(store => store.global_setting.redirect_url);

    const continueCourse = () => {
        if(redirect_url){
            dispatch(setPopup(false))
            history.push(redirect_url);
        }
    }

    useEffect(() => {
        return () => {
            dispatch(setPopupPage(''))
            dispatch(setRedirectUrl(''))
        }
    }, [])

    return (
        <div className={CourseNotFinishedStyles.container}>
            <PopupTitle title='不能開始課程測驗' />
            <p className={CourseNotFinishedStyles.msg}>你還未完成所有課堂，請先完成所有課堂再開始測驗</p>
            <button className={CourseNotFinishedStyles.continueBtn} onClick={continueCourse}>繼續課程</button>
        </div>
    )
}

export default CourseNotFinished
