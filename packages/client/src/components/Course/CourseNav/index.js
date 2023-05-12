import React from 'react';
import { Link, useHistory } from 'react-router-dom';

import CourseNavStyles from './CourseNav.module.scss'

//component
import Badge from 'components/Nav/Badge';

//image
import cartIcon from 'images/icon/btn_cart@3x.png';

//redux
import { useDispatch, useSelector } from 'react-redux'
import { setCheckoutItems, setSubtotal } from 'redux/actions/checkout'
import { setCartPopup } from 'redux/actions/global_setting'

const CourseNav = ({ course, tutor, lessonNumber }) => {

    const dispatch = useDispatch();
    const showCartPopup = useSelector(store => store.global_setting.showCartPopup);
    const cart = useSelector(store => store.cart);
    const history = useHistory();

    const handlePurchase = () => {

        let discount_price;

        if ((course.discount_start && new Date(course.discount_start) < new Date()) && course.discount_price) {
            discount_price = course.discount_price
        }
        if (!course.discount_start && course.discount_price) {
            discount_price = course.discount_price
        }

        let item = {
            course_id: course.id,
            title: course.title,
            price: course.price,
            discount_price: discount_price || null,
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

    return (
        <div className={CourseNavStyles.container}>
            <div className={CourseNavStyles.navLeft}>
                <div className={`${CourseNavStyles.navBrand} ${CourseNavStyles.navItem}`}>
                    <Link to="/">
                        <img src="/media/logo.png" className={CourseNavStyles.icon} alt="MeLearn.guru Icon"/>
                    </Link>
                </div>
            </div>
            <div className={CourseNavStyles.navRight}>
                <div className={CourseNavStyles.navPrice}>
                    {course.discount_price && <div className={CourseNavStyles.navItem}>
                        <p className={CourseNavStyles.discountText}>{course.discount_text} HK${course.discount_price}.00</p>
                    </div>}
                    <div className={CourseNavStyles.navItem}>
                        <p className={CourseNavStyles.price}>HK${course.price}.00{course.discount_price && <span className={CourseNavStyles.crossout}></span>}</p>
                    </div>
                </div>
                <div className={CourseNavStyles.navItem}>
                    <button className={CourseNavStyles.purchaseNowBtn} onClick={handlePurchase}>立即購買</button>
                </div>
                <div className={`${CourseNavStyles.navCart} ${CourseNavStyles.navItem}`}>
                    <div onClick={() => dispatch(setCartPopup(!showCartPopup))}>
                        <img src={cartIcon} className={CourseNavStyles.navIcon} alt="shopping cart icon"/>
                        {cart.length > 0 && <Badge number={cart.length} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseNav
