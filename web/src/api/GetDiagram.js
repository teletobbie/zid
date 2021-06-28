import constants from './constants.json'
import ApiCall from './ApiCall'

/**
 * Send a GET diagram request by diagram ID to the backend.
 * @param {number} diagram_id id of the diagram.
 * @returns {Promise} the result from the backend.
 */
const GetDiagram = async (diagram_id) => {
    const endpoint = constants.ENDPOINTS.DIAGRAM.PATH + diagram_id
    const response = await ApiCall({PATH: endpoint, METHOD: constants.ENDPOINTS.DIAGRAM.METHOD});
    if(!response.ok) {
        throw new Error('Could not find diagram');
    }

    return response.json();
}

export default GetDiagram;