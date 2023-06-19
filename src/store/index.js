import { combineReducers } from "redux";
import userReducer from "./userReducer";
import channelReducer from "./channelReucer";

export const rootReducer = combineReducers({
    user:userReducer,
    channel:channelReducer
});

export default rootReducer;