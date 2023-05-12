import React from 'react';
import { useSelector } from 'react-redux';

import UserCardStyles from './UserCard.module.scss';

const UserCard = () => {

    const user = useSelector(store => store.user);

    return (
        <div className={UserCardStyles.container}>
            <div className={UserCardStyles.avator}>{user?.username.toUpperCase().charAt(0)}</div>
            <div className={UserCardStyles.infoGroup}>
                <p className={UserCardStyles.infoLabel}>用戶名稱</p>
                <p className={UserCardStyles.info}>{user.username}</p>
            </div>
            <div className={UserCardStyles.infoGroup}>
                <p className={UserCardStyles.infoLabel}>電郵</p>
                <p className={UserCardStyles.info}>{user.email}</p>
            </div>
        </div>
    )
}

export default UserCard
