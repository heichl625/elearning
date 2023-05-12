import React, { useRef, useEffect } from 'react'

import { useSelector } from 'react-redux';

const LargeCertificate = () => {

    const certHTML = useSelector(store => store.global_setting.certHTML);
    const divRef = useRef(null)

    useEffect(() => {

        if(divRef.current && certHTML){
            divRef.current.innerHTML = certHTML
        }

    }, [divRef, certHTML])


    return (
        <div ref={divRef}></div>
    )
}

export default LargeCertificate
