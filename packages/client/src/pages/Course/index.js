import React, { useEffect, useState, useRef } from 'react'
import Axios from 'axios'
import { useParams, useHistory } from 'react-router-dom'

//component
import CourseUpperBar from '../../components/Course/CourseUpperBar'
import LessonList from '../../components/Course/LessonList'
import CourseInfo from 'components/Course/CourseInfo'
import InstructorInfo from 'components/Course/InstructorInfo'
import Comments from 'components/Course/Comments';
import CourseNav from 'components/Course/CourseNav';
import Suggestion from 'components/Course/Suggestion';

//redux
import { useSelector } from 'react-redux';


//Styles
import CourseStyles from './Course.module.scss'

const Course = ({ course, tutor, studentNumber }) => {

    const { id } = useParams()
    const user = useSelector(store => store.user);
    const containerRef = useRef(null)
    const history = useHistory();


    const [lessonList, setLessonList] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [comments, setComments] = useState([])
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [lastLesson, setLastLesson] = useState();
    const [finishedLessons, setFinishedLessons] = useState([]);
    const [lessonToStart, setLessonToStart] = useState();
    const [showCourseNav, setShowCourseNav] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [suggestionList, setSuggestionList] = useState([]);

    useEffect(() => {

        let mounted = true;

        const fetchData = async () => {

            await Axios.get(`/api/courses/${id}/lessons`)
                .then(res => {
                    if (mounted) {
                        setLessonList(res.data.lessons)
                    }
                })

            await Axios.get(`/api/courses/${id}/comments`)
                .then(res => res.data)
                .then(data => {
                    if (!data.error && mounted) {
                        setComments(data.comments)
                    }
                })

            if (mounted) {
                setIsLoading(false)
            }
        }

        if (id) {
            fetchData();
        }

        return () => {
            mounted = false;
        }

    }, [id])
    
    useEffect(() => {

        let mounted = true;

        if (user.id && id) {
            Axios.post('/api/check-enrolled', {
                course_id: id,
                user_id: user.id
            })
                .then(res => res.data)
                .then(data => {
                    if (mounted) {
                        if (!data.error) {
                            if (data.isEnrolled) {
                                setIsEnrolled(true);
                                if (data.courseEnrollment.last_lesson) {
                                    let date = new Date(data.courseEnrollment.last_lesson)
                                    let dateStr = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
                                    setLastLesson(dateStr);
                                }
                            } else {
                                setIsEnrolled(false)
                            }
                        }
                    }

                })

            Axios.post('/api/get-finished-lessons', {
                course_id: id,
                user_id: user.id
            })
                .then(res => res.data)
                .then(data => {
                    if (!data.error && mounted) {
                        setFinishedLessons(data.finishedLessons)
                    }
                })

        } else {
            setIsEnrolled(false);
            setLastLesson('');
            setFinishedLessons([])
        }
        Axios.post('/api/course-suggestions', {
            course_id: id,
            user_id: user.id || null
        })
            .then(res => res.data)
            .then(data => {
                if (!data.error && mounted) {
                    setSuggestionList(data.suggestionList);
                }
            })

        return () => {
            mounted = false;
        }


    }, [user.id])

    useEffect(() => {


        if (finishedLessons?.length > 0 && lessonList.length > 0 && finishedLessons?.length !== lessonList.length) {
            for (const lesson of lessonList) {
                if (!finishedLessons.find(finishedLesson => finishedLesson.lesson_id === lesson.id)) {
                    setLessonToStart(lesson)
                    break;
                }
            }
        } else {
            setLessonToStart(lessonList.find(lesson => lesson.order === 1))
        }

    }, [finishedLessons, lessonList])

    useEffect(() => {

        function showNavOnScroll(e) {
            let scrolled = document.scrollingElement.scrollTop;
            if (scrolled >= 80) {
                setShowCourseNav(true)
            } else {

                setShowCourseNav(false)
            }
        }

        document.addEventListener('scroll', showNavOnScroll)

        return () => {
            document.removeEventListener('scroll', showNavOnScroll)
        }

    }, [])

    useEffect(() => {

        if (user.pending_courses?.length > 0) {
            if (user.pending_courses.find(course_id => course_id === id)) {
                setIsPending(true)
            } else {
                setIsPending(false)
            }
        }

    }, [user.pending_courses])



    return (
        <>
            <div className={`${CourseStyles.container} ${suggestionList.length === 0 ? CourseStyles.paddingBottom : ''}`} ref={containerRef}>
                {showCourseNav === true && (isEnrolled !== true || user.isAuth === false) && !isPending && course?.price && <CourseNav course={course} tutor={tutor} lessonNumber={lessonList.length} />}
                <CourseUpperBar course={course} tutor={tutor} lessonNumber={lessonList.length} studentNumber={studentNumber} isEnrolled={isEnrolled} lastLesson={lastLesson} finishedLessons={finishedLessons} lessonToStart={lessonToStart} isLoading={isLoading} />
                <div className={CourseStyles.courseInfoContainer}>
                    <div className={CourseStyles.tabSection}>
                        <div className={`${CourseStyles.tab} ${activeTab === 0 ? CourseStyles.activeTab : ''}`} onClick={() => setActiveTab(0)}>課程簡介</div>
                        <div className={`${CourseStyles.tab} ${activeTab === 1 ? CourseStyles.activeTab : ''}`} onClick={() => setActiveTab(1)}>評價</div>
                    </div>
                    {activeTab === 0 && <CourseInfo course={course} isLoading={isLoading} />}
                    {activeTab === 1 && <Comments isEnrolled={isEnrolled} id={id} comments={comments} />}
                </div>
                {activeTab === 0 && <InstructorInfo instructor={tutor} isLoading={isLoading} />}
                {(activeTab === 0 && course?.price) && <LessonList course_id={id} isEnrolled={isEnrolled} lessonList={lessonList} finishedLessons={finishedLessons} isLoading={isLoading} />}
            </div>
            {suggestionList.length > 0 && <Suggestion suggestionList={suggestionList} isLoading={isLoading} />}
        </>
    )
}

export default Course
