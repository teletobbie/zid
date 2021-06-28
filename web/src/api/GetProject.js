import constants from './constants.json'
import ApiCall from './ApiCall'

/**
 * Send a Get project by project ID or ticketnumber request to the backend.
 * @param {number|string} id id or ticketnumber of the project.
 * @returns {Promise} the result from the backend.
 */
const GetProject = async (id) => {
    let parameter = id
    if (typeof id == 'number') {
        parameter = parseInt(id)
    }
    const endpoint = constants.ENDPOINTS.PROJECT.PATH + parameter
    const response = await ApiCall({PATH: endpoint, METHOD: constants.ENDPOINTS.PROJECT.METHOD});
    if(!response.ok) {
        throw new Error('Could not find project with ' + id);
    }

    return response.json();
}

export default GetProject;