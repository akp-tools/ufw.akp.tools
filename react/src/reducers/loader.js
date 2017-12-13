import { LoaderTypes } from '../actions';

const initialState = {
  visible: true,
};

const loader = (state = initialState, action) => {
  switch (action.type) {
    case LoaderTypes.LOADER_TOGGLE:
      return { ...state, visible: !state.visible };
    case LoaderTypes.LOADER_SHOW:
      return { ...state, visible: true };
    case LoaderTypes.LOADER_HIDE:
      return { ...state, visible: false };
    default:
      return state;
  }
};

export default loader;
