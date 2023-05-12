import React, { useState, useEffect } from 'react'
import Axios from 'axios';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { setBillingInfo, setPersonalInfo } from 'redux/actions/checkout'

//component
import OrderDetail from 'components/Checkout/OrderDetail';
import PaymentMethod from 'components/Checkout/PaymentMethod';

import CheckoutStyles from './Checkout.module.scss'
import BillingInfo from 'components/Checkout/BillingInfo';
import PersonalInfo from 'components/Checkout/PersonalInfo';
import Spinner from 'components/Spinner';

import { setUser } from 'redux/actions/user';

//image
import ArrowUp from 'images/icon/arrow_large_up_black@3x.png';
import ArrowDown from 'images/icon/arrow_large_down_black@3x.png';
import { setLoading, setPopup, setPopupPage } from 'redux/actions/global_setting';


const Checkout = () => {

    const dispatch = useDispatch();

    useEffect(() => {

        document.title = '結帳 - MeLearn.Guru'

    }, [])

    const [mobileSection, setMobileSection] = useState({
        orderDetail: true,
        billing: true,
        personal: true,
    })

    const [hasTransaction, setHasTransaction] = useState(false);
    const [billingComplete, setBillingComplete] = useState(false);
    const [personalComplete, setPersonalComplete] = useState(false);
    const [displayError, setDisplayError] = useState(false);
    const [showPaymentMethod, setShowPaymentMethod] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hideMobileFooter, setHideMobileFooter] = useState(false);

    const user = useSelector(store => store.user);
    const transaction = useSelector(store => store.checkout.transaction)

    const [billingInput, setBillingInput] = useState({
        last_name: '',
        first_name: '',
        company: '',
        country: '香港',
        address: '',
        city: '',
        district: '',
        post_code: '',
        default: true,
    })

    const [personalInput, setPersonalInput] = useState({
        username: '',
        email: '',
        area_code: '',
        phone: '',
        first_name: '',
        last_name: '',
        gender: 'M',
        birthday_month: 1,
        interests: [],
        income: 'HK$10,000或以下',
        occupation: '',
    })

    const handleBillingChange = (name, value) => {
        setBillingInput(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handlePersonalChange = (name, value) => {
        setPersonalInput(prev => ({
            ...prev,
            [name]: value
        }))
    }

    useEffect(async () => {

        let mounted = true;

        if (user.isAuth) {

            await Axios.get('/api/transaction-number')
                .then(res => res.data)
                .then(data => {
                    if (!data.error && data.transaction > 0 && mounted) {
                        setHasTransaction(true);
                    }
                })


            await Axios.get('/api/billing-detail')
                .then(res => res.data)
                .then(data => {
                    if (!data.error && mounted) {
                        setBillingInput(prev => ({
                            ...prev,
                            last_name: data.billing_info.billing_last_name,
                            first_name: data.billing_info.billing_first_name,
                            country: data.billing_info.billing_country || '香港',
                            address: data.billing_info.billing_address,
                            city: data.billing_info.billing_city,
                            district: data.billing_info.billing_district,
                            post_code: data.billing_info.billing_post_code,
                            company: data.billing_info.billing_company
                        }))
                    }
                    setIsLoading(false);
                })

            if(mounted){
                setPersonalInput(prev => ({
                    ...prev,
                    username: user.username,
                    email: user.email,
                    area_code: user.area_code,
                    phone: user.phone,
                    first_name: user.first_name || null,
                    last_name: user.last_name || null,
                }))
            }

            return () => {
                mounted = false;
            }
            


        }

    }, [user])

    useEffect(() => {
        if (personalInput) {
            let { username, email, area_code, phone, gender, birthday_month, interests, income, occupation } = personalInput;
            if (username && email && area_code ** phone && gender && birthday_month && interests.length > 0 && income && occupation) {
                setPersonalComplete(true);
            } else {
                setPersonalComplete(false);
            }
        }
    }, [personalInput])

    useEffect(() => {

        if (billingInput) {
            let { last_name, first_name, company, country, address, city, district, post_code } = billingInput;

            if (last_name && first_name && country && address && city && district) {
                setBillingComplete(true);
            } else {
                setBillingComplete(false);
            }
        }

    }, [billingInput])

    const handlePersonalComplete = (val) => {
        setPersonalComplete(val)
    }

    const handleBillingComplete = (val) => {
        setBillingComplete(val)
    }

    const handleContinueBtnClicked = () => {
        setDisplayError(false);
        dispatch(setBillingInfo(billingInput));
        dispatch(setPersonalInfo(personalInput));
        if ((!hasTransaction && !personalComplete) || !billingComplete) {
            setDisplayError(true)
            setMobileSection(prev => ({
                ...prev,
                billing: true,
                personal: true,
            }))
        } else {

            if (billingInput.default) {
                Axios.post('/api/update-user-billing-address', {
                    billing_address: billingInput
                })
                    .then(res => res.data)
                    .then(data => {
                        if (data.error) {
                            console.log(data.error);
                        }
                    })
            }

            Axios.post('/api/update-extra-user-data', {
                personal_data: personalInput
            })
                .then(res => res.data)
                .then(data => {
                    if (!data.error) {
                        dispatch(setUser({
                            isAuth: true,
                            username: data.user.username,
                            email: data.user.email,
                            area_code: data.user.area_code,
                            phone: data.user.phone,
                            login_token: data.user.login_token,
                            role: data.user.role,
                            id: data.user.id
                        }))
                    } else {
                        console.log(data.error)
                    }
                })

            setShowPaymentMethod(true)
        }
    }

    useEffect(() => {

        if (transaction) {
            setShowPaymentMethod(true)
        }

    }, [transaction])

    const handleLogin = () => {
        dispatch(setPopupPage('loginOptions'))
        dispatch(setPopup(true));
    }

    const hideFooter = () => {
        console.log('hide')
        setHideMobileFooter(true);
    }

    const unhideFooter = () => {
        console.log('show')

        setHideMobileFooter(false);
    }

    return (
        <div className={CheckoutStyles.container}>
            <div className={`${CheckoutStyles.tab} ${mobileSection.orderDetail === false ? CheckoutStyles.tabClosed : ''}`} onClick={() => setMobileSection(prev => ({ ...prev, orderDetail: !prev.orderDetail }))}>
                <h3 className={CheckoutStyles.sectionTitle}>訂單詳情</h3>
                <img src={mobileSection.orderDetail ? ArrowUp : ArrowDown} className={CheckoutStyles.arrow} alt="show/hide button"/>
            </div>
            <OrderDetail show={mobileSection.orderDetail} hideFooter={() => hideFooter()} unhideFooter={() => unhideFooter()}/>
            {user.isAuth ? (!showPaymentMethod && <div className={CheckoutStyles.infoSection}>
                {isLoading ? <Spinner /> : <div className={CheckoutStyles.userInfo}>
                    <div className={CheckoutStyles.billingInfo}>
                        <div className={`${CheckoutStyles.tab} ${mobileSection.billing === false ? CheckoutStyles.tabClosed : ''}`} onClick={() => setMobileSection(prev => ({ ...prev, billing: !prev.billing }))}>
                            <h3 className={CheckoutStyles.sectionTitle}>帳單資料</h3>
                            <img src={mobileSection.billing ? ArrowUp : ArrowDown} className={CheckoutStyles.arrow} alt="show/hide button"/>
                        </div>
                        <BillingInfo setBillingInput={handleBillingChange} billingInput={billingInput} setBillingComplete={handleBillingComplete} displayError={displayError} show={mobileSection.billing} hideFooter={() => hideFooter()} unhideFooter={() => unhideFooter()}/>
                    </div>
                    <div className={CheckoutStyles.personalInfo}>
                        {!hasTransaction && <div>
                            <div className={`${CheckoutStyles.tab} ${mobileSection.personal === false ? CheckoutStyles.tabClosed : ''}`} onClick={() => setMobileSection(prev => ({ ...prev, personal: !prev.personal }))}>
                                <h3 className={CheckoutStyles.sectionTitle}>個人資料</h3>
                                <img src={mobileSection.personal ? ArrowUp : ArrowDown} className={CheckoutStyles.arrow} alt="show/hide button"/>
                            </div>
                            <PersonalInfo setPersonalInput={handlePersonalChange} personalInput={personalInput} setPersonalComplete={handlePersonalComplete} displayError={displayError} show={mobileSection.personal} hideFooter={() => hideFooter()} unhideFooter={() => unhideFooter()}/>
                        </div>}
                        <div className={`${CheckoutStyles.btnContainer} ${hideMobileFooter ? CheckoutStyles.hidden : ''}`}>
                            <button className={CheckoutStyles.continueBtn} onClick={handleContinueBtnClicked}>繼續付款</button>
                        </div>
                    </div>

                </div>}

            </div>) : <div className={CheckoutStyles.loginFirstContainer}>
                <p className={CheckoutStyles.loginFirstText}>請先登入以購買課程</p>
                <button className={CheckoutStyles.loginFirstBtn} onClick={handleLogin}>登入</button>
            </div>}
            {showPaymentMethod && <PaymentMethod />}

        </div>

    )
}

export default Checkout
