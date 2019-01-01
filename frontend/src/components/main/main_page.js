import React from 'react';

import NavBarContainer from '../nav/navbar_container';

class MainPage extends React.Component {

  render() {
    return (
      <>
        {/* TODO: Restyle this page before the final release. Do we really need auth? */}
        <div className="start-screen-container">
          <NavBarContainer />

          {/* TODO: Move this file into assets */}
          <img className="logo" src="https://static1.textcraft.net/data1/4/7/47ec57212c1063d986640e55e8fffed17cc1603fda39a3ee5e6b4b0d3255bfef95601890afd80709da39a3ee5e6b4b0d3255bfef95601890afd8070911e0e0a6c9273f3b1ad5cf500cddc6e2.png" alt="ByeBugger logo"></img>
          <button className="start-button">START</button>

          {/* TODO: Temporary music player */}
          <audio controls autoPlay loop>
            <source src="http://66.90.93.122/ost/minecraft/rcmuwtbq/Volume%20Alpha%20-%2019%20-%20Cat.mp3" />
          </audio>

          <footer>
            Copyright &copy; 2019 Byebugger
          </footer>
        </div>
      </>
    );
  }

}

export default MainPage;
