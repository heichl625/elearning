import React from 'react';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';

//redux
import { useDispatch } from 'react-redux';
import { clearUser } from '../../redux/actions/user';
import { clearCart } from '../../redux/actions/cart';
import { setPopup } from '../../redux/actions/global_setting';

//component
import PopupTitle from '../PopupTitle';

//styles
import LogoutStyles from './Logout.module.scss';

const Logout = () => {

    const history = useHistory();

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
                ";expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        }
    }

    const dispatch = useDispatch();

    const handleLogout = () => {
        Axios.get('/api/logout')
            .then(() => {
                dispatch(clearUser());
                delete Axios.defaults.headers.common['Authorization']
                delete_cookie('cart', '/', process.env.REACT_APP_DOMAIN)
                delete_cookie('login_token', '/', process.env.REACT_APP_DOMAIN)
                dispatch(clearCart());
                dispatch(setPopup(false));
                history.push('/')
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <div className={LogoutStyles.container}>
            <PopupTitle title='登出帳戶？' />
            <p className={LogoutStyles.msg}>你確定要登出這個帳戶嗎？</p>
            <button className={LogoutStyles.logoutBtn} onClick={handleLogout}>登出</button>
        </div>
    )
}

export default Logout
