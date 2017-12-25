import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactMapGL from 'react-map-gl';
import DeckGLOverlay from './DeckGLOverlay';
import './map.css';

const MAPBOX_TOKEN = process.env.MapboxAccessToken;

class Map extends Component {
  constructor(props) {
    super(props);
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.state = {
      viewport: {
        latitude: 25,
        longitude: 0,
        zoom: 1.45,
        pitch: 0,
        bearing: 0,
        width,
        height,
      },
    };

    this.onResize = this.onResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize() {
    this.setState({
      viewport: {
        ...this.state.viewport,
        width: window.innerWidth,
        height: window.innerHeight,
      },
    });
  }

  render() {
    const viewport = { ...this.state.viewport, ...this.props };

    return (
      <ReactMapGL
        {...viewport}
        onViewportChange={v => this.setState({ viewport: v })}
        onLoad={v => this.props.onLoad()}
        mapStyle="mapbox://styles/akp-/cjbmluqa22yqq2qqjn3vd5ccw"
        mapboxApiAccessToken={MAPBOX_TOKEN}
      >
        <DeckGLOverlay
          viewport={viewport}
          data={this.props.locations}
          cellSize={20}
        />
      </ReactMapGL>
    );
  }
}

Map.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onLoad: PropTypes.func.isRequired,
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Map;
