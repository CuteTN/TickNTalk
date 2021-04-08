import * as actionTypes from './ActionTypes'

export const createActionLogIn = email => ({
    type: actionTypes.logInAction,
    payload: {
        isLoggedIn : true,
        email
    }
})

export const createActionLogOut = () => ({
    type: actionTypes.logOutAction,
    payload: {
        isLoggedIn : false,
        email : undefined
    }
})

