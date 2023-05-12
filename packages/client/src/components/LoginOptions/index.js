import React from 'react'
import Axios from 'axios'

import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { GoogleLogin } from 'react-google-login';

//styles
import LoginOptionsStyles from './LoginOptions.module.scss';

//redux
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/actions/user';
import { setPopupPage, setPopup, setPrevPopupPage } from '../../redux/actions/global_setting';

//images
import coverImg from '../../images/login/login_cover.png'
import facebookBtn from 'images/Button/action_btn_circle_facebook@3x.png';
import googleBtn from 'images/Button/action_btn_circle_google@3x.png';

const LoginOptions = () => {

    const dispatch = useDispatch();

    const registerClicked = () => {
        dispatch(setPopupPage('register'));
    }

    const loginClicked = () => {
        dispatch(setPopupPage('login'));
    }

    const responseFacebook = (res) => {
        let { email, userID } = res;

        Axios.post('/api/login/social-platform', {
            email: email,
            userID: userID,
            platform: 'facebook'
        })
            .then(res => res.data)
            .then(data => {
                if (data.user) {
                    localStorage.setItem('login_token', data.user.login_token);
                    localStorage.setItem('role', data.user.role);
                    Axios.defaults.headers.common['Authorization'] = data.user.login_token


                    if (data.missing_fields) {
                        dispatch(setUser({
                            email: email,
                            facebook_id: data.user.facebook_id
                        }));
                        dispatch(setPopupPage('missing-fields'))

                    } else {

                        // let expiry;
                        // let now = new Date();
                        // let time = now.getTime();
                        // let expireTime = time + 30 * 24 * 60 * 60 * 1000;
                        // now.setTime(expireTime);
                        // expiry = now;


                        // dispatch(setUser({ ...data.user, isAuth: true }));
                        // document.cookie = `login_token=${data.user.login_token}; ${expiry ? `expires=${expiry.toUTCString()}` : ''}; path=/; SameSite=Lax;`;
                        // dispatch(setPopup())
                        
                    }
                }else{
                    if (data.next === '2fa') {

                        //store user's phone and email to redux
                        dispatch(setUser({
                            email: data.email,
                            phone: data.phone,
                            area_code: data.area_code,
                            remember_me: true
                        }))
                        //Go to 2fa popup
                        if (process.env.REACT_APP_NODE_ENV !== 'production') {
                            alert(data.code)
                        }

                        dispatch(setPrevPopupPage('login'));
                        dispatch(setPopupPage('2fa'));
                        dispatch(setPopup(true))

                        // history.push({
                        //     pathname: '/login/phone-verification',
                        //     state: {
                        //         email: loginData.email,
                        //         phone: res.data.phone
                        //     }
                        // })
                    }

                    if (data.next === 'admin-authed') {
                        let expiry;

                        let now = new Date();
                        let time = now.getTime();
                        let expireTime = time + 30 * 24 * 60 * 60 * 1000;
                        now.setTime(expireTime);
                        expiry = now;


                        document.cookie = `login_token=${data.user.login_token}; ${expiry ? `expires=${expiry.toUTCString()}` : ''}; path=/; SameSite=Lax;`;
                        Axios.defaults.headers.common['Authorization'] = data.user.login_token
                        dispatch(setUser({
                            id: data.user.id,
                            username: data.user.username,
                            first_name: data.user.first_name,
                            last_name: data.user.last_name,
                            login_token: data.user.login_token,
                            phone: data.user.phone,
                            email: data.user.email,
                            role: data.user.role,
                            isAuth: true
                        }));
                        dispatch(setPopup(false))
                        dispatch(setPopupPage(''))
                    }
                }
                if (data.error) {
                    dispatch(setPopupPage('social-login-fail'));
                }
            })
    }

    const responseGoogle = (res) => {

        const { googleId, profileObj } = res;

        Axios.post('/api/login/social-platform', {
            userID: googleId,
            email: profileObj.email,
            platform: 'google'
        })
            .then(res => res.data)
            .then(data => {
                if (data.user) {
                    localStorage.setItem('login_token', data.user.login_token);
                    localStorage.setItem('role', data.user.role);
                    Axios.defaults.headers.common['Authorization'] = data.user.login_token
                    console.log(Axios.defaults.headers.common['Authorization'])
                    if (data.missing_fields) {
                        dispatch(setUser({
                            email: profileObj.email,
                            google_id: data.user.google_id
                        }));
                        dispatch(setPopupPage('missing-fields'))

                    } else {

                        // let expiry;
                        // let now = new Date();
                        // let time = now.getTime();
                        // let expireTime = time + 30 * 24 * 60 * 60 * 1000;
                        // now.setTime(expireTime);
                        // expiry = now;



                        // dispatch(setUser({ ...data.user, isAuth: true }));
                        // document.cookie = `login_token=${data.user.login_token}; ${expiry ? `expires=${expiry.toUTCString()}` : ''}; path=/; SameSite=Lax;`;
                        // dispatch(setPopup())



                    }
                } else {
                    //============= Display 2fa popup ==============
                    if (data.next === '2fa') {

                        //store user's phone and email to redux
                        dispatch(setUser({
                            email: data.email,
                            phone: data.phone,
                            area_code: data.area_code,
                            remember_me: true
                        }))
                        //Go to 2fa popup
                        if (process.env.REACT_APP_NODE_ENV !== 'production') {
                            alert(data.code)
                        }

                        dispatch(setPrevPopupPage('login'));
                        dispatch(setPopupPage('2fa'));
                        dispatch(setPopup(true))

                        // history.push({
                        //     pathname: '/login/phone-verification',
                        //     state: {
                        //         email: loginData.email,
                        //         phone: res.data.phone
                        //     }
                        // })
                    }

                    if (data.next === 'admin-authed') {
                        let expiry;

                        let now = new Date();
                        let time = now.getTime();
                        let expireTime = time + 30 * 24 * 60 * 60 * 1000;
                        now.setTime(expireTime);
                        expiry = now;


                        document.cookie = `login_token=${data.user.login_token}; ${expiry ? `expires=${expiry.toUTCString()}` : ''}; path=/; SameSite=Lax;`;
                        Axios.defaults.headers.common['Authorization'] = data.user.login_token
                        dispatch(setUser({
                            id: data.user.id,
                            username: data.user.username,
                            first_name: data.user.first_name,
                            last_name: data.user.last_name,
                            login_token: data.user.login_token,
                            phone: data.user.phone,
                            email: data.user.email,
                            role: data.user.role,
                            isAuth: true
                        }));
                        dispatch(setPopup(false))
                        dispatch(setPopupPage(''))
                    }
                }
                if (data.error) {
                    dispatch(setPopupPage('social-login-fail'));
                }
            })

    }


    return (
        <div className={LoginOptionsStyles.container}>
            <img src={coverImg} className={LoginOptionsStyles.coverImg} alt="Login Popup Cover" />
            <div className={LoginOptionsStyles.loginOptionContainer}>
                <p>用以下帳戶繼續</p>
                <div className={LoginOptionsStyles.socialPlatformContainer}>
                    <FacebookLogin
                        appId={process.env.REACT_APP_FB_APP_ID}
                        autoLoad={false}
                        fields="email"
                        callback={responseFacebook}
                        disableMobileRedirect={true}
                        render={renderProps => (
                            <img src={facebookBtn} className={LoginOptionsStyles.socialPlatformLogoContianer} onClick={renderProps.onClick} alt="sign in with facebook button" />
                        )}
                    />
                    <GoogleLogin
                        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                        render={renderProps => (
                            <img src={googleBtn} className={LoginOptionsStyles.socialPlatformLogoContianer} onClick={renderProps.onClick} alt="sign in with Google " />
                        )}
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                    />
                </div>
                <p className={LoginOptionsStyles.divider}>或用 MeLearn 帳號</p>
                <div className={LoginOptionsStyles.buttonGroup}>
                    <button className={`${LoginOptionsStyles.registerBtn} ${LoginOptionsStyles.button}`} onClick={() => registerClicked()}>註冊</button>
                    <button className={`${LoginOptionsStyles.loginBtn} ${LoginOptionsStyles.button}`} onClick={() => loginClicked()}>登入</button>
                </div>
            </div>
        </div>
    )
}

export default LoginOptions
