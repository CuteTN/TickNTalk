import { combineReducers } from "redux";
import userReducer from './UserReducer'
import firebaseReducer from './FirebaseReducer'

const allReducers = combineReducers({
    userReducer,
    firebaseReducer,
})

export default allReducers;