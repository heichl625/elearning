import React, { useState, useEffect } from 'react';
import Axios from 'axios'
import { useParams } from 'react-router-dom';

import { certificateTemplate } from 'utils/certificateTemplate';

const SharedCertificate = () => {
    const [templateData, setTemplateData] = useState()
    const { token } = useParams();

    const [screenSize, setScreenSize] = useState(window.innerWidth);

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

        if(templateData){
            setTemplateData(prev => ({
                ...prev,
                scale: screenSize/512
            }))
        }
        

    }, [screenSize])

    useEffect(() => {

        let mounted = true;

        Axios.get(`/api/get-certificates/${token}`)
        .then(res => res.data)
        .then(data => {
            if(!data.error){
                let { certificate, user } = data;
                if(mounted){
                    document.title = '完課證書 - MeLearn.Guru'
                    setTemplateData({
                        course_title: certificate.course_title,
                        lesson_number: certificate.lesson_number,
                        tutor_name: certificate.tutor_name,
                        issue_date: new Date(certificate.issue_date),
                        user: user,
                        scale: screenSize/512
                    })
                }
                
            }
        }).catch(err => {
            console.log(err)
        })

        return () => {
            mounted = false;
        }

    }, [])


    return (
        <div dangerouslySetInnerHTML={{__html: templateData ? certificateTemplate(templateData) : ''}}>
        </div>
    )
}

export default SharedCertificate
