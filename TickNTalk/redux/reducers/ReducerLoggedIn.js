import * as actionTypes from '../actions/ActionTypes';

const loggedInInitialState = {};

export const reducerLoggedIn = (state = loggedInInitialState, action) => {
    if(action.type === actionTypes.editUserAction) {
        const newState = action.payload
        return newState;
    }

    return state;
};