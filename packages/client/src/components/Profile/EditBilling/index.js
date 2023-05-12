import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { v4 as uuidv4 } from 'uuid'

//utils
import { areaCode } from 'utils/areaCode';

//redux
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setPopup, setPopupPage } from 'redux/actions/global_setting'

//styles
import EditBillingStyles from './EditBilling.module.scss';


//images
import arrowUp from 'images/icon/arrow_up@3x.png';
import arrowDown from 'images/icon/arrow_down@3x.png';
import Spinner from 'components/Spinner';


const EditBilling = () => {

    const dispatch = useDispatch();

    const user = useSelector(store => store.user);
    const loading = useSelector(store => store.global_setting.loading)

    const [billingAddress, setBillingAddress] = useState();
    const [countryDowndown, setCountryDropdown] = useState(false);

    useEffect(() => {

        dispatch(setLoading(true));

    }, [])

    useEffect(() => {

        let mounted = true;

        if (user.isAuth, loading) {
            Axios.get('/api/get-billing-address')
                .then(res => res.data)
                .then(data => {
                    if (!data.error && mounted) {
                        setBillingAddress(data.billing_address);
                        dispatch(setLoading(false))
                    }
                })
        }

        return () => {
            mounted = false;
        }

    }, [user, loading])

    const handleChange = (e) => {
        let { name, value } = e.target;

        setBillingAddress(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const selectCountry = (country) => {
        setBillingAddress(prev => ({...prev, billing_country: country.countryName}));
        setCountryDropdown(false);
    }

    const updateBillingAddress = () => {
        Axios.post('/api/update-user-billing-address', {
            billing_address: {
                last_name: billingAddress.billing_last_name,
                first_name: billingAddress.billing_first_name,
                city: billingAddress.billing_city,
                company: billingAddress.billing_company,
                district: billingAddress.billing_district,
                address: billingAddress.billing_address,
                post_code: billingAddress.billing_post_code,
                country: billingAddress.billing_country
            }
        })
        .then(res => res.data)
        .then(data => {
            if(!data.error){
                dispatch(setPopupPage('modify-billing-success'));
                dispatch(setPopup(true))
            }else{
                console.log(data.error);
            }
        })
    }

    return (
        <div className={EditBillingStyles.container}>
            {loading  ? <Spinner /> : <div className={EditBillingStyles.inputForm}>
                <div className={EditBillingStyles.inputContainer}>
                    <div className={EditBillingStyles.halfWidthInputGroup}>
                        <input
                            name="billing_last_name"
                            value={billingAddress?.billing_last_name || ''}
                            onChange={handleChange}
                            className={EditBillingStyles.inputField}
                            required
                        />
                        <label className={EditBillingStyles.floatingLabel}>姓氏</label>
                    </div>
                    <div className={EditBillingStyles.halfWidthInputGroup}>
                        <input
                            name="billing_first_name"
                            value={billingAddress?.billing_first_name || ''}
                            onChange={handleChange}
                            className={EditBillingStyles.inputField}
                            required
                        />
                        <label className={EditBillingStyles.floatingLabel}>名字</label>
                    </div>
                </div>
                <div className={EditBillingStyles.inputContainer}>
                    <div className={EditBillingStyles.inputGroup}>
                        <input
                            name="billing_company"
                            value={billingAddress?.billing_company || ''}
                            onChange={handleChange}
                            className={EditBillingStyles.inputField}
                            required
                        />
                        <label className={EditBillingStyles.floatingLabel}>公司名稱（選填）</label>
                    </div>
                </div>
                <div className={EditBillingStyles.inputContainer}>
                    <div className={EditBillingStyles.selectGroup}>
                        <div className={EditBillingStyles.dropdownBtn} onClick={() => setCountryDropdown(prev => !prev)}>
                            <p className={EditBillingStyles.selectedOption}>{billingAddress?.billing_country}</p>
                            <img src={countryDowndown ? arrowUp : arrowDown} className={EditBillingStyles.dropdownIcon} alt="show/hiden button"/>
                        </div>
                        {countryDowndown && <div className={EditBillingStyles.dropdown}>
                            {areaCode.map((country) => {
                                return <div className={EditBillingStyles.dropdownOptions} onClick={() => selectCountry(country)} key={uuidv4()}>{country.countryName}</div>
                            })}
                        </div>}
                        <label className={EditBillingStyles.selectLabel}>國家/城市</label>
                    </div>
                </div>
                <div className={EditBillingStyles.inputContainer}>
                    <div className={EditBillingStyles.inputGroup}>
                        <input
                            name="billing_address"
                            value={billingAddress?.billing_address || ''}
                            onChange={handleChange}
                            className={EditBillingStyles.inputField}
                            required
                        />
                        <label className={EditBillingStyles.floatingLabel}>地址</label>
                    </div>
                </div>
                <div className={EditBillingStyles.inputContainer}>
                    <div className={EditBillingStyles.inputGroup}>
                        <input
                            name="billing_city"
                            value={billingAddress?.billing_city || ''}
                            onChange={handleChange}
                            className={EditBillingStyles.inputField}
                            required
                        />
                        <label className={EditBillingStyles.floatingLabel}>城鎮/城市</label>
                    </div>
                </div>
                <div className={EditBillingStyles.inputContainer}>
                    <div className={EditBillingStyles.halfWidthInputGroup}>
                        <input
                            name="billing_district"
                            value={billingAddress?.billing_district || ''}
                            onChange={handleChange}
                            className={EditBillingStyles.inputField}
                            required
                        />
                        <label className={EditBillingStyles.floatingLabel}>地區</label>
                    </div>
                    <div className={EditBillingStyles.halfWidthInputGroup}>
                        <input
                            name="billing_post_code"
                            value={billingAddress?.billing_post_code || ''}
                            onChange={handleChange}
                            className={EditBillingStyles.inputField}
                            required
                        />
                        <label className={EditBillingStyles.floatingLabel}>郵政編碼（選填）</label>
                    </div>
                </div>
                <button className={EditBillingStyles.saveBtn} onClick={updateBillingAddress}>更新</button>
            </div>}
            
        </div>
    )
}

export default EditBilling
