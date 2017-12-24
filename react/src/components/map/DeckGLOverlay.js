import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DeckGL, { ArcLayer } from 'deck.gl';

const crypto = require('crypto');

export default class DeckGLOverlay extends Component {
  render() {
    const { viewport, data } = this.props;

    if (!data) {
      return null;
    }

    const layer = new ArcLayer({
      id: 'grid',
      data,
      getSourceColor,
      getTargetColor,
      getSourcePosition: d => (d.geo ? [d.geo.longitude, d.geo.latitude] : [0, 0]),
      getTargetPosition: d => [-81.5427402, 35.922479],
    });

    return <DeckGL {...viewport} layers={[layer]} />;
  }
}

DeckGLOverlay.propTypes = {
  viewport: PropTypes.objectOf(PropTypes.number).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const getSourceColor = (d) => {
  const str = `${d.country}`;

  const hash = crypto.createHash('md5').update(str).digest('hex').slice(0, 6);
  const red = parseInt(hash.slice(0, 2), 16);
  const green = parseInt(hash.slice(2, 4), 16);
  const blue = parseInt(hash.slice(4, 6), 16);

  return [red, green, blue, 255];
};

const getTargetColor = d => getSourceColor(d);
