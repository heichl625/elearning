import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

import Axios from 'axios'

//Component
import SearchBar from './SearchBar';
import CategoryMenu from './CategoryMenu';
import AboutMenu from './AboutMenu';
import Badge from './Badge';
import Popup from '../Popup';
import UserMenu from './UserMenu';

//styles
import navStyles from './Nav.module.scss';

//image
import bookmarkIcon from 'images/icon/btn_bookmarked@3x.png';
import cartIcon from 'images/icon/btn_cart@3x.png';
import messageIcon from 'images/icon/btn_message_off@3x.png';
import hamburgerMenu from 'images/icon/ic-menu-black@3x.png';

//redux
import { useDispatch, useSelector } from 'react-redux'
import { clearUser, setEnrolledCourses, setPendingCourses } from '../../redux/actions/user'
import { setPopup, setPopupPage, setCartPopup, setCategories } from '../../redux/actions/global_setting'
import { setCart } from '../../redux/actions/cart'
import CartPopup from './CartPopup';
import { setUnreadMsg } from 'redux/actions/inbox';
import MobileMenu from './MobileMenu';


const Nav = () => {

    const dispatch = useDispatch();
    const location = useLocation();

    const cartRef = useRef(null);
    const userMenuRef = useRef(null);

    const [showCategory, setShowCategory] = useState(false)
    const [showAbout, setShowAbout] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const user = useSelector(store => store.user);
    const cart = useSelector(store => store.cart);
    const showPopup = useSelector(store => store.global_setting.showPopup);
    const showCartPopup = useSelector(store => store.global_setting.showCartPopup);
    const unreadMsg = useSelector(store => store.inbox.unreadMsg);

    useEffect(() => {

        const handleClickOutside = event => {
            if (cartRef.current && !cartRef.current.contains(event.target)) {
                dispatch(setCartPopup(false));
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }

    }, [])

    useEffect(async () => {

        let mounted = true;

        if (!user.isAuth) {

            const cartCookieValue = document.cookie
                .split('; ')
                .find(row => row.startsWith('cart'))

            const cartStr = cartCookieValue?.split('=')[1]

            if (typeof cartStr === 'string') {
                let cookieCartArr;
                try{
                    cookieCartArr = JSON.parse(cartStr);
                    let cartArr = [];
                    for(const item of cookieCartArr){
                        let response = await Axios.get('/api/courses/'+item.course_id)
                        let data = await response.data;

                        cartArr.push({
                            course_id: item.course_id,
                            title: data.course.title,
                            price: data.course.price,
                            discount_start: data.course.discount_start,
                            discount_end: data.course.discount_end,
                            discount_price: data.course.discount_price || null,
                            discount_text: data.course.discount_text || null,
                            tutor_name: data.tutor.name,
                            tutor_avator: data.tutor.avator,
                            cover_img: data.course.cover_img,
                            duration: data.course.duration,
                            lesson_num: data.lesson_number
                        })

                    }
                    dispatch(setCart(cartArr))
                }catch(err){
                    console.log(err);
                }
            }

        } else {

            Axios.get('/api/enrolled-courses')
                .then(res => res.data)
                .then(async data => {
                    if (!data.error && mounted ) {

                        const cartCookieValue = document.cookie
                            .split('; ')
                            .find(row => row.startsWith('cart'))
                        
                        try{
                            let cartStr = cartCookieValue?.split('=')[1] 
                            let cookieCartArr = JSON.parse(cartStr);
                            cookieCartArr = cookieCartArr.filter(item => {
                                return !data.enrolledCourses.find(course => course.id === item.course_id);
                            })
                            let cartArr = [];
                            for(const item of cookieCartArr){
                                let response = await Axios.get('/api/courses/'+item.course_id)
                                let data = await response.data;
        
                                cartArr.push({
                                    course_id: item.course_id,
                                    title: data.course.title,
                                    price: data.course.price,
                                    discount_start: data.course.discount_start,
                                    discount_end: data.course.discount_end,
                                    discount_price: data.course.discount_price || null,
                                    discount_text: data.course.discount_text || null,
                                    tutor_name: data.tutor.name,
                                    tutor_avator: data.tutor.avator,
                                    cover_img: data.course.cover_img,
                                    duration: data.course.duration,
                                    lesson_num: data.lesson_number
                                })
        
                            }
                            dispatch(setCart(cartArr))
                        }catch(err){
                            console.log(err)
                        }

                        dispatch(setEnrolledCourses(data.enrolledCourses));
                    }
                })

                Axios.get('/api/pending-course')
                .then(res => res.data)
                .then(data => {
                    if(mounted){
                        dispatch(setPendingCourses(data.pendingCourses));
                    }
                })

            Axios.get('/api/user-unread-messages')
                .then(res => res.data)
                .then(data => {
                    if (!data.error && mounted) {
                        dispatch(setUnreadMsg(data.unreadMsg))
                    }
                })

            if (!cart || cart.length === 0) {
                Axios.get('/api/cart')
                    .then(res => {
                        if (res.data.cart && mounted) {

                            dispatch(setCart(res.data.cart))
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }

        }
        
        return () => {
            mounted = false;
        }

    }, [user.isAuth])

    useEffect(() => {

        let json_str = JSON.stringify(cart);
        document.cookie = `cart=${json_str}; path=/`;

    }, [cart])

    useEffect(() => {
        const handleClickOutside = event => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [])

    useEffect(() => {

        let mounted = true;

        Axios.get('/api/categories')
            .then(res => {
                if(mounted){
                    dispatch(setCategories(res.data));
                }
            })
            .catch(err => {
                console.log(err);
            })

        return () => {
            mounted = false;
        }
    }, [])

    const closePopup = () => {
        if (!user.isAuth) {
            dispatch(clearUser());
        }
        dispatch(setPopupPage(''))
        dispatch(setPopup(false));
    }

    const openPopup = () => {
        dispatch(setPopupPage('loginOptions'))
        dispatch(setPopup(true));
    }

    const onPath = (path) => {
        switch (path) {
            case '/brand-story':
            case '/frequently-asked':
            case '/contact-us':
                return 'about'
            default:
                break;
        }
    }

    useEffect(() => {

        let mounted = true;

        if (location.pathname) {
            window.scrollTo(0, 0);
            dispatch(setCartPopup(false))
            setShowMobileMenu(false)
            // dispatch(setShowUserMenu(false))
            if (user?.isAuth) {
                Axios.get('/api/user-unread-messages')
                    .then(res => res.data)
                    .then(data => {
                        if (!data.error && mounted) {
                            dispatch(setUnreadMsg(data.unreadMsg))
                        }
                    })
            }
        }

        return () => {
            mounted = false;
        }

    }, [location.pathname])


    return (
        <>
            {showPopup && <Popup onClose={() => closePopup()} />}
            <div className={`${navStyles.nav} ${location.pathname.startsWith('/certificate') ? navStyles.hide : ''}`}>
                <div className={navStyles.navLeft}>
                    <div className={navStyles.hamburgerMenu} onClick={() => setShowMobileMenu(!showMobileMenu)}>
                        <img src={hamburgerMenu} className={navStyles.menuIcon} alt="hamburger menu icon"/>
                    </div>
                    <div className={`${navStyles.navBrand} ${navStyles.navItem}`}>
                        <Link to="/">
                            <img src="/media/logo.png" className={navStyles.icon} alt="MeLearn.guru's Logo"/>
                        </Link>
                    </div>
                </div>
                <div className={navStyles.navRight}>
                    <div className={navStyles.navGroupLeft}>
                        <div className={`${navStyles.navCategory} ${navStyles.navItem}`} onMouseEnter={() => setShowCategory(true)} onMouseLeave={() => setShowCategory(false)}>
                            <p className={navStyles.navText}>課程</p>
                            {showCategory && <CategoryMenu />}
                        </div>
                        {!user.isAuth && <div className={navStyles.navItem}>
                            <div onClick={() => openPopup()}>
                                <p className={navStyles.navText}>登入/註冊</p>
                            </div>
                        </div>}
                        <div className={`${navStyles.navAbout} ${navStyles.navItem}`} onMouseEnter={() => setShowAbout(true)} onMouseLeave={() => setShowAbout(false)}>
                            <p className={`${navStyles.navText} ${onPath(location.pathname) === 'about' ? navStyles.underline : ''}`}>關於我們</p>
                            {showAbout && <AboutMenu />}
                        </div>
                    </div>
                    <div className={navStyles.navGroupMid}>
                        <div className={`${navStyles.navSearch} ${navStyles.navItem}`}>
                            <SearchBar />
                        </div>
                    </div>
                    <div className={navStyles.navGroupRight}>
                        {user.isAuth && <div className={`${navStyles.navUser} ${navStyles.navItem}`} onClick={() => { setShowUserMenu(prev => !prev) }} ref={userMenuRef}>
                            <p className={navStyles.firstLetter}>{user.username.charAt(0).toUpperCase()}</p>
                            {showUserMenu && <UserMenu />}
                        </div>}
                        {user.isAuth && <div className={`${navStyles.navBookmark} ${navStyles.navItem}`}>
                            <Link to='/favourite'>
                                <img src={bookmarkIcon} className={navStyles.navIcon} alt="favourite icon"/>
                            </Link>
                        </div>}
                        {user.isAuth && <div className={`${navStyles.navInbox} ${navStyles.navItem}`}>
                            <Link to='/inbox' className={navStyles.inboxContainer}>
                                {/* --------------- TODO ----------------*/}
                                {/* Hide it when no unread inbox message */}
                                {unreadMsg.length > 0 && <div className={navStyles.notification}></div>}
                                {/* -------------------------------------*/}
                                <img src={messageIcon} className={navStyles.navIcon} alt="inbox icon"/>
                            </Link>
                        </div>}
                        <div className={`${navStyles.navCart} ${navStyles.navItem}`} ref={cartRef}>
                            <div onClick={() => dispatch(setCartPopup(!showCartPopup))}>
                                <img src={cartIcon} className={navStyles.navIcon} alt="shopping cart icon"/>
                                {cart.length > 0 && <Badge number={cart.length} />}
                            </div>
                            {showCartPopup && <CartPopup />}
                        </div>
                    </div>
                </div>
                {<MobileMenu setShowMobileMenu={() => setShowMobileMenu(!showMobileMenu)} showMobileMenu={showMobileMenu} />}
            </div>
        </>
    )
}

export default Nav
