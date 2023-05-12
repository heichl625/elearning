import { SET_POPUP, SET_CART_POPUP, SET_POPUP_PAGE, SET_PREV_POPUP_PAGE, SET_CATEGORIES,SET_REDIRECT_URL, SET_CERT_HTML, SET_PAYMNET_METHOD_ID, SET_LOADING, SET_PROMOTION } from '../../action_types/global_setting'

export const setPopup = (val) => ({
    type: SET_POPUP,
    payload: val
})

export const setCartPopup = (val) => ({
    type: SET_CART_POPUP,
    payload: val
})

export const setPopupPage = (page) => ({
    type: SET_POPUP_PAGE,
    payload: page
})

export const setPrevPopupPage = (page) => ({
    type: SET_PREV_POPUP_PAGE,
    payload: page
})

export const setCategories = (categories) => ({
    type: SET_CATEGORIES,
    payload: categories
})

export  const setRedirectUrl = (url) => ({
    type: SET_REDIRECT_URL,
    payload: url
})

export const setCertHTML = (html) => ({
    type: SET_CERT_HTML,
    payload: html
})

export const setPaymentMethodID = (id) => ({
    type: SET_PAYMNET_METHOD_ID,
    payload: id
})

export const setLoading = (val) => ({
    type: SET_LOADING,
    payload: val
})

export const setPromotion = (promotion) => ({
    type: SET_PROMOTION,
    payload: promotion
})