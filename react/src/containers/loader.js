import { connect } from 'react-redux';
import LoaderComponent from '../components/loader/Loader';

const mapStateToProps = state => ({ visible: state.loader.visible });
const mapDispatchToProps = dispatch => ({});

const Loader = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoaderComponent);

export default Loader;
