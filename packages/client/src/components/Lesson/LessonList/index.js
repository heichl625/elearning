import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import { useParams, Link, useHistory, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'

//redux
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedInstructor } from 'redux/actions/inbox'
import { setPopup, setPopupPage, setRedirectUrl } from 'redux/actions/global_setting'

//styles
import LessonListStyles from './LessonList.module.scss'

//images
import LeftArrow from 'images/icon/arrow_left@3x.png';
import tick from 'images/icon/quiz_correct@3x.png';
import attachment from 'images/icon/assignment_needed@3x.png';

const LessonList = ({ lessons, isEnrolled, finishedLessons, instructor, showMobileList, setShowMobileList, isLoading, hasQuiz }) => {

    const dispatch = useDispatch()
    const location = useLocation();
    const user = useSelector(store => store.user);

    let { id, lesson_id } = useParams();
    const history = useHistory();

    const handleAsk = () => {
        dispatch(setSelectedInstructor(instructor));
        history.push('/inbox');
    }

    const startQuiz = () => {

        if(hasQuiz){
            if (finishedLessons.length !== lessons.length) {
                dispatch(setRedirectUrl(location.pathname))
                dispatch(setPopupPage('course-not-finished'))
                dispatch(setPopup(true))
            } else {
                history.push('/quiz/' + id)
            }
        }

    }

    const selectLesson = (lesson) => {
        if((isEnrolled || lesson.trial === 1 && user.role === 'admin')){
            history.push(`/courses/${id}/lessons/${lesson.id}`);
            setShowMobileList(false)
        }
        
    }

    return (
        <div className={`${LessonListStyles.container} ${showMobileList ? LessonListStyles.showList : ''}`}>
            <div className={LessonListStyles.top}>
                <Link className={LessonListStyles.backBtn} to={`/courses/${id}`}>
                    <img src={LeftArrow} className={LessonListStyles.arrow} alt="back button icon"/>
                    <p>返回課程簡介</p>
                </Link>
                {(isEnrolled || user.role === 'admin') && <div className={LessonListStyles.enrolledGroup}>
                    <div className={LessonListStyles.progressBarContainer}>
                        <div className={LessonListStyles.progressBar}>
                            <div className={LessonListStyles.currentProgress} style={{ width: `${(finishedLessons.length > 0 && lessons.length > 0) ? ((finishedLessons.length / lessons.length) * 100) : 0}%` }}>
                                <div className={LessonListStyles.currentProgressIndicator}></div>
                            </div>
                        </div>
                        <p className={LessonListStyles.progressPercent}>已完成{(finishedLessons.length > 0 && lessons.length > 0)? (Math.floor((finishedLessons.length / lessons.length) * 100)) : 0}%</p>
                    </div>
                    {hasQuiz && <button className={LessonListStyles.quizBtn} onClick={startQuiz}>開始課堂測驗</button>}
                    <button className={LessonListStyles.qnaBtn} onClick={handleAsk}>我要發問</button>
                </div>}
            </div>
            <div className={LessonListStyles.lessonsContainer}>
                {isLoading ? <div className={LessonListStyles.skeletonContainer}>
                    <div className={LessonListStyles.skeleton}>
                        <div className={LessonListStyles.titleSkeleton}></div>
                        <div className={LessonListStyles.statusSkeleton}></div>
                    </div>
                    <div className={LessonListStyles.skeleton}>
                        <div className={LessonListStyles.titleSkeleton}></div>
                        <div className={LessonListStyles.statusSkeleton}></div>
                    </div>
                    <div className={LessonListStyles.skeleton}>
                        <div className={LessonListStyles.titleSkeleton}></div>
                        <div className={LessonListStyles.statusSkeleton}></div>
                    </div>
                    <div className={LessonListStyles.skeleton}>
                        <div className={LessonListStyles.titleSkeleton}></div>
                        <div className={LessonListStyles.statusSkeleton}></div>
                    </div>
                    <div className={LessonListStyles.skeleton}>
                        <div className={LessonListStyles.titleSkeleton}></div>
                        <div className={LessonListStyles.statusSkeleton}></div>
                    </div>
                </div> : (lessons.length > 0 && lessons.map(lesson => {
                    return <div className={`${LessonListStyles.lessonBlock} ${lesson_id == lesson.id ? LessonListStyles.activeBlock : ''} ${(!isEnrolled && lesson.trial === 0 && user.role !== 'admin') ? LessonListStyles.disabledBlock : ''}`} onClick={() => selectLesson(lesson)} key={uuidv4()}>
                        <div className={LessonListStyles.lessonBlockLeft}>
                            <p className={LessonListStyles.lessonTitle}>{lesson.order}. {lesson.title}</p>
                            {lesson_id != lesson.id && finishedLessons.length > 0 && finishedLessons.find(finishedLesson => finishedLesson.lesson_id == lesson.id) && <p className={LessonListStyles.finishedText}>已完成<img className={LessonListStyles.tick} src={tick} alt="finished lesson icon"/></p>}
                            {lesson_id != lesson.id && finishedLessons.length > 0 && !finishedLessons?.find(finishedLesson => finishedLesson.lesson_id == lesson.id) && <p className={LessonListStyles.unfinishedText}>未完成</p>}
                        </div>
                        {lesson?.materials?.length  > 0 && <img src={attachment} className={LessonListStyles.attachmentIcon} alt="attachment icon"/>}
                    </div>
                }))}
            </div>
        </div>
    )
}

export default LessonList
