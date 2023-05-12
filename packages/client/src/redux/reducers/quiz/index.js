import { ADD_ANSWER, SET_ANSWERS, CLEAR_ANSWERS, SET_STATUS, SET_SUBMITTED } from "../../action_types/quiz";

const initialState = {
    answers: [],
    status: null,
    submitted: false
}

export default function(state = initialState, action){

    switch(action.type){

        case ADD_ANSWER:
            return {
                ...state,
                answers: [...state.answers, action.payload],
            }

        case SET_ANSWERS: 
            return {
                ...state,
                answers: action.payload
            }
        case CLEAR_ANSWERS:
            return initialState;
        case SET_STATUS:
            return {
                ...state,
                status: action.payload
            }
        case SET_SUBMITTED:
            return {
                ...state,
                submitted: action.payload
            }
        default:
            return state
    }

}