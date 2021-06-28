import constants from './constants.json'
import ApiCall from './ApiCall'

/**
 * Send a login request to the backend.
 * @param {string} username username (ruisnaam) of a KPN user
 * @param {string} password KPN password
 * @returns {Promise} the result from the backend.
 */
const Login = async (username, password) => {
    const response = await ApiCall(constants.ENDPOINTS.LOGIN, {
        username: username,
        password: password,
    });
    if (!response.ok) {
        throw Error('response is not ok got a ' + response.status);
    } 
    
    return await handle_login(response);
}

/**
 * Handles the response from the Login function and sets the sessionStorage on login success.
 * @param {Response} response response of the GetUser function
 * @returns {Promise} a promise that represents the backend result.
 */
const handle_login = async response => {
    const result = await response.json();
    if (result.basic_auth && result.user) {
        await sessionStorage.setItem('basicAuth', result.basic_auth)
        await sessionStorage.setItem('username', result.user.name)
        await sessionStorage.setItem('pictureindex', result.user.picture_index)
        return result;
    } else {
        throw Error('Invalid response body.');
    }
}

export default Login
