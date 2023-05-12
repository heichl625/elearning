import React from 'react'

//redux
import { useDispatch } from 'react-redux';
import { setPopup, setLoading } from 'redux/actions/global_setting';
import { setProceedPayment } from 'redux/actions/checkout';

//component
import PopupTitle from 'components/PopupTitle';

//styles
import PendingTransactionExistPopupStyles from './PendingTransactionExistPopup.module.scss';

const PendingTransactionExistPopup = () => {

    const dispatch = useDispatch();

    const handleCancel = () => {
        dispatch(setPopup(false))
    }

    const handleContinue = () => {
        dispatch(setProceedPayment(true))
        dispatch(setLoading(true))
        dispatch(setPopup(false))
    }

    return (
        <div className={PendingTransactionExistPopupStyles.container}>
            <PopupTitle title='此訂單有未完成訂單之課程'/>
            <p className={PendingTransactionExistPopupStyles.msg}>我們在你其他未完成訂單中找到此你在訂單所購買的課程。</p>
            <p className={PendingTransactionExistPopupStyles.msg}>如你選擇繼續付款，該未完成的訂單將會失效，你將無法再為該訂單付款。</p>
            <div className={PendingTransactionExistPopupStyles.btnGroup}>
                <button className={PendingTransactionExistPopupStyles.cancelBtn} onClick={handleCancel}>取消</button>
                <button className={PendingTransactionExistPopupStyles.confirmBtn} onClick={handleContinue}>繼續付款</button>
            </div>
            
        </div>
    )
}

export default PendingTransactionExistPopup
