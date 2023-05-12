import React, { useState, useEffect } from 'react'
import Axios from 'axios';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../redux/actions/user';
import { setPopupPage, setPrevPopupPage, setPopup } from '../../redux/actions/global_setting';

//component
import PopupTitle from '../PopupTitle';

//fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

//images
import tick from 'images/icon/tick_white@3x.png';

//styles
import LoginStyles from './Login.module.scss';

const Login = () => {

    const dispatch = useDispatch();

    const [loginData, setLoginData] = useState({
        emailOrUsername: '',
        password: ''
    })
    const [error, setError] = useState({
        usernameError: '',
        passwordError: '',
    })

    const [disableSubmitBtn, setDisableSubmitBtn] = useState(false);

    const [rememberMe, setRememberMe] = useState(false);

    useEffect(()=> {

        if(dispatch){
            dispatch(setPrevPopupPage(''))
        }
        
    }, [dispatch])

    const forgotPasswordClicked = () => {
        dispatch(setPrevPopupPage('login'));
        dispatch(setPopupPage('forgot-password'));
    }

    const handleRegister = () => {
        dispatch(setPopupPage('register'))
    }

    const formSubmit = (event) => {

        event.preventDefault();
        setError({
            usernameError: '',
            passwordError: ''
        })

        setDisableSubmitBtn(true);
        
        Axios.post('/api/login', {
            emailOrUsername: loginData.emailOrUsername,
            password: loginData.password
        })
            .then(res => {
                
                if (!res.data.error) {
                    if (res.data.next === 'reset_pw') {
                        dispatch(setUser({
                            email: res.data.oldUser.user_email,
                            username: res.data.oldUser.user_login
                        }))
                        dispatch(setPopupPage('reset-password'))
                        
                        // history.push({
                        //     pathname: '/update-old-user-data',
                        //     state: {
                        //         user: res.data.oldUser
                        //     }
                        // })
                    }

                    //Redirect to 2fa popup
                    if (res.data.next === '2fa') {

                        //store user's phone and email to redux
                        dispatch(setUser({
                            email: res.data.email,
                            phone: res.data.phone,
                            area_code: res.data.area_code,
                            remember_me: rememberMe
                        }))
                        //Go to 2fa popup
                        if(process.env.REACT_APP_NODE_ENV !== 'production'){
                            alert(res.data.code)
                        }
                        
                        dispatch(setPrevPopupPage('login'));
                        dispatch(setPopupPage('2fa'));

                        // history.push({
                        //     pathname: '/login/phone-verification',
                        //     state: {
                        //         email: loginData.email,
                        //         phone: res.data.phone
                        //     }
                        // })
                    }
                    if(res.data.next === 'admin-authed'){
                        let expiry;
                            if(rememberMe){
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
                            dispatch(setPopup(false))
                            dispatch(setPopupPage(''))
                    }
                }else {
                    if(res.data.error.NOT_EXIST){
                        setError(prev => ({...prev, usernameError: res.data.error.NOT_EXIST}))
                    }else if(res.data.error.AC_BANNED){
                        setError(prev => ({...prev, usernameError: res.data.error.AC_BANNED}))
                    }else if(res.data.error.INCORRECT_PW){
                        setError(prev => ({...prev, passwordError: res.data.error.INCORRECT_PW}))
                    }else{
                        setError(prev => ({...prev, usernameError: res.data.error}))
                    }
                    setDisableSubmitBtn(false)
                }
            })
            .catch(err => {
                console.log(err);
            })

    }

    return (
        <div className={LoginStyles.container}>
            <div className={LoginStyles.titleContainer}>
                <PopupTitle title="登入" />
                <p className={LoginStyles.registerText}>沒有帳戶？<span className={LoginStyles.registerBtn} onClick={handleRegister}>快速註冊</span></p>
            </div>
            <form className={LoginStyles.loginForm} onSubmit={formSubmit}>
                <div className={LoginStyles.inputGroup}>
                    <input
                        className={LoginStyles.inputField}
                        value={loginData.emailOrUsername}
                        onChange={(e) => setLoginData(prev => ({ ...prev, emailOrUsername: e.target.value }))}
                        required />
                    <label className={LoginStyles.floatingLabel}>用戶名稱/電郵地址</label>
                    {error.usernameError && <p className={LoginStyles.errorMsg}>{error.usernameError}</p>}
                </div>
                
                <div className={LoginStyles.inputGroup}>
                    <input
                        className={LoginStyles.inputField}
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        type="password"
                        required />
                    <label className={LoginStyles.floatingLabel}>密碼</label>
                    {error.passwordError && <p className={LoginStyles.errorMsg}>{error.passwordError}</p>}
                </div>
                <div className={LoginStyles.rememberAndForgot}>
                    <div className={LoginStyles.rememberMeContainer}>
                        <div className={LoginStyles.checkbox} onClick={() => setRememberMe(prev  => !prev)}>
                            {rememberMe && <img src={tick} className={LoginStyles.checked} alt="remember me checkbox"/>}
                        </div>
                        <label className={LoginStyles.rememberMe}>記住我</label>
                    </div>
                    <p className={LoginStyles.forgotPassword} onClick={forgotPasswordClicked}>忘記密碼</p>
                </div>
                <button type='submit' className={LoginStyles.loginBtn} disabled={disableSubmitBtn}>登入</button>
            </form>
            <p className={LoginStyles.backBtn} onClick={() => dispatch(setPopupPage('loginOptions'))}>
                <FontAwesomeIcon icon={faChevronLeft} className={LoginStyles.backIcon} />返回上一頁
            </p>
        </div>
    )
}

export default Login
