import React, { useState } from 'react'
import Axios from 'axios';

import { useSelector, useDispatch } from 'react-redux';
import { setPopupPage } from '../../redux/actions/global_setting';

//component
import PopupTitle from '../PopupTitle';

//fontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

//styles
import ForgotPasswordStyles from './ForgotPassword.module.scss';

const ForgotPassword = () => {

    const dispatch = useDispatch();

    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [error, setError] = useState('');

    const goBack = () => {
        dispatch(setPopupPage('login'))
    }

    const handleSubmit = (e) => {

        e.preventDefault();

        setError('')

        Axios.post('/api/forgot-passowrd', {
            emailOrUsername: emailOrUsername
        })
        .then(res => res.data)
        .then(data => {
            if(data.error){
                setError(data.error)
            }else if(data.message === 'email sent'){
                dispatch(setPopupPage('reset-pw-email-sent'))
            }
        })

    }


    return (
        <div className={ForgotPasswordStyles.container}>
            <PopupTitle title='忘認密碼？' />
            <p className={ForgotPasswordStyles.msg}>請輸入你的用戶名稱或電郵，以透過電郵收取設密碼的連結</p>
            <form className={ForgotPasswordStyles.inputForm} onSubmit={handleSubmit}>
                <div className={ForgotPasswordStyles.inputGroup}>
                    <input
                        value={emailOrUsername}
                        onChange={(e) => setEmailOrUsername(e.target.value)}
                        className={ForgotPasswordStyles.inputField}
                        required
                    />
                    <label className={ForgotPasswordStyles.floatingLabel}>用戶名稱/電郵地址</label>
                    {error && <p className={ForgotPasswordStyles.errorMsg}>{error}</p>}
                </div>
                <button className={ForgotPasswordStyles.submitBtn}>重設密碼</button>
            </form>
            <p className={ForgotPasswordStyles.backBtn} onClick={goBack}>
                <FontAwesomeIcon icon={faChevronLeft} className={ForgotPasswordStyles.backIcon}/>返回上一頁
            </p>

        </div>
    )
}

export default ForgotPassword
