import React from 'react';
import { render } from 'react-dom';
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import Raven from 'raven-js';
import createRavenMiddleware from 'raven-for-redux';
import Loader from './containers/loader';
import Map from './containers/map';
import reducer from './reducers';
import * as Actions from './actions';
import './index.css';

const SENTRY_TOKEN = process.env.SentryLoggingToken;
Raven.config(SENTRY_TOKEN).install();

const loggerMiddleware = createLogger();
const ravenMiddleware = createRavenMiddleware(Raven);

const enhancers =
  compose(
    applyMiddleware(
      thunkMiddleware,
      ravenMiddleware,
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

// not yet.
// import registerServiceWorker from './registerServiceWorker';
// registerServiceWorker();

store.dispatch(Actions.FirebaseActions.init());
