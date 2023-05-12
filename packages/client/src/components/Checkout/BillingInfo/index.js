import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';

import { areaCode } from 'utils/areaCode'

//styles
import BillingInfoStyles from './BillingInfo.module.scss';

//images
import CheckboxOn from 'images/icon/check_box_on@3x.png';
import CheckboxOff from 'images/icon/check_box_off@3x.png';
import arrowDown from 'images/icon/arrow_down@3x.png';
import arrowUp from 'images/icon/arrow_up@3x.png';

const BillingInfo = ({ setBillingInput, billingInput, displayError, show, hideFooter, unhideFooter }) => {

    const handleChange = (e) => {
        let { name, value } = e.target;
        setBillingInput(name, value);
    }

    const [countryDropdown, setCountryDropdown] = useState(false);

    return (
        <div className={`${BillingInfoStyles.container} ${show ? BillingInfoStyles.mobileContainer : ''}`}>
            <div className={BillingInfoStyles.inputRow}>
                <div className={`${BillingInfoStyles.inputGroup} ${BillingInfoStyles.shortInput}`}>
                    <input
                        name='last_name'
                        value={billingInput.last_name || ''}
                        onChange={handleChange}
                        className={BillingInfoStyles.inputField}
                        required
                        onFocus={hideFooter}
                        onBlur={unhideFooter} />
                    <label className={BillingInfoStyles.floatingLabel}>姓氏 *</label>
                    {displayError && !billingInput.last_name && <p className={BillingInfoStyles.error}>請輸入姓氏</p>}
                </div>
                <div className={`${BillingInfoStyles.inputGroup} ${BillingInfoStyles.shortInput}`}>
                    <input
                        name='first_name'
                        value={billingInput.first_name || ''}
                        onChange={handleChange}
                        className={BillingInfoStyles.inputField}
                        required
                        onFocus={hideFooter}
                        onBlur={unhideFooter} />
                    <label className={BillingInfoStyles.floatingLabel}>名字 *</label>
                    {displayError && !billingInput.first_name && <p className={BillingInfoStyles.error}>請輸入名字</p>}
                </div>
            </div>
            <div className={BillingInfoStyles.inputRow}>
                <div className={BillingInfoStyles.inputGroup}>
                    <input
                        name='company'
                        value={billingInput.company || ''}
                        onChange={handleChange}
                        className={BillingInfoStyles.inputField}
                        required
                        onFocus={hideFooter}
                        onBlur={unhideFooter} />
                    <label className={BillingInfoStyles.floatingLabel}>公司名稱（選填）</label>
                </div>
            </div>
            <div className={BillingInfoStyles.inputRow}>
                <div className={`${BillingInfoStyles.inputGroup} ${BillingInfoStyles.shortInput}`}>
                    <div className={BillingInfoStyles.selectField} onClick={() => setCountryDropdown(prev => !prev)}>
                        <p>{billingInput.country}</p>
                        <img src={countryDropdown ? arrowUp : arrowDown} className={BillingInfoStyles.arrow} alt="show/hide button"/>
                        {countryDropdown && <div className={BillingInfoStyles.dropdown}>
                            {areaCode.map(country => {
                                return <div className={BillingInfoStyles.dropdownItem} onClick={() => setBillingInput('country', country.countryName)} key={uuidv4()}>{country.countryName}</div>
                            })}
                         </div>
                        }
                    </div>
                    <label className={BillingInfoStyles.selectLabel}>國家／城市 *</label>
                    {displayError && !billingInput.country && <p className={BillingInfoStyles.error}>請選擇國家／城市</p>}
                </div>
            </div>
            <div className={BillingInfoStyles.inputRow}>
                <div className={BillingInfoStyles.inputGroup}>
                    <input
                        name='address'
                        value={billingInput.address || ''}
                        onChange={handleChange}
                        className={BillingInfoStyles.inputField}
                        required
                        onFocus={hideFooter}
                        onBlur={unhideFooter} />
                    <label className={BillingInfoStyles.floatingLabel}>地址 *</label>
                    {displayError && !billingInput.address && <p className={BillingInfoStyles.error}>請輸入地址</p>}
                </div>
            </div>
            <div className={BillingInfoStyles.inputRow}>
                <div className={BillingInfoStyles.inputGroup}>
                    <input
                        name='city'
                        value={billingInput.city || ''}
                        onChange={handleChange}
                        className={BillingInfoStyles.inputField}
                        required
                        onFocus={hideFooter}
                        onBlur={unhideFooter} />
                    <label className={BillingInfoStyles.floatingLabel}>城鎮／城市 *</label>
                    {displayError && !billingInput.city && <p className={BillingInfoStyles.error}>請輸入城鎮／城市</p>}
                </div>
            </div>
            <div className={BillingInfoStyles.inputRow}>
                <div className={`${BillingInfoStyles.inputGroup} ${BillingInfoStyles.shortInput}`}>
                    <input
                        name='district'
                        value={billingInput.district || ''}
                        onChange={handleChange}
                        className={BillingInfoStyles.inputField}
                        required
                        onFocus={hideFooter}
                        onBlur={unhideFooter} />
                    <label className={BillingInfoStyles.floatingLabel}>地區 *</label>
                    {displayError && !billingInput.district && <p className={BillingInfoStyles.error}>請輸入地區</p>}
                </div>
                <div className={`${BillingInfoStyles.inputGroup} ${BillingInfoStyles.shortInput}`}>
                    <input
                        name='post_code'
                        value={billingInput.post_code || ''}
                        onChange={handleChange}
                        className={BillingInfoStyles.inputField}
                        required
                        onFocus={hideFooter}
                        onBlur={unhideFooter} />
                    <label className={BillingInfoStyles.floatingLabel}>郵政編碼（選填）</label>
                </div>
            </div>
            <div className={BillingInfoStyles.checkboxContainer}>
                <img src={billingInput.default ? CheckboxOn : CheckboxOff} className={BillingInfoStyles.checkbox} onClick={() => setBillingInput('default', !billingInput.default)} alt="custom checkbox"/>
                <p>將此地址作為我的默認地址</p>
            </div>
            
        </div>
    )
}


export default BillingInfo
