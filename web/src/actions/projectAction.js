import GetProject from "../api/GetProject"
import ProjectList from "../api/ProjectList"
import { CURRENT, ENVIRONMENT, MAILINGLIST, PROJECTNAME, PROJECTS, TICKETNUMBER } from "./types"

/**
 * Perform the set Projects Redux action, thereby sending a ProjectList GET request to the backend and then setting the response as new projects value.
 */
export const setProjects = () => dispatch => {
    ProjectList().then(projects => dispatch({
        type: PROJECTS,
        payload: projects
    }))
}

/**
 * Perform the set ticketnumber Redux action.
 * @param {string} ticketnumber new ticketnumber string to set.
 */
export const setTicketNumber = (ticketnumber) => dispatch => {
    dispatch({
        type: TICKETNUMBER, 
        payload: ticketnumber
    })
}

/**
 * Perform the set project name Redux action.
 * @param {string} projectName new project name string to set.
 */
export const setProjectName = (projectName) => dispatch => {
    dispatch({
        type: PROJECTNAME, 
        payload: projectName
    })
}

/**
 * Perform the set mailinglist Redux action. Could be a Array or string.
 * @param {Array|string} mailingList new mailinglist value 
 */
export const setMailingList = (mailingList) => dispatch => {
    dispatch({
        type: MAILINGLIST, 
        payload: mailingList
    })
}

/**
 * Perform the set Current Project Redux action, thereby sending a GetProject request to the backend and then setting the response as new projects value.
 * @param {number|string} id project id or ticketnumber
 */
export const setCurrentProject = (id) => dispatch => {
    GetProject(id).then(project => dispatch({
        type: CURRENT,
        payload: project
    }))
}

/**
 * Perform the reset current project Redux action. Resetting the current project value to it's initial value (null).
 */
export const resetCurrentProject = () => dispatch => {
    dispatch({
        type: CURRENT,
        payload: null
    })
}

/**
 * Perform the set project environment Redux action.
 * @param {string} environment new environment string to set.
 */
export const setEnvironment = (environment) => dispatch => {
    dispatch({
        type: ENVIRONMENT, 
        payload: environment
    })
}