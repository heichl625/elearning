import React, { useRef, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation } from 'swiper';
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';


import CourseCard from 'components/CourseCard';
import './Carousel.scss';


import CourseListStyles from './CourseList.module.scss';
import leftArrow from 'images/icon/arrow_left@3x.png';
import rightArrow from 'images/icon/arrow_right@3x.png';

SwiperCore.use([Navigation]);

const CourseList = ({ courses }) => {

    const navigationPrevRef = useRef(null)
    const navigationNextRef = useRef(null)

    const [screenSize, setScreenSize] = useState(window.innerWidth);

    useEffect(() => {

        function handleResize(){
            setScreenSize(window.innerWidth);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }

    }, [])

    return (
        <>
            {screenSize > 992 ? <div className={CourseListStyles.coursesListContainer}>
                {courses?.map((course, index) => {
                    return (
                        <CourseCard course={course} key={uuidv4()} />
                    )
                })}
            </div> : <Swiper
                spaceBetween={30}
                slidesPerView={1.6}
                navigation={{
                    prevEl: navigationPrevRef.current,
                    nextEl: navigationNextRef.current
                }}
                onInit={(swiper) => {
                    swiper.params.navigation.prevEl = navigationPrevRef.current;
                    swiper.params.navigation.nextEl = navigationNextRef.current;
                    swiper.navigation.init();
                    swiper.navigation.update();
                  }}
                onBeforeInit={(swiper) => {
                    swiper.params.navigation.prevEl = navigationPrevRef.current;
                    swiper.params.navigation.nextEl = navigationNextRef.current;
               }}
                centeredSlides={true}
                loop={courses?.length > 1 ? true : false}
                initialSlide={0}
                className={CourseListStyles.swiper}
                breakpoints={{
                    768: {
                        spaceBetween: 30,
                        slidesPerView: 1.7
                    }
                }}
            >
                {courses?.map((course, index) => {
                    return (<SwiperSlide className={CourseListStyles.slide} key={uuidv4()}> 
                        <CourseCard course={course} key={uuidv4()} />
                    </SwiperSlide>)
                })}
                <div ref={navigationPrevRef} className={`${CourseListStyles.leftArrow} ${courses.length <= 1 ? CourseListStyles.hiddenArrow : ''}`}>
                    <img src={leftArrow} alt="Carousel previous item button"/>
                </div>
                <div ref={navigationNextRef} className={`${CourseListStyles.rightArrow} ${courses.length <= 1 ? CourseListStyles.hiddenArrow : ''}`}>
                    <img src={rightArrow} alt="Carousel next item button"/>
                </div>
            </Swiper>}
            

        </>
    )
}

export default CourseList
