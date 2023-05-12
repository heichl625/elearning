import React, { useState } from 'react'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';


//component
import CreditCardForm from 'components/Checkout/CreditCardForm';
import UploadProof from 'components/Checkout/UploadProof';
import Alipay from 'components/Checkout/Alipay';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { setMethod } from 'redux/actions/checkout';

//styles
import PaymentMethodStyles from './PaymentMethod.module.scss';

//images
import creditcardImg from 'images/icon/payment_method_visa@3x.png';
import alipayImg from 'images/icon/payment_method_alipay@3x.png';
import fpsImg from 'images/icon/payment_method_fps@3x.png'
import ArrowUp from 'images/icon/arrow_large_up_black@3x.png';
import ArrowDown from 'images/icon/arrow_large_down_black@3x.png';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK);

const PaymentMethod = () => {

    const dispatch = useDispatch();

    const items = useSelector(store => store.checkout.items);
    const method = useSelector(store => store.checkout.method);
    const coupon = useSelector(store => store.checkout.coupon);
    const [mobileShow, setMobileShow] = useState(true);

    return (
        <div className={PaymentMethodStyles.container}>
            <div className={PaymentMethodStyles.top}>
                <div className={`${PaymentMethodStyles.tab} ${!mobileShow ? PaymentMethodStyles.tabClosed : ''}`} onClick={() => setMobileShow(prev => !prev)}>
                    <h3 className={PaymentMethodStyles.title}>選擇付款方式</h3>
                    <img src={mobileShow ? ArrowUp : ArrowDown} className={PaymentMethodStyles.arrow} alt="show/hide button"/>
                </div>
                <div className={`${PaymentMethodStyles.optionContainer} ${mobileShow === true ? PaymentMethodStyles.mobile : ''}`}>
                    <div className={`${PaymentMethodStyles.option} ${method === 'creditcard' ? PaymentMethodStyles.active : ''}`} onClick={() => dispatch(setMethod('creditcard'))}>
                        <p className={PaymentMethodStyles.optionTitle}>信用卡</p>
                        <img src={creditcardImg} className={PaymentMethodStyles.methodImg} alt="credit card accepting master, visa, ae"/>
                    </div>
                    <div className={`${PaymentMethodStyles.option} ${method === 'alipay' ? PaymentMethodStyles.active : ''}`} onClick={() => dispatch(setMethod('alipay'))}>
                        <p className={PaymentMethodStyles.optionTitle}>Alipay</p>
                        <img src={alipayImg} className={PaymentMethodStyles.methodImg} alt="alipay"/>
                    </div>
                    <div className={`${PaymentMethodStyles.option} ${method === 'fps' ? PaymentMethodStyles.active : ''}`} onClick={() => dispatch(setMethod('fps'))}>
                        <p className={PaymentMethodStyles.optionTitle}>轉數快</p>
                        <img src={fpsImg} className={PaymentMethodStyles.methodImg} alt="fps"/>
                    </div>
                    <div className={`${PaymentMethodStyles.option} ${method === 'bank-transfer' ? PaymentMethodStyles.active : ''}`} onClick={() => dispatch(setMethod('bank-transfer'))}>
                        <p className={PaymentMethodStyles.optionTitle}>銀行轉帳</p>
                    </div>
                </div>
            </div>
            <div className={`${PaymentMethodStyles.paymentDetailContainer} ${mobileShow ? PaymentMethodStyles.mobile : ''}`}>
                {method === 'creditcard' && <div className={PaymentMethodStyles.creditCardInfoContainer}>
                    <Elements stripe={stripePromise}>
                        <CreditCardForm cart={items} coupon={coupon} />
                    </Elements>
                </div>}
                {method == 'alipay' && <Alipay />}
                {(method === 'fps' || method === 'bank-transfer') && <UploadProof />}
            </div>
        </div>
    )
}

export default PaymentMethod
