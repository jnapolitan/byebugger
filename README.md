![logo](https://raw.githubusercontent.com/jnapolitan/byebugger/master/frontend/public/assets/images/splashText.png)

Single-player 3D shooter

- [Live Site](http://byebugger.herokuapp.com/#/)
- [Background and Overview](#background-and-overview)
- [Highlighted Features](#highlighted-features)
- [Technologies](#technologies)

## Background and Overview

ByeBugger is a single-player retro-style first-person shooter built using the three.js library within a MERN stack. Every game session is unique as the map is procedurally generated using binary space partitioning. Custom controls, bullet physics, and collision-detection were implemented to simulate a traditional FPS view.

![demo](https://raw.githubusercontent.com/jnapolitan/byebugger/master/frontend/public/assets/images/demo.gif)

## Highlighted Features

### Procedurally generated maps
ByeBugger uses [binary space partitioning ](https://en.wikipedia.org/wiki/Binary_space_partitioning) to generate a new custom map every time a player enters the game. The algorithm yields a 2D array of 1s and 0s, where 1s represent walls and 0s represent empty spaces. The 2D array is then passed to a rendering function, which uses three.js to convert the two-dimensional map to a three-dimensional world. 

### Custom collision
For the player, collision logic was designed in true retro style by calling an accelerated reverse velocity function whenever the player object comes within a certain distance of a wall. This ensures the player is unable to enter walls, and allows for some deeper environment characteristics like an *umph* sound effect when bumping into a wall and bouncing back.

```javascript
if (this.keypresses.forward || this.keypresses.backward) {
  this.velocity.z -= this.direction.z * (900.0 * this.keypresses.shiftFactor) * delta;
  if (GameUtil.checkWallCollision(camPos, this.map, this.UNITSIZE)) {
    this.collisionSound.play();
    this.velocity.z -= this.velocity.z * 4;
  }
}

if (this.keypresses.left || this.keypresses.right) {
  this.velocity.x -= this.direction.x * 1200.0 * delta;
  if (GameUtil.checkWallCollision(camPos, this.map, this.UNITSIZE)) {
    this.collisionSound.play();
    this.velocity.x -= this.velocity.x * 4;
  }
}
```

## Technologies

ByeBugger is implemented using the MERN stack (MongoDB, Express, React, and Node.js) to keep track of players and a leaderboard of scores, as well as abstract game elements into React components such as the HUD (head up display). The game scene and objects are rendered using HTML5 Canvas and WebGL/three.js and HUD elements are updated via Redux global state.

#### Backend: MongoDB/Node.js/Express.js

Stats Model: username/handle, score

#### Frontend: React/Redux

## Credits
* [Kirokaze for intro screen background](https://www.deviantart.com/kirokaze/)
* [Eric Skiff for 8bit music](https://ericskiff.com/music/)
* [ThreeJS](https://github.com/mrdoob/three.js/)
