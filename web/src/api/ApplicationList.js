import constants from './constants.json'
import ApiCall from './ApiCall'

/**
 * Send a application list request to the backend.
 * @returns {Response} the result from the backend.
 */
const ApplicationList = async () => {
    const response = await ApiCall(constants.ENDPOINTS.APPLICATIONLIST);
    if(!response.ok) {
        throw new Error('Could not get application list.');
    }
    const result = await response.json();

    return result;
}

export default ApplicationList