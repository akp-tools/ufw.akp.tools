import { FirebaseTypes } from '../actions';

const initialState = {
  error: false,
  initialized: false,
  blocks: [],
};

const firebase = (state = initialState, action) => {
  switch (action.type) {
    case FirebaseTypes.FIREBASE_INITIALIZE:
      return { ...state, initialized: true };
    case FirebaseTypes.FIREBASE_ERROR:
      return { ...state, error: action.data };
    case FirebaseTypes.FIREBASE_RESPONSE:
      return { ...state, blocks: action.data };
    default:
      return state;
  }
};

export default firebase;
