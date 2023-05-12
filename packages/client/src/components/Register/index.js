import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Axios from 'axios';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../redux/actions/user';
import { setPopupPage, setPrevPopupPage, setLoading, setPopup } from '../../redux/actions/global_setting';

//comopnent
import PopupTitle from '../PopupTitle';

//styles
import RegisterStyles from './Register.module.scss';

//fontAwesome
import tick from 'images/icon/tick_white@3x.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp, faChevronLeft } from '@fortawesome/free-solid-svg-icons'

//utils
import { areaCode } from '../../utils/areaCode';
import Spinner from 'components/Spinner';


const Register = () => {

    const dispatch = useDispatch();

    const loading = useSelector(store => store.global_setting.loading)
    const [registerData, setRegisterData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        areaCode: '+852',
        phone: '',
        receiveInfo: true
    })
    const [searchArea, setSearchArea] = useState('');
    const [filteredAreaCode, setFilteredAreaCode] = useState(areaCode);
    const [disableSubmitBtn, setDisableSubmitBtn] = useState(false);

    const [error, setError] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        agree: ''
    })

    const [dropdown, setDropdown] = useState(false);
    const [agree, setAgree] = useState(false);

    const handleChange = (e) => {

        let { name, value } = e.target;

        setRegisterData(prev => ({
            ...prev,
            [name]: value
        }))

    }

    const selectAreaCode = (code) => {
        setRegisterData(prev => ({
            ...prev,
            areaCode: code
        }))
        setDropdown(false);
    }

    const handleAgree = () => {
        setAgree(prev => !prev);
    }

    const handleLogin = () => {
        dispatch(setPopupPage('login'))
    }

    const goBack = () => {
        dispatch(setPopupPage('loginOptions'))
    }

    const handleRegister = (event) => {

        event.preventDefault();

        dispatch(setLoading(true));
        setDisableSubmitBtn(true);

        setError({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            agree: '',

        })

        if (!agree) {
            setError(prev => ({
                ...prev,
                agree: '請剔選此項以註冊'
            }))
            setDisableSubmitBtn(false);
            dispatch(setLoading(false));
        } else {
            Axios.post('/api/register', {
                username: registerData.username,
                email: registerData.email,
                password: registerData.password,
                confirmPassword: registerData.confirmPassword,
                area_code: registerData.areaCode,
                phone: registerData.phone,
                receive_info: registerData.receiveInfo
            })
                .then(res => res.data)
                .then(data => {
                    if (data.error) {
                        if (data.error.EMTPY_PW) {
                            setError(prev => ({ ...prev, password: data.error.EMTPY_PW }))
                        }
                        if (data.error.PW_NOT_MATCH) {
                            setError(prev => ({ ...prev, confirmPassword: data.error.PW_NOT_MATCH }))
                        }
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
                        setDisableSubmitBtn(false);
                    }
                    if (data.next === '2fa') {
                        dispatch(setUser({
                            email: registerData.email,
                            area_code: registerData.areaCode,
                            phone: registerData.phone
                        }))
                        if(process.env.REACT_APP_NODE_ENV !== 'production'){
                            alert(data.code);
                        }
                        dispatch(setPrevPopupPage('register'));
                        dispatch(setPopupPage('2fa'))
                    }
                    dispatch(setLoading(false));
                })
                .catch(err => {
                    console.log(err);
                    dispatch(setLoading(false));
                    setDisableSubmitBtn(false);
                })
        }

    }
    
    useEffect(() => {

        if(searchArea){
            setFilteredAreaCode(areaCode.filter(code => code.phoneCode.includes(searchArea)))
        }else{
            setFilteredAreaCode(areaCode);
        }

    }, [searchArea])

    return (
        <div className={RegisterStyles.container} >
            <div className={RegisterStyles.titleBar}>
                <PopupTitle title='註冊' />
                <p className={RegisterStyles.loginText}>已有帳戶？<span className={RegisterStyles.highlightedText} onClick={handleLogin}>登入</span></p>
            </div>
            <div className={RegisterStyles.formContainer}>
                {loading ? <Spinner /> : <form className={RegisterStyles.registerForm} onSubmit={handleRegister}>
                    <div className={RegisterStyles.inputGroup}>
                        <input
                            className={RegisterStyles.inputField}
                            name='username'
                            value={registerData.username}
                            onChange={handleChange}
                            required
                        />
                        <label className={RegisterStyles.floatingLabel}>用戶名稱</label>
                        {!error.username && <label className={RegisterStyles.reminderText}>不限字元長度。僅限使用a-z、A-Z、0-9 或半形符號 (.) 及 (_)</label>}
                    </div>
                    {error.username && <label className={RegisterStyles.errorText}>{error.username}</label>}
                    <div className={RegisterStyles.inputGroup}>
                        <input
                            className={RegisterStyles.inputField}
                            name='email'
                            value={registerData.email}
                            onChange={handleChange}
                            required
                        />
                        <label className={RegisterStyles.floatingLabel}>電郵地址</label>
                    </div>
                    {error.email && <label className={RegisterStyles.errorText}>{error.email}</label>}
                    <div className={`${RegisterStyles.inputGroup} ${RegisterStyles.rowFlex}`}>
                        <div className={RegisterStyles.inputSubGroup}>
                            <input
                                className={RegisterStyles.inputField}
                                name='password'
                                value={registerData.password}
                                type='password'
                                onChange={handleChange}
                                required
                            />
                            <label className={RegisterStyles.floatingLabel}>密碼</label>
                            {error.password && <label className={RegisterStyles.errorText}>{error.password}</label>}
                        </div>
                        <div className={RegisterStyles.inputSubGroup}>
                            <input
                                className={RegisterStyles.inputField}
                                name='confirmPassword'
                                value={registerData.confirmPassword}
                                type='password'
                                onChange={handleChange}
                                required
                            />
                            <label className={RegisterStyles.floatingLabel}>確認密碼</label>
                            {error.confirmPassword && <label className={RegisterStyles.errorText}>{error.confirmPassword}</label>}
                        </div>
                    </div>
                    <div className={`${RegisterStyles.inputGroup} ${RegisterStyles.rowFlex}`}>
                        <div className={`${RegisterStyles.inputSubGroup} ${RegisterStyles.areaCodeGroup}`}>
                            <div className={RegisterStyles.dropdownBtn} onClick={() => setDropdown(prev => !prev)}>
                                <p className={RegisterStyles.selectedAreaCode}>{registerData.areaCode}</p>
                                <FontAwesomeIcon icon={dropdown ? faChevronUp : faChevronDown} className={RegisterStyles.dropdownIcon} />
                            </div>
                            {dropdown && <div className={RegisterStyles.dropdown}>
                                <div className={RegisterStyles.areaSearchContainer}>
                                    <label>以區號搜尋：</label>
                                    <input onChange={(e) => setSearchArea(e.target.value)} value={searchArea} placeholder="搜尋"/>
                                </div>
                                {filteredAreaCode.map((country) => {
                                    return <div className={RegisterStyles.dropdownOptions} onClick={() => selectAreaCode(country.phoneCode)}>{`${country.phoneCode} ${country.countryName}`}</div>
                                })}
                            </div>}
                            <label className={RegisterStyles.areaCodeText}>區號</label>
                        </div>
                        <div className={`${RegisterStyles.inputSubGroup} ${RegisterStyles.phoneGroup}`}>
                            <input
                                className={RegisterStyles.inputField}
                                name='phone'
                                value={registerData.phone}
                                type='phone'
                                onChange={handleChange}
                                required
                            />
                            <label className={RegisterStyles.floatingLabel}>電話號碼</label>
                            {error.phone && <label className={RegisterStyles.errorText}>{error.phone}</label>}
                        </div>

                    </div>
                    <div className={RegisterStyles.checkboxContainer}>
                        <div className={RegisterStyles.checkbox} onClick={handleAgree}>
                            {agree && <img src={tick} className={RegisterStyles.checked} alt="agree terms checkbox"/>}
                        </div>
                        <label className={RegisterStyles.checkboxLabel}>我同意Melearn.guru的<Link to="/terms" className={RegisterStyles.link} onClick={() => dispatch(setPopup(false))}>網站條款及細則</Link>與<Link to="/privacy"className={RegisterStyles.link} onClick={() => dispatch(setPopup(false))}>私隱條款</Link></label>
                    </div>
                    {error.agree && <label className={RegisterStyles.errorText}>{error.agree}</label>}
                    <div className={RegisterStyles.checkboxContainer}>
                        <div className={RegisterStyles.checkbox} onClick={() => setRegisterData(prev => ({ ...prev, receiveInfo: !prev.receiveInfo }))}>
                            {registerData.receiveInfo && <img src={tick} className={RegisterStyles.checked} alt="receive information checkbox"/>}
                        </div>
                        <label className={RegisterStyles.checkboxLabel}>我願意接受由天窗文化集團及其關聯公司傳送的優惠資訊</label>
                    </div>
                    <button className={RegisterStyles.registerBtn} disabled={disableSubmitBtn}>註冊</button>
                </form>}
            </div>



            <p className={RegisterStyles.backBtn} onClick={goBack}>
                <FontAwesomeIcon icon={faChevronLeft} className={RegisterStyles.backIcon} />返回上一頁
            </p>
        </div>
    )
}

export default Register
