import React, { useEffect, useState } from 'react'
import Axios from 'axios';

//redux
import { useDispatch, useSelector } from 'react-redux';
import { setPopupPage, setPopup, setPromotion } from "redux/actions/global_setting";

const PromotionPopup = () => {

    const dispatch = useDispatch();
    const showPopup = useSelector(store => store.global_setting.showPopup);
    const popupPage = useSelector(store => store.global_setting.popupPage);

    useEffect(() => {

        if (window.location.pathname === '/') {
            Axios.get('/api/promotion-popup')
                .then(res => res.data)
                .then(data => {
                    if (!data.error) {
                        if (data.promotion) {
                            dispatch(setPromotion(data.promotion))
                            dispatch(setPopupPage('promotion'));
                            dispatch(setPopup(true));
                        }
                    }
                })
        }

    }, [window.location.pathname])

    return (
        <div>

        </div>
    )
}

export default PromotionPopup
