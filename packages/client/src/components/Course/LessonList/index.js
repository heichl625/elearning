import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { v4 as uuidv4} from 'uuid'

//styles
import LessonListStyles from './LessonList.module.scss'

const LessonList = ({course_id, isEnrolled, lessonList, finishedLessons, isLoading}) => {

    const user = useSelector(store => store.user);
    
    return (
        <div className={LessonListStyles.container}>
            <h2 className={LessonListStyles.sectionTitle}>課堂（{lessonList.length}）</h2>
            {isLoading ? <div className={LessonListStyles.skeletonContainer}>
                <div className={LessonListStyles.skeleton}></div>
                <div className={LessonListStyles.skeleton}></div>
                <div className={LessonListStyles.skeleton}></div>
                <div className={LessonListStyles.skeleton}></div>
                <div className={LessonListStyles.skeleton}></div>
            </div> : (lessonList?.length > 0 && lessonList.map(lesson => {
                return <Link to={`/courses/${course_id}/lessons/${lesson.id}`} className={`${LessonListStyles.lessonBlock} ${(!isEnrolled && lesson.trial == 0 && user.role !== 'admin') ? LessonListStyles.disabledBlock : ''}`} key={uuidv4()}>
                    <p>{lesson.order}. {lesson.title}</p>
                    {finishedLessons.find(finishedLesson => finishedLesson.lesson_id === lesson.id) && <p className={LessonListStyles.finishedText}>已完成</p>}
                </Link>
                
            }))}
        </div>
    )
}

export default LessonList
