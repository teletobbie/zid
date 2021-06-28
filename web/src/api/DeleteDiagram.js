import constants from './constants.json'
import ApiCall from './ApiCall'

/**
 * Send a delete a diagram by diagram ID request to the backend.
 * @param {Number} diagram_id diagram_id of the diagram that needs to be deleted.
 * @returns {Promise} the result from the backend.
 */
const DeleteDiagram = async (diagram_id) => {
    const endpoint = constants.ENDPOINTS.DIAGRAM_DELETE.PATH + parseInt(diagram_id, 10) 
    const response = await ApiCall({
        PATH: endpoint,
        METHOD: constants.ENDPOINTS.DIAGRAM_DELETE.METHOD
    });
    if(!response.ok) {
        throw new Error('Could not delete project. ' + diagram_id);
    }

    return await handleDeleteDiagram(response)
}

/**
 * Handles the response from the DeleteDiagram function.
 * @param {Response} response response of the delete diagram request. 
 * @returns {Promise} the result from the backend.
 */
const handleDeleteDiagram = async response => {
    const result = await response.json();
    if (result.deleted_at) {
        return result;
    } else {
        throw Error('Message invalid response body.');
    }
}

export default DeleteDiagram;