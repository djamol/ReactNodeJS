// store.js
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import authReducer from './reducers/authReducer';
import fileReducer from './reducers/fileReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  file: fileReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
 
