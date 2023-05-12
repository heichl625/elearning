import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import Axios from 'axios'
import { v4 as uuidv4 } from 'uuid';

//redux
import { useSelector, useDispatch } from 'react-redux'
import { clearCart } from 'redux/actions/cart'
import { setTransaction, setError, setCheckoutItems, clearCheckout, setProceedPayment } from 'redux/actions/checkout'
import { setLoading, setPopup, setPopupPage } from 'redux/actions/global_setting';

//styles
import CreditCardFormStyles from './CreditCardForm.module.scss'

//stripe
import { useStripe, useElements } from '@stripe/react-stripe-js'

//images
import checkbox_off from 'images/icon/check_box_off@3x.png';
import checkbox_on from 'images/icon/check_box_on@3x.png'
import Spinner from 'components/Spinner';
import visa from 'images/icon/visa@3x.png';
import master from 'images/icon/master@3x.png';
import ae from 'images/icon/ae@3x.png';

const CheckoutForm = () => {

    const stripe = useStripe();
    const elements = useElements();
    const history = useHistory();

    const [email, setEmail] = useState('');
    const [card, setCard] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [rememberCard, setRememberCard] = useState(false);
    const [cardError, setCardError] = useState('')
    const [expiryError, setExpiryError] = useState('')
    const [cvcError, setCvcError] = useState('');
    const [formSubmitted, setFormsubmitted] = useState(false);
    const [savedCards, setSavedCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState();
    const [hideFooter, setHideFooter] = useState(false);
    const dispatch = useDispatch();

    const user = useSelector(store => store.user);
    const checkout = useSelector(store => store.checkout);
    const loading = useSelector(store => store.global_setting.loading);

    useEffect(() => {
        dispatch(setLoading(true))
    }, [])

    useEffect(() => {

        let mounted = true;

        if (user.isAuth && checkout && loading === true && formSubmitted === false) {
            setEmail(user.email)

            Axios.get('/api/credit-card-list')
                .then(res => res.data)
                .then(data => {
                    if (mounted) {
                        if (!data.error) {
                            setSavedCards(data.cards)
                        }
                        dispatch(setLoading(false));
                    }
                })
                .catch(err => {
                    console.log(err);
                    if (mounted) {
                        dispatch(setLoading(false));
                    }
                })
        }

    }, [user, checkout, loading, formSubmitted])

    const handleSubmit = async (e) => {

        e.preventDefault();
        setFormsubmitted(true);
        dispatch(setLoading(true))
        setCardError();
        setExpiryError();
        setCvcError();

        if (!selectedCard) {
            if (!card) {
                setCardError('請輸入信用卡號碼');
            }
            if (!expiry || expiry.length !== 5) {
                setExpiryError('請輸入信用卡到期日（MM/YY）')
            }

            if (!cvc) {
                setCvcError('請輸入安全碼')
            }

            if (!card || !expiry || expiry.length !== 5 || !cvc) {
                dispatch(setLoading(false))
                return
            }
        }

        if (!stripe || !elements) {
            return
        }

        dispatch(setError());

        const checkPendingTransaction = () => {
            Axios.post('/api/checkout/check-pending-transaction', {
                courses: checkout.items
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


        checkPendingTransaction();

    }

    useEffect(() => {

        const pay = (transaction_id) => {
            Axios.post('/api/pay-with-credit-card', {
                transaction_id: transaction_id,
                card: {
                    number: card.replace(/\s/g, ""),
                    exp_month: expiry.split('/')[0],
                    exp_year: expiry.split('/')[1],
                    cvc: cvc
                },
                rememberCard: rememberCard,
                selectedCard: selectedCard,
            })
                .then(res => res.data)
                .then(transactionData => {
                    if (!transactionData.error) {
                        if (transactionData.paymentIntent.status === 'succeeded') {
                            dispatch(setTransaction(transactionData.transaction))
                            document.cookie = `cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
                            dispatch(clearCart())
                            dispatch(setLoading(false))
                            history.push(`/checkout-finished?transaction_id=${transaction_id}`);
                        }
                    } else {
                        console.log(transactionData.error.code);
                        switch (transactionData.error.code) {
                            case "invalid_expiry_month":
                            case "invalid_expiry_year":
                                setExpiryError('請輸入有效的信用卡到期日')
                                dispatch(setLoading(false))
                                break;
                            case "invalid_number":
                            case "incorrect_number":
                                setCardError('請輸入正確的信用卡號碼');
                                dispatch(setLoading(false))
                                break;
                            case "invalid_cvc":
                                setCvcError('請輸入正確的安全碼');
                                dispatch(setLoading(false))
                                break;
                            default:
                                dispatch(setError(transactionData.error.raw.message))
                                dispatch(setLoading(false))
                                let queryString = new URLSearchParams({
                                    transaction_id: transaction_id,
                                    reason: transactionData.error.raw.message
                                })
                                history.push(`/checkout-finished?${queryString.toString()}`)
                                break;
                        }

                    }
                })
        }

        if (checkout.proceed_payment) {

            if (checkout.transaction) {
                pay(checkout.transaction.id);
            } else {
                Axios.post('/api/create-transaction', {
                    cart: checkout.items,
                    coupon: checkout.coupon,
                    method: 'creditcard',
                    billing_info: checkout.billing_info,
                })
                    .then(res => res.data)
                    .then(data => {
                        if (!data.error) {
                            pay(data.transaction.id)
                        } else {
                            if (data.error.PRICE_CHANGED) {
                                history.push(`/price-changed`);
                                dispatch(clearCheckout())
                            }
                        }
                        dispatch(setProceedPayment(false))
                    })
            }
        }

    }, [checkout.proceed_payment])

    const handleCardChange = (e) => {
        let { value } = e.target;

        if ((value.length <= 19 && /^(?=.*\d)[\d ]+$/.test(value)) || value === '') {
            setCard(value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim())
        }

    }

    const handleExpiryChange = (e) => {
        let { value } = e.target;

        if ((value.length <= 5) || value === '') {
            if (expiry.length === 2 && value.length === 3) {
                setExpiry(value.slice(0, 2) + '/' + value.slice(2, 3))
            } else if (expiry.length === 4 && value.length === 3) {
                setExpiry(value.slice(0, 2))
            } else {
                setExpiry(value)
            }

        }
    }

    const handleSelectCard = (card) => {
        if (selectedCard?.id === card.id) {
            setSelectedCard();
        } else {
            setSelectedCard(card);
        }

    }

    const handleHideFooter = () => {
        setHideFooter(true)
    }

    const handleUnhideFooter = () => {
        setHideFooter(false)
    }

    return (
        <div className={CreditCardFormStyles.container}>
            {loading ? <Spinner /> :
                <div className={CreditCardFormStyles.cardSelectionContainer}>
                    {savedCards.length > 0 && <p className={CreditCardFormStyles.sectionTitle}>使用已儲存信用卡</p>}
                    {savedCards.length > 0 && savedCards.map(card => {
                        return <div className={CreditCardFormStyles.savedCardContainer} key={uuidv4()}>
                            <div className={CreditCardFormStyles.radio} onClick={() => handleSelectCard(card)}>
                                {selectedCard?.id === card.id && <div className={CreditCardFormStyles.activeRadio}>
                                </div>}
                            </div>
                            <img className={CreditCardFormStyles.cardBrand} src={card.brand === 'visa' ? visa : card.brand === 'mastercard' ? master : card.brand === 'amex' ? ae : ''} alt={`${card.brand} icon`} />
                            <label className={CreditCardFormStyles.cardDesc}>{card.brand === 'visa' ? 'Visa' : card.brand === 'mastercard' ? 'Mastercard' : card.brand === 'amex' ? 'American Express' : ''} ． {card.last4} - {card.exp_month}/{card.exp_year}到期</label>
                        </div>
                    })}
                    {savedCards.length > 0 && <p className={CreditCardFormStyles.sectionTitle}>使用其他信用卡</p>}
                    <form className={CreditCardFormStyles.form} onSubmit={handleSubmit}>
                        <div className={CreditCardFormStyles.content}>
                            <div className={CreditCardFormStyles.inputGroup}>
                                <input
                                    className={CreditCardFormStyles.inputField}
                                    value={card}
                                    onChange={handleCardChange}
                                    disabled={selectedCard ? true : false}
                                    required
                                    onFocus={handleHideFooter}
                                    onBlur={handleUnhideFooter} />
                                <label className={CreditCardFormStyles.floatingLabel}>信用卡號碼</label>
                                {cardError && <p className={CreditCardFormStyles.error}>{cardError}</p>}
                            </div>
                            <div className={CreditCardFormStyles.inputGroup}>
                                <input
                                    className={CreditCardFormStyles.inputField}
                                    value={expiry}
                                    onChange={handleExpiryChange}
                                    disabled={selectedCard ? true : false}
                                    required
                                    onFocus={handleHideFooter}
                                    onBlur={handleUnhideFooter} />
                                <label className={CreditCardFormStyles.floatingLabel}>到期日(MM/YY)</label>
                                {expiryError && <p className={CreditCardFormStyles.error}>{expiryError}</p>}
                            </div>
                            <div className={CreditCardFormStyles.inputGroup}>
                                <input
                                    className={CreditCardFormStyles.inputField}
                                    value={cvc}
                                    onChange={(e) => setCvc(e.target.value)}
                                    maxLength="4"
                                    disabled={selectedCard ? true : false}
                                    required
                                    onFocus={handleHideFooter}
                                    onBlur={handleUnhideFooter} />
                                <label className={CreditCardFormStyles.floatingLabel}>安全碼</label>
                                {cvcError && <p className={CreditCardFormStyles.error}>{cvcError}</p>}
                            </div>
                            <div className={CreditCardFormStyles.checkboxContainer}>
                                <img className={CreditCardFormStyles.checkbox} src={rememberCard ? checkbox_on : checkbox_off} onClick={() => setRememberCard(prev => !prev)} alt="custom checkbox" />
                                <p>將付款信息保存到我的帳戶中，以備將來購買</p>
                            </div>
                        </div>
                        <div className={`${CreditCardFormStyles.btnContainer} ${hideFooter ? CreditCardFormStyles.hidden : ''}`}>
                            <div className={CreditCardFormStyles.mobileFooterPrice}>
                                <div className={CreditCardFormStyles.footerPriceRow}>
                                    <p className={CreditCardFormStyles.mobilePriceText}>小計 HK${checkout.subtotal}.00</p>
                                    <p className={CreditCardFormStyles.mobilePriceText}>折扣 {checkout.coupon ? `HK$${checkout.coupon.discount}.00` : '-'}</p>
                                </div>
                                <div className={CreditCardFormStyles.mobilePriceTotal}>
                                    <p className={CreditCardFormStyles.mobilePriceText}>累計</p>
                                    <p className={CreditCardFormStyles.mobilePriceTotalText}>HK${checkout.coupon ? checkout.subtotal - checkout.coupon.discount : checkout.subtotal}.00</p>
                                </div>
                            </div>
                            <button onClick={handleSubmit} className={CreditCardFormStyles.payBtn}>確認付款</button>
                        </div>

                    </form>
                </div>
            }
        </div>
    )
}

export default CheckoutForm
