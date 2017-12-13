import { combineReducers } from 'redux';
import loader from './loader';

const ufwApp = combineReducers({
  loader,
});

export default ufwApp;
