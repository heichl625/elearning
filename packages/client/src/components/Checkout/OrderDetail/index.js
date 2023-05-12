import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'
import Axios from 'axios';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { setCoupon, setSubtotal } from 'redux/actions/checkout';

import OrderDetailStyles from './OrderDetail.module.scss';
import { setPopup, setPopupPage } from 'redux/actions/global_setting';
import checkout from 'redux/reducers/checkout';

const OrderDetail = ({ show, hideFooter, unhideFooter }) => {

    const dispatch = useDispatch();
    const history = useHistory();

    const items = useSelector(store => store.checkout.items);
    const subtotal = useSelector(store => store.checkout.subtotal);
    const coupon = useSelector(store => store.checkout.coupon);
    const enrolled_courses = useSelector(store => store.user.enrolled_courses);
    const pending_courses = useSelector(store => store.user.pending_courses);
    const user_id = useSelector(store => store.user.id);

    const [code, setCode] = useState('')
    const [error, setError] = useState('');

    useEffect(() => {

        if (items.length > 0) {
            let sum = 0
            for (const item of items) {
                let discount_price;
                if (item.discount_start && new Date(item.discount_start) < new Date()) {
                    discount_price = item.discount_price;
                }
                if (!item.discount_start && item.discount_price) {
                    discount_price = item.discount_price
                }
                sum += discount_price || item.price;
            }
            dispatch(setSubtotal(sum));
        }

    }, [items])


    const handleSubmit = (e) => {
        e.preventDefault();
        setError('')

        if (items.length === 0) {
            setError('請先選擇需購買的課程')
        } else {

            if(coupon){
                dispatch(setCoupon());
                setCode('');
                return;
            }else{
                Axios.post('/api/check-coupon', {
                    couponCode: code,
                    user_id: user_id
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
    }

    useEffect(() => {

        if (items?.length === 0) {
            history.push('/cart');
        }


    }, [items])

    useEffect(() => {

        if (items?.length > 0 && enrolled_courses?.length > 0) {

            for (const enrolled_course of enrolled_courses) {
                if (items.find(item => item.course_id === enrolled_course.id)) {
                    dispatch(setPopupPage('course-already-enrolled'))
                    dispatch(setPopup(true));
                    break;
                }
            }

        }

        if (items?.length > 0 && pending_courses?.length > 0) {

            for (const pending_course of pending_courses) {
                if (items.find(item => item.course_id === pending_course)) {
                    dispatch(setPopupPage('course-already-enrolled'))
                    dispatch(setPopup(true));
                    break;
                }
            }

        }

    }, [enrolled_courses, pending_courses, items])

    return (
        <div className={`${OrderDetailStyles.container} ${show ? OrderDetailStyles.mobileContainer : ''}`}>
            {items.length > 0 && <table>
                <thead>
                    <tr>
                        <th>購買項目（{items.length}）</th>
                        <th className={OrderDetailStyles.colHeading}>價錢</th>
                        <th className={OrderDetailStyles.colHeading}>數量</th>
                        <th className={OrderDetailStyles.colHeading}>合計</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => {
                        return <tr className={OrderDetailStyles.itemContainer} key={uuidv4()}>
                            <td className={OrderDetailStyles.courseInfo}>
                                <div className={OrderDetailStyles.courseTop}>
                                    <img src={item.cover_img} className={OrderDetailStyles.courseCover} alt={item.title}/>
                                    <div className={OrderDetailStyles.courseBasicInfo}>
                                        <h4 className={OrderDetailStyles.courseName}>{item.title}</h4>
                                        <p className={OrderDetailStyles.instructor}>{item.tutor_name} ． 共{item.lesson_num}堂</p>
                                    </div>
                                </div>
                                <div className={OrderDetailStyles.extraCourseInfo}>
                                    <p>課程長度：視頻約{Math.floor(item.duration / 60)}小時</p>
                                    <p>觀看期限：永久</p>
                                </div>
                            </td>
                            <td className={OrderDetailStyles.centerCol}>
                                HK${item.discount_price || item.price}.00
                            </td>
                            <td className={OrderDetailStyles.centerCol}>
                                1
                                </td>
                            <td className={OrderDetailStyles.centerCol}>
                                HK${item.discount_price || item.price}.00
                            </td>
                            <td className={OrderDetailStyles.centerCol}></td>
                        </tr>
                    })}
                </tbody>
            </table>}
            <div className={OrderDetailStyles.bottom}>
                <div className={OrderDetailStyles.couponContainer}>
                    <h4 className={OrderDetailStyles.sectionTitle}>優惠碼</h4>
                    <form className={OrderDetailStyles.couponForm} onSubmit={handleSubmit}>
                        <input className={OrderDetailStyles.inputField} placeholder="請輸入優惠碼" value={code} onChange={(e) => setCode(e.target.value)} onFocus={hideFooter} onBlur={unhideFooter}/>
                        <button className={OrderDetailStyles.submitBtn}>{coupon ? '移除' : '使用'}</button>
                    </form>
                    {<p className={OrderDetailStyles.error}>{error}</p>}
                </div>
                <div className={OrderDetailStyles.priceContainer}>
                    <table>
                        <tbody>
                            <tr>
                                <td>小計</td>
                                <td>HK${subtotal}.00</td>
                            </tr>
                            <tr>
                                <td>折扣{coupon && <span className={OrderDetailStyles.usedCode}>優惠碼：{coupon.code}</span>}</td>
                                <td>{coupon ? `HK$${coupon.discount}.00` : '-'}</td>
                            </tr>
                            <tr>
                                <td>累計</td>
                                <td className={OrderDetailStyles.total}>HK${coupon ? (subtotal - coupon.discount >= 0 ? subtotal - coupon.discount : 0) : subtotal}.00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>

        </div>
    )
}

export default OrderDetail
