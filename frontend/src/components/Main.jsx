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
    // let musicURL = "http://soundimage.org/wp-content/uploads/2016/07/Puzzle-Game_Looping.mp3";
    // let audio = new Audio(musicURL);
    // audio.play();

    return (
      <div id="splash" className="splash-container">
        <img className="logo" src="../assets/images/splashText.png" alt="ByeBugger" />
        <button className="start-button" onClick={ this.initiateGame }>START</button>
      </div>
    );
  }
}
