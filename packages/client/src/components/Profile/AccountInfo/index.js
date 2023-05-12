import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import { v4 as uuidv4 } from 'uuid'

//redux
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from 'redux/actions/user';
import { setLoading, setPopup, setPopupPage } from 'redux/actions/global_setting';

//styles
import AccountInfoStyles from './AccountInfo.module.scss';

//utils
import { areaCode } from 'utils/areaCode';

//images
import arrowUp from 'images/icon/arrow_up@3x.png';
import arrowDown from 'images/icon/arrow_down@3x.png';
import Spinner from 'components/Spinner';


const AccountInfo = () => {

    const dispatch = useDispatch();

    const user = useSelector(store => store.user);
    const loading = useSelector(store => store.global_setting.loading)

    const [areaCodeDropdown, setAreaCodeDropdown] = useState(false);
    const [genderDropDown, setGenderDropdown] = useState(false);
    const [birthdayDropdown, setBirthdayDropdown] = useState(false);
    const [incomeDropDdown, setIncomeDropdown] = useState(false);
    const [searchArea, setSearchArea] = useState('');
    const [filteredAreaCode, setFilteredAreaCode] = useState(areaCode);
    const [error, setError] = useState({
        DUP_USERNAME: '',
        DUP_EMAIL: '',
        INCORRECT_PW: '',
        NEW_PASSWORD_NOT_MATCH: '',
        INTEREST_EMPTY: ''
    })
    const [userData, setUserData] = useState({
        last_name: '',
        first_name: '',
        username: '',
        email: '',
        area_code: '+852',
        phone: '',
        gender: 'M',
        birthday_month: 1,
        interests: [],
        income: 'HK$10,000或以下',
        occupation: '',
        current_password: '',
        new_password: '',
        confirm_new_password: ''
    });
    const [interestOptions] = useState([{
        name: 'invest',
        display: '股票/投資'
    }, {
        name: 'home_ownership',
        display: '海外樓市/置業'
    }, {
        name: 'business_management',
        display: '工商管理'
    }, {
        name: 'marketing',
        display: '市場營銷',
    }, {
        name: 'career',
        display: '職場'
    }, {
        name: 'health',
        display: '健康/保健'
    }, {
        name: 'education',
        display: '親子/升學/教育'
    }, {
        name: 'travel',
        display: '旅遊'
    }])

    const [incomeOptions] = useState([
        '不願透露',
        'HK$10,000或以下',
        'HK$10,001至HK$20,000',
        'HK$20,001至HK$30,000',
        'HK$30,001至HK$40,000',
        'HK$40,001至HK$50,000',
        'HK$50,001或以上'
    ])

    useEffect(() => {

        dispatch(setLoading(true))

    }, [])

    useEffect(() => {

        let mounted = true;

        if (user.isAuth, loading) {
            console.log(Axios.defaults.headers)
            Axios.get('/api/get-profile')
                .then(res => res.data)
                .then(data => {
                    if (!data.error) {
                        if(mounted){
                            setUserData(prev => {
                                return ({
                                    ...prev,
                                    last_name: data.user.last_name || '',
                                    first_name: data.user.first_name || '',
                                    username: data.user.username,
                                    email: data.user.email,
                                    area_code: data.user.area_code,
                                    phone: data.user.phone,
                                    gender: data.user.gender || 'M',
                                    birthday_month: data.user.birthday_month || 1,
                                    interests: data.interests || [],
                                    income: data.user.monthly_income || 'HK$10,000或以下',
                                    occupation: data.user.occupation || ''
                                })
    
                            })
                            dispatch(setLoading(false))
                        }
                    }
                })

        }

        return () => {
            mounted = false;
        }

    }, [user, loading])

    const selectAreaCode = (code) => {
        setUserData(prev => ({
            ...prev,
            area_code: code
        }))

        setAreaCodeDropdown(false)
    }

    const selectGender = (option) => {

        let gender = '';

        if (option === '男') {
            gender = 'M';
        } else if (option === '女') {
            gender = 'F';
        } else {
            gender = 'ND'
        }

        setUserData(prev => ({
            ...prev,
            gender: gender
        }))

        setGenderDropdown(false);
    }

    const selectBirthday = (option) => {
        setUserData(prev => ({
            ...prev,
            birthday_month: option
        }))
        setBirthdayDropdown(false);
    }

    const handleChange = (e) => {
        let { name, value } = e.target;

        setUserData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleInterestClicked = (option) => {
        setUserData(prev => {
            if (prev.interests?.includes(option.name)) {
                return ({
                    ...prev,
                    interests: prev.interests?.filter(interest => interest !== option.name)
                })
            }
            return ({
                ...prev,
                interests: [...prev.interests, option.name]
            })


        })
    }

    const selectIncome = (option) => {
        setUserData(prev => ({
            ...prev,
            income: option
        }))

        setIncomeDropdown(false)
    }

    const handleUpdatePersonalInfo = (e) => {

        e.preventDefault();
        setError({
            DUP_USERNAME: '',
            DUP_EMAIL: '',
            INCORRECT_PW: '',
            NEW_PASSWORD_NOT_MATCH: '',
            INTEREST_EMPTY: ''
        })

        if(userData.interests.length === 0){
            setError(prev => ({
                ...prev,
                INTEREST_EMPTY: '請選擇至少一項興趣'
            }))
            return;
        }

        let { current_password, new_password, confirm_new_password, ...postData } = userData;

        Axios.post('/api/update-profile-check-valid', {
            email: postData.email,
            username: postData.username,
            phone: postData.phone,
            area_code: postData.area_code
        })
            .then(res => res.data)
            .then(data => {
                if (!data.error) {
                    if (data.next === '2fa') {
                        if (process.env.REACT_APP_NODE_ENV !== 'production') {
                            alert(data.code);
                        }
                        dispatch(setUser(postData))
                        dispatch(setPopupPage('2fa'))
                        dispatch(setPopup(true));
                    } else if (data.next === 'edit') {
                        Axios.post('/api/update-profile', {
                            data: postData
                        })
                            .then(res => res.data)
                            .then(data => {
                                if (!data.error) {
                                    dispatch(setPopupPage('modify-personal-data-success'))
                                    dispatch(setPopup(true))
                                    dispatch(setUser({
                                        login_token: data.user.login_token,
                                        id: data.user.id,
                                        email: data.user.email,
                                        username: data.user.username,
                                        first_name: data.user.first_name,
                                        last_name: data.user.last_name,
                                        role: data.user.role,
                                        isAuth: true,
                                        area_code: data.user.area_code,
                                        phone: data.user.phone
                                    }))
                                }
                            })
                    }
                } else {
                    if (data.error.DUP_USERNAME) {
                        setError(prev => ({
                            ...prev,
                            DUP_USERNAME: data.error.DUP_USERNAME
                        }))
                    }
                    if (data.error.INVALID_EMAIL) {
                        setError(prev => ({
                            ...prev,
                            INVALID_EMAIL: data.error.INVALID_EMAIL
                        }))
                    }
                }
            })

    }

    const changePassword = (e) => {
        e.preventDefault();
        setError({
            DUP_USERNAME: '',
            DUP_EMAIL: '',
            INCORRECT_PW: '',
            NEW_PASSWORD_NOT_MATCH: ''
        })
        if (userData.current_password === userData.new_password) {
            setError(prev => ({
                ...prev,
                NEW_PASSWORD_NOT_MATCH: '新密碼不能與現時密碼相同'
            }))
        } else {
            Axios.post('/api/change-password', {
                current_password: userData.current_password,
                new_password: userData.new_password,
                confirm_new_password: userData.confirm_new_password
            })
                .then(res => res.data)
                .then(data => {
                    if (!data.error) {
                        dispatch(setPopupPage('modify-password-success'))
                        dispatch(setPopup(true))
                        setUserData(prev => ({
                            ...prev,
                            new_password: '',
                            current_password: '',
                            confirm_new_password: ''
                        }))
                    } else {
                        if (data.error.INCORRECT_PW) {
                            setError(prev => ({
                                ...prev,
                                INCORRECT_PW: data.error.INCORRECT_PW
                            }))
                        }
                        if (data.error.NEW_PASSWORD_NOT_MATCH) {
                            setError(prev => ({
                                ...prev,
                                NEW_PASSWORD_NOT_MATCH: data.error.NEW_PASSWORD_NOT_MATCH
                            }))
                        }
                    }
                })
        }
    }

    useEffect(() => {

        if(searchArea){
            // if(searchArea.charAt(0) === '+'){
                setFilteredAreaCode(areaCode.filter(code => code.phoneCode.includes(searchArea)))
            // }else{
            //     setFilteredAreaCode(areaCode.filter(code => code.phoneCode === `+${searchArea}`))
            // }
        }else{
            setFilteredAreaCode(areaCode);
        }

    }, [searchArea])

    return (
        <div className={AccountInfoStyles.container}>
            {loading ? <Spinner /> : <div>
                <h3 className={AccountInfoStyles.sectionTitle}>個人資料</h3>
                <div className={AccountInfoStyles.personalInfoContainer}>
                    <div className={AccountInfoStyles.avator}>{user?.username.charAt(0).toUpperCase()}</div>
                    <form className={AccountInfoStyles.inputForm} onSubmit={handleUpdatePersonalInfo}>
                        <div className={AccountInfoStyles.inputContainer}>
                            <div className={AccountInfoStyles.halfWidthInputGroup}>
                                <input
                                    name="last_name"
                                    value={userData.last_name}
                                    onChange={handleChange}
                                    className={AccountInfoStyles.inputField}
                                    required
                                />
                                <label className={AccountInfoStyles.floatingLabel}>姓氏</label>
                            </div>
                            <div className={AccountInfoStyles.halfWidthInputGroup}>
                                <input
                                    name="first_name"
                                    value={userData.first_name}
                                    onChange={handleChange}
                                    className={AccountInfoStyles.inputField}
                                    required
                                />
                                <label className={AccountInfoStyles.floatingLabel}>名字</label>
                            </div>
                        </div>
                        <div className={AccountInfoStyles.inputContainer}>
                            <div className={AccountInfoStyles.inputGroup}>
                                <input
                                    name="username"
                                    value={userData.username}
                                    onChange={handleChange}
                                    className={AccountInfoStyles.inputField}
                                    required
                                />
                                <label className={AccountInfoStyles.floatingLabel}>用戶名稱</label>
                                {error.DUP_USERNAME && <p className={AccountInfoStyles.error}>{error.DUP_USERNAME}</p>}
                                <label className={AccountInfoStyles.usernameRules}>必須包含由英文字母或數字組成的字元，不能包含空格、冒號或引號</label>
                            </div>
                        </div>
                        <div className={AccountInfoStyles.inputContainer}>
                            <div className={AccountInfoStyles.inputGroup}>
                                <input
                                    name="email"
                                    value={userData.email}
                                    onChange={handleChange}
                                    className={AccountInfoStyles.inputField}
                                    required
                                />
                                <label className={AccountInfoStyles.floatingLabel}>電郵地址</label>
                                {error.INVALID_EMAIL && <p className={AccountInfoStyles.error}>{error.INVALID_EMAIL}</p>}
                            </div>
                        </div>
                        <div className={AccountInfoStyles.inputContainer}>
                            <div className={AccountInfoStyles.areaCodeGroup}>
                                <div className={AccountInfoStyles.dropdownBtn} onClick={() => setAreaCodeDropdown(prev => !prev)}>
                                    <p className={AccountInfoStyles.selectedOption}>{userData.area_code}</p>
                                    <img src={areaCodeDropdown ? arrowUp : arrowDown} className={AccountInfoStyles.dropdownIcon} alt="show/hiden button" />
                                </div>
                                {areaCodeDropdown && <div className={AccountInfoStyles.dropdown}>
                                    <div className={AccountInfoStyles.areaSearchContainer}>
                                        <label>以區號搜尋：</label>
                                        <input onChange={(e) => setSearchArea(e.target.value)} value={searchArea} placeholder="搜尋" />
                                    </div>
                                    {filteredAreaCode.map((country) => {
                                        return <div className={AccountInfoStyles.dropdownOptions} onClick={() => selectAreaCode(country.phoneCode)} key={uuidv4()}>{`${country.phoneCode} ${country.countryName}`}</div>
                                    })}
                                </div>}
                                <label className={AccountInfoStyles.selectLabel}>區號</label>
                            </div>
                            <div className={AccountInfoStyles.phoneInputGroup}>
                                <input
                                    name="phone"
                                    value={userData.phone}
                                    onChange={handleChange}
                                    className={AccountInfoStyles.inputField}
                                    required
                                />
                                <label className={AccountInfoStyles.floatingLabel}>電話號碼</label>
                            </div>
                        </div>
                        <div className={AccountInfoStyles.inputContainer}>
                            <div className={AccountInfoStyles.halfSelectGroup}>
                                <div className={AccountInfoStyles.dropdownBtn} onClick={() => setGenderDropdown(prev => !prev)}>
                                    <p className={AccountInfoStyles.selectedOption}>{userData.gender === 'M' ? '男' : userData.gender === 'F' ? '女' : '不透露'}</p>
                                    <img src={genderDropDown ? arrowUp : arrowDown} className={AccountInfoStyles.dropdownIcon} alt="show/hiden button" />
                                </div>
                                {genderDropDown && <div className={AccountInfoStyles.dropdown}>
                                    {['男', '女', '不透露'].map((option) => {
                                        return <div className={AccountInfoStyles.dropdownOptions} onClick={() => selectGender(option)} key={uuidv4()}>{option}</div>
                                    })}
                                </div>}
                                <label className={AccountInfoStyles.selectLabel}>性別</label>
                            </div>
                            <div className={AccountInfoStyles.halfSelectGroup}>
                                <div className={AccountInfoStyles.dropdownBtn} onClick={() => setBirthdayDropdown(prev => !prev)}>
                                    <p className={AccountInfoStyles.selectedOption}>{userData.birthday_month}月</p>
                                    <img src={birthdayDropdown ? arrowUp : arrowDown} className={AccountInfoStyles.dropdownIcon} alt="show/hiden button" />
                                </div>
                                {birthdayDropdown && <div className={AccountInfoStyles.dropdown}>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((option) => {
                                        return <div className={AccountInfoStyles.dropdownOptions} onClick={() => selectBirthday(option)} key={uuidv4()}>{option}月</div>
                                    })}
                                </div>}
                                <label className={AccountInfoStyles.selectLabel}>生日月份</label>
                            </div>
                        </div>
                        <div className={AccountInfoStyles.interestSection}>
                            <p className={AccountInfoStyles.interestSectionTitle}>興趣 *（可選多於一項）{error && <span className={AccountInfoStyles.error}>{error.INTEREST_EMPTY}</span>}</p>
                            <div className={AccountInfoStyles.interestContainer}>
                                {interestOptions.map(option => {
                                    return (<div className={AccountInfoStyles.interestOption} key={uuidv4()}>
                                        <div className={AccountInfoStyles.radioBtn} onClick={() => handleInterestClicked(option)}>
                                            {userData.interests?.find(interest => interest === option.name) && <div className={AccountInfoStyles.selectedInterest}></div>}
                                        </div>
                                        <p>{option.display}</p>
                                    </div>
                                    )
                                })}
                            </div>
                            {/* {displayError && personalInput.interests.length === 0 && <p className={AccountInfoStyles.error}>請選擇興趣</p>} */}
                        </div>
                        <div className={AccountInfoStyles.inputContainer}>
                            <div className={AccountInfoStyles.halfSelectGroup}>
                                <div className={AccountInfoStyles.dropdownBtn} onClick={() => setIncomeDropdown(prev => !prev)}>
                                    <p className={AccountInfoStyles.selectedOption}>{userData.income}</p>
                                    <img src={areaCodeDropdown ? arrowUp : arrowDown} className={AccountInfoStyles.dropdownIcon} alt="show/hiden button" />
                                </div>
                                {incomeDropDdown && <div className={AccountInfoStyles.dropdown}>
                                    {incomeOptions.map((option) => {
                                        return <div className={AccountInfoStyles.dropdownOptions} onClick={() => selectIncome(option)}>{option}</div>
                                    })}
                                </div>}
                                <label className={AccountInfoStyles.selectLabel}>每月個人收入 (HK$)</label>
                            </div>
                            <div className={AccountInfoStyles.halfWidthInputGroup}>
                                <input
                                    name="occupation"
                                    value={userData.occupation}
                                    onChange={handleChange}
                                    className={AccountInfoStyles.inputField}
                                    required
                                />
                                <label className={AccountInfoStyles.floatingLabel}>職業</label>
                            </div>
                        </div>
                        <button className={AccountInfoStyles.submitBtn} type='submit'>更新</button>
                    </form>
                </div>
                <div className={AccountInfoStyles.divider}></div>
                <div className={AccountInfoStyles.passwordModifyContainer}>
                    <h3 className={AccountInfoStyles.sectionTitle}>修改密碼</h3>
                    <form className={AccountInfoStyles.inputForm} onSubmit={changePassword}>
                        <div className={AccountInfoStyles.inputContainer}>
                            <div className={AccountInfoStyles.inputGroup}>
                                <input
                                    type='password'
                                    name="current_password"
                                    value={userData.current_password}
                                    onChange={handleChange}
                                    className={AccountInfoStyles.inputField}
                                    required
                                />
                                <label className={AccountInfoStyles.floatingLabel}>現時密碼</label>
                                {error.INCORRECT_PW && <p className={AccountInfoStyles.error}>{error.INCORRECT_PW}</p>}
                            </div>
                        </div>
                        <div className={AccountInfoStyles.inputContainer}>
                            <div className={AccountInfoStyles.halfWidthInputGroup}>
                                <input
                                    type='password'
                                    name="new_password"
                                    value={userData.new_password}
                                    onChange={handleChange}
                                    className={AccountInfoStyles.inputField}
                                    required
                                />
                                <label className={AccountInfoStyles.floatingLabel}>新密碼</label>
                                {error.NEW_PASSWORD_NOT_MATCH && <p className={AccountInfoStyles.error}>{error.NEW_PASSWORD_NOT_MATCH}</p>}
                            </div>
                            <div className={AccountInfoStyles.halfWidthInputGroup}>
                                <input
                                    type='password'
                                    name="confirm_new_password"
                                    value={userData.confirm_new_password}
                                    onChange={handleChange}
                                    className={AccountInfoStyles.inputField}
                                    required
                                />
                                <label className={AccountInfoStyles.floatingLabel}>確認新密碼</label>
                            </div>
                        </div>
                        <button className={AccountInfoStyles.submitBtn} type='submit'>修改</button>
                    </form>
                </div>
            </div>}
        </div>
    )
}

export default AccountInfo
