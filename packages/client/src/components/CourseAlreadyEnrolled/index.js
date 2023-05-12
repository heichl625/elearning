import React from 'react';
import { useHistory } from 'react-router-dom';

//redux
import { useDispatch } from 'react-redux';
import { setPopup } from 'redux/actions/global_setting'

//component
import PopupTitle from 'components/PopupTitle';

//styles
import CourseAlreadyEnrolledStyles from './CourseAlreadyEnrolled.module.scss';

const CourseAlreadyEnrolled = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const backToHome = () => {
        history.push('/');
        dispatch(setPopup(false))
    }

    return (
        <div className={CourseAlreadyEnrolledStyles.container}>
            <PopupTitle title='訂單中有已購買的課程'/>
            <p className={CourseAlreadyEnrolledStyles.msg}>此訂單中含有你已購買的課程，請返回主頁重新選擇你需要購買的課程</p>
            <button className={CourseAlreadyEnrolledStyles.backBtn} onClick={backToHome}>返回主頁</button>
        </div>
    )
}

export default CourseAlreadyEnrolled
