import { createStore } from "redux";
import allReducers from "./reducers/AllReducers";

let reduxStore = createStore(allReducers);
export default reduxStore;