import React from 'react'

//redux
import { useDispatch } from 'react-redux';
import { setPopup } from 'redux/actions/global_setting'

//component
import PopupTitle from 'components/PopupTitle';

//styles
import ModifyPhoneSuccessStyles from './ModifyPhoneSuccess.module.scss';

const ModifyPhoneSuccess = () => {

    const dispatch = useDispatch();

    const handleConfirm = () => {
        dispatch(setPopup())
    }

    return (
        <div className={ModifyPhoneSuccessStyles.container}>
            <PopupTitle title='成功更改電話號碼'/>
            <p className={ModifyPhoneSuccessStyles.msg}>你已成功更改電話號碼及個人資料</p>
            <button className={ModifyPhoneSuccessStyles.confirmBtn} onClick={handleConfirm}>確定</button>
        </div>
    )
}

export default ModifyPhoneSuccess
