import React, { useEffect, useState, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Axios from 'axios'

//redux
import { useSelector, useDispatch } from 'react-redux';
import { setFavourite } from 'redux/actions/user';
import { setCheckoutItems, setSubtotal } from 'redux/actions/checkout';
import { addCartItem, removeCartItem } from 'redux/actions/cart';
import { setCartPopup } from 'redux/actions/global_setting';

//styles
import HoverCardStyles from './HoverCard.module.scss'

//images
import favouriteOff from 'images/icon/btn_favourite_off@3x.png';
import favouriteOn from 'images/icon/btn_favourite_on@3x.png';

const HoverCard = ({ course }) => {

    const dispatch = useDispatch();
    const history = useHistory();

    const isAuth = useSelector(store => store.user.isAuth);
    const cart = useSelector(store => store.cart);

    const favourite_courses = useSelector(store => store.user.favourite_courses);
    const enrolled_courses = useSelector(store => store.user.enrolled_courses);
    const pending_courses = useSelector(store => store.user.pending_courses);
    const [isFavourite, setIsFavourite] = useState(false);
    const [purchaseBtn, setPurchaseBtn] = useState(true);
    const [cartBtnText, setCartBtnText] = useState('新增至購物車');
    const [discountPrice, setDiscountPrice] = useState();
    const [lessonToStart, setLessonToStart] = useState();
    
    const containerRef = useRef(null);
    const buttonRef = useRef(null)

    useEffect(() => {

        let mounted = true

        if(enrolled_courses.find(enrolled_course => enrolled_course.id === course.id)){
            Axios.post('api/get-lesson-to-start', {
                course_id: course.id
            })
            .then(res => res.data)
            .then(data => {
                if(!data.error && mounted){
                    setLessonToStart(data.lessonToStart)
                }
            })
        }

        return () => {
            mounted = false
        }


    }, [enrolled_courses])

    const favouriteBtnClicked = () => {

        setIsFavourite(prev => !prev)

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

    useEffect(() => {

        if (cart.find(item => item.course_id === course.id)) {
            setCartBtnText('從購物車中移除');
            setPurchaseBtn(false);
        } else {
            setCartBtnText('新增至購物車');
        }

    }, [cart])

    useEffect(() => {

        if (favourite_courses.length > 0 && favourite_courses.find(item => item.id === course.id)) {
            if (!isFavourite)
                setIsFavourite(true)
        } else {
            if (isFavourite)
                setIsFavourite(false)
        }


    }, [favourite_courses])

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


    const addToCart = () => {
        if (cart.find(item => item.course_id === course.id)) {
            dispatch(removeCartItem(course.id))
            setPurchaseBtn(true)
        } else {
            let cartItem = {
                course_id: course.id,
                title: course.title,
                price: course.price,
                discount_start: course.discount_start,
                discount_end: course.discount_end,
                discount_price: discountPrice || null,
                discount_text: course.discount_text,
                tutor_name: course.tutor_name,
                tutor_avator: course.tutor_avator,
                cover_img: course.cover_img,
                duration: course.duration,
                lesson_num: course.lesson_num
            }
            dispatch(addCartItem(cartItem));
            dispatch(setCartPopup(true))
            setPurchaseBtn(false);
        }

        if (isAuth) {
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

    const purchaseNow = () => {
        let cartItem = {
            course_id: course.id,
            title: course.title,
            price: course.price,
            discount_price: discountPrice || null,
            discount_text: course.discount_text,
            tutor_name: course.tutor_name,
            tutor_avator: course.tutor_avator,
            cover_img: course.cover_img,
            duration: course.duration,
            lesson_num: course.lesson_num
        }

        dispatch(setCheckoutItems([cartItem]))
        dispatch(setSubtotal(cartItem.discount_price || cartItem.price))
        history.push('/checkout')
    }

    const continueLesson = () => {
        if(lessonToStart){
            history.push(`/courses/${course.id}/lessons/${lessonToStart.id}`)
        }else{
            history.push(`/courses/${course.id}`)
        }
    }

    return (
        <div className={HoverCardStyles.hoverCard}>
            <div className={HoverCardStyles.hoverContainer}>
                {isAuth && <div className={HoverCardStyles.favouriteBtn} onClick={favouriteBtnClicked} ref={buttonRef}>
                    <img src={isFavourite ? favouriteOn : favouriteOff} className={HoverCardStyles.favouriteIcon} alt="favourite icon"/>
                </div>}
                <Link className={HoverCardStyles.hoverInfoContainer} to={`/courses/${course.id}`}>
                    <p className={HoverCardStyles.hoverTitle}>{course.title}</p>
                    <p className={HoverCardStyles.hoverDesc}>規格：{course.spec}</p>
                    <p className={HoverCardStyles.hoverDesc}>時長： 合共{course.duration}分鐘</p>
                    <p className={HoverCardStyles.hoverDesc}>GS1編號：{course.gs1}</p>
                </Link>
                {course.price ? <div className={HoverCardStyles.hoverBtnContainer}>
                    {!pending_courses?.find(id => id === course.id) && (enrolled_courses.find(enrolled_course => enrolled_course.id === course.id) ? <button className={`${HoverCardStyles.btn} ${HoverCardStyles.hoverPurchaseBtn}`} onClick={continueLesson}>
                        {lessonToStart?.order === 1 ? '開始上課' : '繼續課堂'}</button> : <div>
                        <button className={`${HoverCardStyles.btn} ${HoverCardStyles.hoverAddToCartBtn}`} onClick={addToCart} ref={buttonRef}>{cartBtnText}</button>
                        {purchaseBtn && <button className={`${HoverCardStyles.btn} ${HoverCardStyles.hoverPurchaseBtn}`} ref={buttonRef} onClick={purchaseNow}>立即購買</button>}
                    </div>)}
                    {pending_courses?.find(id => id === course.id) && <p className={HoverCardStyles.purchasedText}>已購買課程，請等待我們審批</p>}

                </div> : <div className={HoverCardStyles.hoverBtnContainer}>
                    <p className={HoverCardStyles.purchasedText}>即將推出</p>
                </div>}
            </div>
        </div>
    )
}

export default HoverCard
