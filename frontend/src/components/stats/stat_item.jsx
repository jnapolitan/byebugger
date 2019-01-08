import React from 'react';

const StatItem = props => (
  <li>
    <p>{props.stat.player}</p>
    <p>{props.stat.score}</p>
  </li>
)

export default StatItem;