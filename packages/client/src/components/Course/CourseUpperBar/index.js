import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Axios from 'axios';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { removeCartItem, addCartItem } from 'redux/actions/cart';
import { setFavourite } from 'redux/actions/user';
import { setCartPopup } from 'redux/actions/global_setting';
import { setCheckoutItems, setSubtotal } from 'redux/actions/checkout';


//styles
import CourseUpperBarStyles from './CourseUpperBar.module.scss'

//images
import lessonIcon from 'images/icon/lesson@3x.png'
import studentIcon from 'images/icon/student_white@3x.png'
import coloredStudentIcon from 'images/icon/student@3x.png'
import favIcon from 'images/icon/btn_favourite_white@3x.png'
import shareIcon from 'images/icon/share@3x.png'

const CourseUpperBar = ({ course, tutor, lessonNumber, studentNumber, isEnrolled, lastLesson, finishedLessons, lessonToStart, isLoading }) => {

    const dispatch = useDispatch();
    const history = useHistory();

    const user = useSelector(store => store.user);
    const cart = useSelector(store => store.cart);

    const [discountPrice, setDiscountPrice] = useState();
    const [showCopiedText, setShowCopiedText] = useState(false);

    const { id } = useParams();

    const addToFavourite = () => {
        Axios.post('/api/favourite', {
            course_id: course.id
        })
            .then(res => res.data)
            .then(data => {
                if (!data.error) {
                    dispatch(setFavourite(data.favourite_courses));
                } else {
                    console.log(data.error);
                }
            })
    }

    const addToCart = () => {
        if (cart.find(item => item.course_id === course.id)) {
            dispatch(removeCartItem(course.id))
        } else {
            let cartItem = {
                course_id: course.id,
                title: course.title,
                price: course.price,
                discount_start: course.discount_start,
                discount_end: course.discount_end,
                discount_price: course.discount_price,
                discount_text: course.discount_text,
                tutor_name: tutor.name,
                tutor_avator: tutor.avator,
                cover_img: course.cover_img,
                lesson_num: lessonNumber,
                duration: course.duration
            }
            dispatch(addCartItem(cartItem));
            dispatch(setCartPopup(true))
        }

        if (user.isAuth) {
            Axios.post('/api/cart', {
                course_id: course.id
            })
                .then(res => {
                })
                .catch(err => {
                    console.log(err)
                })
        }

    }

    useEffect(() => {

        if (course) {
            if ((course.discount_start && new Date(course.discount_start) < new Date()) && course.discount_price) {
                setDiscountPrice(course.discount_price)
            }
            if (!course.discount_start && course.discount_price) {
                setDiscountPrice(course.discount_price)
            }
        }

    }, [course])

    const handlePurchase = () => {

        let item = {
            course_id: course.id,
            title: course.title,
            price: course.price,
            discount_price: discountPrice || null,
            discount_text: course.discount_text,
            tutor_name: tutor.name,
            tutor_avator: tutor.avator,
            cover_img: course.cover_img,
            lesson_num: lessonNumber,
            duration: course.duration
        }

        dispatch(setCheckoutItems([item]));
        dispatch(setSubtotal(course.discount_price || course.price))
        history.push('/checkout');
    }

    const startLesson = () => {
        if(lessonToStart){
            history.push(`/courses/${id}/lessons/${lessonToStart.id}`)
        }
    }

    const shareBtnClicked = () => {
        const url = window.location.href;

        const el = document.createElement('textarea');
        el.value = url;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        setShowCopiedText(true);
    }

    useEffect(() => {

        const hideCopiedText = () => {
            setShowCopiedText(false);
        }

        if(showCopiedText){
            let timeFunction = window.setTimeout(hideCopiedText, 3000);
    
            return () => {
                window.clearTimeout(timeFunction);
            }
        }

    }, [showCopiedText])


    return (
        <div className={CourseUpperBarStyles.upperBar}>
            <p className={`${CourseUpperBarStyles.copiedText} ${showCopiedText ? CourseUpperBarStyles.showCopiedText : CourseUpperBarStyles.hideCopiedText}`}>已複製課程連結</p>
            {!isLoading ? <div className={CourseUpperBarStyles.upperBarWrapper}>
                <div className={CourseUpperBarStyles.left}>
                    {isEnrolled && <div className={CourseUpperBarStyles.enrolledBadge}>已報讀</div>}
                    <h1 className={CourseUpperBarStyles.title}>{course?.title}</h1>
                    <div className={CourseUpperBarStyles.subtitleBar}>
                        <div className={CourseUpperBarStyles.instructor}>
                            <img src={tutor?.avator} className={CourseUpperBarStyles.instructorAvator} alt={tutor?.name}/>
                            <p className={CourseUpperBarStyles.subtitleText}>{tutor?.name}</p>
                        </div>
                        <div className={CourseUpperBarStyles.numbersContainer}>
                            <img src={lessonIcon} className={CourseUpperBarStyles.icon} alt="lesosn icon"/>
                            <p className={CourseUpperBarStyles.subtitleText}>{lessonNumber}課節</p>
                        </div>
                        {course?.display_number ? <div className={CourseUpperBarStyles.numbersContainer}>
                            <img src={studentIcon} className={CourseUpperBarStyles.icon} alt="student icon"/>
                            <p className={CourseUpperBarStyles.subtitleText}>{studentNumber}名學生</p>
                        </div> : ''}
                    </div>
                    <div className={CourseUpperBarStyles.specContainer}>
                        <p className={CourseUpperBarStyles.spec}>規格：{course.spec}</p>
                        <p className={CourseUpperBarStyles.spec}>時長：{course.duration}分鐘</p>
                        <p className={CourseUpperBarStyles.spec}>GS1編號：{course.gs1}</p>
                        {!isEnrolled && <p className={CourseUpperBarStyles.spec}>正價：{course.price ? `HK$${(course.price).toLocaleString('en-US')}.00` : '稍後公佈' }</p>}
                        {isEnrolled && lastLesson && <p className={CourseUpperBarStyles.spec}>上次上課日期：{lastLesson}</p>}
                    </div>
                    {isEnrolled &&
                        <div className={CourseUpperBarStyles.progressBarContainer}>
                            <div className={CourseUpperBarStyles.progressBar}>
                                <div style={{ width: `${(finishedLessons.length / lessonNumber * 100)}%` }} className={CourseUpperBarStyles.currentProgress}>
                                    <div className={CourseUpperBarStyles.currentProgressIndicator}></div>
                                </div>
                            </div>
                            <label className={CourseUpperBarStyles.progressPercent}>{Math.floor(finishedLessons.length / lessonNumber * 100)}%</label>
                        </div>}
                    <div className={CourseUpperBarStyles.buttonGroup}>
                        {(user.isAuth && user.role !== 'admin') && <button className={`${CourseUpperBarStyles.btn} ${CourseUpperBarStyles.favouriteBtn}`} onClick={addToFavourite}><img src={favIcon} className={CourseUpperBarStyles.btnIcon} alt="favourite icon"/>{user.favourite_courses?.find(fav_course => fav_course.id === course.id) ? '從我的最愛中移除' : '加入我的最愛'}</button>}
                        {((isEnrolled || user.role === 'admin') && (lessonToStart)) && <button className={`${CourseUpperBarStyles.btn} ${CourseUpperBarStyles.continueBtn}`} onClick={startLesson}>{lessonToStart?.order === 1 ? '開始上課' : '繼續課堂'}</button>}
                        <button className={CourseUpperBarStyles.btn} onClick={shareBtnClicked}><img src={shareIcon} className={CourseUpperBarStyles.btnIcon} alt="share icon"/>分享</button>
                    </div>
                </div>
                <div className={CourseUpperBarStyles.right}>
                    {isEnrolled && <img src={course?.cover_img} className={CourseUpperBarStyles.largeCoverImg} alt={course?.title}/>}
                    {!isEnrolled && <div className={CourseUpperBarStyles.courseCard}>
                        <img src={course?.cover_img} className={CourseUpperBarStyles.coverImg} alt={course?.title}/>
                        <div className={CourseUpperBarStyles.cardContent}>
                            {course.display_number ? <p className={CourseUpperBarStyles.enrollNum}><img src={coloredStudentIcon} className={CourseUpperBarStyles.btnIcon} alt="student icon"/>{studentNumber}名學生已報讀</p> : ''}
                            <div className={CourseUpperBarStyles.originalPrice}>
                                {course.price ? <p className={CourseUpperBarStyles.price}>
                                    {discountPrice && <span className={CourseUpperBarStyles.crossout}></span>}
                                HK${`${(course?.price).toLocaleString('en-US')}.00`}
                                </p> : <p className={CourseUpperBarStyles.tbc}>稍後公佈</p>}

                            </div>
                            {discountPrice && <div className={CourseUpperBarStyles.discountContainer}>
                                <p className={CourseUpperBarStyles.calculatedDisocunt}>節省HK${course.price - discountPrice}</p>
                                <p className={CourseUpperBarStyles.discountPrice}>{course?.discount_text} HK${discountPrice}</p>
                            </div>}
                            {course.price && (!user.pending_courses?.find(id => id === course.id) ? <div className={CourseUpperBarStyles.cardBtnGroup}>
                                <button className={CourseUpperBarStyles.cartBtn} onClick={addToCart}>{cart.find(item => item.course_id === course.id) ? '從購物車中移除' : '新增至購物車'}</button>
                                {!cart.find(item => item.course_id === course.id) && <button className={CourseUpperBarStyles.purchaseBtn} onClick={handlePurchase}>立即購買</button>}
                            </div> : <div className={CourseUpperBarStyles.cardBtnGroup}>
                                <p className={CourseUpperBarStyles.purchasedText}>已購買課程，請等待我們審批</p>
                            </div>)}

                        </div>
                    </div>}
                </div>
            </div> : <div className={CourseUpperBarStyles.skeleton}>
                <div className={CourseUpperBarStyles.upperBarWrapper}>
                        <div className={CourseUpperBarStyles.left}>
                            <div className={CourseUpperBarStyles.titleSkeleton}></div>
                            <div className={CourseUpperBarStyles.subtitleBarSkeleton}></div>
                            <div className={CourseUpperBarStyles.specContainer}>
                                <div className={CourseUpperBarStyles.specSkeleton}></div>
                                <div className={CourseUpperBarStyles.specSkeleton}></div>
                                <div className={CourseUpperBarStyles.specSkeleton}></div>
                            </div>
                        </div>
                        <div className={CourseUpperBarStyles.right}>
                            <div className={CourseUpperBarStyles.imgSkeleton}></div>
                        </div>
                </div>
            </div>}
        </div>

    )
}

export default CourseUpperBar
