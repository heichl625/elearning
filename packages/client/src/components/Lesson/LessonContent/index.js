import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid' 
import Axios from 'axios';
import Player from '@vimeo/player';

//redux
import { useDispatch, useSelector } from 'react-redux';
import { setCheckoutItems, setSubtotal } from 'redux/actions/checkout';
import { setPopup, setPopupPage, setRedirectUrl } from 'redux/actions/global_setting'

import LessonContentStyles from './LessonContent.module.scss';

import MaterialIcon from 'images/icon/assignment_needed@3x.png';

const LessonContent = ({ course, lesson, finishedLessons, isEnrolled, instructor, lessonNumber, nextLesson, prevLesson, setFinishedLessons, showMobileList, isLoading, hasQuiz }) => {

    const dispatch = useDispatch();
    const history = useHistory();

    const [video, setVideo] = useState();
    const [isVideoLoading, setIsVideoLoading] = useState(true);
    const [isFinished, setIsFinished] = useState(false);
    const contentRef = useRef(null);
    const { lesson_id, id } = useParams();
    const user = useSelector(store => store.user);

    useEffect(() => {

        if (finishedLessons?.length > 0 && finishedLessons?.find(item => item.lesson_id == lesson_id)) {
            setIsFinished(true)
        } else {
            setIsFinished(false)
        }

    }, [finishedLessons, lesson])

    useEffect(() => {

        if (lesson) {
            setIsVideoLoading(true);
            let options = {
                url: lesson.video_url,
                height: '669px',
            }

            if (!video) {
                setVideo(new Player(LessonContentStyles.lessonVideo, options))
                setIsVideoLoading(false);
            } else {
                video.loadVideo(lesson.video_url.split('https://vimeo.com/')[1]).then(() => {
                    setIsVideoLoading(false);
                })
            }
            contentRef.current.innerHTML = lesson.description;
        }

    }, [lesson])

    useEffect(() => {

        let mounted = true;

        function autoFinishLesson() {
            if (isFinished === false) {
                Axios.post('/api/finish-lesson', {
                    lesson_id: lesson_id,
                    course_id: id
                })
                    .then(res => res.data)
                    .then(data => {
                        if (!data.error) {
                            if(mounted){
                                if (!nextLesson) {
                                    setFinishedLessons([...finishedLessons, data.lesson])
                                } else {
                                    goToNext();
                                }
                            }
                        }
                    })

            }
        }


        if (video && lesson) {
            video.on('ended', autoFinishLesson)

            return () => {
                video.off('ended', autoFinishLesson);
                mounted = false;
            }
        }

        return () => {
            mounted = false;
        }

    }, [video, lesson, isFinished])

    const purchaseNow = () => {
        console.log(instructor);
        let item = {
            course_id: course.id,
            title: course.title,
            price: course.price,
            discount_price: course.discount_price,
            discount_text: course.discount_text,
            tutor_name: instructor.name,
            tutor_avator: instructor.avator,
            cover_img: course.cover_img,
            duration: course.duration,
            lesson_num: lessonNumber
        }
        dispatch(setCheckoutItems([item]))
        dispatch(setSubtotal(course.discount_price || course.price))
        history.push('/checkout')
    }

    const finishLesson = () => {
        Axios.post('/api/finish-lesson', {
            lesson_id: lesson_id,
            course_id: id
        })
            .then(res => res.data)
            .then(data => {
                if (!data.error) {
                    if (nextLesson) {
                        goToNext();
                    }
                    setFinishedLessons([...finishedLessons, data.lesson])
                    if (data.finished === 1) {
                        if(hasQuiz){
                            dispatch(setRedirectUrl(`/quiz/${id}`))
                            dispatch(setPopupPage('finished-all-lessons'))
                            
                        }else{
                            dispatch(setPopupPage('finished-course'))
                        }
                        dispatch(setPopup(true));
                    }
                }
            })
    }

    const goToPrev = () => {
        history.push(`/courses/${course.id}/lessons/${prevLesson.id}`)
    }

    const goToNext = () => {
        history.push(`/courses/${course.id}/lessons/${nextLesson.id}`)
    }

    const handleDownloadMaterial = (id) => {
        Axios.post('/api/download-material', {
            id: id
        })
            .then(res => res.data)
            .then(data => {
                if (!data.error) {
                    let a = document.createElement('a');
                    a.href = data.url;
                    a.download = data.file_name;
                    a.click();
                    a.remove();
                }
            })
    }

    return (
        <div className={`${LessonContentStyles.container} ${showMobileList === false ? LessonContentStyles.showContent : ''}`}>
            {isLoading ? <div className={LessonContentStyles.courseNameSkeleton}></div> : <p className={LessonContentStyles.courseName}>{course?.title}</p>}
            {isLoading ? <div className={LessonContentStyles.titleBarSkeleton}></div> : <div className={LessonContentStyles.titleBar}>
                <div className={LessonContentStyles.titleContainer}>
                    <h1 className={LessonContentStyles.lessonTitle}>{lesson?.order}. {lesson?.title}</h1>
                    {lesson?.materials?.length > 0 && <img className={LessonContentStyles.mobileMaterialIcon} src={MaterialIcon}/>}
                </div>
                {isFinished && <p className={LessonContentStyles.finishedText}>已完成</p>}
            </div>}

            <div id={LessonContentStyles.lessonVideo} className={isVideoLoading ? LessonContentStyles.videoSkeleton : ''}></div>
            {(!isEnrolled && user.role !== 'admin') && course && <div className={LessonContentStyles.priceContainer}>
                {course.discount_price && <p className={LessonContentStyles.discountPrice}>{course.discount_text} HK${course.discount_price}.00</p>}
                <p className={LessonContentStyles.originalPrice}>HK${course.price}.00{course.discount_price && <span className={LessonContentStyles.crossout}></span>}</p>
                <button className={LessonContentStyles.purchaseBtn} onClick={purchaseNow}>立即購買</button>
            </div>}
            <div className={LessonContentStyles.lessonDescContainer}>
                {(isEnrolled || user.role === 'admin') && <div className={LessonContentStyles.enrolledBtnGroup}>
                    {isFinished ? <button className={LessonContentStyles.finishedBtn}>已完成課堂</button> : <button className={LessonContentStyles.finishBtn} onClick={finishLesson}>完成課堂</button>}
                    <div className={LessonContentStyles.lessonControlBtnGroup}>
                        {prevLesson && <button className={LessonContentStyles.prevBtn} onClick={goToPrev}>上一課堂</button>}
                        {nextLesson && <button className={LessonContentStyles.nextBtn} onClick={goToNext}>下一課堂</button>}
                    </div>
                </div>}
                <div className={LessonContentStyles.lessonContent}>
                    <h3 className={LessonContentStyles.contentTitle}>內容簡介</h3>
                    <div className={`${LessonContentStyles.content} ${isLoading ? LessonContentStyles.hidden : ''}`} ref={contentRef}></div>
                    {isLoading && <div className={LessonContentStyles.contentSkeleton}>
                        <div className={LessonContentStyles.skeleton}></div>
                        <div className={LessonContentStyles.skeleton}></div>
                        <div className={LessonContentStyles.skeleton}></div>
                        <div className={LessonContentStyles.skeleton}></div>
                        <div className={LessonContentStyles.skeleton}></div>
                    </div>}
                </div>
                {lesson?.materials?.length > 0 && <div className={LessonContentStyles.lessonContent}>
                    <h3 className={LessonContentStyles.contentTitle}>教材下載</h3>
                    {lesson.materials.map(material => {
                        return <p className={LessonContentStyles.materialFileName} onClick={() => handleDownloadMaterial(material.id)} key={uuidv4()}>{material.file_name}</p>
                    })}
                </div>}
            </div>
            <div className={LessonContentStyles.mobileFooter}>
                {!isEnrolled && course && <div className={LessonContentStyles.mobilePriceContainer}>
                    <div className={LessonContentStyles.priceRow}>
                        {course.discount_price && <p className={LessonContentStyles.discountPrice}>{course.discount_text} HK${course.discount_price}.00</p>}
                        <p className={LessonContentStyles.originalPrice}>HK${course.price}.00{course.discount_price && <span className={LessonContentStyles.crossout}></span>}</p>
                    </div>
                    <button className={LessonContentStyles.purchaseBtn} onClick={purchaseNow}>立即購買</button>
                </div>}
                {isEnrolled && (isFinished ? <button className={LessonContentStyles.finishedBtn}>已完成課堂</button> : <button className={LessonContentStyles.finishBtn} onClick={finishLesson}>完成課堂</button>)}
            </div>
        </div>
    )
}

export default LessonContent
