import {DiagramHasError} from '../utils/Logic';
/**
 * Checks the current diagram on erros, not null/undefined and isArray.
 * @param {object} data diagram data 
 * @returns {boolean} returns true if all the conditions are met, false if not. 
 */
const disabled = (data) => {
    if (Array.isArray(data) && data.length > 0) {
      //now the data array has blocks check if the diagram has no errors
      return DiagramHasError(data)
    }
    if (!data) {
      return true;
    }
    if (Array.isArray(data) && data.length === 0) {
      return true;
    }
    return false;
} 

export default disabled