import { SET_COUPON, SET_CHECKOUT_ITEMS, SET_SUBTOTAL, SET_METHOD, SET_BILLING_INFO, SET_PERSONAL_INFO, SET_TRANSACTION, SET_ERROR, CLEAR_CHECKOUT, SET_PROOF, CLEAR_CHECKOUT_WITHOUT_ITEMS, SET_PROCEED_PAYMENT } from "../../action_types/checkout";

const initialState = {
   coupon: null,
   items: [],
   subtotal: 0,
   method: 'creditcard',
   personal_info: null,
   billing_info: null,
   transaction: null,
   proof: null,
   error: null,
   proceed_payment: false
}

export default function(state = initialState, action){

    switch(action.type){

        case SET_COUPON:
            return {...state, coupon: action.payload};
        case SET_CHECKOUT_ITEMS:
            return {...state, items: action.payload || []};
        case SET_SUBTOTAL:
            return { ...state, subtotal: action.payload };
        case SET_METHOD:
            return { ...state, method: action.payload };
        case SET_PERSONAL_INFO:
            return { ...state, personal_info: action.payload };
        case SET_BILLING_INFO:
            return { ...state, billing_info: action.payload };
        case SET_TRANSACTION:
            return { ...state, transaction: action.payload};
        case SET_ERROR:
            return { ...state, error: action.payload };
        case SET_PROOF:
            return { ...state, proof: action.payload };
        case CLEAR_CHECKOUT_WITHOUT_ITEMS:
            return { ...state, proof: null, billing_info: null, personal_info: null, method: 'creditcard', subtotal: 0, coupon: null}
        case CLEAR_CHECKOUT:
            return initialState;
        case SET_PROCEED_PAYMENT:
            return {...state, proceed_payment: action.payload}
        default:
            return state
    }

}