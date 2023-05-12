import React from 'react';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { setPopupPage } from 'redux/actions/global_setting'

//component
import PopupTitle from 'components/PopupTitle';

//styles
import FailToUseSocialLoginStyles from './FailToUseSocialLogin.module.scss';

const FailToUseSocialLogin = () => {

    const dispatch = useDispatch();
    
    const handleLogin = () => {
        dispatch(setPopupPage('login'))
    }

    return (
        <div className={FailToUseSocialLoginStyles.container}>
            <PopupTitle title='無法以社交平台帳號登入'/>
            <p className={FailToUseSocialLoginStyles.msg}>你無法以社交平台帳號登入MeLearn.guru，請輸入帳戶和密碼進行登入. </p>
            <button className={FailToUseSocialLoginStyles.btn} onClick={handleLogin}>登入</button>
        </div>
    )
}

export default FailToUseSocialLogin
