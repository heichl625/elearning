import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

//styles
import FooterStyles from './Footer.module.scss'

const Footer = () => {

    const location = useLocation();

    const [darkBackground, setDarkBackground] = useState(false);


    useEffect(() => {

        if(location.pathname.startsWith('/courses') && !location.pathname.includes('lessons') && location.pathname !== '/courses'){
            setDarkBackground(true)
        }else{
            setDarkBackground(false)
        }

    }, [location.pathname])

    if(location.pathname !== '/inbox' && !location.pathname.startsWith('/certificate')){
        return (
            <div className={`${FooterStyles.container} ${darkBackground ? FooterStyles.darkBackground : ''}`}>
                <p className={FooterStyles.copyright}>Copyright MeLearn.guru 2020</p>
                <div className={FooterStyles.tncLink}>
                    <Link to='/terms'>條款及細則</Link>
                    <Link to='/privacy'>私隱條款</Link>
                </div>
            </div>
        )
    }else{
        return<></>
    }
    
}

export default Footer
