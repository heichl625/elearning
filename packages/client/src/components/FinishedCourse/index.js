import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { setPopup, setPopupPage, setRedirectUrl } from 'redux/actions/global_setting'

//component
import PopupTitle from 'components/PopupTitle';

//styles
import FinishedCourseStyles from './FinishedCourse.module.scss';

const FinishedCourse = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const redirect_url = useSelector(store => store.global_setting.redirect_url)

    const checkCertificate = () => {
        dispatch(setPopup(false));
        history.push('/profile/certificate')
    }

    const backToHome = () => {
        dispatch(setPopup(false));
        history.push('/')
    }

    useEffect(() => {
        return () => {
            dispatch(setPopupPage(''));
            dispatch(setRedirectUrl(''))
        }
        
    }, [])


    return (
        <div className={FinishedCourseStyles.container}>
            <PopupTitle title='已完成所有課堂!'/>
            <p className={FinishedCourseStyles.msg}>你已完成所有課堂！請按下方的按鈕查您的課程證書。</p>
            <div className={FinishedCourseStyles.btnGroup}>
                <button className={FinishedCourseStyles.certificateBtn} onClick={checkCertificate}>查看證書</button>
                <button className={FinishedCourseStyles.homeBtn} onClick={backToHome}>返回主頁</button>
            </div>
        </div>
    )
}

export default FinishedCourse
