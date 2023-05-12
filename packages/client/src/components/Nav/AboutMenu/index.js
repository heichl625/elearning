import React from 'react'
import { Link } from 'react-router-dom';

import AboutMenuStyles from './AboutMenuStyle.module.scss';

const AboutMenu = () => {

    const menuItems = [{
        name: '品牌故事',
        path: '/brand-story'
    }, {
        name: '常見問題',
        path: '/frequently-asked'
    }, {
        name: '聯絡我們',
        path: 'contact-us'
    }]

    return (
        <div className={AboutMenuStyles.about}>
            {menuItems.map((item, index) => {
                return (
                    <div className={AboutMenuStyles.item} key={`about-${index}`}>
                        <Link to={item.path}>{item.name}</Link>
                    </div>
                )
            })}
        </div>
    )
}

export default AboutMenu
