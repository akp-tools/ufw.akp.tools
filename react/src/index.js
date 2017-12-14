import React from 'react';
import { render } from 'react-dom';
import { createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import Loader from './containers/loader';
import Map from './components/map';
import reducer from './reducers';
import { LoaderActions } from './actions';
import './index.css';

const enhancers =
  compose(window.devToolsExtension ? window.devToolsExtension() : f => f);

const store = createStore(reducer, enhancers);

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
