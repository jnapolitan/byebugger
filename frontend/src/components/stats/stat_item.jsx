import React from 'react';

const StatItem = props => (
  <li className="stats-item">
    <p className="stats-player">{props.stat.player}</p>
    <p className="stats-score">{props.stat.score}</p>
  </li>
)

export default StatItem;
