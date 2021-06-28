import constants from './constants.json'
import ApiCall from './ApiCall'

/**
 * Send a create project request to the backend.
 * @param {string} ticketnumber ticketnumber of the project.
 * @param {string} name name of the project.
 * @param {string} mailinglist mailinglist of the project.
 * @param {string} environment environment of the project.
 * @returns {Promise} the result from the backend.
 */
const CreateProject = async (ticketnumber, name, mailinglist, environment) => {
    const response = await ApiCall(constants.ENDPOINTS.CREATE_PROJECT, {
        ticketnumber, name, mailinglist, environment
    });
    if(!response.ok) {
        throw new Error('Could not create project.');
    }

    return await handleCreateProject(response);
}

/**
 * Handles the response from the CreateProject function.
 * @param {Response} response response of the CreateDiagram function
 * @returns {Promise} a promise that represents the backend result.
 */
const handleCreateProject = async response => {
    const result = await response.json();
    if (result.id) {
        return result;
    } else {
        throw Error('Message invalid response body.');
    }
}

export default CreateProject