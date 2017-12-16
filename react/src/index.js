import React from 'react';
import { render } from 'react-dom';
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import Loader from './containers/loader';
import Map from './containers/map';
import reducer from './reducers';
import './index.css';


const loggerMiddleware = createLogger();
const enhancers =
  compose(
    applyMiddleware(
      thunkMiddleware,
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
