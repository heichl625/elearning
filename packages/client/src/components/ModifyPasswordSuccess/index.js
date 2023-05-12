import React from 'react'

//redux
import { useDispatch } from 'react-redux';
import { setPopup } from 'redux/actions/global_setting'

//component
import PopupTitle from 'components/PopupTitle';

//styles
import ModifyPasswordSuccessStyles from './ModifyPasswordSuccess.module.scss';

const ModifyPasswordSuccess = () => {

    const dispatch = useDispatch();

    const handleConfirm = () => {
        dispatch(setPopup())
    }

    return (
        <div className={ModifyPasswordSuccessStyles.container}>
            <PopupTitle title='成功修改密碼'/>
            <p className={ModifyPasswordSuccessStyles.msg}>你現在可以使用新密碼登入帳戶</p>
            <button className={ModifyPasswordSuccessStyles.confirmBtn} onClick={handleConfirm}>確定</button>
        </div>
    )
}

export default ModifyPasswordSuccess
