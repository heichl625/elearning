import React, { useRef, useState, useEffect } from 'react';
import Player from '@vimeo/player';

import CourseInfoStyles from './CourseInfo.module.scss';

const CourseInfo = ({ course, isLoading }) => {

    const targetRef = useRef(null)
    const learnRef = useRef(null)
    const keyRef = useRef(null)
    const [video, setVideo] = useState();

    useEffect(() => {

        if(course?.video_url){
            let options = {
                url: course?.video_url,
                height: '743px',
            }

            setVideo(new Player(CourseInfoStyles.preview, options))
        }
        targetRef.current.innerHTML = course?.target;
        learnRef.current.innerHTML = course?.learn;
        keyRef.current.innerHTML = course?.lesson_key;
        

    }, [course])


    return (
        <div className={CourseInfoStyles.contianer}>
            <div className={CourseInfoStyles.section}>
                <h2 className={CourseInfoStyles.sectionHeading}>目標學員</h2>
                <div className={`${CourseInfoStyles.content} ${isLoading ? CourseInfoStyles.hidden : ''}`} ref={targetRef}></div>
                {isLoading && <div className={CourseInfoStyles.skeletonContainer}>
                    <div className={CourseInfoStyles.skeleton}></div>
                    <div className={CourseInfoStyles.skeleton}></div>
                    <div className={CourseInfoStyles.skeleton}></div>
                </div> }
            </div>
            <div className={CourseInfoStyles.section}>
                <h2 className={CourseInfoStyles.sectionHeading}>完成課程後，您會學到：</h2>
                <div className={`${CourseInfoStyles.content} ${isLoading ? CourseInfoStyles.hidden : ''}`} ref={learnRef}></div>
                {isLoading && <div className={CourseInfoStyles.skeletonContainer}>
                    <div className={CourseInfoStyles.skeleton}></div>
                    <div className={CourseInfoStyles.skeleton}></div>
                    <div className={CourseInfoStyles.skeleton}></div>
                </div>}
            </div>
            <div className={CourseInfoStyles.section}>
                <h2 className={CourseInfoStyles.sectionHeading}>《{course?.title}》導師介紹及課程精華預覽</h2>
                <div id={CourseInfoStyles.preview} className={isLoading ? CourseInfoStyles.hidden : ''}></div>
                {isLoading && <div className={CourseInfoStyles.videoSkeleton}></div>}
            </div>
            <div className={CourseInfoStyles.section}>
                <h2 className={CourseInfoStyles.sectionHeading}>課程要點</h2>
                <div className={`${CourseInfoStyles.content} ${isLoading ? CourseInfoStyles.hidden : ''}`} ref={keyRef}></div>
                {isLoading &&  <div className={CourseInfoStyles.skeletonContainer}>
                    <div className={CourseInfoStyles.skeleton}></div>
                    <div className={CourseInfoStyles.skeleton}></div>
                    <div className={CourseInfoStyles.skeleton}></div>
                </div>}
            </div>
        </div>
    )
}

export default CourseInfo
