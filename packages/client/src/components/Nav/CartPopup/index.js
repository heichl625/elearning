import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom'
import Axios from 'axios';
import {v4 as uuidv4} from 'uuid';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { addCartItem, removeCartItem } from 'redux/actions/cart';
import { setCheckoutItems, setSubtotal } from 'redux/actions/checkout';


//styles
import CartPopupStyles from './CartPopup.module.scss'

//images
import suggestAddCartBtn from 'images/icon/btn_add_cart@3x.png';

const CartPopup = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const user = useSelector(store => store.user);
    const cart = useSelector(store => store.cart);

    const [suggestion, setSuggestion] = useState([])
    const [obtainedSuggestion, setObtainedSuggestion] = useState(false)

    const [categories, setCategories] = useState([]);
    
    useEffect(() => {

        let mounted = true;

        if(cart.length > 0 && obtainedSuggestion === false){
            Axios.post('/api/course-suggestions', {
                course_id: cart[0].course_id,
                user_id: user.id
            })
            .then(res => res.data)
            .then(data => {
                if(!data.error){
                    let suggestionList = data.suggestionList.map(item => {
                        let { id, ...rest } = item
                        if(!suggestion.find(suggestion_course => suggestion_course.course_id === id)){
                            return ({
                                course_id: id,
                                ...rest
                            })
                        }
                    })
                    if(mounted){
                        setSuggestion(suggestionList);
                        setObtainedSuggestion(true)
                    }
                }
            })
        }

        return () => {
            mounted = false;
        }

    }, [cart, obtainedSuggestion])

    useEffect(() => {

        if(cart.length > 0 && suggestion.length > 0){
            if(obtainedSuggestion === true){
                setSuggestion(suggestion.filter(suggestionCourse => {
                    return !cart.find(cartItem => cartItem.course_id === suggestionCourse.course_id)
                }))
            }
        }

    }, [cart, obtainedSuggestion])


    useEffect(() => {

        let mounted = true;

        if(cart.length > 0){


            let cartIDArr = cart.map(item => item.course_id);

            cartIDArr.forEach(id => {
                if(suggestion.find(item => item.course_id === id)){
                    
                    setSuggestion(prev => prev.filter(item => item.course_id !== id))
                }
            })

            Axios.post('/api/courses/cart-categories', {
                cart: cart
            })
            .then(res => res.data)
            .then(data => {
                if(!data.error && mounted){
                    setCategories(data.categories);
                }
            })
            .catch(err => {
                console.log(err);
            })


        }
        
        return () => {
            mounted = false;
        }
        

    }, [cart])

    const addItemToCart = (item) => {
        dispatch(addCartItem(item))
        if (user.isAuth) {
            Axios.post('/api/cart', {
                course_id: item.course_id
            })
                .then(res => {
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    const addAllToCart = () => {
        suggestion.forEach(item => {
            dispatch(addCartItem(item))
            if (user.isAuth) {
                Axios.post('/api/cart', {
                    course_id: item.course_id
                })
                    .then(res => {
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        })
        
    }


    const removeItemFromCart = (item) => {
        dispatch(removeCartItem(item.course_id))
        if(user.isAuth){
            Axios.post('/api/cart', {
                course_id: item.course_id
            })
                .then(res => {
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    const handleCheckout = () => {
        dispatch(setCheckoutItems(cart));
        let subTotal = 0;
        cart.forEach(item => {
            subTotal += (item.discount_price || item.price)
        })
        dispatch(setSubtotal(subTotal))
        history.push('/checkout')
    }

    
    return (
        <div className={CartPopupStyles.container}>
            <div className={CartPopupStyles.pointer}></div>
            <div className={CartPopupStyles.cartContainer}>
                <h3 className={CartPopupStyles.cartTotalNumber}>我的購物車（{cart.length}）</h3>
                <div className={CartPopupStyles.cartItems}>
                    {cart?.length > 0 && cart.map(item => {
                        return <div className={CartPopupStyles.cartItem} key={uuidv4()}>
                            <img src={item.cover_img} className={CartPopupStyles.courseCover} alt={item.title}/>
                            <div className={CartPopupStyles.courseInfo}>
                                <div className={CartPopupStyles.courseInfoTop}>
                                    <p className={CartPopupStyles.courseTitle}>{item.title}</p>
                                    <p className={CartPopupStyles.removeBtn} onClick={() => removeItemFromCart(item)}>移除</p>
                                </div>
                                <div className={CartPopupStyles.instructorContainer}>
                                    <img className={CartPopupStyles.avator} src={item.tutor_avator} alt={item.tutor_name}/>
                                    <p className={CartPopupStyles.instructor}>{item.tutor_name}</p>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
                {cart.length === 0 && <p className={CartPopupStyles.noItemText}>購物車中未有任何課程</p>}
                {(cart.length && suggestion.length > 0) ? <div className={CartPopupStyles.suggestionContainer}>
                    <h3 className={CartPopupStyles.sectionTitle}>經常一起購買</h3>

                    {suggestion.map(item => {
                        return <div className={CartPopupStyles.suggestionCourse} key={uuidv4()}>
                            <img src={item.cover_img} className={CartPopupStyles.suggestCourseCover} alt={item.title}/>
                            <div className={CartPopupStyles.suggestCourseInfo}>
                                <p className={CartPopupStyles.courseTitle}>{item.title}</p>
                                <div className={CartPopupStyles.suggestCourseBottom}>
                                    <div className={CartPopupStyles.suggestCourseBottomLeft}>
                                        <div className={CartPopupStyles.instructorContainer}>
                                            <img src={item.tutor_avator} className={CartPopupStyles.avator} alt={item.tutor_name}/>
                                            <p className={CartPopupStyles.instructor}>{item.tutor_name}</p>
                                        </div>
                                        <div className={CartPopupStyles.suggestToCartContainer} onClick={() => addItemToCart(item)}>
                                            <img className={CartPopupStyles.suggestAddCartBtn} src={suggestAddCartBtn} alt="Add course to cart button"/>
                                        </div>
                                    </div>
                                    <div className={CartPopupStyles.suggestCoursePriceContainer}>
                                        <label className={CartPopupStyles.price}>HK${item.price}{item.discount_price && <span className={CartPopupStyles.crossout}></span>}.00</label>
                                        {item.discount_price && <p className={`${CartPopupStyles.price} ${CartPopupStyles.discount}`}>HK${item.discount_price}.00</p>}
                                        {item.discount_text && <p className={`${CartPopupStyles.price} ${CartPopupStyles.discount}`}>{item.discount_text}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    })}
                    <div className={CartPopupStyles.btnContainer}>
                        <button className={CartPopupStyles.addAllBtn} onClick={addAllToCart}>全部加入購物車</button>
                    </div>

                </div> : null}

                {cart.length > 0 && <div className={CartPopupStyles.btnContainer}>
                    <button className={CartPopupStyles.cartBtn} onClick={() => history.push('/cart')}>前往購物車</button>
                    <button className={CartPopupStyles.checkoutBtn} onClick={handleCheckout}>前往結帳</button>
                </div>}

                {cart.length > 0 && <div className={CartPopupStyles.relatedCategories}>
                    <p className={CartPopupStyles.sectionTitle}>相關主題</p>
                    {categories.length > 0 && <div className={CartPopupStyles.tagContainer}>
                        {categories.map(category => {
                            return <Link to={`/courses?category=${category.id}`} className={CartPopupStyles.tag} key={uuidv4()}>{category.name}</Link>
                        })}
                    </div>}
                </div>}
            </div>
        </div>
    )
}

export default CartPopup
