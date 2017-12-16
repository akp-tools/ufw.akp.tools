/**
 * Action Types
 */

// Loader actions
export const LoaderTypes = {
  LOADER_SHOW: 'LOADER_SHOW',
  LOADER_HIDE: 'LOADER_HIDE',
  LOADER_TOGGLE: 'LOADER_TOGGLE',
};

// Map actions
export const MapTypes = {
  MAP_LOADED: 'MAP_LOADED',
};

/**
 * Action Creators
 */

// Loader action creators
export const LoaderActions = {
  show: () => ({ type: LoaderTypes.LOADER_SHOW }),
  hide: () => ({ type: LoaderTypes.LOADER_HIDE }),
  toggle: () => ({ type: LoaderTypes.LOADER_TOGGLE }),
};

// Map action creators
export const MapActions = {
  loaded: () => (
    (dispatch) => {
      dispatch({ type: MapTypes.MAP_LOADED });
      dispatch(LoaderActions.hide());
    }
  ),
};
