import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Axios from 'axios';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { clearCheckout, setTransaction, setCheckoutItems } from 'redux/actions/checkout'

import CheckoutFinishedStyles from './CheckoutFinished.module.scss';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

const CheckoutFinsihed = () => {

    const query = useQuery();

    const history = useHistory();
    const dispatch = useDispatch();

    const [title, setTitle] = useState('');
    const [msg, setMsg] = useState('');
    const [transaction_id, setTransaction_id] = useState(''); 

    const checkout = useSelector(store => store.checkout);
    const transaction = useSelector(store => store.checkout.transaction);


    useEffect(() => {

        if(query.get('transaction_id')){
            setTransaction_id(query.get('transaction_id'))

            Axios.post('/api/get-transaction', {
                transaction_id: query.get('transaction_id')
            })
            .then(res => res.data)
            .then(data => {
                if(!data.error){
                    let { details, ...rest } = data.transaction;
                    dispatch(setTransaction(rest));
                    let items = details.map(detail => {
                        return {
                            course_id: detail.course_id,
                            title: detail.course_title,
                            price: detail.course_price,
                            discount_price: detail.course_discount_price || null,
                            discount_text: detail.discount_text || null,
                            tutor_name: detail.tutor_name,
                            tutor_avator: detail.avator,
                            cover_img: detail.cover_img,
                            duration: detail.duration,
                            lesson_num: detail.lesson_num
                        }
                    })
                    dispatch(setCheckoutItems(items))
                }
            })

        }


    }, [])

    useEffect(() => {

        if(transaction?.status === 'failed'){
            setTitle('付款失敗');
            setMsg(`付款時出現問題，${query.get('reason') ? `原因： ${query.get('reason')}` : ''}請你檢查你的銀行交易紀錄作確認，如有任何問題，請與我們聯絡。`)
            document.title = '付款失敗 - MeLearn.Guru'
        }
        if(transaction?.status === 'verified'){
            setTitle('付款成功');
            setMsg('多謝選購MeLearn.guru課程，我們已透過電郵向您發送一封訂單確認。祝你有一趟愉快的學習旅程！')
            document.title = '付款成功 - MeLearn.Guru'
        }
        if(transaction?.status === 'pending'){
            setTitle('提交成功');
            if((transaction?.method === 'fps' || transaction?.method === 'bank-transfer') && !transaction?.proof){
                setMsg('已成功提交訂單，請盡快於購買紀錄上載付款證明以完成購買程序。')
            }else{
                setMsg('已成功提交付款證明，我們會盡快核實款項及處理您的訂單。請於購買紀錄查看審批進度。')

            }
            document.title = '提交成功 - MeLearn.Guru'
        }

    }, [transaction])

    const purchaseRecordClicked = () => {
        history.push('/purchase-record')
    }

    const courseClicked = () => {
        history.push(`/courses/${checkout?.items[0].course_id}`)
    }

    const otherCourseClicked = () => {
        history.push('/courses')
    }

    const purchaseAgain = () => {
        let { details, ...rest} = transaction;
        dispatch(setTransaction(rest));
        history.push('/checkout')
    }

    useEffect(() => {
        return () => {
            if (transaction?.status !== 'failed') {
                dispatch(clearCheckout())
            }
        }
    }, [])

    return (
        <div className={CheckoutFinishedStyles.container}>
            <div className={CheckoutFinishedStyles.titleContainer}>
                <h1 className={CheckoutFinishedStyles.title}>{title}</h1>
                <div className={CheckoutFinishedStyles.divider}></div>
            </div>
            {transaction?.status === 'verified' && <p className={CheckoutFinishedStyles.orderNumber}>訂單編號：#{transaction_id}</p>}
            <p className={CheckoutFinishedStyles.msg}>{msg}</p>
            <div className={CheckoutFinishedStyles.btnGroup}>
                {(transaction?.status === 'verified' && transaction?.details?.length > 1) && <button className={CheckoutFinishedStyles.normalBtn} onClick={() => purchaseRecordClicked()}>查看購買紀錄</button>}
                {(transaction?.status === 'verified' || transaction?.status === 'pending') && <button className={CheckoutFinishedStyles.normalBtn} onClick={() => otherCourseClicked()}>購買其他課程</button>}
                {(transaction?.status === 'verified' && checkout?.items?.length === 1) && <button className={CheckoutFinishedStyles.highlightBtn} onClick={() => courseClicked(0)}>現在上課</button>}
                {(transaction?.status === 'failed' && <button className={CheckoutFinishedStyles.normalBtn} onClick={() => purchaseAgain()}>重新購買</button>)}
            </div>
        </div>
    )
}

export default CheckoutFinsihed
