import React, { useEffect } from 'react'

//component
import UserCard from 'components/Profile/UserCard';
import EditProfile from 'components/Profile/EditProfile';

//styles
import ProfileStyles from './Profile.module.scss'


const Profile = () => {

    useEffect(() => {

        document.title = '我的帳戶 - MeLearn.Guru'

    }, [])

    return (
        <div className={ProfileStyles.container}>
            <h3 className={ProfileStyles.pageTitle}>我的帳戶</h3>
            <div className={ProfileStyles.main}>
                <UserCard />
                <EditProfile />
            </div>
        </div>
    )
}

export default Profile
