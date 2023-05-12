import React from 'react'

//redux
import { useDispatch } from 'react-redux';
import { setPopup } from 'redux/actions/global_setting'

//component
import PopupTitle from 'components/PopupTitle';

//styles
import ModifyBillingSucccessStyles from './ModifyBillingSucccess.module.scss';

const ModifyBillingSucccess = () => {

    const dispatch = useDispatch();

    const handleConfirm = () => {
        dispatch(setPopup())
    }

    return (
        <div className={ModifyBillingSucccessStyles.container}>
            <PopupTitle title='成功修改帳單地址'/>
            <p className={ModifyBillingSucccessStyles.msg}>你已成功修改帳單地址</p>
            <button className={ModifyBillingSucccessStyles.confirmBtn} onClick={handleConfirm}>確定</button>
        </div>
    )
}

export default ModifyBillingSucccess
