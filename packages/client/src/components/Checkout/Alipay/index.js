import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
import { sha512 } from 'js-sha512';
import { v4 as uuidv4 } from 'uuid';

import { useSelector, useDispatch } from 'react-redux'
import { setLoading, setPopup, setPopupPage } from 'redux/actions/global_setting'
import { clearCheckout, setProceedPayment } from 'redux/actions/checkout';

import AlipayStyles from './Alipay.module.scss';

const Alipay = () => {

    const checkout = useSelector(store => store.checkout);
    const user = useSelector(store => store.user);
    const formRef = useRef(null);

    const [custormer_ip, setCustomer_ip] = useState('');
    const [data, setData] = useState();
    const [readyToPay, setReadyToPay] = useState(false);

    const secret = '70b94036-56f8-4bec-9c3b-a2b9f3236462';

    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {

        let mounted = true;

        if (checkout.subtotal > 0) {
            Axios.get('/api/get-user-ip')
                .then(res => {
                    if (mounted) {
                        setCustomer_ip(res.data);
                    }
                })
        }

        return () => {
            mounted = false;
        }

    }, [checkout])

    useEffect(() => {

        if (readyToPay === true && data) {

            formRef.current.submit();

        }

    }, [readyToPay, data])

    useEffect(() => {

        if (checkout.proceed_payment) {
            if (checkout.transaction) {
                let dataObj = {
                    merchant_reference: '#' + checkout.transaction?.id,
                    currency: 'HKD',
                    amount: (checkout.coupon ? checkout.subtotal - checkout.coupon?.discount : checkout.subtotal) + '.00',
                    network: 'Alipay',
                    subject: 'Transaction_id: #' + checkout.transaction?.id,
                    customer_first_name: checkout.transaction.first_name,
                    customer_last_name: checkout.transaction.last_name,
                    customer_phone: user.area_code + user.phone,
                    customer_email: user.email,
                    custormer_ip: custormer_ip,
                    return_url: process.env.REACT_APP_BASE_URL + 'api/alipay-callback'
                }

                let keys = Object.keys(dataObj);
                let orderedKeys = keys.sort();

                const orderedDataObj = orderedKeys.reduce(
                    (obj, key) => {
                        obj[key] = dataObj[key];
                        return obj;
                    },
                    {}
                );
                const params = new URLSearchParams(orderedDataObj);

                setData({
                    ...dataObj,
                    sign: sha512(params.toString() + secret)
                })

                setReadyToPay(true);
            } else {
                Axios.post('/api/create-transaction', {
                    cart: checkout.items,
                    coupon: checkout.coupon,
                    method: 'alipay',
                    billing_info: checkout.billing_info
                })
                    .then(res => res.data)
                    .then(data => {
                        if (!data.error) {
                            let dataObj = {
                                merchant_reference: '#' + data?.transaction?.id,
                                currency: 'HKD',
                                amount: (checkout.coupon ? checkout.subtotal - checkout.coupon?.discount : checkout.subtotal) + '.00',
                                network: 'Alipay',
                                subject: 'Transaction_id: #' + data?.transaction?.id,
                                customer_first_name: checkout.billing_info.first_name,
                                customer_last_name: checkout.billing_info.last_name,
                                customer_phone: user.area_code + user.phone,
                                customer_email: user.email,
                                custormer_ip: custormer_ip,
                                return_url: process.env.REACT_APP_BASE_URL + 'api/alipay-callback'
                            }

                            let keys = Object.keys(dataObj);
                            let orderedKeys = keys.sort();

                            const orderedDataObj = orderedKeys.reduce(
                                (obj, key) => {
                                    obj[key] = dataObj[key];
                                    return obj;
                                },
                                {}
                            );
                            const params = new URLSearchParams(orderedDataObj);

                            setData({
                                ...dataObj,
                                sign: sha512(params.toString() + secret)
                            })

                            setReadyToPay(true);
                        } else {
                            if (data.error.PRICE_CHANGED) {
                                history.push('/price-changed');
                                dispatch(clearCheckout())
                            }
                        }
                    })
            }

            dispatch(setProceedPayment(false))
        }

    }, [checkout.proceed_payment])

    const handlePay = () => {

        const checkPendingTransaction = () => {
            Axios.post('/api/checkout/check-pending-transaction', {
                courses: checkout.items,
                transaction_id: checkout.transaction?.id || null
            })
                .then(res => res.data)
                .then(data => {
                    if (data.error?.PENDING_TRANSACTION) {
                        dispatch(setLoading(false));
                        dispatch(setPopupPage('pending-transaction-exist'))
                        dispatch(setPopup(true))
                    }
                    if (data.next) {
                        dispatch(setProceedPayment(true));
                    }
                })
        }

        checkPendingTransaction()

    }

    return (
        <div className={AlipayStyles.container}>
            <p class={AlipayStyles.alert}>溫馨提示：如透過Alipay付款，在交易完成前請不要關閉該二維碼頁面，待頁面跳轉回本平台後方可關閉，否則閣下的交易將會受到影響。</p>

            <form action="https://payment.pa-sys.com/app/page/b9a1618b-be2e-4931-aa63-006f1e9133bc" method='POST' name="payment" acceptCharset='utf-8' ref={formRef}>
                {data && Object.keys(data).map(key => {
                    return <input defaultValue={data[key]} name={key} key={uuidv4()} className={AlipayStyles.hiddenInput} />
                })}
            </form>
            <div className={AlipayStyles.btnContainer}>
                <div className={AlipayStyles.mobileFooterPrice}>
                    <div className={AlipayStyles.footerPriceRow}>
                        <p className={AlipayStyles.mobilePriceText}>小計 HK${checkout.subtotal}.00</p>
                        <p className={AlipayStyles.mobilePriceText}>折扣 {checkout.coupon ? `HK$${checkout.coupon.discount}.00` : '-'}</p>
                    </div>
                    <div className={AlipayStyles.mobilePriceTotal}>
                        <p className={AlipayStyles.mobilePriceText}>累計</p>
                        <p className={AlipayStyles.mobilePriceTotalText}>HK${checkout.coupon ? checkout.subtotal - checkout.coupon.discount : checkout.subtotal}.00</p>
                    </div>
                </div>

                <button onClick={handlePay} className={AlipayStyles.payBtn}>使用Alipay付款</button>
            </div>
        </div >

    )
}

export default Alipay
