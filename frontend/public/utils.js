const getMapSector = (v) => {
  let UNITSIZE = 128;
  let x = Math.floor(((v.x + 20) + UNITSIZE / 2) / UNITSIZE + mapW / 2);
  let z = Math.floor(((v.z + 20) + UNITSIZE / 2) / UNITSIZE + mapW / 2);
  let x2 = Math.floor(((v.x - 20) + UNITSIZE / 2) / UNITSIZE + mapW / 2);
  let z2 = Math.floor(((v.z - 20) + UNITSIZE / 2) / UNITSIZE + mapW / 2);
  return {
    x: x,
    z: z,
    x2: x2,
    z2: z2
  };
};

//Get a random integer between lo and hi, inclusive.
//Assumes lo and hi are integers and lo is lower than hi.
const getRandBetween = (lo, hi) => {
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
};

const sceneSetup = (scene, map) => {
  ceiling = new t.GridHelper(20000, 600, '#00ccfd', '#00ccfd'); // size, divisions
  ceiling.position.y = 100;
  ceiling.position.x = Math.PI / 2;
  scene.add(ceiling);

  // Mirror floor
  var geometry = new t.PlaneBufferGeometry(20000, 20000);
  var groundMirror = new t.Reflector(geometry, {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x111111,
    recursion: 1
  });
  groundMirror.position.y = 0.5;
  groundMirror.rotateX(- Math.PI / 2);
  scene.add(groundMirror);

  // Walls
  const wallMat = new t.TextureLoader().load('https://pbs.twimg.com/media/DQG5kVSXkAAb03B.jpg');
  wallMat.repeat.set(2, 2);
  wallMat.wrapT = t.RepeatWrapping;
  wallMat.wrapS = t.RepeatWrapping;
  const block = new t.CubeGeometry(128, 128 - 32, 128);
  let wallTexture = new t.MeshToonMaterial({
    map: wallMat
  });

  // Create walls according to 2D map array
  for (let i = 0; i < map.length; i++) {
    for (let j = 0, m = map[i].length; j < m; j++) {
      if (map[i][j]) {
        let wall = new t.Mesh(block, wallTexture);
        wall.position.x = (i - map.length / 2) * 128;
        wall.position.y = 128 / 3 + 10;
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
function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) {
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
      if (this.currentTile == this.numberOfTiles)
        this.currentTile = 0;
      var currentColumn = this.currentTile % this.tilesHorizontal;
      texture.offset.x = currentColumn / this.tilesHorizontal;
      var currentRow = Math.floor(this.currentTile / this.tilesHorizontal);
      texture.offset.y = currentRow / this.tilesVertical;
    }
  };
}
