import constants from './constants.json'
import ApiCall from './ApiCall'

/**
 * Send a delete a project by project ID request to the backend.
 * @param {Number} project_id id of the project that needs to be deleted.
 * @returns {Promise} the result from the backend.
 */
const DeleteProject = async (project_id) => {
    const endpoint = constants.ENDPOINTS.DELETE_PROJECT.PATH + parseInt(project_id, 10) 
    const response = await ApiCall({
        PATH: endpoint,
        METHOD: constants.ENDPOINTS.DELETE_PROJECT.METHOD
    });
    if(!response.ok) {
        throw new Error('Could not delete project. ' + project_id);
    }

    return await handleDeleteProject(response)
}

/**
 * Handles the response from the DeleteProject function.
 * @param {Response} response response of the delete project request. 
 * @returns {Promise} the result from the backend.
 */
const handleDeleteProject = async response => {
    const result = await response.json();
    if (result.deleted_at) {
        return result;
    } else {
        throw Error('Message invalid response body.');
    }
}

export default DeleteProject;