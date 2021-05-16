import Fire from '../../firebase/Fire';
import * as actionTypes from '../actions/ActionTypes';

const signedInInitialState = { isSignedIn: false };

export const reducerSignedIn = (state = signedInInitialState, action) => {
    if (action.type === actionTypes.signInAction || action.type === actionTypes.signOutAction) {
        // CuteTN Note: it's not the right thing to do, but heck, let's just leave it that way :)
        // if(action.type === actionTypes.signInAction)
        //     Fire.subscribeRef(`user/${action.payload.email}`)
        // if(action.type === actionTypes.signOutAction)
        //     Fire.unSubscribeRef(`user/${state.email}`)

        const newState = action.payload
        return newState;
    }


    return state;
};