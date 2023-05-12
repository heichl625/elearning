import React from 'react'

//redux
import { useDispatch } from 'react-redux';
import { setPopup } from 'redux/actions/global_setting'

//component
import PopupTitle from 'components/PopupTitle';

//styles
import ModifyPersonalDataSuccessStyles from './ModifyPersonalDataSuccess.module.scss';

const ModifyPersonalDataSuccess = () => {

    const dispatch = useDispatch();

    const handleConfirm = () => {
        dispatch(setPopup())
    }

    return (
        <div className={ModifyPersonalDataSuccessStyles.container}>
            <PopupTitle title='成功修改個人資料'/>
            <p className={ModifyPersonalDataSuccessStyles.msg}>你已成功修改個人資料</p>
            <button className={ModifyPersonalDataSuccessStyles.confirmBtn} onClick={handleConfirm}>確定</button>
        </div>
    )
}

export default ModifyPersonalDataSuccess
