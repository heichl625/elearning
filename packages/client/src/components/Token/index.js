import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import Axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setPopup, setPopupPage } from 'redux/actions/global_setting'

import { setUser, clearUser, setFavourite } from '../../redux/actions/user';

const Token = () => {

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const token = getCookie('login_token');
    const isAuth = useSelector(store => store.user.isAuth);
    const dispatch = useDispatch();
    const location = useLocation();

    function get_cookie(name) {
        return document.cookie.split(';').some(c => {
            return c.trim().startsWith(name + '=');
        });
    }

    function delete_cookie(name, path, domain) {
        if (get_cookie(name)) {
            document.cookie = name + "=" +
                ((path) ? ";path=" + path : "") +
                ((domain) ? ";domain=" + domain : "") +
                ";expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
        }
    }

    useEffect(() => {

        Axios.get('/api/auth')
            .then(async res => {
                if (res.data.login_token && token) {
                    if (res.data.login_token !== token) {
                        dispatch(setPopupPage('other-device-signed-in'))
                        dispatch(setPopup(true))
                        await Axios.get('/api/logout')
                            .then(() => {
                                dispatch(clearUser())
                                delete_cookie('cart', '/', process.env.REACT_APP_DOMAIN)
                                delete_cookie('login_token', '/', process.env.REACT_APP_DOMAIN)
                            })
                            .catch(err => {
                                console.log(err);
                            })
                    }else{
                        Axios.defaults.headers.common['Authorization'] = res.data.login_token
                        //Using session to login user
                        dispatch(setUser({
                            id: res.data.id,
                            username: res.data.username,
                            first_name: res.data.first_name,
                            last_name: res.data.last_name,
                            login_token: res.data.login_token,
                            area_code: res.data.area_code,
                            phone: res.data.phone,
                            email: res.data.email,
                            role: res.data.role,
                            isAuth: true
                        }))
                    }
                } else {
                    dispatch(setUser({
                        isAuth: false
                    }))
                }
            })
            .catch(err => {
                console.log(err);
            })

    }, [location.pathname])

    useEffect(() => {

        if (isAuth) {
            Axios.get('/api/favourite')
                .then(res => res.data)
                .then(data => {
                    if (data.favourite_courses) {
                        dispatch(setFavourite(data.favourite_courses))
                    }
                })
        }

    }, [isAuth])

    return (
        <div>

        </div>
    )
}

export default Token
