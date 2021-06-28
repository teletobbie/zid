import Logic from '../utils/Logic'
import { LOGIC, DATA, DEPLOYMENT, DIAGRAM } from './types'

/**
 * Perform the set environment Redux action.
 * @param {string} environment environment string to set.
 */
export const setLogic = (environment) => dispatch => {
    Logic(environment).then(newLogic => dispatch({
        type: LOGIC,
        payload: newLogic
    }))
}

/**
 * Perform the set logic Redux action, thereby setting the logic value back to null.
 */
export const resetLogic = () => dispatch => {
    dispatch({
        type: LOGIC,
        payload: null
    })
}

/**
 * Perform the set data Redux action.
 * @param {Array} newData new data array to set.
 */
export const setData = (newData) => dispatch => {
    dispatch({
        type: DATA,
        payload: newData
    })
}

/**
 * Perform the set deployment Redux action.
 * @param {Array} newDeployment new deployment array to set.
 */
export const setDeployment = (newDeployment) => dispatch => {
    dispatch({
        type: DEPLOYMENT,
        payload: newDeployment
    })
}

/**
 * Perform the set deployment Redux action.
 * @param {Object} newDiagram new diagram Object to set.
 */
export const setDiagram = (newDiagram) => dispatch => {
    dispatch({
        type: DIAGRAM,
        payload: newDiagram
    })
}