import * as t from 'three';

////// AI-related //////
const audioLoader = new t.AudioLoader();
export function addAI(camPos, map, scene, ai, aiAnimations, listener) {
  // Possible bug textures
  const aiSpriteTextures = [
    '/assets/images/galaga-sprite.png',
    '/assets/images/galaga-sprite-blue.png',
    '/assets/images/butterfly-sprite.png',
    '/assets/images/winged-sprite.png',
    '/assets/images/butterfly-sprite.png',
    '/assets/images/winged-sprite.png'
  ];

  // Sample from aiSpriteTextures array to create a random bugger
  const aiTexture = new t.TextureLoader().load(aiSpriteTextures[Math.floor(Math.random() * aiSpriteTextures.length)]);

  // Add texture, create sprite using material and set scale
  let aiMaterial = new t.SpriteMaterial({
    map: aiTexture,
    fog: true
  });
  let bug = new t.Sprite(aiMaterial);
  bug.scale.set(40, 40, 1);

  // Generate random coords within the map until bugger is not on the player or in a wall
  let x;
  let z;
  do {
    x = getRandBetween(0, map.length - 1);
    z = getRandBetween(0, map.length - 1);
  } while (map[x][z] > 0 || (x === camPos.x && z === camPos.z));

  // Format coords, set position, and random directions (X and Z) to be used for animating direction
  x = (x - map.length / 2) * 128;
  z = (z - map.length / 2) * 128;
  bug.position.set(x, 128 * 0.15, z);
  bug.health = 100;
  bug.randomX = Math.random();
  bug.randomZ = Math.random();

  // Add TextureAnimator to animations array to be iterated through and processed in animation function
  aiAnimations.push(new TextureAnimator(aiTexture, 2, 1, 2, 1000));
  ai.push(bug);

  // create the PositionalAudio object (passing in the listener)
  const aiSound = new t.PositionalAudio(listener);

  // load AI sound and set it as the PositionalAudio object's buffer
  audioLoader.load('/assets/sounds/glitch_static.mp3', function (buffer) {
    aiSound.setBuffer(buffer);
    aiSound.setRefDistance(10);
    aiSound.setLoop(true);
    aiSound.setDistanceModel('linear');
    aiSound.setMaxDistance(150);
    aiSound.play();
  });
  bug.sound = aiSound;

  scene.add(bug);
  bug.add(aiSound);
}

////////////////////////

export const findValidSpace = (map, cam, UNITSIZE) => {
  let x = Math.floor(Math.random() * map.length);
  let z = Math.floor(Math.random() * map.length);
  while (map[x][z]) {
    x = Math.floor(Math.random() * map.length);
    z = Math.floor(Math.random() * map.length);
  }
  let calcX = (x - map.length / 2) * UNITSIZE;
  let calcZ = (z - map.length / 2) * UNITSIZE;
  cam.position.x = calcX - 20;
  cam.position.z = calcZ - 20;
};

export const checkSpawn = (map, cam, UNITSIZE) => {
  let startingSpot = map[map.length / 2][map.length / 2];
  if (startingSpot) {
    findValidSpace(map, cam, UNITSIZE);
  }
};

// Create powerup, set to a random valid location
export const addPowerup = (camPos, scene) => {
  const powerupGeo = new t.BoxGeometry(30, 30, 30);
  const powerupMat = new t.MeshPhongMaterial({
    emissive: 0xffffff,
    emissiveIntensity: 4
  });
  const powerup = new t.Mesh(powerupGeo, powerupMat);
  powerup.position.copy(camPos);
  powerup.position.y += 5;
  scene.add(powerup);
};

export const getMapSector = (v, map, UNITSIZE) => {
  let x = Math.floor(((v.x + 20) + UNITSIZE / 2) / UNITSIZE + map.length / 2);
  let z = Math.floor(((v.z + 20) + UNITSIZE / 2) / UNITSIZE + map.length / 2);
  let x2 = Math.floor(((v.x - 20) + UNITSIZE / 2) / UNITSIZE + map.length / 2);
  let z2 = Math.floor(((v.z - 20) + UNITSIZE / 2) / UNITSIZE + map.length / 2);
  return {
    x: x,
    z: z,
    x2: x2,
    z2: z2
  };
};

export const checkWallCollision = (obj, map, UNITSIZE) => {
  let currentPos = getMapSector(obj, map, UNITSIZE);
  if (currentPos.x > map.length - 1 || currentPos.z > map.length - 1) {
    return;
  }
  if (map[currentPos.x] || map[currentPos.x2]) {
    if (map[currentPos.x][currentPos.z] > 0 || map[currentPos.x2][currentPos.z2] > 0 ||
      map[currentPos.x][currentPos.z2] > 0 || map[currentPos.x2][currentPos.z] > 0) {
      return true;
    } else {
      return false;
    }
  }
};

//Get a random integer between lo and hi, inclusive.
//Assumes lo and hi are integers and lo is lower than hi.
export const getRandBetween = (lo, hi) => {
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
};

export const sceneSetup = (scene, map) => {
  const ceiling = new t.GridHelper(9000, 600, '#55e7ff', '#55e7ff'); // size, divisions
  ceiling.position.y = 96;
  ceiling.position.x = Math.PI / 2;
  scene.add(ceiling);

  const floor = new t.GridHelper(9000, 600, '#ff34b3', '#ff34b3');
  floor.position.y = 0.5;
  floor.position.x = (-Math.PI / 2);
  scene.add(floor);

  // Walls
  const block = new t.BoxGeometry(128, 96, 128);

  let wallTexture = new t.MeshBasicMaterial({ color: 'black' });
  // let wallTexture = new t.MeshBasicMaterial({
  //   map: new t.TextureLoader().load('')
  // });

  const geom = new t.Geometry();
  // Create walls according to 2D map array
  for (let i = 0; i < map.length; i++) {
    for (let j = 0, m = map[i].length; j < m; j++) {
      if (map[i][j]) {
        let wall = new t.Mesh(block, wallTexture);
        wall.position.x = (i - map.length / 2) * 128;
        wall.position.y = 128 / 3 + 5;
        wall.position.z = (j - map.length / 2) * 128;
        geom.mergeMesh(wall);
      }
    }
  }

  // Merge meshes for better memory usage
  scene.add(new t.Mesh(geom, wallTexture));

  // Lighting
  const directionalLight1 = new t.DirectionalLight(0xF7EFBE, 0.7);
  directionalLight1.position.set(0.5, 1, 0.5);
  scene.add(directionalLight1);

  const directionalLight2 = new t.DirectionalLight(0xF7EFBE, 0.5);
  directionalLight2.position.set(-0.5, -1, -0.5);
  scene.add(directionalLight2);
};

// Texture animator for AI utilizing sprites 
// Sprite frames are animated during the update function using the specified duration
export function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) {
  // note: texture passed by reference, will be updated by the update function.

  this.tilesHorizontal = tilesHoriz;
  this.tilesVertical = tilesVert;
  // how many images does this spritesheet contain?
  //  usually equals tilesHoriz * tilesVert, but not necessarily,
  //  if there at blank tiles at the bottom of the spritesheet. 
  this.numberOfTiles = numTiles;
  texture.wrapS = texture.wrapT = t.RepeatWrapping;
  texture.repeat.set(1 / this.tilesHorizontal, 1 / this.tilesVertical);

  // how long should each image be displayed?
  this.tileDisplayDuration = tileDispDuration;

  // how long has the current image been displayed?
  this.currentDisplayTime = 0;

  // which image is currently being displayed?
  this.currentTile = 0;

  this.update = function (milliSec) {
    this.currentDisplayTime += milliSec;
    while (this.currentDisplayTime > this.tileDisplayDuration) {
      this.currentDisplayTime -= this.tileDisplayDuration;
      this.currentTile++;
      if (this.currentTile === this.numberOfTiles)
        this.currentTile = 0;
      var currentColumn = this.currentTile % this.tilesHorizontal;
      texture.offset.x = currentColumn / this.tilesHorizontal;
      var currentRow = Math.floor(this.currentTile / this.tilesHorizontal);
      texture.offset.y = currentRow / this.tilesVertical;
    }
  };
}
