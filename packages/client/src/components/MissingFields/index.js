import React, { useState, useEffect } from 'react';

import Axios from 'axios';

//redux
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../redux/actions/user';
import { setPopupPage, setPrevPopupPage, setPopup } from '../../redux/actions/global_setting';

//component
import PopupTitle from '../PopupTitle';

//styles
import MissingFieldsStyles from './MissingFields.module.scss';

//fontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronLeft, faChevronUp } from '@fortawesome/free-solid-svg-icons';

//utils
import { areaCode } from '../../utils/areaCode';

const MissingFields = () => {

    const dispatch = useDispatch();

    const user = useSelector(store => store.user);

    const [dropdown, setDropdown] = useState(false);
    const [searchArea, setSearchArea] = useState('');
    const [filteredAreaCode, setFilteredAreaCode] = useState(areaCode);
    const [error, setError] = useState({
        email: '',
        phone: '',
        username: ''
    })

    const [inputData, setInputData] = useState({
        username: '',
        email: '',
        areaCode: '+852',
        phone: ''
    })

    useEffect(() => {

        if (user.email) {
            setInputData(prev => ({
                ...prev,
                email: user.email
            }))
        }

    }, [user])

    const handleChange = (e) => {
        let { name, value } = e.target;
        setInputData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const selectAreaCode = (code) => {
        setInputData(prev => ({
            ...prev,
            areaCode: code
        }))
        setDropdown(false);
    }


    const goBack = () => {
        dispatch(setPopupPage('loginOptions'))
    }

    const completeRegister = (e) => {

        e.preventDefault();

        setError({
            email: '',
            phone: ''
        })

        Axios.post('/api/login/complete-missing-fields', {
            email: inputData.email,
            phone: inputData.phone,
            username: inputData.username,
            area_code: inputData.areaCode,
            facebook_id: user.facebook_id,
            google_id: user.google_id
        })
            .then(res => res.data)
            .then(data => {
                // if (data.user) {
                //     dispatch(setUser({
                //         login_token: data.user.login_token,
                //         id: data.user.id,
                //         email: data.user.email,
                //         username: data.user.username,
                //         first_name: data.user.first_name,
                //         last_name: data.user.last_name,
                //         role: data.user.role,
                //         isAuth: true,
                //     }))
                //     dispatch(setPopupPage('finished-registration'))
                // }
                if(data.next === '2fa'){
                    dispatch(setUser({
                        email: data.email,
                        phone: data.phone,
                        area_code: data.area_code,
                        remember_me: true
                    }))
                    //Go to 2fa popup
                    if (process.env.REACT_APP_NODE_ENV !== 'production') {
                        alert(data.code)
                    }

                    dispatch(setPrevPopupPage('missing-fields'));
                    dispatch(setPopupPage('2fa'));
                    dispatch(setPopup(true))
                }
                if (data.error) {
                    if (data.error.INVALID_PHONE) {
                        setError(prev => ({ ...prev, phone: data.error.INVALID_PHONE }))
                    }
                    if (data.error.INVALID_EMAIL) {
                        setError(prev => ({ ...prev, email: data.error.INVALID_EMAIL }))
                    }
                    if (data.error.DUP_USERNAME) {
                        setError(prev => ({ ...prev, username: data.error.DUP_USERNAME }))
                    }
                    if (data.error === '未能成功註冊') {
                        setError(prev => ({ ...prev, username: data.error }))
                    }
                }
            })
            .catch(err => {
                console.log(err);
                alert(err.data)
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
        <div className={MissingFieldsStyles.container}>
            <PopupTitle title='補充資料' />
            <p className={MissingFieldsStyles.msg}>在完成註冊前，請先向我們提供以下個人資料，我們將用作傳送驗證或購物收據</p>
            <form className={MissingFieldsStyles.inputForm} onSubmit={completeRegister}>
                <div className={MissingFieldsStyles.inputGroup}>
                    <input
                        className={MissingFieldsStyles.inputField}
                        name='username'
                        value={MissingFieldsStyles.username}
                        onChange={handleChange}
                        required
                    />
                    <label className={MissingFieldsStyles.floatingLabel}>用戶名稱</label>
                    <label className={MissingFieldsStyles.reminderText}>不限字元長度。僅限使用a-z、A-Z、0-9 或半形符號 (.) 及 (_)</label>
                    {error.username && <label className={MissingFieldsStyles.errorText}>{error.username}</label>}
                </div>
                <div className={MissingFieldsStyles.inputGroup}>
                    <input
                        className={MissingFieldsStyles.inputField}
                        name='email'
                        value={inputData.email}
                        onChange={handleChange}
                        disabled={user.email ? true : false}
                        required
                    />
                    <label className={MissingFieldsStyles.floatingLabel}>電郵地址</label>
                </div>
                {error.email && <label className={MissingFieldsStyles.errorText}>{error.email}</label>}
                <div className={`${MissingFieldsStyles.inputGroup} ${MissingFieldsStyles.rowFlex}`}>
                    <div className={`${MissingFieldsStyles.inputSubGroup} ${MissingFieldsStyles.areaCodeGroup}`}>
                        <div className={MissingFieldsStyles.dropdownBtn} onClick={() => setDropdown(prev => !prev)}>
                            <p className={MissingFieldsStyles.selectedAreaCode}>{inputData.areaCode}</p>
                            <FontAwesomeIcon icon={dropdown ? faChevronUp : faChevronDown} className={MissingFieldsStyles.dropdownIcon} />
                        </div>
                        {dropdown && <div className={MissingFieldsStyles.dropdown}>
                            <div className={MissingFieldsStyles.areaSearchContainer}>
                                <label>以區號搜尋：</label>
                                <input onChange={(e) => setSearchArea(e.target.value)} value={searchArea} placeholder="搜尋" />
                            </div>
                            {filteredAreaCode.map((country) => {
                                return <div className={MissingFieldsStyles.dropdownOptions} onClick={() => selectAreaCode(country.phoneCode)}>{`${country.phoneCode} ${country.countryName}`}</div>
                            })}
                        </div>}
                        <label className={MissingFieldsStyles.areaCodeText}>區號</label>
                    </div>
                    <div className={`${MissingFieldsStyles.inputSubGroup} ${MissingFieldsStyles.phoneGroup}`}>
                        <input
                            className={MissingFieldsStyles.inputField}
                            name='phone'
                            value={inputData.phone}
                            type='phone'
                            onChange={handleChange}
                            required
                        />
                        <label className={MissingFieldsStyles.floatingLabel}>電話號碼</label>
                        {error.phone && <label className={MissingFieldsStyles.errorText}>{error.phone}</label>}
                    </div>
                </div>
                <button className={MissingFieldsStyles.finishBtn}>完成註冊</button>
            </form>
            <p className={MissingFieldsStyles.backBtn} onClick={goBack}>
                <FontAwesomeIcon icon={faChevronLeft} className={MissingFieldsStyles.backIcon} />返回上一頁
            </p>
        </div>
    )
}

export default MissingFields
