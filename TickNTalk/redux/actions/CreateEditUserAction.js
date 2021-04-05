import * as actionTypes from './ActionTypes'

const createEditUserAction = user => ({
    type: actionTypes.editUserAction,
    payload: {
        user
    }
})

export default createEditUserAction;