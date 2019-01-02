// Important variables
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const ASPECT = WIDTH / HEIGHT;
const UNITSIZE = 128;
const WALLHEIGHT = UNITSIZE;

// Alias THREE as t
const t = THREE;

var cam = new t.PerspectiveCamera(75, ASPECT, 1, 10000);
var canJump;
var controls = new t.PointerLockControls(cam);
var renderer = new t.WebGLRenderer({ antialias: false });
var scene = new t.Scene();

// For FPS controls
var raycaster;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var prevTime = performance.now();
var velocity = new t.Vector3();
var direction = new t.Vector3();

var map = createMap();
for (let i = 0; i < map.length; i++) {
  for (let j = 0; j < map[0].length; j++) {
    if (j === 0 || i === 0 || j === map[0].length - 1 || i === map.length - 1) {
      map[i][j] = 1;
    }
  }
}
var mapW = map.length;

// Set up environment
const setupScene = () => {
  const units = mapW;

  // Floor and ceiling
  // TODO: Readjust plane sizing and replace all textures
  const floorCeilMat = new t.TextureLoader().load('https://pbs.twimg.com/media/DQG5kVSXkAAb03B.jpg');
  // Possible to use max ansi, but performance might suffer
  floorCeilMat.anisotropy = 32;
  floorCeilMat.repeat.set(100, 100);
  floorCeilMat.wrapT = t.RepeatWrapping;
  floorCeilMat.wrapS = t.RepeatWrapping;
  // PlaneBufferGeometry is a lower memory alternative to PlaneGeometry
  const floorCeilGeo = new t.PlaneBufferGeometry(10000, 10000);
  // TODO: Try out different types of material
  let texture = new t.MeshLambertMaterial({
    map: floorCeilMat
  });

  let floor = new t.Mesh(floorCeilGeo, texture);
  let ceiling = new t.Mesh(floorCeilGeo, texture);

  floor.position.y = -10;
  floor.rotation.x = Math.PI / -2;
  ceiling.position.y = 100;
  ceiling.rotation.x = Math.PI / 2;

  scene.add(floor);
  scene.add(ceiling);

  // Walls
  // MeshBasic is unaffected by lighting, unlike MeshLambert and MeshPhong
  const cube = new t.CubeGeometry(UNITSIZE, UNITSIZE, UNITSIZE);
  let wallMat = new t.TextureLoader().load('https://pbs.twimg.com/media/DQG5kVSXkAAb03B.jpg');
  wallMat.repeat.set(2, 2);
  wallMat.wrapT = t.RepeatWrapping;
  wallMat.wrapS = t.RepeatWrapping;
  wallMat = new t.MeshToonMaterial({ map: wallMat });
  for (let i = 0; i < mapW; i++) {
    for (let j = 0, m = map[i].length; j < m; j++) {
      if (map[i][j]) {
        let wall = new t.Mesh(cube, wallMat);
        wall.position.x = (i - units / 2) * UNITSIZE;
        wall.position.y = WALLHEIGHT / 3;
        wall.position.z = (j - units / 2) * UNITSIZE;
        scene.add(wall);
      }
    }
  }

  // Lighting
  // Light1 and Light2 face away from each other
  const directionalLight1 = new t.DirectionalLight(0xF7EFBE, 0.7);
  directionalLight1.position.set(0.5, 1, 0.5);
  scene.add(directionalLight1);
  const directionalLight2 = new t.DirectionalLight(0xF7EFBE, 0.5);
  directionalLight2.position.set(-0.5, -1, -0.5);
  scene.add(directionalLight2);
  var light = new t.AmbientLight('purple');
  scene.add(light);
}

// Setup game
function init() {
  // scene = new t.Scene();
  scene.fog = new t.FogExp2('black', 0.0020);
  // Always need to set up camera so we know the perspective from where we render our screen
  cam.position.y = UNITSIZE * .1; // Raise the camera off the ground
  // Camera moves with player controls
  scene.add(controls.getObject());

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
  raycaster = new t.Raycaster(new t.Vector3(), new t.Vector3(0, - 1, 0), 0, 10);

  // Add objects to the world
  setupScene();

  // TODO: setting antialias to false seems to increase performance - why?
  // renderer = new t.WebGLRenderer({ antialias: false });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight); // Give the renderer the canvas size

  // Add the canvas to the document
  renderer.setClearColor('#D6F1FF');
  document.body.appendChild(renderer.domElement);

  // Add the radar
  $('body').append('<canvas id="radar" width="180" height="180"></canvas>');
}

// Helper function for browser frames
function animate() {
  requestAnimationFrame(animate);

  raycaster.ray.origin.copy(controls.getObject().position);
  raycaster.ray.origin.y -= 10;

  var time = performance.now();
  var delta = (time - prevTime) / 1000;
  velocity.x -= velocity.x * 10.0 * delta;
  velocity.z -= velocity.z * 10.0 * delta;
  velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
  direction.z = Number(moveForward) - Number(moveBackward);
  direction.x = Number(moveLeft) - Number(moveRight);
  direction.normalize(); // this ensures consistent movements in all directions
  // TODO: Update camera position
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

  renderer.render(scene, cam);
}

// Helper functions
function getMapSector(v) {
  var x = Math.floor((v.x + UNITSIZE / 2) / UNITSIZE + mapW / 2);
  var z = Math.floor((v.z + UNITSIZE / 2) / UNITSIZE + mapW / 2);
  return { x: x, z: z };
}

function drawRadar() {
  var ai = [];
  var c = getMapSector(cam.position), context = document.getElementById('radar').getContext('2d');
  context.font = '10px Helvetica';
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

// Start screen
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
    setInterval(drawRadar, 1000);
    animate();
  });
});
