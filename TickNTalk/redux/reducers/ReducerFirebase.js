import * as actionTypes from '../actions/ActionTypes';

const firebaseInitialState = {};

export const reducerFirebase = (state = firebaseInitialState, action) => {
    if (action.type === actionTypes.updateFirebaseAction) {
        const { childName, listData } = action.payload;

        let newState = {
            ...state,
        }

        newState[childName] = listData;
        return newState;
    }

    return state;
};
