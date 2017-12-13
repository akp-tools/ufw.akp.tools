import React from 'react';
import PropTypes from 'prop-types';
import './Loader.css';

const Loader = ({ visible }) => (
  <div className={`Loader ${visible ? 'visible' : ''}`}>
    <div className="Logo">
      <img src="http://via.placeholder.com/250x250" alt="akp.tools logo" /><br />
      <img src="http://via.placeholder.com/100x100" alt="loading indicator" />
    </div>
  </div>
);

Loader.propTypes = {
  visible: PropTypes.bool.isRequired,
};

export default Loader;
