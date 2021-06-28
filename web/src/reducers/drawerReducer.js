import {LOGIC, DATA, DEPLOYMENT, DIAGRAM} from '../actions/types';

const initialState = {
    diagram: null,
    logic: null,
    data: null,
    deployment: null
}

/**
 * Set the drawerReducer state actions, more information about reducer: https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers 
 * @param {object} state current Redux reducer state. 
 * @param {string} action current action
 * @returns {object} drawer state
 */
const drawerReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOGIC:
            return {
                ...state, 
                logic: action.payload
            }
        case DATA:
            return {
                ...state,
                data: action.payload
            }
        case DEPLOYMENT:
            return {
                ...state,
                deployment: action.payload
            }
        case DIAGRAM: 
            return {
                ...state,
                diagram: action.payload
            }
        default:
            return state;
    }
}

export default drawerReducer;