import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Axios from 'axios'

import CourseDetailCardStyle from './CourseDetailCard.module.scss'

//FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'


//Redux
import { useSelector, useDispatch } from 'react-redux';
import { setFavourite } from '../../redux/actions/user';
import { addCartItem, removeCartItem } from '../../redux/actions/cart';

const CourseDetailCard = ({ course }) => {

    const dispatch = useDispatch();

    const user = useSelector(store => store.user);
    const cart = useSelector(store => store.cart);
    const [isFavourite, setIsFavourite] = useState(false);
    const [cartBtnText, setCartBtnText] = useState('新增至購物車');
    const [cartBtnClass, setCartBtnClass] = useState(CourseDetailCardStyle.add);
    const [purchaseBtn, setPurchaseBtn] = useState(true)

    const favouriteClicked = () => {

        setIsFavourite(!isFavourite);

        Axios.post('/api/favourite', {
            course_id: course.id
        })
            .then(res => {
                let courseArr = res.data.favourite_courses?.map(course => course.course_id);
                dispatch(setFavourite(courseArr))
            })
            .catch(err => {
                console.log(err);
            })

    }

    const cartBtnClick = () => {
        if (cart.find(item => item.course_id === course.id)) {
            dispatch(removeCartItem(course.id))
            setPurchaseBtn(true)
        } else {
            let cartItem = {
                course_id: course.id,
                title: course.title,
                price: course.price,
                discount_price: course.discount_price,
                discount_text: course.discount_text,
                tutor_name: course.tutor_name,
                tutor_avator: course.tutor_avator,
                cover_img: course.cover_img,
                discount_start: course.discount_start,
                discount_end: course.discount_end
            }
            dispatch(addCartItem(cartItem));
        }

        if (user.email) {
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

        if (user?.favourite_courses?.includes(course.id)) {
            setIsFavourite(true);
        }

    }, [user.favourite_courses])

    useEffect(() => {

        if (cart?.find(item => item.course_id === course.id)) {
            setCartBtnText('從購物車中移除')
            setCartBtnClass(CourseDetailCardStyle.remove)
            setPurchaseBtn(false)
        } else {
            setCartBtnText('新增至購物車')
            setCartBtnClass(CourseDetailCardStyle.add)
        }

    }, [cart])



    return (
        <div className={CourseDetailCardStyle.container}>
            <div className={CourseDetailCardStyle.card}>
                <h2 className={CourseDetailCardStyle.title}>{course.title}</h2>
                <p className={CourseDetailCardStyle.description}>規格：{course.spec}</p>
                <p className={CourseDetailCardStyle.description}>時長：合共{course.duration}分鐘</p>
                <p className={CourseDetailCardStyle.description}>GS1編號：{course.gs1}</p>

                <div className={CourseDetailCardStyle.btnGroup}>
                    {user.email && <div className={CourseDetailCardStyle.favouriteBtn}>
                        <FontAwesomeIcon icon={faHeart} onClick={() => favouriteClicked()} className={isFavourite ? CourseDetailCardStyle.favourite : CourseDetailCardStyle.notFavourite} />
                    </div>}
                    <button className={`${CourseDetailCardStyle.cartBtn} ${CourseDetailCardStyle.btn} ${cartBtnClass}`} onClick={() => cartBtnClick()}>{cartBtnText}</button>
                    {purchaseBtn && <Link className={`${CourseDetailCardStyle.purchaseBtn} ${CourseDetailCardStyle.btn}`} to={{
                            pathname: '/checkout',
                            state: { course }
                        }}>
                            立即購買
                    </Link>
                    }
                </div>
            </div>

        </div>
    )
}

export default CourseDetailCard
