import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};

const middleware = [thunk]

/**
 * The redux store configuration. Adding the rootreducer (reducers/index.js), initial state and compose the middleware + Redux dev tools.
 * More on configuring the Redux store: https://redux.js.org/tutorials/fundamentals/part-4-store#configuring-the-store
 */
const store = createStore(
    rootReducer, 
    initialState, 
    compose (
        applyMiddleware(...middleware)
    )
);

export default store;