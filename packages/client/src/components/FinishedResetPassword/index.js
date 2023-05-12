import React from 'react';
import { useHistory } from 'react-router-dom';

//redux
import { useDispatch } from 'react-redux';
import { setPopupPage } from 'redux/actions/global_setting'

//component
import PopupTitle from 'components/PopupTitle';

//styles
import FinishedResetPasswordStyles from './FinishedResetPassword.module.scss';

const FinishedResetPassword = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const handleConfirm = () => {
        history.push('/')
        dispatch(setPopupPage('loginOptions'))
    }

    return (
        <div className={FinishedResetPasswordStyles.container}>
            <PopupTitle title='成功更改密碼'/>
            <p className={FinishedResetPasswordStyles.msg}>你已成功更改密碼</p>
            <button className={FinishedResetPasswordStyles.confirmBtn} onClick={handleConfirm}>登入</button>
        </div>
    )
}

export default FinishedResetPassword
