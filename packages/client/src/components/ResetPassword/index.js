import React, { useState, useEffect } from 'react'
import Axios from 'axios'

//component
import PopupTitle from '../PopupTitle'

//redux
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../redux/actions/user';
import { setPopupPage, setPrevPopupPage } from '../../redux/actions/global_setting';

//styles
import ResetPasswordStyles from './ResetPassword.module.scss';

//fontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

//utils
import { areaCode } from '../../utils/areaCode';


const ResetPassword = () => {

    const user = useSelector(store => store.user);
    const dispatch = useDispatch()

    const [error, setError] = useState({
        phone: ''
    })

    const [resetData, setResetData] = useState({
        areaCode: '+852',
        phone: ''
    })
    const [dropdown, setDropdown] = useState(false);
    const [searchArea, setSearchArea] = useState('');
    const [filteredAreaCode, setFilteredAreaCode] = useState(areaCode);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setResetData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const selectAreaCode = (code) => {
        setResetData(prev => ({
            ...prev,
            areaCode: code
        }))
        setDropdown(false);
    }

    const handleReset = (e) => {

        e.preventDefault();

        setError({
            phone: ''
        })

        Axios.post('/api/update-old-user-phone', {
            email: user.email,
            username: user.username,
            inputData: resetData
        })
            .then(res => {
                return res.data
            })
            .then(data => {
                if (data.error) {
                    if (data.error.INVALID_PHONE) {
                        setError(prev => ({ ...prev, phone: data.error.INVALID_PHONE }))
                    }

                } else {
                    if(process.env.REACT_APP_NODE_ENV !== 'production'){
                        alert(data.code);
                    }
                    dispatch(setUser({
                        area_code: resetData.areaCode,
                        phone: resetData.phone
                    }))
                    dispatch(setPopupPage('2fa'))
                    dispatch(setPrevPopupPage('reset-password'))
                }
            })


    }

    useEffect(() => {

        if(searchArea){
            setFilteredAreaCode(areaCode.filter(code => code.phoneCode.includes(searchArea)))
        }else{
            setFilteredAreaCode(areaCode);
        }

    }, [searchArea])

    return (
        <div className={ResetPasswordStyles.container}>
            <PopupTitle title='MeLearn.guru已更新' />
            <p className={ResetPasswordStyles.msg}>由於MeLearn.guru已更新，為確保閣下資料的安全，請先更新您的電話號碼。更新電話後你將收到重設密碼的電郵，請於更新密碼後再登入</p>
            <form className={ResetPasswordStyles.resetForm} onSubmit={handleReset}>
                <div className={`${ResetPasswordStyles.inputGroup} ${ResetPasswordStyles.rowFlex}`}>
                    <div className={`${ResetPasswordStyles.inputSubGroup} ${ResetPasswordStyles.areaCodeGroup}`}>
                        <div className={ResetPasswordStyles.dropdownBtn} onClick={() => setDropdown(prev => !prev)}>
                            <p className={ResetPasswordStyles.selectedAreaCode}>{resetData.areaCode}</p>
                            <FontAwesomeIcon icon={dropdown ? faChevronUp : faChevronDown} className={ResetPasswordStyles.dropdownIcon} />
                        </div>
                        {dropdown && <div className={ResetPasswordStyles.dropdown}>
                                <div className={ResetPasswordStyles.areaSearchContainer}>
                                    <label>以區號搜尋：</label>
                                    <input onChange={(e) => setSearchArea(e.target.value)} value={searchArea} placeholder="搜尋"/>
                                </div>
                            {filteredAreaCode.map((country) => {
                                return <div className={ResetPasswordStyles.dropdownOptions} onClick={() => selectAreaCode(country.phoneCode)}>{`${country.phoneCode} ${country.countryName}`}</div>
                            })}
                        </div>}
                        <label className={ResetPasswordStyles.areaCodeText}>區號</label>
                    </div>
                    <div className={`${ResetPasswordStyles.inputSubGroup} ${ResetPasswordStyles.phoneGroup}`}>
                        <input
                            className={ResetPasswordStyles.inputField}
                            name='phone'
                            value={resetData.phone}
                            type='phone'
                            onChange={handleChange}
                        />
                        <label className={ResetPasswordStyles.floatingLabel}>電話號碼</label>
                        {error.phone && <label className={ResetPasswordStyles.errorText}>{error.phone}</label>}
                    </div>
                </div>
                <button className={ResetPasswordStyles.nextBtn}>下一步</button>
            </form>
            <p className={ResetPasswordStyles.backBtn}>
                <FontAwesomeIcon icon={faChevronLeft} className={ResetPasswordStyles.backIcon} />返回上一頁
            </p>
        </div>
    )
}

export default ResetPassword
