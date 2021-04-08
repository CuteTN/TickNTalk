import { createStore } from "redux";
import { allReducers } from "./reducers/AllReducers";

export let reduxStore = createStore(allReducers);