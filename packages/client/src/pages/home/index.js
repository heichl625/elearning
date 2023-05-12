import React, { useEffect } from 'react';
import Axios from 'axios';

//redux
import { useDispatch, useSelector } from 'react-redux';
import { setEnrolledCourses, setPendingCourses } from 'redux/actions/user';

//components
import ContactUs from '../../components/ContactUs';
import Carousel from 'components/Home/Carousel';
import FreeTrial from 'components/Home/FreeTrial';
import TopSelling from 'components/Home/TopSelling';
import NewCourses from 'components/Home/NewCourses';
import EarlyBird from 'components/Home/EarlyBird';

const Home = () => {

    const dispatch = useDispatch();

    const isAuth = useSelector(store => store.user.isAuth);

    useEffect(() => {

        let mounted = true;

        if(isAuth){
            Axios.get('/api/enrolled-courses')
            .then(res => res.data)
            .then(data => {
                if(mounted){
                    dispatch(setEnrolledCourses(data.enrolledCourses));
                }
            })
            Axios.get('/api/pending-course')
            .then(res => res.data)
            .then(data => {
                if(mounted){
                    dispatch(setPendingCourses(data.pendingCourses));
                }
            })
        }

        return () => {
            mounted = false;
        }
        
    }, [isAuth])

    useEffect(() => {

        document.title = 'MeLearn.Guru 自在學';
        console.log({
            BASE_URL: process.env.REACT_APP_BASE_URL,
            DOMAIN: process.env.REACT_APP_DOMAIN,
        })

    }, [])

    return (
        <div>
            <Carousel />
            <FreeTrial />
            <TopSelling />
            <NewCourses />
            <EarlyBird />
            <ContactUs />
        </div>

    )
}

export default Home
