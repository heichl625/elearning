import React, { useEffect, useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

//redux
import { useSelector } from 'react-redux';

//component
import HoverCard from '../HoverCard'

//styles
import CourseCardStyles from './CourseCard.module.scss';

//images
import studentImg from 'images/icon/student@3x.png';

const CourseCard = ({ course }) => {

    const enrolled_courses = useSelector(store => store.user.enrolled_courses);

    const [showDetailCard, setShowDetailCard] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const [discountPrice, setDiscountPrice] = useState();
    const divRef = useRef(null)

    const location = useLocation();
   

    const handleMouseEnter = () => {
        setShowDetailCard(true)
    }

    const handleMouseLeave = () => {
        setShowDetailCard(false)
    }

    useEffect(() => {

        if(course){
            if((course.discount_start && new Date(course.discount_start) < new Date()) && course.discount_price){
                setDiscountPrice(course.discount_price)
            }
            if(!course.discount_start && course.discount_price){
                setDiscountPrice(course.discount_price)
            }
        }

    }, [course])
    
    return (
        <div className={CourseCardStyles.cardContainer}>
            <div className={CourseCardStyles.card} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} ref={divRef}>

                {showDetailCard && <HoverCard course={course}/>}
                <Link to={`/courses/${course?.id}`} className={`${CourseCardStyles.coverContianer} ${location.pathname.includes('courses') ? CourseCardStyles.largerCoverContainer : ''}`}>
                    {loading && <div className={CourseCardStyles.coverSkeleton}></div>}
                    <img src={course.cover_img} className={`${CourseCardStyles.cover} ${loading ? CourseCardStyles.hidden : ''}`} onLoad={() => setLoading(false)} alt={course.title}/>
                </Link>

                {enrolled_courses.find(enrolled_course => enrolled_course.id === course.id) && <div className={CourseCardStyles.enrolledBadge}>
                    已報讀
                </div>}

                <div className={CourseCardStyles.infoContainer}>
                    <h3 className={CourseCardStyles.title}>{course.title}</h3>
                    <div className={CourseCardStyles.bottomContainer}>
                        <div className={CourseCardStyles.bottomTopContainer}>
                            <div className={CourseCardStyles.tutorBar}>
                                <img src={course.tutor_avator} className={CourseCardStyles.tutorAvator} alt={course.tutor_name}/>
                                <Link to={`/instructor/${course.tutor_id}`} className={CourseCardStyles.tutorName}>{course.tutor_name}</Link>
                            </div>
                            {discountPrice && <p className={CourseCardStyles.calculatedDiscount}>節省HK${course.price - discountPrice}.00</p>}
                        </div>
                        <div className={`${CourseCardStyles.priceContainer} ${!discountPrice ? CourseCardStyles.normalPriceContainer : ''}`}>
                            {discountPrice && <p className={CourseCardStyles.discount}>{course.discount_text} HK${discountPrice}.00</p>}
                            
                        </div>
                        <div className={CourseCardStyles.bottomBottomContainer}>
                            {course.display_number === 1 && <div className={CourseCardStyles.numberOfStudent}><img src={studentImg} className={CourseCardStyles.studentIcon} alt="student icon"/>{course.total_student}名學生</div>}
                            {course.price ? (
                                <p className={CourseCardStyles.price}>{discountPrice && <span className={CourseCardStyles.crossOutPrice}></span>}HK${course.price}.00</p>
                            ) : <p className={CourseCardStyles.tbc}>稍後公佈</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseCard
