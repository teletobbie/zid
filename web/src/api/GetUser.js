import constants from './constants.json'
import ApiCall from './ApiCall'

/**
 * Send a Get user request to the backend.
 * @returns {Promise} the result from the backend.
 */
const GetUser = async () => {
    const response = await ApiCall(constants.ENDPOINTS.USER);
    if(!response.ok) {
        throw new Error('Could not get user.');
    }

    return await HandleUser;
}

/**
 * Handles the response from the GetUser function.
 * @param {Response} response response of the GetUser function
 * @returns {Promise} a promise that represents the backend result.
 */
const HandleUser = async response => {
    const result = await response.json();
    if (result.id) {
        return result;
    } else {
        throw Error('Message invalid response body.');
    }
}

export default GetUser