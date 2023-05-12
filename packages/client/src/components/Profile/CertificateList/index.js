import React, { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { v4 as uuidv4 } from 'uuid';

//redux
import { useSelector, useDispatch } from 'react-redux'
import { setPopup, setPopupPage, setCertHTML } from 'redux/actions/global_setting';

//images
import downloadIcon from 'images/icon/ic-download-blue@3x.png';
import shareIcon from 'images/icon/share_blue@3x.png';


//utils
import { certificateTemplate } from 'utils/certificateTemplate';

//styles
import CertificateListStyles from './CertificateList.module.scss'
import Spinner from 'components/Spinner';

const CertificateList = ({ certificates }) => {

    const dispatch = useDispatch();
    const certificateCardRef = useRef([]);
    certificateCardRef.current = [];



    const user = useSelector(store => store.user);
    const loading = useSelector(store => store.global_setting.loading);
    const [screenSize, setScreenSize] = useState(window.innerWidth);
    const [copied, setCopied] = useState(false);

    const sharedCertificate = (token) => {
        let input = document.createElement('textarea');
        input.value = process.env.REACT_APP_BASE_URL+'certificate/'+token
        document.body.appendChild(input)
        input.select();
        document.execCommand('copy');
        setCopied(true);
        document.body.removeChild(input);
    }

    const downloadCertificate = (certificate) => {

        let newDiv = document.createElement('div')
        newDiv.innerHTML = certificateTemplate({
            course_title: certificate.course_title,
            lesson_number: certificate.lesson_number,
            tutor_name: certificate.tutor_name,
            issue_date: new Date(certificate.issue_date),
            user: user,
            scale: 2
        })
        newDiv.style.position = 'fixed'
        newDiv.style.top = '100%'
        newDiv.style.left = '100%'

        
        document.body.appendChild(newDiv);
        html2canvas(newDiv, {
            width: 1024,
            height: 736,
            backgroundColor: null,
            scrollX: -window.scrollX,
            scrollY: 0,
            windowWidth: document.documentElement.offsetWidth,
            windowHeight: document.documentElement.offsetHeight,
        }).then(canvas => {
            newDiv.remove();
            let a = document.createElement('a');
            a.href = canvas.toDataURL()
            a.download = `certificate_${certificate.course_title}_${user.username}.png`;
            a.click();
        })

        

    }

    const enlargeCertificate = (certificate) => {

        dispatch(setPopupPage('large-certificate'))
        dispatch(setCertHTML(certificateTemplate({
            course_title: certificate.course_title,
            lesson_number: certificate.lesson_number,
            tutor_name: certificate.tutor_name,
            issue_date: new Date(certificate.issue_date),
            user: user,
            scale: screenSize > 992 ? 2 : screenSize/512
        })))
        dispatch(setPopup(true));


    }

    useEffect(() => {

        function handleResize(){
            setScreenSize(window.innerWidth);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }

    }, [])

    useEffect(() => {


        const hideCopyText = () => {
            setCopied(false);
        }

        if(copied){
            let timeFunction = window.setTimeout(hideCopyText, 5000);

            return () => {
                window.clearTimeout(timeFunction);
            }
        }

    }, [copied])

    return (
        <div className={CertificateListStyles.container}>
            <p className={`${CertificateListStyles.copiedText} ${copied ? CertificateListStyles.show : CertificateListStyles.hide}`}>已複製證書連結</p>
            <p className={CertificateListStyles.certNum}>共{certificates.length}張證書</p>
            {loading ? <Spinner /> : <div className={CertificateListStyles.certificateCardList}>
                {certificates?.length > 0 ? certificates.map(certificate => {
                    return <div className={CertificateListStyles.certificateCard} key={uuidv4()}>
                        <div key={uuidv4()} className={CertificateListStyles.certificate} onClick={() => enlargeCertificate(certificate)} dangerouslySetInnerHTML={{
                            __html: certificateTemplate({
                                course_title: certificate.course_title,
                                lesson_number: certificate.lesson_number,
                                tutor_name: certificate.tutor_name,
                                issue_date: new Date(certificate.issue_date),
                                user: user,
                                scale: screenSize > 992 ? 1 : (screenSize*0.85)/512
                            })
                        }}>
                        </div>
                        <div className={CertificateListStyles.courseInfo}>
                            <div className={CertificateListStyles.courseInfoTop}>
                                <h3 className={CertificateListStyles.courseTitle}>{certificate.course_title}</h3>
                                <p className={CertificateListStyles.download} onClick={() => downloadCertificate(certificate)}>下載<img className={CertificateListStyles.downloadIcon} src={downloadIcon} alt="download button"/></p>
                            </div>
                            <div className={CertificateListStyles.courseInfoBottom}>
                                <p className={CertificateListStyles.extraInfo}>{certificate.tutor_name}．共{certificate.lesson_number}課．於{new Date(certificate.issue_date).getFullYear()}年{new Date(certificate.issue_date).getMonth() + 1}月{new Date(certificate.issue_date).getDate()}日發出</p>
                                <p className={CertificateListStyles.download} onClick={() => sharedCertificate(certificate.certificate_token)}>分享<img className={CertificateListStyles.shareIcon} src={shareIcon} alt="share button"/></p>
                            </div>
                            <div className={CertificateListStyles.mobileButtons}>
                                <p className={CertificateListStyles.mobileDownload} onClick={() => downloadCertificate(certificate)}>下載<img className={CertificateListStyles.downloadIcon} src={downloadIcon} alt="download button"/></p>
                                <p className={CertificateListStyles.mobileDownload} onClick={() => sharedCertificate(certificate.certificate_token)}>分享<img className={CertificateListStyles.shareIcon} src={shareIcon} alt="share button"/></p>   
                            </div>
                            

                        </div>
                    </div>
                }) : <div className={CertificateListStyles.noCertContainer}>
                    <p className={CertificateListStyles.noCertText}>你還未獲得任何證書</p>
                    <Link className={CertificateListStyles.purchaseBtn} to='/courses'>立即選購課程</Link>
                </div>}
            </div>}
        </div>
    )
}

export default CertificateList
