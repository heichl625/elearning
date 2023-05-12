import Axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/zh-hk';

//redux
import { useDispatch, useSelector } from 'react-redux';
import { setCheckoutItems, setSubtotal as setCheckoutSubtotal, setCoupon as setCheckoutCoupon, setTransaction, setMethod } from 'redux/actions/checkout';

import PurchaseRecordCardStyle from './PurchaseRecordCard.module.scss';

moment.locale('zh-hk');

const PurchaseRecordCard = ({ record }) => {

    const history = useHistory();
    const dispatch = useDispatch();

    const [statusColor, setStatusColor] = useState(PurchaseRecordCardStyle.pendingStatus);
    const [statusText, setStatusText] = useState('')
    const [methodText, setMethodText] = useState('')
    const [courseList, setCourseList] = useState([]);
    const [subTotal, setSubtotal] = useState(record.sub_total);
    const [total, setTotal] = useState(record.total);
    const [coupon, setCoupon] = useState();
    const [loading, setLoading] = useState(true);
    const [isValid, setIsValid] = useState(true);

    useEffect(() => {

        let mounted = true;

        switch (record.status) {
            case 'verified':
                setStatusColor(PurchaseRecordCardStyle.successStatus);
                setStatusText('已完成付款')
                break;
            case 'pending':
                setStatusColor(PurchaseRecordCardStyle.pendingStatus);
                if ((record.method === 'fps' || record.method === 'bank-transfer') && !record.proof) {
                    setStatusText('未完成付款')
                } else if(record.method === 'alipay'){
                    setStatusText('未完成付款')
                } else {
                    setStatusText('審批中')
                }
                break;
            case 'failed':
                setStatusColor(PurchaseRecordCardStyle.failedStatus);
                setStatusText('付款失敗')
                break;
            case 'invalid':
                setStatusColor(PurchaseRecordCardStyle.failedStatus);
                setStatusText('交易已失效');
                break;
            case 'refunding':
                setStatusColor(PurchaseRecordCardStyle.pendingStatus);
                setStatusText('退款中')
                break;
            case 'refunded':
                setStatusColor(PurchaseRecordCardStyle.successStatus);
                setStatusText('已完成退款')
                break;
            default:
                break;
        }

        switch (record.method) {
            case 'creditcard':
                setMethodText('信用卡')
                break;
            case 'fps':
                setMethodText('轉數快')
                break;
            case 'bank-transfer':
                setMethodText('銀行轉帳')
                break;
            case 'alipay':
                setMethodText('Alipay')
                break;
            default:
                break;
        }

        Axios.post('/api/get-purchase-course-detail', {
            id: record.id
        })
            .then(res => res.data)
            .then(data => {
                if(mounted){
                    if (!data.error) {
                        setCourseList(data.courseList);
                    } else {
                        console.log(data.error)
                    }
                }
                setLoading(false);
            })

        return () => {
            mounted = false;
        }

    }, [record])

    useEffect(() => {

        let mounted = true;

        if (courseList.length > 0) {
            if (record.status === 'pending' && !record.proof && (record.method === 'fps' || record.method === 'bank-transfer')) {
                let newSubtotal = 0;
                for (const course of courseList) {
                    newSubtotal += (course.course_discount_price || course.course_price)
                }

                let newTotal = 0;

                Axios.post('/api/get-transaction-coupon', {
                    id: record.id
                })
                    .then(res => res.data)
                    .then(data => {
                        if (!data.error && mounted) {
                            if (data.coupon) {
                                newTotal = newSubtotal - data.coupon.discount;
                                setCoupon(data.coupon)
                                setTotal(newTotal);
                            } else {
                                setTotal(newSubtotal);
                            }
                            setSubtotal(newSubtotal)
                        }

                    })
            }
        }

        return () => {
            mounted = false;
        }


    }, [courseList])

    const continuePay = () => {
        let cartItems = [];

        for (const course of courseList) {
            cartItems.push({
                course_id: course.course_id,
                title: course.course_title,
                price: course.course_price,
                discount_price: course.course_discount_price,
                discount_text: course.discount_text,
                tutor_name: course.tutor_name,
                tutor_avator: course.avator,
                cover_img: course.cover_img,
                duration: course.duration,
                lesson_num: course.lesson_num
            })
        }

        dispatch(setCheckoutItems(cartItems));
        dispatch(setCheckoutSubtotal(subTotal));
        if (coupon) {
            dispatch(setCheckoutCoupon(coupon));
        }
        dispatch(setTransaction({
            id: record.id,
            holder_name: record.holder_name,
            last_name: record.last_name,
            first_name: record.first_name,
            psot_code: record.post_code,
            address: record.address,
            city: record.city,
            company: record.company,
            country: record.country,
            district: record.district
        }));
        dispatch(setMethod(record.method))

        history.push('/checkout');

    }

    const handleRepay = () => {

        let cartItems = [];

        for (const course of courseList) {
            cartItems.push({
                course_id: course.course_id,
                title: course.course_title,
                price: course.course_price,
                discount_price: course.course_discount_price,
                discount_text: course.discount_text,
                tutor_name: course.tutor_name,
                tutor_avator: course.avator,
                cover_img: course.cover_img,
                duration: course.duration,
                lesson_num: course.lesson_num
            })
        }

        let newSubtotal = 0;
        for (const items of cartItems) {
            newSubtotal += (items.discount_price || items.price)
        }

        dispatch(setCheckoutItems(cartItems));
        dispatch(setCheckoutSubtotal(newSubtotal));
        if (coupon) {
            dispatch(setCheckoutCoupon(coupon));
        }
        dispatch(setTransaction({
            id: record.id,
            holder_name: record.holder_name,
            last_name: record.last_name,
            first_name: record.first_name,
            psot_code: record.post_code,
            address: record.address,
            city: record.city,
            company: record.company,
            country: record.country,
            district: record.district
        }));
        dispatch(setMethod(record.method))

        history.push('/checkout');

    }

    return (
        <div className={PurchaseRecordCardStyle.container}>
            {loading === true ? <div className={PurchaseRecordCardStyle.skeleton}>
                <div className={PurchaseRecordCardStyle.top}>
                    <div className={PurchaseRecordCardStyle.courseList}>
                        <div className={PurchaseRecordCardStyle.courseRow}>
                            <div className={PurchaseRecordCardStyle.courseTop}>
                                <div className={PurchaseRecordCardStyle.courseCoverSkeleton} />
                                <div className={PurchaseRecordCardStyle.courseInfo}>
                                    <div className={PurchaseRecordCardStyle.courseRowTitleSkeleton}></div>
                                    <div className={PurchaseRecordCardStyle.courseRowDescSkeleton}></div>
                                </div>
                            </div>
                            <div className={PurchaseRecordCardStyle.coursePriceContainer}>
                                <div className={PurchaseRecordCardStyle.courseRowTitleSkeleton}></div>
                                <div className={PurchaseRecordCardStyle.courseRowDescSkeleton}></div>
                            </div>
                        </div>
                    </div>
                    <div className={PurchaseRecordCardStyle.orderStatus}>
                        <div className={PurchaseRecordCardStyle.statusTextSkeleton}></div>
                        <div className={PurchaseRecordCardStyle.orderNumberSkeleton}></div>
                    </div>
                </div>

            </div> : <div>
                <div className={PurchaseRecordCardStyle.top}>
                    <div className={PurchaseRecordCardStyle.courseList}>
                        {courseList.length > 0 && courseList.map(course => {
                            return <div className={PurchaseRecordCardStyle.courseRow} key={uuidv4()}>
                                <div className={PurchaseRecordCardStyle.courseTop}>
                                    <img className={PurchaseRecordCardStyle.courseCover} src={course.cover_img} alt={course.course_title}/>
                                    <div className={PurchaseRecordCardStyle.courseInfo}>
                                        <h3 className={PurchaseRecordCardStyle.courseRowTitle}>{course.course_title}</h3>
                                        <p className={PurchaseRecordCardStyle.courseRowDesc}>{course.tutor_name} ． 共{course.lesson_num}堂</p>
                                    </div>
                                </div>
                                <div className={PurchaseRecordCardStyle.coursePriceContainer}>
                                    <h3 className={PurchaseRecordCardStyle.courseRowTitle}>HK${((record.method === 'fps' || record.method === 'bank-transfer') && record.status === 'pending' && !record.proof) ? (course.course_discount_price || course.course_price) : course.price}.00</h3>
                                    <p className={PurchaseRecordCardStyle.courseRowDesc}>數量：1</p>
                                </div>
                            </div>
                        })}
                    </div>
                    <div className={PurchaseRecordCardStyle.orderStatus}>
                        <h4 className={`${PurchaseRecordCardStyle.statusText} ${statusColor}`}>{statusText}</h4>
                        <p className={PurchaseRecordCardStyle.orderNumber}>訂單編號：#{record.id}</p>
                        {isValid && <div className={PurchaseRecordCardStyle.mobileBtnGroup}>
                            {record.status === 'failed' &&
                                <div className={PurchaseRecordCardStyle.payBtnContainer}>
                                    <button className={PurchaseRecordCardStyle.payBtn} onClick={handleRepay}>重新付款</button>
                                </div>}
                            {(record.status === 'pending' && !record.proof) && <div className={PurchaseRecordCardStyle.payBtnContainer}><button className={PurchaseRecordCardStyle.payBtn} onClick={continuePay}>繼續付款</button></div>}
                        </div>}
                    </div>
                </div>
                {isValid && <div className={PurchaseRecordCardStyle.desktopBtnGroup}>
                    {record.status === 'failed' &&
                        <div className={PurchaseRecordCardStyle.payBtnContainer}>
                            <button className={PurchaseRecordCardStyle.payBtn} onClick={handleRepay}>重新付款</button>
                        </div>}
                    {(record.status === 'pending' && !record.proof) && <div className={PurchaseRecordCardStyle.payBtnContainer}><button className={PurchaseRecordCardStyle.payBtn} onClick={continuePay}>繼續付款</button></div>}
                </div>}
                <div className={PurchaseRecordCardStyle.bottom}>
                    <div className={PurchaseRecordCardStyle.orderDetailContainer}>
                        <p className={PurchaseRecordCardStyle.orderDetail}>數量：{courseList.length}個</p>
                        <p className={PurchaseRecordCardStyle.orderDetail}>購買時間： {moment(record.created_at).format('L')} {moment(record.created_at).format('Ah:mm')}</p>
                        <p className={PurchaseRecordCardStyle.orderDetail}>付款方式：{methodText}</p>
                    </div>
                    <div className={PurchaseRecordCardStyle.priceContainer}>
                        <table>
                            <tbody>
                                <tr>
                                    <td className={PurchaseRecordCardStyle.priceColTitle}>小計</td>
                                    <td>HK${subTotal}.00</td>
                                </tr>
                                <tr>
                                    <td className={PurchaseRecordCardStyle.priceColTitle}>折扣</td>
                                    <td>-HK${record.sub_total - record.total}.00</td>
                                </tr>
                                <tr>
                                    <td className={PurchaseRecordCardStyle.priceColTitle}>實付金額</td>
                                    <td className={PurchaseRecordCardStyle.finalPrice}>HK${total}.00</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default PurchaseRecordCard
