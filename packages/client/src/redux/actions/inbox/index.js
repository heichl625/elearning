import { SET_UNREAD_MSG, SET_SELECTED_INSTRUCTOR } from '../../action_types/inbox'

export const setUnreadMsg = (val) => ({
    type: SET_UNREAD_MSG,
    payload: val
})

export const setSelectedInstructor = (val) => ({
    type: SET_SELECTED_INSTRUCTOR,
    payload: val
})