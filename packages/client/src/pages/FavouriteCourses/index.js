import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'

//redux
import { useSelector } from 'react-redux';

//component
import CourseCard from 'components/CourseCard';

//styles
import FavouriteCoursesStyles from './FavouriteCourses.module.scss';

const FavouriteCourses = () => {

    const courses = useSelector(store => store.user.favourite_courses);

    useEffect(() => {

        document.title = '我收藏的課程 - MeLearn.Guru'

    }, [])

    return (
        <div className={FavouriteCoursesStyles.container}>
            <h3 className={FavouriteCoursesStyles.title}>我收藏的課程</h3>
            <div className={FavouriteCoursesStyles.courseList}>
                {courses?.length > 0 && courses.map(course => {
                    return <CourseCard course={course} key={uuidv4()}/>
                })}
            </div>
        </div>
    )
}

export default FavouriteCourses
