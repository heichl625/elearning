import React from 'react'
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'

//redux
import { useSelector } from 'react-redux';

//component
import Spinner from 'components/Spinner';

import EnrolledCoursesListStyles from './EnrolledCoursesList.module.scss';

const EnrolledCoursesList = ({ enrolledCourses }) => {

    const loading = useSelector(store => store.global_setting.loading)

    return (
        <div className={EnrolledCoursesListStyles.container}>
            <p className={EnrolledCoursesListStyles.courseNum}>共{enrolledCourses.length}個課程</p>
            {loading ? <Spinner /> : (enrolledCourses?.length > 0 && enrolledCourses.map(course => {
                return <div className={EnrolledCoursesListStyles.courseBlock} key={uuidv4()}>
                    <div className={EnrolledCoursesListStyles.courseInfoContainer}>
                        <div className={EnrolledCoursesListStyles.top}>
                            <div className={EnrolledCoursesListStyles.left}>
                                <Link to={`/courses/${course.course_id}`}><img src={course.cover_img} className={EnrolledCoursesListStyles.courseCover} alt={course.title}/></Link>
                                
                                <div className={EnrolledCoursesListStyles.courseDesc}>
                                    <Link className={EnrolledCoursesListStyles.courseTitle} to={`/courses/${course.course_id}`}>{course.title}</Link>
                                    <p className={EnrolledCoursesListStyles.desc}>{course.tutor_name}．共{course.lessonNum}堂</p>
                                </div>
                            </div>
                            <div className={EnrolledCoursesListStyles.right}>
                                <div className={EnrolledCoursesListStyles.progressContainer}>
                                    <div className={EnrolledCoursesListStyles.progressGroup}>
                                        <p className={EnrolledCoursesListStyles.greyLabel}>課程進度</p>
                                        {course.progressCount === course.lessonNum ? <h3 className={EnrolledCoursesListStyles.finishedText}>已完成</h3> : <h3 className={EnrolledCoursesListStyles.percentageText}>{Math.floor((course.progressCount / course.lessonNum) * 100)}%</h3>}
                                    </div>
                                    {course.hasQuiz === true && <div className={EnrolledCoursesListStyles.progressGroup}>
                                        <p className={EnrolledCoursesListStyles.greyLabel}>測驗成績</p>
                                        {course.answeredQuiz.length === 0 && <h3 className={EnrolledCoursesListStyles.pendingText}>未測驗</h3>}
                                        {course.answeredQuiz.length > 0 && (Math.floor(course.answeredQuiz.filter(question => question.status === 'correct').length / course.answeredQuiz.length * 100) >= 70 ? <h3 className={EnrolledCoursesListStyles.finishedText}>合格</h3> : <h3 className={EnrolledCoursesListStyles.failedText}>不合格</h3>)}
                                    </div>}
                                </div>
                            </div>
                        </div>
                        {course.hasQuiz && course.answeredQuiz.length > 0 && <div className={EnrolledCoursesListStyles.bottom}>
                            {(course.answeredQuiz.length > 0 && Math.floor(course.answeredQuiz.filter(question => question.status === 'correct').length/course.answeredQuiz.length*100 >= 70)) ?  <Link to={`/quiz/${course.course_id}`} className={EnrolledCoursesListStyles.checkAnswerBtn}>查看考卷</Link> : null}
                            {course.answeredQuiz.length > 0 && Math.floor(course.answeredQuiz.filter(question => question.status === 'correct').length / course.answeredQuiz.length*100 < 70) ? <Link to={`/quiz/${course.course_id}`} className={EnrolledCoursesListStyles.testAgainBtn}>重新測驗</Link> : null}
                        </div>}

                    </div>
                </div>
            }))}
        </div >
    )
}

export default EnrolledCoursesList
