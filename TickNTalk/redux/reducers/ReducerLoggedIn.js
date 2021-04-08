import Fire from '../../firebase/Fire';
import * as actionTypes from '../actions/ActionTypes';

const loggedInInitialState = { isLoggedIn : false };

export const reducerLoggedIn = (state = loggedInInitialState, action) => {
    if(action.type === actionTypes.logInAction || action.type === actionTypes.logOutAction) {
        // CuteTN Note: it's not the right thing to do, but heck, let's just leave it that way :)
        if(action.type === actionTypes.logInAction)
            Fire.subscribeRef(`user/${action.payload.email}`)
        if(action.type === actionTypes.logOutAction)
            Fire.unSubscribeRef(`user/${state.email}`)

        const newState = action.payload
        return newState;
    }
    

    return state;
};