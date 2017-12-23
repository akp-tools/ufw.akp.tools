import { MapTypes } from '../actions';

const initialState = {
  mapLoaded: false,
};

const map = (state = initialState, action) => {
  switch (action.type) {
    case MapTypes.MAP_LOADED:
      return { ...state, mapLoaded: true };
    default:
      return state;
  }
};

export default map;
