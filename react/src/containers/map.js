import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MapComponent from '../components/map';
import { MapActions } from '../actions';

const mapStateToProps = state => ({ locations: state.firebase.blocks });
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    onLoad: MapActions.loaded,
  }, dispatch)
);

const Map = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapComponent);

export default Map;
