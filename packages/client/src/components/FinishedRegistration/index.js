import React from 'react'

//component
import PopupTitle from '../PopupTitle';

//redux
import { useDispatch } from 'react-redux';
import { setPopup } from '../../redux/actions/global_setting'; 

//styles
import FinishedRegistrationStyles from './FinishedRegistration.module.scss';

const FinishedRegistration = () => {

    const dispatch = useDispatch();

    const handleContinue = () => {
        dispatch(setPopup());
    }

    return (
        <div className={FinishedRegistrationStyles.container}>
            <PopupTitle title='註冊成功'/>
            <p className={FinishedRegistrationStyles.msg}>恭喜你成功註冊MeLearn.guru，請檢查您的電子郵件。</p>
            <button className={FinishedRegistrationStyles.continueBtn} onClick={handleContinue}>繼續</button>
        </div>
    )
}

export default FinishedRegistration
