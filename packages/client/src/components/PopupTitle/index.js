import React from 'react'

//Styles
import PopupTitleStyles from './PopupTitle.module.scss';

const PopupTitle = ({title}) => {
    return (
        <div className={PopupTitleStyles.container}>
            <h1 className={PopupTitleStyles.title}>{title}</h1>
            <div className={PopupTitleStyles.divider}></div>
        </div>
    )
}

export default PopupTitle
