import * as actionTypes from './ActionTypes'

export const createActionUpdateFirebase = (childName, listData) => ({
    type: actionTypes.updateFirebaseAction,
    payload: {
        childName,
        listData,
    }
})