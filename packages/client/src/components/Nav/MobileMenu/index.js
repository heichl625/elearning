import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'
import { Link } from 'react-router-dom';

import SearchBar from '../SearchBar';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { setPopup, setPopupPage } from 'redux/actions/global_setting';

//styles
import MobileMenuStyles from './MobileMenu.module.scss';

//images
import close from 'images/icon/ic-menu-close@3x.png';
import arrowDown from 'images/icon/arrow_large_down_black@3x.png';
import arrowUp from 'images/icon/arrow_large_up_black@3x.png';


const MobileMenu = ({ setShowMobileMenu, showMobileMenu }) => {

    const dispatch = useDispatch();

    const user = useSelector(store => store.user);
    const categories = useSelector(store => store.global_setting.categories);

    const [courseExpanded, setCourseExpanded] = useState(false);
    const [aboutExpanded, setAboutExpanded] = useState(false);

    const aboutMenuItems = [{
        name: '品牌故事',
        path: '/brand-story'
    }, {
        name: '常見問題',
        path: '/frequently-asked'
    }, {
        name: '聯絡我們',
        path: 'contact-us'
    }]

    const handleLoginClicked = () => {
        dispatch(setPopupPage('loginOptions'))
        dispatch(setPopup(true))
    }

    const handleLogoutClicked = () => {
        dispatch(setPopupPage('logout'))
        dispatch(setPopup(true))
    }

    return (
        <div className={`${MobileMenuStyles.container} ${showMobileMenu ? MobileMenuStyles.show : MobileMenuStyles.hide}`}>
            <div className={MobileMenuStyles.closeBtn} onClick={setShowMobileMenu}>
                <img src={close} className={MobileMenuStyles.closeIcon} alt="close button"/>
                <p className={MobileMenuStyles.closeText}>關閉</p>
            </div>
            <div className={MobileMenuStyles.searchContainer}>
                <SearchBar setShowMobileMenu={() => setShowMobileMenu()}/>
            </div>
            {user.isAuth === true && <div className={MobileMenuStyles.userMenu}>
                <div className={MobileMenuStyles.userContainer}>
                    <div className={MobileMenuStyles.userAvator}>{user.username.charAt(0).toUpperCase()}</div>
                    <div>
                        <p className={MobileMenuStyles.username}>{user.username}</p>
                        <Link to='/profile' className={MobileMenuStyles.highlightText}>查看我的帳戶</Link>
                    </div>
                </div>
                <Link to='/profile/enrolled-courses' className={MobileMenuStyles.profileLink}>我的課程</Link>
                <Link to='/profile/purchase-records' className={MobileMenuStyles.profileLink}>購買紀錄</Link>
                <Link to='/profile/certificate' className={MobileMenuStyles.profileLink}>我的證書</Link>
                <p className={MobileMenuStyles.profileLink} onClick={handleLogoutClicked}>登出</p>
            </div>}
            <div className={MobileMenuStyles.menuList}>
                <div className={`${MobileMenuStyles.menuItem} ${MobileMenuStyles.navItem}`}>

                    <div className={MobileMenuStyles.sectionTitle} onClick={() => setCourseExpanded(!courseExpanded)}>
                        <p className={MobileMenuStyles.navText}>課程</p>
                        <img src={courseExpanded ? arrowUp : arrowDown} className={MobileMenuStyles.arrowIcon} alt="show/hiden button"/>
            
                    </div>

                    {courseExpanded === true && <div className={MobileMenuStyles.subItemContainer}>
                        <Link to='/courses'>所有({categories.totalCourseNumber})</Link>
                        {categories.categories.length > 0 && categories.categories.map(category => {
                            return <Link to={`/courses?category=${category.id}`} key={uuidv4()} onClick={() => setShowMobileMenu()}>{category.name}({category.course_number})</Link>
                        })}
                    </div>}
                </div>
                <div className={`${MobileMenuStyles.menuItem} ${MobileMenuStyles.navItem}`}>
                    <div className={MobileMenuStyles.sectionTitle} onClick={() => setAboutExpanded(!aboutExpanded)}>
                        <p className={MobileMenuStyles.navText}>關於我們</p>
                        <img src={aboutExpanded ? arrowUp : arrowDown} className={MobileMenuStyles.arrowIcon} alt="show/hiden button"/>
                    </div>
                    { aboutExpanded === true && <div className={MobileMenuStyles.subItemContainer}>
                        {aboutMenuItems.map(item => {
                            return <Link to={item.path} key={uuidv4()}>{item.name}</Link>
                        })}
                    </div>}
                </div>
                {!user.isAuth && <div className={MobileMenuStyles.menuItem}>
                    <div>
                        <p className={`${MobileMenuStyles.navText} ${MobileMenuStyles.highlightText}`} onClick={handleLoginClicked}>登入/註冊</p>
                    </div>
                </div>}
            </div>

        </div>
    )
}

export default MobileMenu
