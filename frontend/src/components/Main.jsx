import React from 'react';
import Game from '../game/game';

export default class Main extends React.Component {

  initiateGame(e) {
    e.preventDefault();
    const splash = document.getElementById('splash');
    // splash.classList.add('hidden');

    const game = new Game();
    game.init();
    game.animate();
  }

  render() {
    return (
      <div className="start-screen-container" id="splash">
        <img className="logo" src="https://static1.textcraft.net/data1/4/7/47ec57212c1063d986640e55e8fffed17cc1603fda39a3ee5e6b4b0d3255bfef95601890afd80709da39a3ee5e6b4b0d3255bfef95601890afd8070911e0e0a6c9273f3b1ad5cf500cddc6e2.png" />
        <button onClick={this.initiateGame} className="start-button">START</button>
      </div>
    )
  }
}