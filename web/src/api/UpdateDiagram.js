import constants from './constants.json'
import ApiCall from './ApiCall'

/**
 * Send a update diagram request to the backend.
 * @param {number} diagram_id id of the diagram.
 * @param {*} password data to be updated.
 * @returns {Promise} the result from the backend.
 */
const UpdateDiagram = async (diagram_id, data) => {
    const response = await ApiCall(constants.ENDPOINTS.DIAGRAM_UPDATE, {diagram_id, data});
    if(!response.ok) {
        throw new Error('Could not update diagram.');
    }

    return await handleUpdateDiagram(response);
}

/**
 * Handles the response from the UpdateDiagram function.
 * @param {Response} response response of the UpdateDiagram function
 * @returns {Promise} a promise that represents the backend result.
 */
const handleUpdateDiagram = async response => {
    const result = await response.json();
    if (result.id) {
        return result;
    } else {
        throw Error('Message invalid response body.');
    }
}

export default UpdateDiagram