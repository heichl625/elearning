import {SET_UNREAD_MSG, SET_SELECTED_INSTRUCTOR } from "../../action_types/inbox";

const initialState = {
    unreadMsg: [],
    selectedInstructor: null
}

export default function(state = initialState, action){

    switch(action.type){

        case SET_UNREAD_MSG: 
            return {
                ...state,
                unreadMsg: action.payload
            }
        case SET_SELECTED_INSTRUCTOR:
            return {
                ...state,
                selectedInstructor: action.payload
            }
        default:
            return state
    }

}