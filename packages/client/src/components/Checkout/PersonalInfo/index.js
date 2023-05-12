import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

//styles
import PersonalInfoStyles from './PersonalInfo.module.scss';

//images
import arrowDown from 'images/icon/arrow_down@3x.png';
import arrowUp from 'images/icon/arrow_up@3x.png';

const PersonalInfo = ({ personalInput, setPersonalInput, displayError, show, hideFooter, unhideFooter }) => {

    const [genderDropdown, setGenderDropdown] = useState(false);
    const [birthdayDropdown, setBirthdayDropdown] = useState(false);
    const [incomeDropdown, setIncomeDropdown] = useState(false);

    const [interestOptions, setInterestOptions] = useState([{
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

    const incomeOptions = [
        '不願透露',
        'HK$10,000或以下',
        'HK$10,001至HK$20,000',
        'HK$20,001至HK$30,000',
        'HK$30,001至HK$40,000',
        'HK$40,001至HK$50,000',
        'HK$50,001或以上'
    ]

    const handleChange = (e) => {
        let { name, value } = e.target;
        setPersonalInput(name, value);
    }

    const handleInterestClicked = (option) => {
        if (personalInput.interests?.find(interest => interest === option.name)) {
            setPersonalInput('interests', personalInput.interests.filter(interest => interest !== option.name))
        } else {
            setPersonalInput('interests', [...personalInput.interests, option.name])
        }
    }

    return (
        <div className={`${PersonalInfoStyles.container} ${show ? PersonalInfoStyles.mobileContainer : ''}`}>
            <div className={PersonalInfoStyles.inputRow}>
                <div className={PersonalInfoStyles.inputGroup}>
                    <input
                        name='username'
                        value={personalInput.username || ''}
                        onChange={handleChange}
                        className={PersonalInfoStyles.inputField}
                        required
                        disabled
                        onFocus={hideFooter}
                        onBlur={unhideFooter}
                    />
                    <label className={PersonalInfoStyles.floatingLabel}>用戶名稱 *</label>
                    {displayError && !personalInput.username && <p className={PersonalInfoStyles.error}>請輸入用戶名</p>}
                </div>
            </div>
            <div className={PersonalInfoStyles.inputRow}>
                <div className={PersonalInfoStyles.inputGroup}>
                    <input
                        name='email'
                        value={personalInput.email || ''}
                        onChange={handleChange}
                        className={PersonalInfoStyles.inputField}
                        required
                        disabled
                        onFocus={hideFooter}
                        onBlur={unhideFooter}
                    />
                    <label className={PersonalInfoStyles.floatingLabel}>電郵地址 *</label>
                    {displayError && !personalInput.email && <p className={PersonalInfoStyles.error}>請輸入電郵</p>}
                </div>
            </div>
            <div className={PersonalInfoStyles.inputRow}>
                <div className={`${PersonalInfoStyles.inputGroup} ${PersonalInfoStyles.areaCodeInput}`}>
                    <input
                        name='area_code'
                        value={personalInput.area_code || ''}
                        onChange={handleChange}
                        className={PersonalInfoStyles.inputField}
                        required
                        disabled
                        onFocus={hideFooter}
                        onBlur={unhideFooter}
                    />
                    <label className={PersonalInfoStyles.floatingLabel}>區號 *</label>
                    {displayError && !personalInput.area_code && <p className={PersonalInfoStyles.error}>請輸入區號</p>}
                </div>
                <div className={`${PersonalInfoStyles.inputGroup} ${PersonalInfoStyles.phoneInput}`}>
                    <input
                        name='phone'
                        value={personalInput.phone || ''}
                        onChange={handleChange}
                        className={PersonalInfoStyles.inputField}
                        required
                        disabled
                        onFocus={hideFooter}
                        onBlur={unhideFooter}
                    />
                    <label className={PersonalInfoStyles.floatingLabel}>電話號碼 *</label>
                    {displayError && !personalInput.phone && <p className={PersonalInfoStyles.error}>請輸入電話</p>}
                </div>
            </div>
            <div className={PersonalInfoStyles.inputRow}>
                <div className={`${PersonalInfoStyles.inputGroup} ${PersonalInfoStyles.shortInput}`}>
                    <input
                        name='last_name'
                        value={personalInput.last_name || ''}
                        onChange={handleChange}
                        className={PersonalInfoStyles.inputField}
                        required
                        onFocus={hideFooter}
                        onBlur={unhideFooter}
                    />
                    <label className={PersonalInfoStyles.floatingLabel}>姓氏</label>
                    {displayError && !personalInput.last_name && <p className={PersonalInfoStyles.error}>請輸入姓氏</p>}
                </div>
                <div className={`${PersonalInfoStyles.inputGroup} ${PersonalInfoStyles.shortInput}`}>
                    <input
                        name='first_name'
                        value={personalInput.first_name || ''}
                        onChange={handleChange}
                        className={PersonalInfoStyles.inputField}
                        required
                        onFocus={hideFooter}
                        onBlur={unhideFooter}
                    />
                    <label className={PersonalInfoStyles.floatingLabel}>名稱</label>
                    {displayError && !personalInput.first_name && <p className={PersonalInfoStyles.error}>請輸入名稱</p>}
                </div>
            </div>
            <div className={PersonalInfoStyles.inputRow}>
                <div className={`${PersonalInfoStyles.inputGroup} ${PersonalInfoStyles.shortInput}`}>
                    <div className={PersonalInfoStyles.selectField} onClick={() => setGenderDropdown(prev => !prev)}>
                        <p>{personalInput.gender === 'M' ? '男' : personalInput.gender === 'F' ? '女' : '不透露'}</p>
                        <img src={genderDropdown ? arrowUp : arrowDown} className={PersonalInfoStyles.arrow} alt="show/hide button"/>
                        {genderDropdown && <div className={PersonalInfoStyles.dropdown}>
                            {['M', 'F', 'ND'].map(gender => {
                                return <div className={PersonalInfoStyles.dropdownItem} onClick={() => setPersonalInput('gender', gender)} key={uuidv4()}>{gender === 'M' ? '男' : gender === 'F' ? '女' : '不透露'}</div>
                            })}
                        </div>}
                    </div>
                    <label className={PersonalInfoStyles.selectLabel}>性別 *</label>
                    {displayError && !personalInput.gender && <p className={PersonalInfoStyles.error}>請選擇性別</p>}
                </div>
                <div className={`${PersonalInfoStyles.inputGroup} ${PersonalInfoStyles.shortInput}`}>
                    <div className={PersonalInfoStyles.selectField} onClick={() => setBirthdayDropdown(prev => !prev)}>
                        <p>{personalInput.birthday_month}月</p>
                        <img src={birthdayDropdown ? arrowUp : arrowDown} className={PersonalInfoStyles.arrow} alt="show/hide button"/>
                        {birthdayDropdown && <div className={PersonalInfoStyles.dropdown}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => {
                                return <div className={PersonalInfoStyles.dropdownItem} onClick={() => setPersonalInput('birthday_month', month)} key={uuidv4()}>{month}月</div>
                            })}
                        </div>}
                    </div>
                    <label className={PersonalInfoStyles.selectLabel}>生日月份 *</label>
                    {displayError && !personalInput.birthday_month && <p className={PersonalInfoStyles.error}>請選擇生日月份</p>}
                </div>
            </div>
            <div className={PersonalInfoStyles.interestSection}>
                <p className={PersonalInfoStyles.interestSectionTitle}>興趣 *（可選多於一項）</p>
                <div className={PersonalInfoStyles.interestContainer}>
                    {interestOptions.map(option => {
                        return (<div className={PersonalInfoStyles.interestOption} key={uuidv4()}>
                            <div className={PersonalInfoStyles.radioBtn} onClick={() => handleInterestClicked(option)}>
                                {personalInput.interests?.find(interest => interest === option.name) && <div className={PersonalInfoStyles.selectedInterest}></div>}
                            </div>
                            <p>{option.display}</p>
                        </div>
                        )
                    })}
                </div>
                {displayError && personalInput.interests.length === 0 && <p className={PersonalInfoStyles.error}>請選擇興趣</p>}
            </div>
            <div className={PersonalInfoStyles.inputRow}>
                <div className={`${PersonalInfoStyles.inputGroup} ${PersonalInfoStyles.shortInput}`}>
                    <div className={PersonalInfoStyles.selectField} onClick={() => setIncomeDropdown(prev => !prev)}>
                        <p>{personalInput.income}</p>
                        <img src={incomeDropdown ? arrowUp : arrowDown} className={PersonalInfoStyles.arrow} alt="show/hide button"/>
                        {incomeDropdown && <div className={PersonalInfoStyles.dropdown}>
                            {incomeOptions.map(income => {
                                return <div className={PersonalInfoStyles.dropdownItem} onClick={() => setPersonalInput('income', income)} key={uuidv4()}>{income}</div>
                            })}
                        </div>}
                    </div>
                    <label className={PersonalInfoStyles.selectLabel}>每月個人收入（HK$）*</label>
                    {displayError && !personalInput.income && <p className={PersonalInfoStyles.error}>請選擇每月個人收入</p>}
                </div>
                <div className={`${PersonalInfoStyles.inputGroup} ${PersonalInfoStyles.shortInput}`}>
                    <input
                        name='occupation'
                        value={personalInput.occupation || ''}
                        onChange={handleChange}
                        className={PersonalInfoStyles.inputField}
                        required
                        onFocus={hideFooter}
                        onBlur={unhideFooter}
                    />
                    <label className={PersonalInfoStyles.floatingLabel}>職業 *</label>
                    {displayError && !personalInput.occupation && <p className={PersonalInfoStyles.error}>請輸入職業</p>}
                </div>
            </div>

        </div>
    )
}

export default PersonalInfo
