import React from 'react';

export default class Hud extends React.Component {

  render() {
    return (
      <div className="hud-container hidden" id="hud">
        <p id="sanity">Sanity: {this.props.health}</p>
        <p id="score">Score: {this.props.score}</p>
      </div>
    )
  }
}
