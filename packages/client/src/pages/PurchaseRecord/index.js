import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { useSelector } from 'react-redux';


//component
import UserCard from 'components/Profile/UserCard';
import PurchaseRecordCard from 'components/Profile/PurchaseRecordCard'

import PurchaseRecordStyles from './PurchaseRecord.module.scss';

const PurchaseRecord = () => {

    const [order, setOrder] = useState([]);
    const isAuth = useSelector(store => store.user.isAuth)

    useEffect(() => {

        let mounted = true;

        if (isAuth) {
            Axios.get('/api/user-purchase')
                .then(res => res.data)
                .then(data => {
                    if (!data.error && mounted) {
                        setOrder(data.orders)
                    }
                })
        }

        return () => {
            mounted = false;
        }

    }, [isAuth])

    useEffect(() => {
        
        document.title = '購買紀錄 - MeLearn.Guru'
        
    }, [])

    return (
        <div className={PurchaseRecordStyles.container}>
            <h3 className={PurchaseRecordStyles.pageTitle}>購買紀錄</h3>
            <div className={PurchaseRecordStyles.main}>
                <UserCard />
                {order.length > 0 && <div className={PurchaseRecordStyles.recordList}>
                    <p className={PurchaseRecordStyles.recordNum}>共{order?.length}項紀錄</p>
                    {order.map(record => {
                        return <PurchaseRecordCard record={record} key={uuidv4()}/>
                    })}
                </div>}
            </div>

        </div>
    )
}

export default PurchaseRecord
