import React, { useEffect, useState, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import Axios from 'axios'
import Player from '@vimeo/player';
import { Vimeo } from 'vimeo';
import { v4 as uuidv4 } from 'uuid';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation } from 'swiper';
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';
import './Carousel.scss'

//styles
import FreeTrialStyles from './FreeTrial.module.scss';

//images
import playBtn from 'images/icon/video_play_small@3x.png';
import videoPlayBtn from 'images/icon/video_play_large@3x.png';
import leftArrow from 'images/icon/arrow_left@3x.png';
import rightArrow from 'images/icon/arrow_right@3x.png';

SwiperCore.use([Navigation]);

const FreeTrial = () => {

    const history = useHistory();

    const [courses, setCourses] = useState([]);
    const [mobileVideo, setMobileVideo] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [player, setPlayer] = useState();
    const mobileActiveVideo = useRef(null)
    const [showPlayBtn, setShowPlayBtn] = useState(true);
    const [mobileSwiper, setMobileSwiper] = useState();
    const navigationPrevRef = useRef(null)
    const navigationNextRef = useRef(null)
    const [isMobile, setIsMobile] = useState(window.innerWidth > 992 ? false : true);

    useEffect(() => {

        function handleResize(){
            if(window.innerWidth > 992){
                setIsMobile(false);
            }else{
                setIsMobile(true);
            }
            
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }

    }, [])

    useEffect(() => {

        let mounted = true;

        Axios.get('/api/trial_courses')
            .then(res => res.data)
            .then(data => {
                if (!data.error && mounted) {
                    setCourses(data.courses);
                }
            })

        return () => {
            mounted = false;
        }

    }, [])

    useEffect(() => {

        let mounted = true;

        if (courses.length > 0 && isMobile && mobileVideo.length === 0) {
            for (const course of courses) {

                Axios.get(`https://vimeo.com/api/oembed.json?url=${course.video_url}`, {
                    transformRequest: [(data, headers) => {
                        delete headers.common['Authorization']
                        return data
                    }]
                }
)
                    .then(res => res.data)
                    .then(data => {
                        if(mounted){
                            setMobileVideo(prev => ({
                                ...prev,
                                [course.id]: data
                            }))
                        }
                    })
                    .catch(err => {
                        console.log('failed to fetch')
                    })
            }

            return () => {
                mounted = false;
            }

        }


    }, [courses, isMobile])

    useEffect(() => {

        // if(!isMobile){
            if (courses[currentIndex]) {
                if (!player) {
                    let options = {
                        url: courses[currentIndex].video_url,
                        width: "784",
                        height: "445",
                        controls: 'true'
                    }
                    setPlayer(new Player('free-trial-video', options))
                } else {
                    try{
                        player.loadVideo(courses[currentIndex].video_url.split('https://vimeo.com/')[1])
                    }catch(err){
                        console.log(err);
                    }
                }
    
            }
        // }

    }, [courses, currentIndex])

    useEffect(() => {

        if(isMobile && player){
            player.pause();
            setShowPlayBtn(true);
        }

    }, [isMobile, player])

    const playVideo = () => {
        if (showPlayBtn) {
            player.play();
            setShowPlayBtn(false);
        } else {
            player.pause();
            setShowPlayBtn(true);
        }

    }

    const handleTutorClick = (id) => {
        history.push(`/courses?instructor=${id}`)
    }

    return (
        <div className={FreeTrialStyles.container}>

            {/* <img src={background} className={FreeTrialStyles.background} alt="homepage backdrop"/> */}

            <div className={FreeTrialStyles.videoSectionContainer}>
                
                <div className={`${FreeTrialStyles.videoContainer} ${isMobile ? FreeTrialStyles.hide : ''}`}>

                    <div id="free-trial-video" className={FreeTrialStyles.video}></div>
                    {/* <div className={FreeTrialStyles.videoOverlay} onClick={playVideo}>
                        {showPlayBtn && <img className={FreeTrialStyles.videoPlayBtn} src={videoPlayBtn} alt="video play button"/>}
                    </div> */}
                    {!player && <div className={FreeTrialStyles.videoSkeleton}></div>}

                </div>
                <h3 className={FreeTrialStyles.selectedCourseTitle}><span className={FreeTrialStyles.line}></span>{courses[currentIndex]?.title}</h3>
            </div>
            <div className={FreeTrialStyles.videoSelector}>
                <div className={FreeTrialStyles.sectionTitleContainer}>
                    <h1 className={FreeTrialStyles.sectionTitle}>免費試看</h1>
                    <div className={FreeTrialStyles.divider}></div>
                </div>
                {(courses.length > 0 && isMobile) ? <Swiper
                    spaceBetween={30}
                    slidesPerView={1.5}
                    navigation={{
                        prevEl: navigationPrevRef.current,
                        nextEl: navigationNextRef.current
                    }}
                    centeredSlides={true}
                    onSlideChange={() => setCurrentIndex(mobileSwiper?.realIndex || 0)}
                    onSwiper={(swiper) => setMobileSwiper(swiper)}
                    loop={true}
                    initialSlide={0}
                    className={FreeTrialStyles.swiper}
                >
                    {courses?.map((course, index) => {
                        return <SwiperSlide className={FreeTrialStyles.slide} key={uuidv4()}>{({ isActive }) => (
                            <div className={FreeTrialStyles.mobileVideoContainer}>
                                <img src={mobileVideo[course.id]?.thumbnail_url_with_play_button} className={FreeTrialStyles.mobileThumbnails} alt="trial video thumbnail"/>
                                {isActive && <div ref={mobileActiveVideo} dangerouslySetInnerHTML={{ __html: mobileVideo[courses[currentIndex].id]?.html }}></div>}
                            </div>
                        )}</SwiperSlide>
                    })}
                    <div ref={navigationPrevRef} className={FreeTrialStyles.leftArrow}>
                        <img src={leftArrow} alt="carousel previous item button"/>
                    </div>
                    <div ref={navigationNextRef} className={FreeTrialStyles.rightArrow}>
                        <img src={rightArrow} alt="carousel next item button"/>
                    </div>
                </Swiper> : <div className={FreeTrialStyles.mobileVideoSkeleton}>
                    <div className={FreeTrialStyles.mobileLeftVideoSkeleton}></div>
                    <div className={FreeTrialStyles.mobileCenterVideoSkeleton}></div>
                    <div className={FreeTrialStyles.mobileRightVideoSkeleton}></div>
                </div>}
                <h3 className={FreeTrialStyles.mobileVideoTitle}>{courses[currentIndex]?.title}</h3>


                <div className={FreeTrialStyles.coursesContainer}>
                    {
                        courses.length > 0 ? courses.map((course, index) => {
                            if (index !== currentIndex) {
                                return (
                                    <div className={FreeTrialStyles.courseCard} key={`trial_vidoe_${index}`}>
                                        <img className={FreeTrialStyles.courseImg} src={course?.cover_img} alt={course?.title}/>
                                        <div className={FreeTrialStyles.courseInfo}>
                                            <h3 className={FreeTrialStyles.courseTitle}>{course?.title}</h3>
                                            <div className={FreeTrialStyles.courseCardBottom}>
                                                <div className={FreeTrialStyles.instructorContainer} onClick={() => handleTutorClick(course.tutor_id)}>
                                                    <img className={FreeTrialStyles.instructorAvator} src={course?.avator} alt={course.name}/>
                                                    <p className={FreeTrialStyles.instructorName}>{course?.name}</p>
                                                </div>
                                                <div className={FreeTrialStyles.playButtonGroup} onClick={() => setCurrentIndex(index)}>
                                                    <p className={FreeTrialStyles.playLabel}>播放</p>
                                                    <img src={playBtn} className={FreeTrialStyles.playBtn} alt="play button"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            } else {
                                return
                            }
                        }) : <div className={FreeTrialStyles.courseCardSkeletonContiainer}>
                            <div className={FreeTrialStyles.courseCard}>
                                <div className={FreeTrialStyles.courseImgSkeleton}></div>
                                <div className={FreeTrialStyles.courseInfo}>
                                    <div className={FreeTrialStyles.courseTitleSkeleton}></div>
                                    <div className={FreeTrialStyles.courseCardBottomSkeleton}>
                                    </div>
                                </div>
                            </div>
                            <div className={FreeTrialStyles.courseCard}>
                                <div className={FreeTrialStyles.courseImgSkeleton}></div>
                                <div className={FreeTrialStyles.courseInfo}>
                                    <div className={FreeTrialStyles.courseTitleSkeleton}></div>
                                    <div className={FreeTrialStyles.courseCardBottomSkeleton}>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>

            </div>
        </div>
    )
}

export default FreeTrial
