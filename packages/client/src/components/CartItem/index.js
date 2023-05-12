import React from 'react'

import CartItemStyles from './CartItem.module.scss'

const CartItem = ({item}) => {
    return (
        <div className={CartItemStyles.container}>
            <div className={CartItemStyles.title}>{item.title}</div>
            <div className={CartItemStyles.priceContainer}>
                {item.discount_price ? <div>
                    <p>原價： {item.price}</p>
                    <p>{item.discount_text}： {item.discount_price}</p>
                    <p>共節省： {item.price-item.discount_price}</p>
                </div> : <p>價錢： {item.price}</p>}
            </div>
        </div>
    )
}

export default CartItem
