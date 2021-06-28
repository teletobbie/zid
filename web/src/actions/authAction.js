import {LOGOUT, SETUSERNAME, SETPASSWORD, SETBASICAUTH, SETERROR} from './types'

/**
 * Perform the set basic auth Redux action.
 * @param {string} basicAuth basic auth string to set.
 */
export const setBasicAuth = (basicAuth) => dispatch => {
    dispatch({
        type: SETBASICAUTH,
        payload: basicAuth
    })
}

/**
 * Perform the set error Redux action.
 * @param {*} error error value to be set.
 */
export const setError = (error) => dispatch => {
    dispatch({
        type: SETERROR,
        payload: error
    })
}

/**
 * Perform the logout Redux action thereby resetting the authReducer to it's initial values and clear the sessionStorage.
 */
export const logout = () => dispatch => {
    dispatch({
        type: LOGOUT
    })
    sessionStorage.clear();
}

/**
 * Perform the set username Redux action.
 * @param {string} value username string to set.
 */
export const setUsername = (value) => dispatch => {
    dispatch({
        type: SETUSERNAME,
        payload: value
    })
}

/**
 * Perform the set password Redux action.
 * @param {string} value password string to set.
 */
export const setPassword = (value) => dispatch => {
    dispatch({
        type: SETPASSWORD,
        payload: value 
    })
}
