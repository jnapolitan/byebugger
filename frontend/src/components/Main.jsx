import React from "react";

import Game from "../game/game";

export default class Main extends React.Component {
  componentDidMount() {
    // TODO: Intro music - this is a semi-functional placeholder
    // By Eric Matyas @ https://soundimage.org/
    // const musicURL = "http://soundimage.org/wp-content/uploads/2016/07/Puzzle-Game_Looping.mp3";
    const musicURL = "https://soundimage.org/wp-content/uploads/2018/11/Dance-of-the-Satellites_Looping.mp3";
    const introMusic = new Audio(musicURL);
    introMusic.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
    }, false);
    introMusic.play();
  }

  constructor(props) {
    super(props);
    this.initiateGame = this.initiateGame.bind(this);
    this.state = { player: 'Guest' };
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
    const game = new Game(this.state.player, this.props.store);
    game.init();
    
    game.animate();

    const enterLevelAudio = new Audio("./assets/sounds/enter_level.mp3");
    enterLevelAudio.play();
  }

  showStats(e) {
    e.preventDefault();
    const stats = document.getElementById("stats-modal");
    stats.classList.remove("hidden");
  }

  updatePlayerName() {
    return e => {
      this.setState({ player: e.target.value });
    };
  }

  render() {
    return (
      <div id="splash" className="splash-container">
        <img className="logo" src="../assets/images/splashText.png" alt="ByeBugger" />
        <form onSubmit={ this.initiateGame } >
          <input 
            type="text" 
            className="player-name-input" 
            placeholder="Enter your name to join the hacker ranks" 
            onChange={ this.updatePlayerName() }
            maxLength="18"
          />
        </form>
        <div className="buttons">
          <button className="start-button" onClick={this.initiateGame}>START</button>
          <button id="rankings-button" className="start-button" onClick={this.showStats}>RANKS</button>
        </div>
        <img id="controls" src="assets/images/controls.png" alt="controls"></img>
        <footer>Copyright &copy; 2019 ByeBugger</footer>
      </div>
    );
  }
}
