import React from 'react';
import { useHistory } from 'react-router-dom'

//redux
import { useDispatch } from 'react-redux';
import { setPopup, setPopupPage } from 'redux/actions/global_setting'

//component
import PopupTitle from 'components/PopupTitle';

//styles
import OtherDeviceSignedInStyles from './OtherDeviceSignedIn.module.scss';

const OtherDeviceSignedIn = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const handleConfirm = () => {
        history.push('/');
        dispatch(setPopup(false))
        dispatch(setPopupPage(''));
    }

    return (
        <div className={OtherDeviceSignedInStyles.container}>
            <PopupTitle title='已有另一裝置登入'/>
            <p className={OtherDeviceSignedInStyles.msg}>您已從另一裝置登入，如希望在此裝置上使用MeLearn.Guru，請重新登入。如您未曾使用另一裝置登入，請立即更改您的密碼。如有任何疑問，歡迎與我們聯絡。</p>
            
            <button className={OtherDeviceSignedInStyles.confirmBtn} onClick={handleConfirm}>確定</button>
        </div>
    )
}

export default OtherDeviceSignedIn
