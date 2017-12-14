import React from 'react';
import PropTypes from 'prop-types';
import Build from 'react-icons/lib/md/build';
import Autorenew from 'react-icons/lib/md/autorenew';
import './Loader.css';

const Loader = ({ visible }) => (
  <div className={`Loader ${visible ? 'visible' : ''}`}>
    <div className="Logo">
      <Build className="wrench-icon" /><br />
      <Autorenew className="rotate load-icon" />
    </div>
  </div>
);

Loader.propTypes = {
  visible: PropTypes.bool.isRequired,
};

export default Loader;
