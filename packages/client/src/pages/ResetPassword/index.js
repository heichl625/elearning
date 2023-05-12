import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import { useParams } from 'react-router-dom'

//redux
import { useDispatch } from 'react-redux';
import { setPopup, setPopupPage } from 'redux/actions/global_setting'

//styels
import ResetPasswordStyles from './ResetPassword.module.scss';

const ResetPassword = () => {

    const dispatch = useDispatch()

    const [newPassword, setNewPassword] = useState({
        password: '',
        confirmPassword: ''
    })

    const [msg, setMsg] = useState('')

    let { token } = useParams();

    useEffect(() => {

        document.title = '重設密碼 - MeLearn.Guru';

    }, [])

    const handleChange = (e) => {

        let { name, value } = e.target;
        setNewPassword(prevVal => {
            return ({
                ...prevVal,
                [name]: value
            })
        })
    }

    const handleSubmit = (e) => {

        e.preventDefault();

        Axios.post('/api/reset-password', {
            token: token,
            password: newPassword.password,
            confirmPassword: newPassword.confirmPassword
        })
            .then(res => res.data)
            .then(data => {
                if (data.error) {
                    setMsg(data.error)
                } else {
                    dispatch(setPopupPage('finished-reset-password'))
                    dispatch(setPopup(true))
                }
            })

    }


    return (
        <div className={ResetPasswordStyles.container}>
            <h1 className={ResetPasswordStyles.title}>重設密碼</h1>
            <p className={ResetPasswordStyles.msg}>請輸入新的密碼</p>
            {msg && <p className={ResetPasswordStyles.error}>{msg}</p>}
            <form className={ResetPasswordStyles.inputForm} onSubmit={handleSubmit}>
                <div className={ResetPasswordStyles.inputGroup}>
                    <input 
                        type='passowrd'
                        onChange={handleChange}
                        value={newPassword.password}
                        name='password'
                        type='password'
                        className={ResetPasswordStyles.inputField}
                        required />
                    <label className={ResetPasswordStyles.floatingLabel}>新密碼</label>
                </div>
                <div className={ResetPasswordStyles.inputGroup}>
                    <input
                        type='passowrd'
                        onChange={handleChange}
                        value={newPassword.confirmPassword}
                        name='confirmPassword'
                        type='password'
                        className={ResetPasswordStyles.inputField}
                        required />
                    <label className={ResetPasswordStyles.floatingLabel}>確認新密碼</label>
                </div>
                <button type='submit' className={ResetPasswordStyles.submitBtn}>更改密碼</button>
            </form>
            
        </div>
    )
}

export default ResetPassword
