import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';
import Axios from 'axios'
import Spinner from 'components/Spinner';

//redux
import { useSelector, useDispatch } from 'react-redux'
import { setCart, removeCartItem } from '../../redux/actions/cart'
import { setPopup, setPopupPage } from 'redux/actions/global_setting';
import { setCoupon, setCheckoutItems, setSubtotal as setCheckoutSubtotal } from 'redux/actions/checkout'

//style
import CartStyles from './Cart.module.scss'


const Cart = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const cartItems = useSelector(store => store.cart);
    const user = useSelector(store => store.user);
    const checkout = useSelector(store => store.checkout);

    const [subtotal, setSubtotal] = useState(0);
    const [code, setCode] = useState('')
    const [selectedItems, setSelectedItems] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [hideMobileFooter, setHideMobileFooter] = useState(false);


    useEffect(() => {

        if (selectedItems.length > 0) {
            let newSubtotal = 0;
            selectedItems.forEach(item => {
                if (item.discount_price) {
                    newSubtotal += item.discount_price
                } else {
                    newSubtotal += item.price
                }
            })
            setSubtotal(newSubtotal);
        } else {
            setSubtotal(0)
        }

    }, [selectedItems])

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('')

        if(checkout.coupon){
            dispatch(setCoupon());
            setCode('');
            return;
        }

        if (selectedItems.length === 0) {
            setError('請先選擇需購買的課程')
        } else {
            Axios.post('/api/check-coupon', {
                couponCode: code
            })
                .then(res => res.data)
                .then(data => {
                    if (data.error) {
                        setError(data.error);
                    } else {
                        dispatch(setCoupon(data.coupon))
                    }
                })
        }


    }

    const selectAllItems = () => {
        setSelectedItems(cartItems);
    }

    const radioBtnClicked = (item) => {
        if (selectedItems.find(course => course.course_id === item.course_id)) {
            setSelectedItems(selectedItems.filter(course => course.course_id !== item.course_id))
        } else {
            setSelectedItems(prev => [...prev, item])
        }

    }

    const handleNext = () => {
        if (!user.isAuth) {
            dispatch(setPopupPage('loginOptions'))
            dispatch(setPopup(true))
        } else {
            dispatch(setCheckoutItems(selectedItems))
            dispatch(setCheckoutSubtotal(subtotal))
            history.push('/checkout')
        }
    }

    const removeFromCart = (item) => {
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

    useEffect(async () => {

        const cartCookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('cart'))

        const cartStr = cartCookieValue?.split('=')[1]
        console.log(cartStr);

        if (typeof cartStr === 'string') {
            let cookieCartArr;
            try {
                cookieCartArr = JSON.parse(cartStr);
                let cartArr = [];
                for (const item of cookieCartArr) {
                    let response = await Axios.get('/api/courses/' + item.course_id)
                    let data = await response.data;

                    cartArr.push({
                        course_id: item.course_id,
                        title: data.course.title,
                        price: data.course.price,
                        discount_start: data.course.discount_start,
                        discount_end: data.course.discount_end,
                        discount_price: data.course.discount_price || null,
                        discount_text: data.course.discount_text || null,
                        tutor_name: data.tutor.name,
                        tutor_avator: data.tutor.avator,
                        cover_img: data.course.cover_img,
                        duration: data.course.duration,
                        lesson_num: data.lesson_number
                    })

                }
                dispatch(setCart(cartArr))
                setIsLoading(false);
            } catch (err) {
                console.log(err);
                setIsLoading(false);
            }
        }

    }, [])

    useEffect(() => {

        if (cartItems.length === 0) {
            dispatch(setCoupon());
            setSubtotal(0);
        } else {
            setSelectedItems(prev => {
                return prev.filter(item => cartItems.find(cartItem => cartItem.course_id === item.course_id))
            })
        }

    }, [cartItems])

    useEffect(() => {

        document.title = '購物車 - MeLearn.Guru'

    }, [])
    
    const hideFooter = () => {
        setHideMobileFooter(true);
    }

    const unhideFooter = () => {
        setHideMobileFooter(false);
    }

    return (
        <div className={CartStyles.container}>
            <h3 className={CartStyles.title}>購物車（{cartItems.length}）</h3>
            {cartItems.length > 0 && <table>
                <thead>
                    <tr className={CartStyles.headingRow}>
                        <th>已選項目（{selectedItems.length}）</th>
                        <th className={CartStyles.headingRadio}>
                            <div className={CartStyles.radioBtn} onClick={selectAllItems}>
                                {selectedItems.length === cartItems.length && <div className={CartStyles.selectedRadio}></div>}
                            </div>全選
                        </th>
                        <th className={CartStyles.colHeading}>價錢</th>
                        <th className={CartStyles.colHeading}>數量</th>
                        <th className={CartStyles.colHeading}>合計</th>
                        <th className={CartStyles.colHeading}></th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? <tr><td><Spinner /></td></tr>  : cartItems.map((item, index) => {
                        return <tr className={CartStyles.itemContainer} key={uuidv4()}>
                            <td className={CartStyles.mobileItemContainer}>
                                <div className={CartStyles.topRow}>
                                    <div className={CartStyles.radioBtn} onClick={() => radioBtnClicked(item)}>
                                        {selectedItems.find(course => course.course_id === item.course_id) && <div className={CartStyles.selectedRadio}></div>}
                                    </div>
                                    <p className={CartStyles.removeBtn} onClick={() => removeFromCart(item)}>刪除</p>
                                </div>
                                <div className={CartStyles.mobileCourseInfo}>
                                    <div className={CartStyles.courseTop}>
                                        <img src={item.cover_img} className={CartStyles.courseCover} alt={item.title} />
                                        <div className={CartStyles.courseBasicInfo}>
                                            <h4 className={CartStyles.courseName}>{item.title}</h4>
                                            <p className={CartStyles.instructor}>{item.tutor_name} ． 共{item.lesson_num}堂</p>
                                        </div>
                                    </div>
                                    <div className={CartStyles.extraCourseInfo}>
                                        <p>課程長度：視頻約{Math.floor(item.duration / 60)}小時</p>
                                        <p>觀看期限：永久</p>
                                    </div>
                                </div>
                                <div className={CartStyles.mobilePriceContainer}>
                                    <div className={CartStyles.mobilePriceRow}>
                                        <p className={CartStyles.mobilePriceType}>價錢</p>
                                        <p className={CartStyles.mobilePriceNumber}>HK${item.discount_price || item.price}.00</p>
                                    </div>
                                    <div className={CartStyles.mobilePriceRow}>
                                        <p className={CartStyles.mobilePriceType}>數量</p>
                                        <p className={CartStyles.mobilePriceNumber}>1</p>
                                    </div>
                                    <div className={CartStyles.mobilePriceRow}>
                                        <p className={CartStyles.mobilePriceType}>合計</p>
                                        <p className={CartStyles.mobilePriceNumber}>HK${item.discount_price || item.price}.00</p>
                                    </div>
                                </div>
                            </td>
                            <td className={CartStyles.ratioChoice}>
                                <div className={CartStyles.radioBtn} onClick={() => radioBtnClicked(item)}>
                                    {selectedItems.find(course => course.course_id === item.course_id) && <div className={CartStyles.selectedRadio}></div>}
                                </div>
                            </td>
                            <td className={CartStyles.courseInfo}>
                                <div className={CartStyles.courseTop}>
                                    <img src={item.cover_img} className={CartStyles.courseCover} alt={item.title} />
                                    <div className={CartStyles.courseBasicInfo}>
                                        <h4 className={CartStyles.courseName}>{item.title}</h4>
                                        <p className={CartStyles.instructor}>{item.tutor_name} ． 共{item.lesson_num}堂</p>
                                    </div>
                                </div>
                                <div className={CartStyles.extraCourseInfo}>
                                    <p>課程長度：視頻約{Math.floor(item.duration / 60)}小時</p>
                                    <p>觀看期限：永久</p>
                                </div>
                            </td>
                            <td className={CartStyles.centerCol}>
                                HK${item.discount_price || item.price}.00
                            </td>
                            <td className={CartStyles.centerCol}>
                                1
                                </td>
                            <td className={CartStyles.centerCol}>
                                HK${item.discount_price || item.price}.00
                            </td>
                            <td>
                                <p className={CartStyles.removeBtn} onClick={() => removeFromCart(item)}>刪除</p>
                            </td>
                        </tr>
                    })}
                </tbody>
            </table>}
            <div className={CartStyles.bottom}>
                <div className={CartStyles.couponContainer}>
                    <h4 className={CartStyles.sectionTitle}>優惠碼</h4>
                    <form className={CartStyles.couponForm} onSubmit={handleSubmit}>
                        <input className={CartStyles.inputField} placeholder="請輸入優惠碼" value={code} onChange={(e) => setCode(e.target.value)} onFocus={hideFooter} onBlur={unhideFooter}/>
                        <button className={CartStyles.submitBtn}>{checkout.coupon ? "移除" : "使用"}</button>
                    </form>
                    {<p className={CartStyles.error}>{error}</p>}
                </div>
                <div className={CartStyles.priceContainer}>
                    <table>
                        <tbody>
                            <tr>
                                <td>小計</td>
                                <td>HK${subtotal}.00</td>
                            </tr>
                            <tr>
                                <td>折扣{checkout.coupon && <span className={CartStyles.usedCode}>優惠碼：{checkout.coupon.code}</span>}</td>
                                <td>{checkout.coupon ? `HK$${checkout.coupon.discount}.00` : '-'}</td>
                            </tr>
                            <tr>
                                <td>累計</td>
                                <td className={CartStyles.total}>HK${checkout.coupon ? (subtotal - checkout.coupon.discount >= 0 ? subtotal - checkout.coupon.discount : 0) : subtotal}.00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
            <div className={CartStyles.continueBtnContainer}>
                <button className={CartStyles.continueBtn} onClick={handleNext}>繼續下單</button>
            </div>
            <div className={`${CartStyles.mobileFooter} ${hideMobileFooter ? CartStyles.hidden : ''}`}>
                <div className={CartStyles.footerPriceRow}>
                    <p className={CartStyles.mobilePriceText}>小計 HK${subtotal}.00</p>
                    <p className={CartStyles.mobilePriceText}>折扣 {checkout.coupon ? `HK$${checkout.coupon.discount}.00` : '-'}</p>
                </div>
                <div className={CartStyles.mobilePriceTotal}>
                    <p className={CartStyles.mobilePriceText}>累計</p>
                    <p className={CartStyles.mobilePriceTotalText}>HK${checkout.coupon ? (subtotal - checkout.coupon.discount >= 0 ? subtotal - checkout.coupon.discount : 0) : subtotal}.00</p>
                </div>
                <button className={CartStyles.continueBtn} onClick={handleNext}>繼續下單</button>
            </div>

        </div>
    )
}

export default Cart
