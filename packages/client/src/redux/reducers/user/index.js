import {SET_USER, CLEAR_USER, SET_FAVOURITE, SET_ENROLLED_COURSES, SET_PENDING_COURSES } from "../../action_types/user";

const initialState = {

    login_token: '',
    id: '',
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    role: '',
    isAuth: null,
    favourite_courses: [],
    enrolled_courses: [],
    pending_courses: [],

}

export default function(state = initialState, action){

    switch(action.type){

        case SET_USER: 
            return {
                ...state,
                ...action.payload,
            }
        case CLEAR_USER:
            return initialState
        case SET_FAVOURITE:
            return {
                ...state,
                favourite_courses: action.payload || []
            }
        case SET_ENROLLED_COURSES:
            return {
                ...state,
                enrolled_courses: action.payload || []
            }
        case SET_PENDING_COURSES:
            return {
                ...state,
                pending_courses: action.payload || []
            }
        default:
            return state
    }

}