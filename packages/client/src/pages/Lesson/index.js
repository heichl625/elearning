import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';

//component
import LessonList from 'components/Lesson/LessonList';
import LessonContent from 'components/Lesson/LessonContent';

//redux
import { useSelector } from 'react-redux';

//styles
import LessonStyles from './Lesson.module.scss';

//images
import ArrowUp from 'images/icon/ic-arrow-large-up-white@3x.png';
import ArrowDown from 'images/icon/ic-arrow-large-down-white@3x.png';


const Lesson = ({course, tutor}) => {

    const history = useHistory();

    const { id, lesson_id } = useParams();

    const user = useSelector(store => store.user);

    const [isEnrolled, setIsEnrolled] = useState(false);
    const [finishedLessons, setFinishedLessons] = useState([]);
    // const [course, setCourses] = useState();
    const [instructor, setInstructor] = useState();
    const [studentNum, setStudentNum] = useState();
    const [lessons, setLessons] = useState([]);
    const [currentLesson, setCurrentLesson] = useState();
    const [nextLesson, setNextLesson] = useState();
    const [prevLesson, setPrevLesson] = useState();
    const [showMobileList, setShowMobileList] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasQuiz, setHasQuiz] = useState(false);

    useEffect(() => {

        let mounted = true;

        const fetchData = async () => {

            await Axios.get(`/api/courses/${id}/lessons`)
                .then(res => res.data)
                .then(data => {
                    if(mounted){
                        if (!data.error) {
                            setLessons(data.lessons)
                        } else {
                            console.log(data.error)
                        }
                    }
                    
                })

            if(mounted){
                setIsLoading(false);
            }
        }

        const checkQuizExist = () => {
            Axios.post('/api/check-quiz-exist', {
                course_id: id
            })
            .then(res => res.data)
            .then(data => {
                if(data.hasQuiz){
                    setHasQuiz(true)
                }else{
                    setHasQuiz(false)
                }
            })
        }

        if (id) {
            fetchData();
            checkQuizExist();
        }

        return () => {
            mounted = false;
        }

    }, [id])


    useEffect(() => {

        if(lessons.length > 0){
            let currentLesson = lessons?.find(item => item.id == lesson_id)
            setCurrentLesson(currentLesson);
            if(currentLesson.order > 1){
                setPrevLesson(lessons.find((item => item.order == currentLesson.order-1)))
            }
            if(currentLesson.order == 1){
                setPrevLesson()
            }
            if(currentLesson.order < lessons.length){
                setNextLesson(lessons.find((item => item.order == currentLesson.order+1)))
            }
            if(currentLesson.order == lessons.length){
                setNextLesson()
            }
        }

    }, [lessons, lesson_id])

    useEffect(() => {

        let mounted = true;

        if (user.isAuth === true) {
            Axios.post('/api/check-enrolled', {
                course_id: id,
                user_id: user.id
            })
                .then(res => res.data)
                .then(data => {
                    if (!data.error) {
                        if(mounted){
                            if (data.isEnrolled) {
                                setIsEnrolled(true);
                            } else {
                                setIsEnrolled(false)
                                if(lessons.length > 0 && lessons?.find(item => item.id == lesson_id)?.trial == 0 && user.role !== 'admin'){
                                    history.push(`/courses/${id}`)
                                }
                            }
                        }
                    }
                })
        }else{
            if(currentLesson && currentLesson.trial !== 1){
                history.push(`/courses/${id}`)
            }
        }

        return () => {
            mounted = false;
        }
    }, [user, currentLesson])

    useEffect(() => {

        let mounted = true;

        if(user.isAuth){
            Axios.post('/api/get-finished-lessons', {
                course_id: id,
                user_id: user.id
            })
                .then(res => res.data)
                .then(data => {
                    if(mounted){
                        if (!data.error) {
                            setFinishedLessons(data.finishedLessons)
                        } else {
                            console.log(data.error)
                        }
                    }
                })
        }

        return () => {
            mounted = false;
        }

    }, [user.isAuth, lesson_id])

    useEffect(() => {

        if(currentLesson){
            document.title = `${currentLesson?.title} - MeLearn.Guru`
        }

    }, [currentLesson])

    return (
        <div className={LessonStyles.container}>
            <div className={LessonStyles.tab} onClick={() => setShowMobileList(prev => !prev)}>
                <p>所有課堂</p>
                <img src={showMobileList ? ArrowUp : ArrowDown} alt="show/hide button"/>
            </div>
            <LessonList lessons={lessons} isEnrolled={isEnrolled} finishedLessons={finishedLessons} instructor={tutor} showMobileList={showMobileList} setShowMobileList={(val) => setShowMobileList(val)} isLoading={isLoading} hasQuiz={hasQuiz}/>
            <LessonContent course={course} lesson={currentLesson} isEnrolled={isEnrolled} finishedLessons={finishedLessons} lessonNumber={lessons.length} studentNumber={studentNum} instructor={tutor}
            nextLesson={nextLesson} prevLesson={prevLesson} setFinishedLessons={(val) => setFinishedLessons(val)} showMobileList={showMobileList} isLoading={isLoading} hasQuiz={hasQuiz}/>
        </div>
    )
}

export default Lesson
