import { ADD_ANSWER, SET_ANSWERS, CLEAR_ANSWERS, SET_STATUS, SET_SUBMITTED } from '../../action_types/quiz';

export const addAnswer = answer => ({
    type: ADD_ANSWER,
    payload: answer
})

export const setAnswers = answers => ({
    type: SET_ANSWERS,
    payload: answers
})

export const clearAnswers = () => ({
    type: CLEAR_ANSWERS
})

export const setStatus = (status) => ({
    type: SET_STATUS,
    payload: status
})

export const setSubmitted = (val) => ({
    type: SET_SUBMITTED,
    payload: val
})