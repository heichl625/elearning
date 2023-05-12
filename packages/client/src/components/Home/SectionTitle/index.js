import React from 'react'

//styles
import SectionTitleStyles from './SectionTitle.module.scss';


const SectionTitle = ({title}) => {
    return (
        <div className={SectionTitleStyles.container}>
            <h1 className={SectionTitleStyles.title}>{title}</h1>
            <div className={SectionTitleStyles.divider}></div>
        </div>
    )
}

export default SectionTitle
