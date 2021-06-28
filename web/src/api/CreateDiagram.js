import constants from './constants.json'
import ApiCall from './ApiCall'

/**
 * Send a create diagram request to the backend.
 * @param {string} ticketnumber ticketnumber of the project.
 * @param {*} data data to send to the endpoint
 * @returns {Promise} the result from the backend.
 */
const CreateDiagram = async (ticketnumber, data) => {
    const response = await ApiCall(constants.ENDPOINTS.CREATE_DIAGRAM, {ticketnumber, data});
    if(!response.ok) {
        throw new Error('Could not create diagram.');
    }

    return await handleCreateDiagram(response);
}

/**
 * Handles the response from the CreateDiagram function.
 * @param {Response} response response of the CreateDiagram function
 * @returns {Promise} a promise that represents the backend result.
 */
const handleCreateDiagram = async response => {
    const result = await response.json();
    if (result.id) {
        return result;
    } else {
        throw Error('Message invalid response body.');
    }
}

export default CreateDiagram