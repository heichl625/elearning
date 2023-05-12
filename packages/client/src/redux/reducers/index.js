import { combineReducers } from "redux";
import user from './user'
import cart from './cart'
import global_setting from './global_setting'
import checkout from './checkout'
import inbox from './inbox'
import quiz from './quiz'

export default combineReducers({ user, cart, global_setting, checkout, inbox, quiz});