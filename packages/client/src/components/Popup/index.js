import React, { useState, useEffect } from 'react'

import PopupStyles from './Popup.module.scss';

import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../../redux/actions/user';
import { setCertHTML } from '../../redux/actions/global_setting';

//pages
import Promotion from '../Promotion';
import LoginOptions from '../LoginOptions';
import Login from '../Login';
import Register from '../Register';
import TwoFactor from '../TwoFactor';
import ForgotPassword from '../ForgotPassword';
import EmailSent from '../EmailSent';
import FinishedRegistration from '../FinishedRegistration';
import Logout from '../Logout';
import ResetPassword from '../ResetPassword';
import MissingFields from '../MissingFields';
import CourseNotFinished from 'components/CourseNotFinished';
import FinishedAllLessons from 'components/FinishedAllLessons';
import FinishedQuiz from 'components/FinishedQuiz';
import LargeCertificate from 'components/Profile/LargeCertificate';
import ModifyPersonalDataSuccess from 'components/ModifyPersonalDataSuccess';
import ModifyPhoneSuccess from 'components/ModifyPhoneSuccess';
import RemoveCard from 'components/RemoveCard';
import AddCard from 'components/AddCard';
import AddCardSuccess from 'components/AddCardSuccess';
import FinishedResetPassword from 'components/FinishedResetPassword';
import FailToUseSocialLogin from 'components/FailToUseSocialLogin';
import CourseAlreadyEnrolled from 'components/CourseAlreadyEnrolled';
import FinishedCourse from 'components/FinishedCourse';
import ModifyPasswordSuccess from 'components/ModifyPasswordSuccess';
import ModifyBillingSucccess from 'components/ModifyBillingSucccess';
import OtherDeviceSignedIn from 'components/OtherDeviceSignedIn';
import PendingTransactionExistPopup from 'components/PendingTransactionExistPopup';


//fontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const Popup = ({onClose}) => {

    const dispatch = useDispatch();
    const popupPage = useSelector(store => store.global_setting.popupPage);

    const [page, setPage] = useState();
    const [hideCloseBtn, setHideCloseBtn] = useState(false);

    useEffect(() => {

        return () => {
            dispatch(setCertHTML(''))
        }

    }, [])

    useEffect(() => {

        if(popupPage){
            switch(popupPage){
                case 'promotion':
                    setPage(<Promotion />)
                    setHideCloseBtn(false)
                    break;
                case 'loginOptions':
                    setPage(<LoginOptions />)
                    setHideCloseBtn(false)
                    break;
                case 'login':
                    setPage(<Login />)
                    setHideCloseBtn(false)
                    break;
                case 'register':
                    setPage(<Register />)
                    setHideCloseBtn(false)
                    break;
                case '2fa':
                    setPage(<TwoFactor />)
                    setHideCloseBtn(false)
                    break;
                case 'forgot-password':
                    setPage(<ForgotPassword />)
                    setHideCloseBtn(false)
                    break;
                case 'reset-pw-email-sent':
                    setPage(<EmailSent />)
                    setHideCloseBtn(false)
                    break;
                case 'finished-registration':
                    setPage(<FinishedRegistration />)
                    setHideCloseBtn(false)
                    break;
                case 'logout':
                    setPage(<Logout />)
                    setHideCloseBtn(false)
                    break;
                case 'social-login-fail':
                    setPage(<FailToUseSocialLogin />)
                    setHideCloseBtn(false);
                    break;
                case 'reset-password':
                    setPage(<ResetPassword />)
                    setHideCloseBtn(false)
                    break;
                case 'missing-fields':
                    setPage(<MissingFields />)
                    setHideCloseBtn(false)
                    break;
                case 'course-not-finished':
                    setPage(<CourseNotFinished />)
                    setHideCloseBtn(true)
                    break;
                case 'finished-all-lessons':
                    setPage(<FinishedAllLessons  />)
                    setHideCloseBtn(false)
                    break;
                case 'finished-course':
                    setPage(<FinishedCourse />)
                    setHideCloseBtn(false)
                    break;
                case 'finished-quiz':
                    setPage(<FinishedQuiz />)
                    setHideCloseBtn(true)
                    break;
                case 'large-certificate':
                    setPage(<LargeCertificate />)
                    setHideCloseBtn(false)
                    break;
                case 'modify-personal-data-success':
                    setPage(<ModifyPersonalDataSuccess />)
                    setHideCloseBtn(true);
                    break;
                case 'modify-phone-success':
                    setPage(<ModifyPhoneSuccess />)
                    setHideCloseBtn(true);
                    break;
                case 'modify-password-success':
                    setPage(<ModifyPasswordSuccess />)
                    setHideCloseBtn(true);
                    break;
                case 'modify-billing-success':
                    setPage(<ModifyBillingSucccess />)
                    setHideCloseBtn(true);
                    break;
                case 'remove-card':
                    setPage(<RemoveCard />)
                    setHideCloseBtn(false);
                    break;
                case 'add-card':
                    setPage(<AddCard />)
                    setHideCloseBtn(false);
                    break;
                case 'add-card-success':
                    setPage(<AddCardSuccess />)
                    setHideCloseBtn(true);
                    break;
                case 'finished-reset-password':
                    setPage(<FinishedResetPassword />)
                    setHideCloseBtn(true);
                    break;
                case 'other-device-signed-in':
                    setPage(<OtherDeviceSignedIn />)
                    setHideCloseBtn(true);
                    break;
                case 'course-already-enrolled':
                    setPage(<CourseAlreadyEnrolled />)
                    setHideCloseBtn(true)
                    break;
                case 'pending-transaction-exist':
                    setPage(<PendingTransactionExistPopup />)
                    setHideCloseBtn(true)
                    break
                default:
                    break;

            }
        }

    }, [popupPage])

    return (
        <div className={PopupStyles.popupContainer}>
            <div className={PopupStyles.popupCard}>
                {hideCloseBtn === false && <div className={PopupStyles.closeBtn} onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </div>}
                {page}
            </div>
        </div>
    )
}

export default Popup
