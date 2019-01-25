![alt text](https://raw.githubusercontent.com/jnapolitan/byebugger/master/frontend/public/assets/images/splashText.png)

Single-player 3D shooter

- [Live Site](http://byebugger.herokuapp.com/#/)
- [Background and Overview](#background-and-overview)
- [Functionality and MVP](#functionality-and-mvp)
- [Technologies](#technologies)

## Background and Overview

(Updated 1/9/2019) ByeBugger is a single-player retro-style first-person shooter. Every game session is unique as the map is procedurally generated using binary space partitioning. The algorithm yields a 2D array of 1s and 0s, where 1s represent walls and 0s represent empty spaces. The 2D array is then passed to a rendering function, which uses Three.JS to convert the two-dimensional map to a three-dimensional world. Custom controls, bullet physics, and collision-detection were implemented to simulate a traditional FPS view.

## Functionality and MVP

- [ ] Game lobby with option for player to enter name/handle
- [ ] Graphic assets
  - [ ] Bugs
  - [ ] Human player
  - [ ] Textures/environment
- [ ] Player control logic
- [ ] Bug behavior logic
- [ ] Game logic
  - [ ] Point system
  - [ ] Collision
  - [ ] Controls / user input

## Technologies

ByeBugger is implemented using the MERN stack (MongoDB, Express, React, and Node.js) to keep track of players and a leaderboard of scores, as well as abstract game elements into React components such as the HUD (head up display). The game scene and objects are rendered using HTML5 Canvas and WebGL/three.js and HUD elements are updated via Redux global state.

#### Backend: MongoDB/Node.js/Express.js

Stats Model: username/handle, score

#### Frontend: React/Redux

## Credits
* [Kirokaze for intro screen background](https://www.deviantart.com/kirokaze/)
* [Eric Skiff for 8bit music](https://ericskiff.com/music/)
* [ThreeJS](https://github.com/mrdoob/three.js/)
