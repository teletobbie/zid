import {BASE_URL, PORT} from './constants.json';
import {encode as base64_encode} from 'base-64';

/**
 * Send a request to the backend.
 * @param {object} endpoint path of the endpoint
 * @param {*} data data to send to the endpoint
 * @returns {Response} the result from the backend.
 */
const ApiCall = async (endpoint, data = {}) => {
    let headers = new Headers({
        'Content-Type': 'application/json'
    });

    await GetBasicAuth().then(basicAuth => {
      if (basicAuth) {
        headers.set('Authorization', basicAuth)
      } else { //session storage is empty.
        headers.set('Authorization', 'Basic ' + base64_encode(data.username+':'+data.password))
      }
    });

    let config = {
      method: endpoint.METHOD,
      headers: headers,
    };
    if (config.method === 'POST' || config.method === 'PATCH') { 
      config.body = JSON.stringify(data);
    }
    return fetch(BASE_URL + ':' + PORT + '/' + endpoint.PATH, config);
};

/**
 * Get basic auth.
 * @returns {string} basicAuth value.
 */
export const GetBasicAuth = async () => {
  return sessionStorage.getItem('basicAuth')
};

export default ApiCall