import constants from './constants.json'
import ApiCall from './ApiCall'

/**
 * Send a Instance status by key request to the backend.
 * @param {number} key instance key used in Zeebe workflow.
 * @returns {Promise} the result from the backend.
 */
const InstanceStatus = async (key) => {
    const endpoint = constants.ENDPOINTS.INSTANCE_STATUS.PATH + parseInt(key)
    const response = await ApiCall({PATH: endpoint, METHOD: constants.ENDPOINTS.INSTANCE_STATUS.METHOD});
    if(!response.ok) {
        throw new Error('Could not get instance status of ' + key);
    }

    return response.json();
}

export default InstanceStatus;