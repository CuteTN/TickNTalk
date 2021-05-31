import { combineReducers } from "redux";
import { reducerFirebase } from './ReducerFirebase'

export const allReducers = combineReducers({
    reducerFirebase,
})