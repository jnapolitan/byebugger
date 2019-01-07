import React from 'react';

const Hud = props => (
  <div className="hud-container">
    <h2>Health: {props.health}</h2>
    <h2>Score: {props.score}</h2>
  </div>
)

export default Hud;