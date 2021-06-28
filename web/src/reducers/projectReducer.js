import { ENVIRONMENT, MAILINGLIST, PROJECTNAME, PROJECTS, TICKETNUMBER, CURRENT } from "../actions/types"

const initialState = {
    current: null,
    projects: null,
    ticketNumber: '',
    projectName: '',
    environment: 'Development',
    mailingList: []
}

/**
 * Set the projectReducer state actions, more information about reducer: https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers 
 * @param {object} state current Redux reducer state. 
 * @param {string} action current action
 * @returns {object} project state
 */
const projectReducer = (state = initialState, action) => {
    switch(action.type) {
        case CURRENT:
            return {
                ...state,
                current: action.payload
            }
        case PROJECTS:
            return {
                ...state,
                projects: action.payload
            }
        case TICKETNUMBER:
            return {
                ...state, 
                ticketNumber: action.payload
            }
        case PROJECTNAME:
            return {
                ...state,
                projectName: action.payload
            }
        case ENVIRONMENT:
            return {
                ...state,
                environment: action.payload
            }
        case MAILINGLIST:
            return {
                ...state,
                mailingList: action.payload
            }
        default:
            return state;
    }
}

export default projectReducer;