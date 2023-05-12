import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom';

import PriceChangedStyle from './PriceChanged.module.scss';

const PriceChanged = () => {

    const history = useHistory();

    useEffect(() => {

        document.title = '課程價格已變更 - MeLearn.Guru'

    }, [])

    return (
        <div className={PriceChangedStyle.container}>
            <div className={PriceChangedStyle.titleContainer}>
                <h1 className={PriceChangedStyle.title}>課程價格已變更</h1>
                <div className={PriceChangedStyle.divider}></div>
            </div>
            <p className={PriceChangedStyle.msg}>對不起，您所購買的課程價格已變更。請放心，我們沒有在此交易中收費，您也可向您的銀行查詢。</p>
            <p className={PriceChangedStyle.msg}>如有任何疑問，歡迎與我們聯絡。</p>
            <div className={PriceChangedStyle.btnGroup}>
                <button className={PriceChangedStyle.highlightBtn} onClick={() => history.push('/courses')}>購買其他課程</button>
                <button className={PriceChangedStyle.normalBtn} onClick={() => history.push('/')}>返回主頁</button>
            </div>
        </div>
    )
}

export default PriceChanged
