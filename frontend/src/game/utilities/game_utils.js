import * as t from 'three';

import Reflector from '../external_sources/Reflector';

// Create and deploy a single AI object
export function addAI(camPos, map, scene, ai, aiAnimations) {
  // Array of three different sprite textures
  const aiSpriteTextures = [
    '/assets/images/butterfly-sprite.png',
    '/assets/images/galaga-sprite.png',
    '/assets/images/winged-sprite.png'
  ];

  // Sample from aiSpriteTextures array to create a random bugger
  const aiTexture = new t.TextureLoader().load(aiSpriteTextures[Math.floor(Math.random() * aiSpriteTextures.length)]);

  // Add texture, create sprite using material and set scale
  let aiMaterial = new t.SpriteMaterial({ /*color: 0xEE3333,*/
    map: aiTexture,
    fog: true
  });
  let o = new t.Sprite(aiMaterial);
  o.scale.set(40, 40, 1);

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
  o.position.set(x, 128 * 0.15, z);
  o.randomX = Math.random();
  o.randomZ = Math.random();

  // Add TextureAnimator to animations array to be iterated through and processed in animation function
  aiAnimations.push(new TextureAnimator(aiTexture, 2, 1, 2, 1000));
  ai.push(o);

  // create the PositionalAudio object (passing in the listener)
  // const aiSound = new t.PositionalAudio(listener);

  // load AI sound and set it as the PositionalAudio object's buffer
  // const audioLoader = new t.AudioLoader();
  // audioLoader.load('https://s3-us-west-1.amazonaws.com/towndcloud-seed/bug-glitch-1.mp3', function (buffer) {
  //   aiSound.setBuffer(buffer);
  //   aiSound.setRefDistance(5);
  //   aiSound.setLoop(true);
  //   aiSound.setRolloffFactor(2);
  //   aiSound.play();
  // });

  // o.add(aiSound);
  scene.add(o);
};

export const checkSpawn = (map, cam, UNITSIZE) => {
  let startingSpot = map[map.length / 2][map.length / 2];
  if (startingSpot) {
    console.log("Was in a wall");
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
  }
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

// TODO: Export ceiling
export const sceneSetup = (scene, map) => {
  const ceiling = new t.GridHelper(20000, 600, '#00ccfd', '#00ccfd'); // size, divisions
  ceiling.position.y = 120;
  ceiling.position.x = Math.PI / 2;
  scene.add(ceiling);

  // Mirror floor
  var geometry = new t.PlaneBufferGeometry(20000, 20000);
  var groundMirror = new Reflector(geometry, {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x111111,
    recursion: 1
  });
  groundMirror.position.y = 0.5;
  groundMirror.rotateX(-Math.PI / 2);
  scene.add(groundMirror);

  // Walls
  const wallMat = new t.TextureLoader().load('https://pbs.twimg.com/media/DQG5kVSXkAAb03B.jpg');
  wallMat.repeat.set(2, 2);
  wallMat.wrapT = t.RepeatWrapping;
  wallMat.wrapS = t.RepeatWrapping;
  const block = new t.CubeGeometry(128, 128 - 32, 128);
  let wallTexture = new t.MeshBasicMaterial({
    map: wallMat
  });

  // Create walls according to 2D map array
  for (let i = 0; i < map.length; i++) {
    for (let j = 0, m = map[i].length; j < m; j++) {
      if (map[i][j]) {
        let wall = new t.Mesh(block, wallTexture);
        wall.position.x = (i - map.length / 2) * 128;
        wall.position.y = 128 / 3 + 5;
        wall.position.z = (j - map.length / 2) * 128;
        scene.add(wall);
      }
    }
  }

  // Lighting
  const directionalLight1 = new t.DirectionalLight(0xF7EFBE, 0.7);
  directionalLight1.position.set(0.5, 1, 0.5);
  scene.add(directionalLight1);

  const directionalLight2 = new t.DirectionalLight(0xF7EFBE, 0.5);
  directionalLight2.position.set(-0.5, -1, -0.5);
  scene.add(directionalLight2);
  // Ambient lighting
  const allLight = new t.AmbientLight(0xffffff, 0.2);
  scene.add(allLight);

  let light = new t.PointLight(0xffffff, 0.8, 18);
  light.position.set(-3, 6, -3);
  light.castShadow = true;
  light.shadow.camera.near = 0.1;
  light.shadow.camera.far = 25;
  scene.add(light);

  // Hammer
  // var loader = new t.GLTFLoader();
  // loader.load("./assets/models/td.gltf", function(gltf) {
  //   models['hammer'] = gltf.scene;
  //   models['hammer'].position.y = 18;
  //   models['hammer'].scale.set(200, 200, 200);
  //   models['hammer'].rotation.set(0, 3.2, 0);
  //   models['hammer'].position.x = controls.getObject().position.x;
  //   models['hammer'].position.z = controls.getObject().position.z;
  //   scene.add(gltf.scene);

  // });
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