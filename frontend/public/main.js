const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const ASPECT = WIDTH / HEIGHT;
const UNITSIZE = 128; // In pixels
const WALLHEIGHT = UNITSIZE;

// TODO: Remove this reference when we use the node module Three
const t = THREE;

// Set up the camera (the player's perspective)
var camera = new t.PerspectiveCamera(75, ASPECT, 1, 10000); // FOV, aspect, near, far
var canJump; // For later use when we handle the player's keyboard input
// Set up controls (custom first-person controls)
// TODO: This class needs to update the camera's position (right now it doesn't)
var controls = new t.PointerLockControls(camera);
// What we'll be using to render the scene - set antialias to false for better performance
var renderer = new t.WebGLRenderer({ antialias: false });
// Set up the scene (a world in Three.js terms). We'll add objects to the scene later.
var scene = new t.Scene();

// Variables for FPS controls
var direction = new t.Vector3();
var moveBackward = false;
var moveForward = false;
var moveLeft = false;
var moveRight = false;
var prevTime = performance.now();
var raycaster;
var velocity = new t.Vector3();

// Creates a 2D grid of 1s and 0s, which will be used to render the 3D world
var map = createMap();
for (let i = 0; i < map.length; i++) {
  for (let j = 0; j < map[0].length; j++) {
    if (j === 0 || i === 0 || j === map[0].length - 1 || i === map.length - 1) {
      map[i][j] = 1;
    }
  }
}
var mapW = map.length;


////// Set up the environment //////
const setupScene = () => {
  const units = mapW;

  // Floor and ceiling
  // TODO: Readjust plane sizing and replace all textures
  const floorCeilMat = new t.TextureLoader().load('https://pbs.twimg.com/media/DQG5kVSXkAAb03B.jpg');
  // It's possible to use max anisotropy, but performance might suffer
  floorCeilMat.anisotropy = 32;
  floorCeilMat.repeat.set(100, 100);
  floorCeilMat.wrapT = t.RepeatWrapping;
  floorCeilMat.wrapS = t.RepeatWrapping;
  // PlaneBufferGeometry is a lower memory alternative to PlaneGeometry
  const floorCeilGeo = new t.PlaneBufferGeometry(10000, 10000);
  let texture = new t.MeshLambertMaterial({
    map: floorCeilMat
  });

  // Three.Mesh takes in 1. geometry and 2. material/texture
  let floor = new t.Mesh(floorCeilGeo, texture);
  let ceiling = new t.Mesh(floorCeilGeo, texture);

  floor.position.y = -10;
  floor.rotation.x = Math.PI / -2;

  // Rotation makes it so that the ceiling mirrors the floor on the opposite side
  ceiling.position.y = 100;
  ceiling.rotation.x = Math.PI / 2;

  // Add the floor and ceiling to the world
  scene.add(floor);
  scene.add(ceiling);

  // Walls - note MeshLambertMaterial is affected by lighting
  // TODO: Replace texture
  const wallMat = new t.TextureLoader().load('https://pbs.twimg.com/media/DQG5kVSXkAAb03B.jpg');
  wallMat.repeat.set(2, 2);
  wallMat.wrapT = t.RepeatWrapping;
  wallMat.wrapS = t.RepeatWrapping;
  const block = new t.CubeGeometry(WALLHEIGHT, WALLHEIGHT, WALLHEIGHT);
  let wallTexture = new t.MeshLambertMaterial({
    map: wallMat
  });

  // Iterate through the 2D map I computed above and place the walls where needed
  for (let i = 0; i < mapW; i++) {
    for (let j = 0, m = map[i].length; j < m; j++) {
      if (map[i][j]) {
        let wall = new t.Mesh(block, wallTexture);
        wall.position.x = (i - units / 2) * UNITSIZE;
        wall.position.y = WALLHEIGHT / 3;
        wall.position.z = (j - units / 2) * UNITSIZE;
        scene.add(wall);
      }
    }
  }

  // Lighting
  // Note that light1 and light2 are required. Both lights
  // face away from each other - without one, one side of
  // the wall will be pitch black from the player's perspective
  const directionalLight1 = new t.DirectionalLight(0xF7EFBE, 0.7);
  directionalLight1.position.set(0.5, 1, 0.5);
  scene.add(directionalLight1);
  const directionalLight2 = new t.DirectionalLight(0xF7EFBE, 0.5);
  directionalLight2.position.set(-0.5, -1, -0.5);
  scene.add(directionalLight2);
  // TODO: Remove temporary ambient lighting
  const allLight = new t.AmbientLight('purple');
  scene.add(allLight);
}

// Setup the game
function init() {
  scene.fog = new t.FogExp2('black', 0.0020);
  camera.position.y = UNITSIZE * .1; // Ensures the player is above the floor
  // It may not look like it, but this adds the camera to the scene
  scene.add(controls.getObject());

  // TODO: Move the controls logic into another file if possible
  document.addEventListener('click', function () {
    controls.lock();
  }, false);

  var onKeyDown = function (event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = true;
        break;
      case 37: // left
      case 65: // a
        moveLeft = true;
        break;
      case 40: // down
      case 83: // s
        moveBackward = true;
        break;
      case 39: // right
      case 68: // d
        moveRight = true;
        break;
      case 32: // space
        if (canJump === true) velocity.y += 350;
        canJump = false;
        break;
      default:
        break;
    }
  };

  var onKeyUp = function (event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = false;
        break;
      case 37: // left
      case 65: // a
        moveLeft = false;
        break;
      case 40: // down
      case 83: // s
        moveBackward = false;
        break;
      case 39: // right
      case 68: // d
        moveRight = false;
        break;
      default:
        break;
    }
  };

  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);
  // TODO: Remove raycaster if there's no good use for it
  raycaster = new t.Raycaster(new t.Vector3(), new t.Vector3(0, - 1, 0), 0, 10);

  // Add objects to the world
  setupScene();

  // TODO: Maybe move this to where renderer is instantiated for more coherent code
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Add the canvas to the document
  renderer.setClearColor('#D6F1FF'); // Sky color (if the sky was visible)
  document.body.appendChild(renderer.domElement);

  // Add the minimap
  $('body').append('<canvas id="radar" width="180" height="180"></canvas>');
}

// Helper function for browser frames
function animate() {
  requestAnimationFrame(animate);

  // TODO: Not important for now. Remove this if there's no good use for it.
  raycaster.ray.origin.copy(controls.getObject().position);
  raycaster.ray.origin.y -= 10;

  // Controls/movement related logic
  var time = performance.now();
  var delta = (time - prevTime) / 1000;
  velocity.x -= velocity.x * 10.0 * delta;
  velocity.z -= velocity.z * 10.0 * delta;
  velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
  direction.z = Number(moveForward) - Number(moveBackward);
  direction.x = Number(moveLeft) - Number(moveRight);
  direction.normalize(); // Ensures consistent movement in all directions

  // TODO: Update the camera position
  if (moveForward || moveBackward) velocity.z -= direction.z * 1200.0 * delta;
  if (moveLeft || moveRight) velocity.x -= direction.x * 1200.0 * delta;
  controls.getObject().translateX(velocity.x * delta);
  controls.getObject().translateY(velocity.y * delta);
  controls.getObject().translateZ(velocity.z * delta);

  if (controls.getObject().position.y < 10) {
    velocity.y = 0;
    controls.getObject().position.y = 10;
    canJump = true;
  }
  prevTime = time;

  // Deals with what portion of the scene the player sees
  renderer.render(scene, camera);
}

////// Helper function(s) //////
function getMapSector(v) {
  var x = Math.floor((v.x + UNITSIZE / 2) / UNITSIZE + mapW / 2);
  var z = Math.floor((v.z + UNITSIZE / 2) / UNITSIZE + mapW / 2);
  return { x: x, z: z };
}

// Creates the minimap
// TODO: Clean up this code however possible before deployment
function drawMinimap() {
  var ai = [];
  var c = getMapSector(camera.position), context = document.getElementById('radar').getContext('2d');
  context.font = '10px Georgia';
  for (var i = 0; i < mapW; i++) {
    for (var j = 0, m = map[i].length; j < m; j++) {
      var d = 0;
      for (var k = 0, n = ai.length; k < n; k++) {
        var e = getMapSector(ai[k].position);
        if (i === e.x && j === e.z) {
          d++;
        }
      }
      if (i === c.x && j === c.z && d === 0) {
        context.fillStyle = 'rgba(170, 51, 255, 1)';
        context.fillRect(i * 7, j * 7, (i + 1) * 7, (j + 1) * 7);
      }
      else if (i === c.x && j === c.z) {
        context.fillStyle = '#AA33FF';
        context.fillRect(i * 7, j * 7, (i + 1) * 7, (j + 1) * 7);
        context.fillStyle = '#000000';
        context.fillText('' + d, i * 7 + 8, j * 7 + 12);
      }
      else if (d > 0 && d < 10) {
        context.fillStyle = '#FF0000';
        context.fillRect(i * 7, j * 7, (i + 1) * 7, (j + 1) * 7);
        context.fillStyle = '#000000';
        context.fillText('' + d, i * 7 + 8, j * 7 + 12);
      }
      else if (map[i][j] > 0) {
        context.fillStyle = 'rgba(102, 102, 102, 1)';
        context.fillRect(i * 7, j * 7, (i + 1) * 7, (j + 1) * 7);
      }
      else {
        context.fillStyle = '#CCCCCC';
        context.fillRect(i * 7, j * 7, (i + 1) * 7, (j + 1) * 7);
      }
    }
  }
}

// Creates start screen
// TODO: Refactor this into a React component and move it to a different file
$(document).ready(() => {
  $('body').append('<div class="start-screen-container"></div>');
  $('.start-screen-container').append('<img class="logo" src="https://static1.textcraft.net/data1/4/7/47ec57212c1063d986640e55e8fffed17cc1603fda39a3ee5e6b4b0d3255bfef95601890afd80709da39a3ee5e6b4b0d3255bfef95601890afd8070911e0e0a6c9273f3b1ad5cf500cddc6e2.png"></img>');
  $('.start-screen-container').append('<button class="start-button">START</button>');
  $('.start-screen-container').one('click', function (e) {
    e.preventDefault();
    $(this).fadeOut();
    init();
    $('body').append('<img class="floor-title" src="https://static1.textcraft.net/data1/c/d/cd29149206b0527bd8c02af9bbf3d1bab8882c74da39a3ee5e6b4b0d3255bfef95601890afd80709da39a3ee5e6b4b0d3255bfef95601890afd807098626b16c099e53d50b4b4e9e7a56bd90.png"></img>');
    setInterval(() => {
      $('.floor-title').fadeOut(3000);
    }, 1000);
    setInterval(drawMinimap, 1000);
    animate();
  });
});
