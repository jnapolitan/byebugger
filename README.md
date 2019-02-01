![logo](https://raw.githubusercontent.com/jnapolitan/byebugger/master/frontend/public/assets/images/splashText.png)

3D 8-bit Style First-Person Shooter

- [Live Site](http://byebugger.herokuapp.com/#/)
- [Background and Overview](#background-and-overview)
- [Highlighted Features](#highlighted-features)
- [Technologies Used](#technologies)
- [Credits](#credits)

## Background and Overview

ByeBugger is a 3D 8-bit style shooter in the first-person format. It was built in the MERN stack (MongoDB, Express.js, React.js & Redux, and Node.js); rendering of 3D objects was accomplished using Three.js, which uses WebGL underneath the hood.

![demo](https://github.com/jnapolitan/byebugger/blob/master/frontend/public/assets/images/byebugger-demo.gif)

## Highlighted Features

### Procedurally generated maps
It would be boring if the player had to roam the same map every time they played, right? To fix this, we generate a 2D matrix of 1s and 0s, 1s representing walls and 0s representing reachable spaces. We used the [binary space partitioning algorithm](https://en.wikipedia.org/wiki/Binary_space_partitioning) to randomly subdivide the matrix into many rooms connected by corridors. The matrix is then passed to the main game loop, where it is used to determine where walls will be rendered in the 3D game environment.

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

ByeBugger is implemented using the MERN stack (MongoDB, Express.js, React.js & Redux, and Node.js) to keep track of players and a leaderboard of scores, as well as abstract game elements into React components such as the HUD (head up display). The game scene and objects are rendered using HTML5 Canvas and WebGL/three.js and HUD elements are updated via Redux global state.

#### Backend: MongoDB/Node.js/Express.js

Stats Model: username/handle, score

#### Frontend: React/Redux

## Credits
* [Kirokaze for intro screen background](https://www.deviantart.com/kirokaze/)
* [Eric Skiff for 8bit music](https://ericskiff.com/music/)
* [ThreeJS](https://github.com/mrdoob/three.js/)
