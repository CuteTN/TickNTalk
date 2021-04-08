import { combineReducers } from "redux";
import { reducerLoggedIn } from './ReducerLoggedIn'
import { reducerFirebase } from './ReducerFirebase'

export const allReducers = combineReducers({
    reducerLoggedIn,
    reducerFirebase,
})