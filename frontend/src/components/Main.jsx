import React from "react";

import Game from "../game/game";

export default class Main extends React.Component {
  componentDidMount() {
    // TODO: Intro music - this is a semi-functional placeholder
    // By Eric Matyas @ https://soundimage.org/
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

    // Early game sound effects (enter level, scary walls)
    const enterLevelAudio = new Audio("./assets/sounds/enter_level.mp3");
    enterLevelAudio.play();

    setTimeout(() => {
      const scaryWallsAudio = new Audio("./assets/sounds/scary_walls.mp3");
      scaryWallsAudio.play();
    }, 5000);

    // Special thanks to Eric Skiff for the amazing 8bit music
    // Music: Eric Skiff - Song Name - Resistor Anthems - Available at http://EricSkiff.com/music
    const tracks = ["https://ericskiff.com/music/Resistor%20Anthems/09%20Come%20and%20Find%20Me%20-%20B%20mix.mp3",
                    "https://ericskiff.com/music/Resistor%20Anthems/07%20We're%20the%20Resistors.mp3"];
    const musicURL = tracks[Math.floor(Math.random() * tracks.length)];
    const introMusic = new Audio(musicURL);
    introMusic.addEventListener('ended', function () {
      this.currentTime = 0;
      this.play();
    }, false);
    if (introMusic) {
      introMusic.play();
    }
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
