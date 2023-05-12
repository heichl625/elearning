import React, { useEffect } from 'react'

//component
import PopupTitle from 'components/PopupTitle';
import Axios from 'axios';

//redux
import { useSelector, useDispatch } from 'react-redux'; 
import { setLoading, setPaymentMethodID, setPopup, setPopupPage } from 'redux/actions/global_setting';

//styles
import RemoveCardStyles from './RemoveCard.module.scss';

const RemoveCard = () => {

    const dispatch = useDispatch()

    const paymentMethodID = useSelector(store => store.global_setting.paymentMethodID);

    const handleCardRemove = () => {
        Axios.post('/api/remove-card', {
            id: paymentMethodID
        })
            .then(res => res.data)
            .then(data => {
                if(!data.error){
                    dispatch(setLoading(true));
                    dispatch(setPopup(false));
                }
            })
    }

    useEffect(() => {

        return () => {
            dispatch(setPopupPage(''));
            dispatch(setPaymentMethodID(''));
        }

    }, [])

    return (
        <div className={RemoveCardStyles.container}>
            <PopupTitle title='確定刪除信用卡？'/>
            <p className={RemoveCardStyles.msg}>刪除後，付款頁面將無法使用此信用卡，確定要刪除？</p>
            <button className={RemoveCardStyles.removeBtn} onClick={handleCardRemove}>刪除</button>
        </div>
    )
}

export default RemoveCard
