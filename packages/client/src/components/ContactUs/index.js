import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; 
import Axios from 'axios';

// redux
import { useSelector } from 'react-redux';

//fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

//styles
import ContactUsStyles from './ContactUs.module.scss';

//images
import facebookIcon from 'images/icon/social_media_facebook@3x.png';
import igIcon from 'images/icon/social_media_instagram@3x.png';
import linkedin from 'images/icon/linkedin.png';
import youtube from 'images/icon/youtube.png';

const ContactUs = ({ titleSize }) => {

    const location = useLocation();

    const user = useSelector(store => store.user);
    const [submitted, setSubmitted] = useState(false);

    const [inputData, setInputData] = useState({
        email: '',
        type: '一般查詢',
        content: ''
    })
    const [dropdown, setDropdown] = useState(false);

    const [options, setOptions] = useState([
        '一般查詢',
        '註冊登記',
        '課程查詢',
        '技術支援',
        '申請成為導師',
        '其他意見'
    ])
    const textareaRef = useRef(null);

    const selectOption = (option) => {
        setDropdown(false);
        setInputData(prev => ({
            ...prev,
            type: option
        }))
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        setInputData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    useEffect(() => {

        if (user.isAuth) {
            setInputData(prev => ({
                ...prev,
                email: user.email
            }))
        } else {
            setInputData({
                email: '',
                type: '一般查詢',
                content: ''
            })
        }

    }, [user])

    useEffect(() => {


        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';


    }, [inputData.content])

    const submitEnquiry = (e) => {
        e.preventDefault();

        if(!submitted){
            Axios.post('/api/enquiry', {
                email: inputData.email,
                type: inputData.type,
                content: inputData.content
            })
                .then(res => res.data)
                .then(data => {
                    if (!data.error) {
                        if (data.message === 'success') {
                            setSubmitted(true);
                        }
                    }
                })
        }
    }

    useEffect(() => {

        if(location.pathname !== '/'){
            document.title = '聯絡我們 - MeLearn.Guru'
        }


    }, [location.pathname])


    return (
        <div className={`${ContactUsStyles.container} ${location.pathname !== '/' ? ContactUsStyles.topPadding : ''}`}>
            <div className={location.pathname === '/' ? ContactUsStyles.largeTitle : ContactUsStyles.smallTitle}>聯絡我們</div>
            <div className={ContactUsStyles.content}>
                <form className={ContactUsStyles.contactForm} onSubmit={submitEnquiry}>
                    <div className={`${ContactUsStyles.inputGroup} ${submitted ? ContactUsStyles.disabledField : ''}`}>
                        <input
                            className={ContactUsStyles.inputField}
                            value={inputData.email}
                            onChange={handleChange}
                            name='email'
                            required
                            disabled={submitted}
                        />
                        <label className={ContactUsStyles.floatingLabel}>電郵地址</label>
                    </div>
                    <div className={`${ContactUsStyles.inputGroup} ${submitted ? ContactUsStyles.disabledField : ''}`}>
                        <div className={ContactUsStyles.dropdownBtn} onClick={() => !submitted && setDropdown(prev => !prev)}>
                            <p className={ContactUsStyles.selectedAreaCode}>{inputData.type}</p>
                            <FontAwesomeIcon icon={dropdown ? faChevronUp : faChevronDown} className={ContactUsStyles.dropdownIcon} />
                        </div>
                        {dropdown && <div className={ContactUsStyles.dropdown}>
                            {options.map((option) => {
                                return <div className={ContactUsStyles.dropdownOptions} onClick={() => selectOption(option)} key={uuidv4()}>{option}</div>
                            })}
                        </div>}
                        <label className={ContactUsStyles.typeText}>查詢種類</label>
                    </div>
                    <div className={`${ContactUsStyles.inputGroup} ${submitted ? ContactUsStyles.disabledField : ''}`}>
                        <textarea
                            className={ContactUsStyles.inputField}
                            value={inputData.content}
                            onChange={handleChange}
                            name='content'
                            required
                            ref={textareaRef}
                            disabled={submitted}
                        ></textarea>
                        <label className={ContactUsStyles.floatingLabel}>查詢內容</label>
                    </div>
                    <div className={ContactUsStyles.btnGroup}>
                        <button className={`${ContactUsStyles.submitBtn} ${submitted ? ContactUsStyles.disabledBtn : ''}`} type='submit'>{submitted ? '已成功提交' : '提交'}</button>
                        {submitted && <span className={ContactUsStyles.submittedText}>我們會於辦公時間內盡快回覆！</span>}
                    </div>

                </form>

                <div className={ContactUsStyles.contactGroup}>
                    <div className={ContactUsStyles.infoGroup}>
                        <p className={ContactUsStyles.fieldName}>電郵</p>
                        <p className={ContactUsStyles.fieldContent}><a href='mailto:melearn@enrichculture.com'>melearn@enrichculture.com</a></p>
                    </div>
                    <div className={ContactUsStyles.infoGroup}>
                        <p className={ContactUsStyles.fieldName}>電話</p>
                        <p className={ContactUsStyles.fieldContent}>(+852) 2793 5678</p>
                    </div>
                    <div className={ContactUsStyles.infoGroup}>
                        <p className={ContactUsStyles.fieldName}>WhatsApp</p>
                        <p className={ContactUsStyles.fieldContent}>(+852) 9547 2211</p>
                    </div>
                </div>

                <div className={ContactUsStyles.contactGroup}>
                    <div className={ContactUsStyles.infoGroup}>
                        <p className={ContactUsStyles.fieldName}>地址</p>
                        <p className={ContactUsStyles.fieldContent}>九龍觀塘鴻圖道78號17樓A室</p>
                    </div>
                    <div className={ContactUsStyles.infoGroup}>
                        <p className={ContactUsStyles.fieldName}>辦公時間</p>
                        <p className={ContactUsStyles.fieldContent}>星期一至五 : 上午9:00 – 下午6:00</p>
                        <p className={ContactUsStyles.fieldContent}> 星期六、日及公眾假期 ：休息</p>
                    </div>
                    <div className={ContactUsStyles.infoGroup}>
                        <p className={ContactUsStyles.fieldName}>關注我們</p>
                        <div className={ContactUsStyles.socialPlatformContainer}>
                            {/* ------------ Change to Image later -----------------*/}
                            <a href='https://www.facebook.com/melearn.guru/' target='_blank' rel="noopener"><img src={facebookIcon} className={ContactUsStyles.socialIcon} alt="facebook icon"/></a>
                            <a href='https://www.instagram.com/wealthub18/' target='_blank' rel="noopener"><img src={igIcon} className={ContactUsStyles.socialIcon} alt="instagram icon"/></a>
                            <a href='https://www.linkedin.com/company/wealthub-%E7%9D%BF%E5%AF%8C/?viewAsMember=true' target='_blank' rel="noopener"><img src={linkedin} className={ContactUsStyles.socialIcon} alt="linkedin icon"/></a>
                            <a href='https://www.youtube.com/c/%E5%A4%A9%E7%AA%97%E6%9C%83EnrichClub/featured' target='_blank' rel="noopener"><img src={youtube} className={ContactUsStyles.socialIcon} alt="youtube icon"/></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactUs
