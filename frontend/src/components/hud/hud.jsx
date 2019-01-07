import React from 'react';

const Hud = props => (
  <div className="hud-container">
    <h2>Health: {this.props.health}</h2>
    <h2>Score: {this.props.score}</h2>
  </div>
)

export default Hud;