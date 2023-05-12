import { SET_USER, CLEAR_USER, SET_FAVOURITE, SET_ENROLLED_COURSES, SET_PENDING_COURSES } from '../../action_types/user'

export const setUser = userData => ({
    type: SET_USER,
    payload: userData
})

export const clearUser = () => ({
    type: CLEAR_USER
})

export const setFavourite = (favouriteCoruses) => ({
    type: SET_FAVOURITE,
    payload: favouriteCoruses
})

export const setEnrolledCourses = (enrolledCoruses) => ({

    type: SET_ENROLLED_COURSES,
    payload: enrolledCoruses

})

export const setPendingCourses = (pendingCourses) => ({
    type: SET_PENDING_COURSES,
    payload: pendingCourses
})