import { combineReducers } from 'redux';
import loader from './loader';
import map from './map';
import firebase from './firebase';

const ufwApp = combineReducers({
  loader,
  map,
  firebase,
});

export default ufwApp;
