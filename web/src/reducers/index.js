import { combineReducers } from 'redux'
import authReducer from './authReducer'
import drawerReducer from './drawerReducer'
import projectReducer from './projectReducer'

export default combineReducers({
    auth: authReducer,
    drawer: drawerReducer,
    project: projectReducer
})