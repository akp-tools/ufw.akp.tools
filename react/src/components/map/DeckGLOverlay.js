import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DeckGL, { ScreenGridLayer } from 'deck.gl';

export default class DeckGLOverlay extends Component {
  render() {
    const { viewport, cellSize, data } = this.props;

    if (!data) {
      return null;
    }

    const layer = new ScreenGridLayer({
      id: 'grid',
      data,
      minColor: [0, 255, 0, 0],
      maxColor: [0, 255, 0, 240],
      getPosition: d => (d.geo ? [d.geo.longitude, d.geo.latitude] : [0, 0]),
      cellSizePixels: cellSize,
    });

    return <DeckGL {...viewport} layers={[layer]} />;
  }
}

DeckGLOverlay.propTypes = {
  viewport: PropTypes.objectOf(PropTypes.number).isRequired,
  cellSize: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
