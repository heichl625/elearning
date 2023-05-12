import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Route, Redirect, useHistory } from 'react-router-dom';

import { useSelector } from 'react-redux';

const CourseRoute = ({component: Component, path, ...rest }) => {

    const isAuth = useSelector(store => store.user.isAuth)
    const role = useSelector(store => store.user.role)
    const [published, setPublished] = useState();
    const [courseDeveloper, setCourseDeveloper] = useState();
    const [userBelongs, setUserBelongs] = useState();
    const [id, setID] = useState(rest.computedMatch.params.id);
    const [course, setCourse] = useState();
    const [tutor, setTutor] = useState();
    const [studentNumber, setStudentNumber] = useState();
    const [finishedFetching, setFinishedFetching] = useState(false);

    const history = useHistory()

    useEffect(() => {

        if(role === 'course_developer'){
            Axios.get('/api/get-course-developer-id')
                .then(res => res.data)
                .then(data => {
                    if(!data.error){
                        setUserBelongs(data.course_developer_id);
                    }
                })
        }

    }, [role])

    useEffect(() => {

        if(id){
            Axios.get(`/api/courses/${id}`)
            .then(res => res.data)
            .then(data => {
                if(!data.error){
                    if(!data.course){
                        history.push('/');
                        return;
                    }
                    if(data.course.published === 1){
                        setPublished(true);

                    }else{
                        setPublished(false);
                        
                    }
                    if(data.tutor){
                        setCourseDeveloper(data.tutor.course_developer_id);
                    }
                    setCourse(data.course);
                    if(data.student_number){
                        setStudentNumber(data.student_number);
                    }
                    setTutor(data.tutor);
                    setFinishedFetching(true)
                }
            })
        }


    }, [id])


    return (
        
       <Route {...rest} render={props => {

            return (published === true || role === 'admin' || (userBelongs && courseDeveloper && role === 'course_developer' && userBelongs === courseDeveloper)) ? <Component {...props} course={course} tutor={tutor} studentNumber={studentNumber}/> : (published === false && ((role === 'user' && isAuth === true) || (published === false && isAuth === false) || (userBelongs && courseDeveloper && role === 'course_developer' && userBelongs !== courseDeveloper))) ? <Redirect to='/' /> : null
            
       }} />
    )
}

export default CourseRoute
