import React from 'react';

export default class Hud extends React.Component {

  render() {
    return (
      <div className="hud-container hidden" id="hud">
        <p>Score: {this.props.score}</p>
        <p>Sanity: {this.props.health}</p>
      </div>
    )
  }
}
