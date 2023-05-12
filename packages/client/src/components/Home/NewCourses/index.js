import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import Axios from 'axios'

//component
import SectionTitle from '../SectionTitle';
import CourseList from '../../CourseList';
import CourseCardSkeleton from '../../CourseCardSkeleton';

//images
import rightArrow from 'images/icon/arrow_right@3x.png'

//styles
import NewCoursesStyles from './NewCourses.module.scss';

const NewCourses = () => {

    const [courses, setCourses] = useState([]);

    useEffect(() => {

        let mounted = true

        Axios.get('/api/new-courses')
        .then(res => res.data)
        .then(data => {
            if(!data.error && mounted){
                setCourses(data.courses)
            }
        })

        return () => {
            mounted = false;
        }

    }, [])

    return (
        <div className={NewCoursesStyles.container}>

            <div className={NewCoursesStyles.topContainer}>
                <SectionTitle title='最新課程' className={NewCoursesStyles.title}/>
                <Link className={NewCoursesStyles.more} to='/courses?sortby=latest'>更多最新課程<img src={rightArrow} className={NewCoursesStyles.rightArrow} alt="more button"/></Link>
            </div>
            {courses.length > 0 ? <CourseList courses={courses}/> : <CourseCardSkeleton />}
            <Link className={NewCoursesStyles.mobileMore} to='/courses?sortby=latest'>更多最新課程<img src={rightArrow} className={NewCoursesStyles.rightArrow} alt="more button"/></Link>

        </div>
    )
}

export default NewCourses
