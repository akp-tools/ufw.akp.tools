import React from 'react';
import { render } from 'react-dom';
import { createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import App from './components/App';
import reducer from './reducers';
import { LoaderActions } from './actions';

const enhancers =
  compose(window.devToolsExtension ? window.devToolsExtension() : f => f);

const store = createStore(reducer, enhancers);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);

setTimeout(() => {
  store.dispatch(LoaderActions.hide());
}, 5000);

// not yet.
// import registerServiceWorker from './registerServiceWorker';
// registerServiceWorker();
