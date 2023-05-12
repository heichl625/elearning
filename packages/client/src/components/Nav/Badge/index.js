import React from 'react'

import BadgeStyles from './Badge.module.scss'

const Badge = ({number}) => {
    return (
        <p className={BadgeStyles.badge}>
            {number}
        </p>
    )
}

export default Badge
