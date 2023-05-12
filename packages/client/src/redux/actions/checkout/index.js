import { SET_COUPON, SET_CHECKOUT_ITEMS, SET_SUBTOTAL, SET_METHOD, SET_BILLING_INFO, SET_PERSONAL_INFO, SET_TRANSACTION, SET_ERROR, CLEAR_CHECKOUT, SET_PROOF, CLEAR_CHECKOUT_WITHOUT_ITEMS, SET_PROCEED_PAYMENT } from '../../action_types/checkout'

export const setCoupon = (coupon) => ({
    type: SET_COUPON,
    payload: coupon
})

export const setCheckoutItems = (items) => ({
    type: SET_CHECKOUT_ITEMS,
    payload: items
})

export const setSubtotal = (subtotal) => ({
    type: SET_SUBTOTAL,
    payload: subtotal
})

export const setMethod = (method) => ({
    type: SET_METHOD,
    payload: method
})

export const setBillingInfo = (info) => ({
    type: SET_BILLING_INFO,
    payload: info
})

export const setPersonalInfo = (info) => ({
    type: SET_PERSONAL_INFO,
    payload: info
})

export const setTransaction = (transaction) => ({
    type: SET_TRANSACTION,
    payload: transaction
})

export const setError = (error) => ({
    type: SET_ERROR,
    payload: error
})

export const setProof = (proof) => ({
    type: SET_PROOF,
    payload: proof
})

export const clearCheckout = () => ({
    type: CLEAR_CHECKOUT
})

export const clearCheckoutWithoutItems = () => ({
    type: CLEAR_CHECKOUT_WITHOUT_ITEMS
})

export const setProceedPayment = (value) => ({
    type: SET_PROCEED_PAYMENT,
    payload: value
})