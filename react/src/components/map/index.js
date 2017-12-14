import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactMapGL from 'react-map-gl';
import './map.css';

const MAPBOX_TOKEN = process.env.MapboxAccessToken;

class Map extends Component {
  constructor(props) {
    super(props);
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.state = {
      viewport: {
        latitude: 37.7749,
        longitude: -122.4194,
        zoom: 12,
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
        mapStyle="mapbox://styles/mapbox/dark-v9"
        preventStyleDiffing={false}
        mapboxApiAccessToken={MAPBOX_TOKEN}
      />
    );
  }
}

Map.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default Map;
