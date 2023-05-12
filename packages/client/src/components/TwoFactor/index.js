import React, { useState, useEffect } from 'react';

import Axios from 'axios';

import { useSelector, useDispatch } from 'react-redux';

//fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faCheck } from '@fortawesome/free-solid-svg-icons';

//component
import PopupTitle from '../PopupTitle';

//Styles
import TwoFactorStyles from './TwoFactor.module.scss';
import { setUser } from '../../redux/actions/user';
import { setPopupPage, setPopup } from '../../redux/actions/global_setting';

const TwoFactor = () => {

    const dispatch = useDispatch();

    const user = useSelector(store => store.user);
    const prevPopupPage = useSelector(store => store.global_setting.prevPopupPage);

    const [OTP, setOTP] = useState('');
    const [error, setError] = useState('');
    const [remainingSecond, setRemainingSecond] = useState(60);
    const [resendPopup, setResendPopup] = useState(false)

    useEffect(() => {

        const timer = setInterval(() => {

            if (remainingSecond > 0) {
                setRemainingSecond(prev => prev - 1);
            }

        }, 1000)

        return () => {
            clearInterval(timer)
        };

    }, [remainingSecond])

    useEffect(() => {

        if (resendPopup) {
            const timer = setTimeout(() => {
                setResendPopup(false);
            }, 5000)

            return () => { clearTimeout(timer) };
        }

    }, [resendPopup])

    const verifyOTP = (e) => {

        e.preventDefault();

        if(user.isAuth === true){
            Axios.post('/api/edit-phone-number', {
                code: OTP,
                email: user.email,
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                area_code: user.area_code,
                phone: user.phone,
                gender: user.gender,
                birthday_month: user.birthday_month,
                interests: user.interests,
                income: user.income,
                occupation: user.occupation
            })
                .then(res => res.data)
                .then(data => {
                    if(!data.error){
                        dispatch(setUser({
                            login_token: data.user.login_token,
                            id: data.user.id,
                            email: data.user.email,
                            username: data.user.username,
                            first_name: data.user.first_name,
                            last_name: data.user.last_name,
                            role: data.user.role,
                            isAuth: true,
                            area_code: data.user.area_code,
                            phone: data.user.phone
                        }))
                        dispatch(setPopupPage('modify-phone-success'));
                    }else {
                        if (data.error.INCORRECT_CODE) {
                            setError(data.error.INCORRECT_CODE);
                        } else {
                            setError('發生錯誤');
                        }
                    }
                })

        }else{
            if(prevPopupPage === 'reset-password'){
                dispatch(setPopupPage('reset-pw-email-sent'))
            }else{
                Axios.post('/api/login/2fa', {
                    code: OTP,
                    email: user.email
                })
                    .then(res => {
                        if (!res.data.error) {

                            let expiry;
                            if(user.remember_me){
                                let now = new Date();
                                let time = now.getTime();
                                let expireTime = time + 30*24*60*60*1000;
                                now.setTime(expireTime);
                                expiry=now;
                            }

                            document.cookie = `login_token=${res.data.user.login_token}; ${expiry ? `expires=${expiry.toUTCString()}` : ''}; path=/; SameSite=Lax;`;
                            Axios.defaults.headers.common['Authorization'] = res.data.user.login_token
                            dispatch(setUser({
                                id: res.data.user.id,
                                username: res.data.user.username,
                                first_name: res.data.user.first_name,
                                last_name: res.data.user.last_name,
                                login_token: res.data.user.login_token,
                                phone: res.data.user.phone,
                                email: res.data.user.email,
                                role: res.data.user.role,
                                isAuth: true
                            }));
                            
                            if (prevPopupPage !== 'register') {
                                dispatch(setPopup());
                            } else {
                                dispatch(setPopupPage('finished-registration'))
                            }
        
                        } else {
                            if (res.data.error.INCORRECT_CODE) {
                                setError(res.data.error.INCORRECT_CODE);
                            } else {
                                setError('發生錯誤');
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
            
        }

        
    }

    const resendSMS = () => {
        setRemainingSecond(60);
        Axios.post('/api/login/resend-2fa', {
            email: user.email
        })
            .then(res => {
                if (!res.data.error) {
                    setResendPopup(true);
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    const goBack = () => {
        dispatch(setPopupPage(prevPopupPage));
    }


    return (
        <div className={TwoFactorStyles.container}>
            <PopupTitle title="驗證OTP" />
            <p className={TwoFactorStyles.msg}>一次性密碼已經以短訊傳送到電話號碼<span className={TwoFactorStyles.phone}> {user.area_code} - {user.phone} </span>，請於下方欄輸入一次密碼登入MeLearn.guru。</p>
            <form className={TwoFactorStyles.OTPForm} onSubmit={verifyOTP}>
                <div className={TwoFactorStyles.inputGroup}>
                    <input
                        className={TwoFactorStyles.inputField}
                        value={OTP}
                        onChange={(e) => setOTP(e.target.value)}
                        required
                    />
                    <label className={TwoFactorStyles.floatingLabel}>一次性密碼</label>
                    {error && <p className={TwoFactorStyles.errorMsg}>{error}</p>}
                </div>

                <p className={TwoFactorStyles.notReceived}>
                    沒有收到？
                    <span className={`${TwoFactorStyles.resendButton} ${remainingSecond > 0 && TwoFactorStyles.inactive}`} onClick={resendSMS}>{`重新傳送${remainingSecond > 0 ? `(${remainingSecond}s)` : ''}`}</span>
                </p>
                <button className={TwoFactorStyles.confirmBtn}>確定</button>
            </form>
            {!user.isAuth && <p className={TwoFactorStyles.backBtn} onClick={goBack}>
                <FontAwesomeIcon icon={faChevronLeft} className={TwoFactorStyles.backIcon} />返回上一頁
            </p>}
            { resendPopup && <label className={TwoFactorStyles.resendPopup}><FontAwesomeIcon icon={faCheck} className={TwoFactorStyles.checkIcon} />已重新傳送</label>}

        </div>
    )
}

export default TwoFactor
