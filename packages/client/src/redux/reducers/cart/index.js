import { SET_CART, ADD_CART_ITEM, REMOVE_CART_ITEM, CLEAR_CART } from '../../action_types/cart';

const initialState = []

export default function(state = initialState, action){

    switch(action.type){
        case SET_CART:
            return action.payload
        case CLEAR_CART:
            return initialState
        case ADD_CART_ITEM: 
            return [...state, action.payload]
        case REMOVE_CART_ITEM:
            return state.filter(item => item.course_id !== action.payload)
        default:
            return state
    }

}