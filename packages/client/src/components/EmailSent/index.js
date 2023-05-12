import React from 'react'

//redux
import { useDispatch } from 'react-redux';
import { setPopup, setPopupPage } from '../../redux/actions/global_setting';

//component
import PopupTitle from '../PopupTitle';


import EmailSentStyles from './EmailSent.module.scss';

const EmailSent = () => {

    const dispatch = useDispatch();

    const handleConfirm = () => {
        dispatch(setPopup(false))
        dispatch(setPopupPage(''))
    }

    return (
        <div className={EmailSentStyles.container}>
            <PopupTitle title='電郵已寄出' />
            <p className={EmailSentStyles.msg}>重設密碼的電郵已寄出,電郵有可能需要數分鐘時間才能顯示於閣下的電子郵箱。如未能收到此電郵,請於十分鐘後再嘗試。謝謝!</p>
            <button className={EmailSentStyles.confirmBtn} onClick={handleConfirm}>確定</button>
        </div>
    )
}

export default EmailSent
