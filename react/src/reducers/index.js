import { combineReducers } from 'redux';
import loader from './loader';
import map from './map';

const ufwApp = combineReducers({
  loader,
  map,
});

export default ufwApp;
