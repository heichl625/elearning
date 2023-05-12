import React, { useState, useEffect } from 'react';
import Axios from 'axios';

//component 
import PopupTitle from 'components/PopupTitle';

//redux
import { useDispatch } from 'react-redux';
import { setLoading, setPopup, setPopupPage } from 'redux/actions/global_setting'

//styles
import AddCardStyles from './AddCard.module.scss'

const AddCard = () => {

    const dispatch = useDispatch();

    const [card, setCard] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [cardError, setCardError] = useState('')
    const [expiryError, setExpiryError] = useState('')
    const [cvcError, setCvcError] = useState('')
    const [disabledSubmitBtn, setDisabledSubmitBtn] = useState(false);

    const handleCardChange = (e) => {
        let { value } = e.target;

        if ((value.length <= 19 && /^(?=.*\d)[\d ]+$/.test(value)) || value === '') {
            setCard(value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim())
        }

    }

    const handleExpiryChange = (e) => {
        let { value } = e.target;

        if ((value.length <= 5) || value === '') {
            if (expiry.length === 2 && value.length === 3) {
                setExpiry(value.slice(0, 2) + '/' + value.slice(2, 3))
            } else if (expiry.length === 4 && value.length === 3) {
                setExpiry(value.slice(0, 2))
            } else {
                setExpiry(value)
            }

        }
    }

    const handleAddCard = (e) => {
        e.preventDefault();

        setDisabledSubmitBtn(true)
        setCardError('');
        setExpiryError('');
        setCvcError('');

        if (!card) {
            setCardError('請輸入信用卡號碼');
            setDisabledSubmitBtn(false);
        }
        if (!expiry || expiry.length !== 5) {
            setExpiryError('請輸入信用卡到期日（MM/YY）')
            setDisabledSubmitBtn(false);
        }

        if (!cvc) {
            setCvcError('請輸入安全碼');
            setDisabledSubmitBtn(false);
        }

        Axios.post('/api/add-card', {
            number: card.replace(/\s/g, ""),
            exp_month: expiry.split('/')[0],
            exp_year: expiry.split('/')[1],
            cvc: cvc
        })
            .then(res => res.data)
            .then(data => {
                if (data.error) {
                    switch (data.error.code) {
                        case 'card_declined':
                            if (data.error.decline_code === 'insufficient_funds') {
                                setCardError('信用卡沒有足夠的信用額')
                            } else {
                                setCardError('請輸入有效的信用卡號碼')
                            }
                            break;
                        case "invalid_expiry_month":
                        case "invalid_expiry_year":
                            setExpiryError('請輸入有效的信用卡到期日')
                            break;
                        case "invalid_cvc":
                        case "incorrect_cvc":
                            setCvcError('請輸入正確的安全碼');
                            break;
                        case "expired_card":
                            setExpiryError('此信用卡已過期')
                            break;
                        case "incorrect_number":
                            setCardError('請輸入有效的信用卡號碼');
                            break;
                        default:
                            setCardError(data.error);
                            break;
                    }
                    setDisabledSubmitBtn(false);
                } else {
                    dispatch(setLoading(true));
                    dispatch(setPopupPage('add-card-success'));
                }
            })
    }

    useEffect(() => {

        return () => {
            dispatch(setPopupPage(''))
        }

    }, [])

    return (
        <div className={AddCardStyles.container}>
            <PopupTitle title='添加信用卡' />
            <form className={AddCardStyles.inputForm} onSubmit={handleAddCard}>
                <div className={AddCardStyles.inputGroup}>
                    <input
                        className={AddCardStyles.inputField}
                        value={card}
                        onChange={handleCardChange}
                        required />
                    <label className={AddCardStyles.floatingLabel}>信用卡號碼</label>
                    {cardError && <p className={AddCardStyles.error}>{cardError}</p>}
                </div>
                <div className={AddCardStyles.inputGroup}>
                    <input
                        className={AddCardStyles.inputField}
                        value={expiry}
                        onChange={handleExpiryChange}
                        required />
                    <label className={AddCardStyles.floatingLabel}>到期日(MM/YY)</label>
                    {expiryError && <p className={AddCardStyles.error}>{expiryError}</p>}
                </div>
                <div className={AddCardStyles.inputGroup}>
                    <input
                        className={AddCardStyles.inputField}
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        maxLength="4"
                        required />
                    <label className={AddCardStyles.floatingLabel}>安全碼</label>
                    {cvcError && <p className={AddCardStyles.error}>{cvcError}</p>}
                </div>
                <button className={AddCardStyles.addBtn} type='submit' disabled={disabledSubmitBtn}>添加</button>
            </form>
        </div>
    )
}

export default AddCard
