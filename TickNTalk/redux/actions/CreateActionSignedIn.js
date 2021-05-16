import * as actionTypes from './ActionTypes'

export const createActionSignIn = email => ({
    type: actionTypes.signInAction,
    payload: {
        isSignedIn: true,
        email
    }
})

export const createActionSignOut = () => ({
    type: actionTypes.signOutAction,
    payload: {
        isSignedIn: false,
        email: undefined
    }
})

