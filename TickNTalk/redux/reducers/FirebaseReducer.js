import * as actionTypes from '../actions/ActionTypes';

const firebaseInitialState = {};

const firebaseReducer = (state = firebaseInitialState, action) => {
    if(action.type === actionTypes.updateFirebaseAction) {
        const { childName, listData } = action.payload;

        let newState = {
            ...state,
        }

        newState[childName] = listData;
        return newState;
    }

    return state;
};

export default firebaseReducer;