import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DeckGL, { ArcLayer } from 'deck.gl';

const c = require('tinycolor2');

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
      getSourceColor: d => getSourceColor(d, false),
      getTargetColor: d => getSourceColor(d, true),
      // eslint-disable-next-line no-underscore-dangle
      getSourcePosition: d => (d.geo ? [d.geo._longitude, d.geo._latitude] : [0, 0]),
      getTargetPosition: d => [-81.5427402, 35.922479],
      strokeWidth: 4,
    });

    return <DeckGL {...viewport} layers={[layer]} />;
  }
}

DeckGLOverlay.propTypes = {
  viewport: PropTypes.objectOf(PropTypes.number).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const getSourceColor = (d, t) => {
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
