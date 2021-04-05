import * as actionTypes from '../actions/ActionTypes';

const userInitialState = {};

const userReducer = (state = userInitialState, action) => {
    if(action.type === actionTypes.editUserAction) {
        const newState = ({...state, ...action.payload.user});
        return newState;
    }

    return state;
};

export default userReducer;