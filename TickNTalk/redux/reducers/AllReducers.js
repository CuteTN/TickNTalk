import { combineReducers } from "redux";
import { reducerSignedIn } from './ReducerSignedIn'
import { reducerFirebase } from './ReducerFirebase'

export const allReducers = combineReducers({
    reducerSignedIn,
    reducerFirebase,
})