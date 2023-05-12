import React, { useEffect, useState } from 'react'
import Axios from 'axios'

//redux
import { useSelector, useDispatch } from 'react-redux';
import { setLoading } from 'redux/actions/global_setting';

//component
import UserCard from 'components/Profile/UserCard';
import CertificateList from 'components/Profile/CertificateList';

//styles
import CertificateStyles from './Certificate.module.scss';

const Certificate = () => {

    const dispatch = useDispatch();

    const [certificates, setCertificates] = useState([]);

    const user = useSelector(store => store.user);
    const loading = useSelector(store => store.global_setting.loading)

    useEffect(() => {

        document.title = '我的證書 - MeLearn.Guru'
        dispatch(setLoading(true))

    }, [])

    useEffect(() => {

        if (user.isAuth && loading) {
            Axios.get('/api/certificates')
                .then(res => res.data)
                .then(data => {
                    if (!data.error) {
                        setCertificates(data.certificates);
                        
                    }
                    dispatch(setLoading(false));
                })
        }

    }, [user, loading])


    return (
        <div className={CertificateStyles.container}>
            <h3 className={CertificateStyles.pageTitle}>我的證書</h3>
            <div className={CertificateStyles.main}>
                <UserCard />
                <CertificateList certificates={certificates} />
            </div>
        </div>
    )
}

export default Certificate
