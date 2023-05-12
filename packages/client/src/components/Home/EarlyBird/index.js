import React, { useEffect, useState} from 'react';
import { Link } from 'react-router-dom'
import Axios from 'axios';

//styles
import EarlyBirdStyles from './EarlyBird.module.scss';

//component
import SectionTitle from '../SectionTitle';
import CourseList from '../../CourseList';
import CourseCardSkeleton from '../../CourseCardSkeleton';

//images
import rightArrow from 'images/icon/arrow_right@3x.png';

const EarlyBird = () => {

    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        let mounted = true;

        Axios.get('/api/early-bird')
        .then(res => res.data)
        .then(data => {
            if(!data.error && mounted){
                setCourses(data.courses)
                setIsLoading(false);
            }
        })

        return () => {
            mounted = false;
        }

    }, [])

    return (
        <div className={`${EarlyBirdStyles.container} ${(!isLoading && courses.length === 0) ? EarlyBirdStyles.hide : ''}`}>

            <div className={EarlyBirdStyles.topContainer}>
                <SectionTitle title='早鳥課程' className={EarlyBirdStyles.title}/>
                <Link className={EarlyBirdStyles.more} to='/courses?type=earlybird'>更多早鳥課程<img src={rightArrow} className={EarlyBirdStyles.rightArrow} alt="more icon"/></Link>
            </div>
            {isLoading ? <CourseCardSkeleton /> : <CourseList courses={courses}/>}
            <Link className={EarlyBirdStyles.mobileMore} to='/courses?type=earlybird'>更多早鳥課程<img src={rightArrow} className={EarlyBirdStyles.rightArrow} alt="more icon"/></Link>


        </div>
    )
}

export default EarlyBird
