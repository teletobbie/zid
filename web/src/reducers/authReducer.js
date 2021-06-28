import { LOGOUT, SETUSERNAME, SETPASSWORD, SETBASICAUTH, SETERROR } from '../actions/types'

const initialState = {
    error: undefined,
    basicAuth: undefined,
    username: '',
    password: ''
}

/**
 * Set the authReducer state actions, more information about reducer: https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers 
 * @param {object} state current Redux reducer state. 
 * @param {string} action current action
 * @returns {object} auth state
 */
const authReducer = (state = initialState, action) => {
    switch(action.type) {
        case SETBASICAUTH:
            return {
                ...state,
                basicAuth: action.payload
            } 
        case SETERROR:
            return {
                ...state,
                error: action.payload,
            }
        case LOGOUT: {
            return {
                ...initialState
            }
        }
        case SETUSERNAME: {
            return {
                ...state,
                username: action.payload
            }
        }
        case SETPASSWORD: {
            return {
                ...state,
                password: action.payload
            }
        }
        default:
            return state;
    }
}

export default authReducer;