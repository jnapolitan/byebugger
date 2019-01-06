import React from "react";

import Game from "../game/game";

export default class Main extends React.Component {
  // e is pulled in as the "event" being handled
  initiateGame(e) {
    // Don't reload the page upon clicking the start game button
    e.preventDefault();
    const splash = document.getElementById("splash");
    // Hide the splash screen
    splash.classList.add("hidden");

    // Start the game
    const game = new Game();
    game.init();
    game.animate();
  }

  render() {
    // TODO: Intro music - this is a semi-functional placeholder
    // By Eric Matyas @ https://soundimage.org/
    let musicURL = "http://soundimage.org/wp-content/uploads/2016/07/Puzzle-Game_Looping.mp3";
    let audio = new Audio(musicURL);
    audio.play();

    return (
      <div id="splash" className="splash-container">
        <img className="logo" src="https://static1.textcraft.net/data1/4/7/47ec57212c1063d986640e55e8fffed17cc1603fda39a3ee5e6b4b0d3255bfef95601890afd80709da39a3ee5e6b4b0d3255bfef95601890afd8070911e0e0a6c9273f3b1ad5cf500cddc6e2.png" alt="ByeBugger" />
        <button className="start-button" onClick={ this.initiateGame }>START</button>
      </div>
    );
  }
}
