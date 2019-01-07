import React from "react";

import Game from "../game/game";

export default class Main extends React.Component {
  componentDidMount() {
    // TODO: Intro music - this is a semi-functional placeholder
    // By Eric Matyas @ https://soundimage.org/
    const musicURL = "http://soundimage.org/wp-content/uploads/2016/07/Puzzle-Game_Looping.mp3";
    const audio = new Audio(musicURL);
    const promise = audio.play();
    if (promise !== undefined) {
      promise.then(() => {
        audio.play();
        audio.currentTime = 0;
      })
    }
  }

  constructor(props) {
    super(props);
    this.initiateGame = this.initiateGame.bind(this);
  }

  // e is pulled in as the "event" being handled
  initiateGame(e) {
    // Don't reload the page upon clicking the start game button
    e.preventDefault();
    const splash = document.getElementById("splash");
    const hud = document.getElementById("hud");
    // Hide the splash screen
    splash.classList.add("hidden");
    hud.classList.remove("hidden");

    // Start the game
    const game = new Game(this.props.store);
    game.init();
    game.animate();
  }

  render() {
    return (
      <div id="splash" className="splash-container">
        <img className="logo" src="../assets/images/splashText.png" alt="ByeBugger" />
        <button className="start-button" onClick={ this.initiateGame }>START</button>
        <footer>Copyright &copy; 2019 ByeBugger</footer>
      </div>
    );
  }
}
