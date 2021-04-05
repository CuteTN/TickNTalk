import * as actionTypes from './ActionTypes'

const createUpdateFirebaseAction = (childName, listData) => ({
    type: actionTypes.updateFirebaseAction,
    payload: {
        childName: childName,
        listData: listData,
    }
})

export default createUpdateFirebaseAction;