import React from 'react';
import { render } from 'react-dom';
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import Loader from './containers/loader';
import Map from './components/map';
import reducer from './reducers';
import { LoaderActions } from './actions';
import './index.css';


const loggerMiddleware = createLogger();
const enhancers =
  compose(
    applyMiddleware(
      loggerMiddleware,
    ),
    window.devToolsExtension ? window.devToolsExtension() : f => f,
  );

const store = createStore(
  reducer,
  enhancers,
);

if (window.devToolsExtension) {
  window.devToolsExtension.updateStore(store);
}

render(
  <Provider store={store}>
    <div>
      <Loader />
      <Map />
    </div>
  </Provider>,
  document.getElementById('root'),
);

setTimeout(() => {
  store.dispatch(LoaderActions.hide());
}, 500);

// not yet.
// import registerServiceWorker from './registerServiceWorker';
// registerServiceWorker();
