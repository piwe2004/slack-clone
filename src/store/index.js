import { combineReducers } from "redux";
import userReducer from "./userReducer";
import channelReducer from "./channelReucer";
import themeReducer from "./themeReducer";

export const rootReducer = combineReducers({
    user:userReducer,
    channel:channelReducer,
    theme:themeReducer
});

export default rootReducer;