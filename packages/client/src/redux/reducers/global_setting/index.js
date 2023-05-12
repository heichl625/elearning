import {SET_POPUP, SET_POPUP_PAGE, SET_PREV_POPUP_PAGE, SET_CART_POPUP, SET_CATEGORIES, SET_REDIRECT_URL, SET_CERT_HTML, SET_PAYMNET_METHOD_ID, SET_LOADING, SET_PROMOTION } from "../../action_types/global_setting";

const initialState = {
    showPopup: false,
    showCartPopup: false,
    popupPage: '',
    prevPopupPage: '',
    categories: [],
    redirect_url: '',
    certHTML: '',
    paymentMethodID: '',
    loading: false,
    promotion: null
}

export default function(state = initialState, action){

    switch(action.type){

        case SET_POPUP:
            return {...state, showPopup: action.payload}
        case SET_POPUP_PAGE:
            if(state.popupPage !== 'other-device-signed-in'){
                return { ...state, popupPage: action.payload}
            }else{
                if(action.payload === ''){
                    return {...state, popupPage: action.payload}
                }
            }
        case SET_PREV_POPUP_PAGE:
            return { ...state, prevPopupPage: action.payload}
        case SET_CART_POPUP:
            return {...state, showCartPopup: action.payload}
        case SET_CATEGORIES:
            return {...state, categories: action.payload}
        case SET_REDIRECT_URL:
            return { ...state, redirect_url: action.payload }
        case SET_CERT_HTML:
            return { ...state, certHTML: action.payload }
        case SET_PAYMNET_METHOD_ID:
            return { ...state, paymentMethodID: action.payload }
        case SET_LOADING:
            return { ...state, loading: action.payload }
        case SET_PROMOTION:
            return {...state, promotion: action.payload}
        default:
            return state
    }

}