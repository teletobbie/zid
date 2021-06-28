import constants from './constants.json'
import ApiCall from './ApiCall'

/**
 * Send a GET request by project ID to get all associated diagrams to the backend.
 * @param {number} project_id id of the project.
 * @returns {Promise} the result from the backend.
 */
const GetDiagramsByProject = async (project_id) => {
    const endpoint = constants.ENDPOINTS.DIAGRAMSBYPROJECT.PATH + project_id
    const response = await ApiCall({PATH: endpoint, METHOD: constants.ENDPOINTS.DIAGRAMSBYPROJECT.METHOD});
    if(!response.ok) {
        throw new Error('Could not find diagrams by this project.');
    }

    return response.json();
}

export default GetDiagramsByProject;