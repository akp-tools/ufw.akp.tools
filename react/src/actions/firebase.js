import * as firebase from 'firebase';

require('firebase/firestore'); // firestore has side effects that need to occur.

const firebaseConfig = {
  apiKey: 'AIzaSyCBOVphw_2mJv4qcCpY-Q9KlzT0BphcNwA',
  databaseURL: 'https://ufw-akp-tools.firebaseio.com',
  authDomain: 'ufw-akp-tools.firebaseapp.com',
  projectId: 'ufw-akp-tools',
};

// Firebase actions
export const FirebaseTypes = {
  FIREBASE_INITIALIZE: 'FIREBASE_INITIALIZE',
  FIREBASE_RESPONSE: 'FIREBASE_RESPONSE',
  FIREBASE_ERROR: 'FIREBASE_ERROR',
};

// Firebase action creators
export const FirebaseActions = {
  init: () => (
    (dispatch) => {
      dispatch({ type: FirebaseTypes.FIREBASE_INITIALIZE });
      firebase.initializeApp(firebaseConfig);
      const db = firebase.database().ref('data');
      db.child('geopoints').on('value', (data) => {
        const blocks = Object.values(data.val());
        dispatch(FirebaseActions.response(blocks));
      });
    }
  ),
  response: data => ({ type: FirebaseTypes.FIREBASE_RESPONSE, data }),
  error: error => ({ type: FirebaseTypes.FIREBASE_ERROR, error }),
};
