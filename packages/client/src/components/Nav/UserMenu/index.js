import React, { useEffect } from 'react'

import { Link } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux'
import { setPopupPage, setPopup } from '../../../redux/actions/global_setting';

import UserMenuStyles from './UserMenu.module.scss';

const UserMenu = () => {

    const dispatch = useDispatch();

    const user = useSelector(store => store.user);

    const logout = () => {
        dispatch(setPopupPage('logout'))
        dispatch(setPopup(true));
    }

    return (
        <div className={UserMenuStyles.container}>
            <div className={UserMenuStyles.pointer}></div>
            <div className={UserMenuStyles.menu}>
                <div className={`${UserMenuStyles.menuItem} ${UserMenuStyles.userContainer} `}>
                    <div className={UserMenuStyles.userIcon}>
                        <p className={UserMenuStyles.iconLetter}>{user.username?.charAt(0).toUpperCase()}</p>
                    </div>
                    <div className={UserMenuStyles.userRight}>
                        <p className={UserMenuStyles.username}>{user.username}</p>
                        <Link to='/profile' className={UserMenuStyles.profileLink}>查看我的帳戶</Link>
                    </div>
                </div>
                <Link to='/profile/enrolled-courses' className={UserMenuStyles.menuItem}>
                    我的課程
            </Link>
                <Link to='/profile/purchase-records' className={UserMenuStyles.menuItem}>
                    購買紀錄
            </Link>
                <Link to='/profile/certificate' className={UserMenuStyles.menuItem}>
                    我的證書
            </Link>
                <div className={`${UserMenuStyles.menuItem} ${UserMenuStyles.logoutBtn}`} onClick={logout}>
                    登出
            </div>
            </div>
        </div>

    )
}

export default UserMenu
