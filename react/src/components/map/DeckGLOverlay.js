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
      getSourceColor: d => getSourceColor(d, false, data.length),
      getTargetColor: d => getSourceColor(d, true, data.length),
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

const getSourceColor = (d, t, dataLength) => {
  let str = `${d.country}`;
  if (str === 'United States') {
    str = `${d.subcountry}, ${str}`;
  }

  const hash = crypto.createHash('md5').update(str).digest('hex').slice(0, 6);
  const red = parseInt(hash.slice(0, 2), 16);
  const green = parseInt(hash.slice(2, 4), 16);
  const blue = parseInt(hash.slice(4, 6), 16);
  const alpha = t ? dataLength / 1000 * 255 : 255;


  return [red, green, blue, alpha];
};
