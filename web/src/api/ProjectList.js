import constants from './constants.json'
import ApiCall from './ApiCall'

/**
 * Send a projectlist request to the backend.
 * @returns {Promise} the result from the backend.
 */
const ProjectList = async () => {
    const response = await ApiCall(constants.ENDPOINTS.PROJECTLIST);
    if(!response.ok) {
        throw new Error('Could not get projects associated to this user.');
    }
    return await response.json();
}

export default ProjectList