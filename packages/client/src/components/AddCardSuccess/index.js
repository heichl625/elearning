import React, { useEffect } from 'react'

//redux
import { useDispatch } from 'react-redux';
import { setPopup, setPopupPage } from 'redux/actions/global_setting'

//component
import PopupTitle from 'components/PopupTitle';

//styles
import AddCardSuccessStyles from './AddCardSuccess.module.scss';

const AddCardSuccess = () => {

    const dispatch = useDispatch();

    const handleConfirm = () => {
        dispatch(setPopup())
    }

    useEffect(() => {

        return () => {
            dispatch(setPopupPage(''))
        }

    }, [])

    return (
        <div className={AddCardSuccessStyles.container}>
            <PopupTitle title='成功添加信用卡'/>
            <p className={AddCardSuccessStyles.msg}>你已成功添加信用卡</p>
            <button className={AddCardSuccessStyles.confirmBtn} onClick={handleConfirm}>確定</button>
        </div>
    )
}

export default AddCardSuccess
