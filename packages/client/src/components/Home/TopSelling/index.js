import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Axios from 'axios'

//component
import SectionTitle from '../SectionTitle';
import CourseList from '../../CourseList';
import CourseCardSkeleton from '../../CourseCardSkeleton';

//images
import rightArrow from 'images/icon/arrow_right@3x.png'

//styles
import TopSellingStyles from './TopSelling.module.scss';

const TopSelling = () => {

    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        let mounted = true;

        Axios.get('/api/top-selling')
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
        <div className={`${TopSellingStyles.container} ${!isLoading && courses.length === 0 ? TopSellingStyles.hide : ''}`}>
            <div className={TopSellingStyles.topContainer}>
                <SectionTitle title='暢銷課程' className={TopSellingStyles.title}/>
                <Link className={TopSellingStyles.more} to='/courses?sortby=topselling'>更多暢銷課程<img src={rightArrow} className={TopSellingStyles.rightArrow} alt="more button"/></Link>
            </div>
            {isLoading ? <CourseCardSkeleton /> : <CourseList courses={courses}/> }
            <Link className={TopSellingStyles.mobileMore} to='/courses?sortby=topselling'>更多暢銷課程<img src={rightArrow} className={TopSellingStyles.rightArrow} alt="more button"/></Link>

        </div>
    )
}

export default TopSelling
