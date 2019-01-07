import React from 'react';

export default class Hud extends React.Component {

  render() {
    return (
      <div className="hud-container hidden" id="hud">
        <p id="score">Score: {this.props.score}</p>
        <p id="sanity">Sanity: {this.props.health}</p>
      </div>
    )
  }
}
