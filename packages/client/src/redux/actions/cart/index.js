import { SET_CART, ADD_CART_ITEM, REMOVE_CART_ITEM, CLEAR_CART } from '../../action_types/cart'

export const setCart = (cart) => {

    return ({
        type: SET_CART,
        payload: cart
    })

}

export const clearCart = () => {
    return ({
        type: CLEAR_CART
    })
}

export const addCartItem = (course) => {

    return ({
        type: ADD_CART_ITEM,
        payload: course
    })
}



export const removeCartItem = (course) => {

    return ({
        type: REMOVE_CART_ITEM,
        payload: course
    })

}