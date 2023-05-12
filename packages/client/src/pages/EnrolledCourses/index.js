import React, { useEffect, useState } from 'react';
import Axios from 'axios';

import { useSelector, useDispatch } from 'react-redux';
import { setLoading } from 'redux/actions/global_setting';


//component
import UserCard from 'components/Profile/UserCard'
import EnrolledCoursesList from 'components/Profile/EnrolledCoursesList'

//styles
import EnrolledCoursesStyles from './EnrolledCourses.module.scss';

const EnrolledCourses = () => {

    const dispatch = useDispatch();

    const user = useSelector(store => store.user)
    const loading = useSelector(store => store.global_setting.loading);
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    useEffect(() => {

        dispatch(setLoading(true));
        document.title = '我的課程 - MeLearn.Guru';

    }, [])

    useEffect(() => {

        if(user.isAuth && loading){
            Axios.get('/api/enrolled-courses-detail')
            .then(res => res.data)
            .then(data => {
                
                if(!data.error){
                    setEnrolledCourses(data.enrolledCourses);
                }else{
                    console.log(data.error)
                }
                dispatch(setLoading(false))
            })
            .catch(err => {
                console.log(err);
            })
        }

    }, [user, loading])

    return (
        <div className={EnrolledCoursesStyles.container}>
            <h3 className={EnrolledCoursesStyles.pageTitle}>我的課程</h3>
            <div className={EnrolledCoursesStyles.main}>
                <UserCard />
                <EnrolledCoursesList enrolledCourses={enrolledCourses} />
            </div>
        </div>
    )
}

export default EnrolledCourses
