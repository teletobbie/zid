import constants from './constants.json'
import ApiCall from './ApiCall'

/**
 * Recursivly loop over the data object and add diagram_id, ticketnumber, environment and mailinglist as key | value pairs.
 * @param {Object} data data object of the drawed diagram.
 * @param {number} diagram_id id of the diagram that needs to be deployed.
 * @param {string} ticketnumber ticketnumber of the associated project.
 * @param {string} environment environment of the associated project.
 * @param {string} mailinglist mailinglist of the associated project.
 * @returns {Object} data with diagram_id, ticketnumber, environment and mailinglist attached.
 */
const prepareBody = (data, diagram_id, ticketnumber, environment, mailinglist) => {
    const loopOverItems = (items) => {
        for (let i of items) {
            i.diagram_id = diagram_id
            i.ticketnumber = ticketnumber
            i.environment = environment
            i.mailinglist = mailinglist
            loopOverItems(i.next)
        }
        return items
    }
    return loopOverItems(data)
}

/**
 * Send a deployment request to the backend.
 * @param {*} data data to send to the endpoint.
 * @param {number} diagram_id id of the diagram that needs to be deployed.
 * @param {string} ticketnumber ticketnumber of the associated project.
 * @param {string} environment environment of the associated project.
 * @param {string} mailinglist mailinglist of the associated project.
 * @returns {Promise} the result from the backend.
 */
const DeployComponent = async (data, diagram_id, ticketnumber, environment, mailinglist) => {
    const requestBody = prepareBody(data, diagram_id, ticketnumber, environment, mailinglist)
    const response = await ApiCall(constants.ENDPOINTS.DEPLOY_COMPONENT, requestBody);
    if(!response.ok) {
        throw new Error('Could not create component.');
    }

    return await HandleCreate(response);
}

/**
 * Handles the response from the DeployComponent function.
 * @param {Response} response response of the DeployComponent function
 * @returns {Promise} a promise that represents the backend result.
 */
const HandleCreate = async response => {
    const result = await response.json();
    if (result) {
        return result;
    } else {
        throw Error('Message invalid response body.');
    }
}

export default DeployComponent
