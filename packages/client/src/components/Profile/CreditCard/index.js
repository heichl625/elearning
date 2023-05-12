import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Axios from 'axios';
import Spinner from 'components/Spinner';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { setPopup, setPopupPage, setPaymentMethodID, setLoading } from 'redux/actions/global_setting'

//styles
import CreditCardStyles from './CreditCard.module.scss';

//images
import visaIcon from 'images/icon/visa@3x.png';
import masterIcon from 'images/icon/master@3x.png';
import aeIcon from 'images/icon/ae@3x.png';

const CreditCard = () => {

    const dispatch = useDispatch()

    const user = useSelector(store => store.user);
    const loading = useSelector(store => store.global_setting.loading)

    const [cardList, setCardList] = useState([]);

    useEffect(() => {

        dispatch(setLoading(true))

    }, [])

    useEffect(() => {

        let mounted = true;

        if (user.isAuth && loading) {

            Axios.get('/api/credit-card-list')
                .then(res => res.data)
                .then(data => {
                    if(mounted){
                        if (!data.error) {
                            setCardList(data.cards)
                        }
                        dispatch(setLoading(false))
                    }
                    
                })

        }

        return () => {
            mounted = false;
        }

    }, [user, loading])

    const removeCard = (id) => {

        dispatch(setPaymentMethodID(id))
        dispatch(setPopupPage('remove-card'))
        dispatch(setPopup(true))

    }

    const handleAddCard = () => {
        dispatch(setPopupPage('add-card'));
        dispatch(setPopup(true));
    }

    return (
        <div className={CreditCardStyles.container}>
            {loading ? <Spinner /> : <div>
                {cardList?.length > 0 && cardList.map(card => {
                    return <div className={CreditCardStyles.cardBlock} key={uuidv4()}>
                        <div className={CreditCardStyles.cardLeft}>
                            <img src={card.brand === 'visa' ? visaIcon : card.brand === 'mastercard' ? masterIcon : aeIcon} className={CreditCardStyles.icon} alt={`${card.brand} icon`}/>
                            <div className={CreditCardStyles.cardInfoContainer}>
                                <p className={CreditCardStyles.cardInfo}>{card.brand === 'visa' ? 'Visa' : card.brand === 'mastercard' ? 'Mastercard' : 'American Express'} ． {card.last4} - {card.exp_month}/{card.exp_year}</p>
                            </div>
                        </div>
                        <p className={CreditCardStyles.deleteBtn} onClick={() => removeCard(card.id)}>刪除</p>
                    </div>
                })}
                <p className={CreditCardStyles.addCard} onClick={handleAddCard}>添加信用卡 +</p>
            </div>}
        </div>
    )
}

export default CreditCard
