import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DeckGL, { ScatterplotLayer } from 'deck.gl';

const c = require('tinycolor2');
const crypto = require('crypto');

export default class DeckGLOverlay extends Component {
  render() {
    const { viewport, data } = this.props;

    if (!data) {
      return null;
    }

    const layer = new ScatterplotLayer({
      id: 'grid',
      data,
      // eslint-disable-next-line no-underscore-dangle
      getPosition: d => (d.geo ? [d.geo._longitude, d.geo._latitude] : [0, 0]),
      getColor,
      getRadius: d => (Math.pow((1 / (viewport.zoom || 1.5)), 2) * 100),
      radiusScale: 1000,
      outline: false,
      updateTriggers: {
        getRadius: [viewport.zoom],
      },
    });

    return <DeckGL {...viewport} layers={[layer]} />;
  }
}

DeckGLOverlay.propTypes = {
  viewport: PropTypes.objectOf(PropTypes.number).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const getColor = (d) => {
  let str = `${d.country}`;
  if (str === 'United States') {
    str = `${d.subcountry}, ${str}`;
  }

  const hash = crypto.createHash('md5').update(str).digest('hex').slice(0, 6);
  let color = c(hash);

  if (color.isDark()) {
    color = color.brighten(30).saturate();
  }

  const { r, g, b } = color.toRgb();

  return [r, g, b, 255];
};
