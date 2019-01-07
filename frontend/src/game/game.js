import * as t from 'three';
import * as BugCaptureUtil from './utilities/bug_capture_utils';
import * as GameUtil from './utilities/game_utils';
import * as KeypressHandler from './keypressHandler';

import BSPTree from './mapGenerator';
import createCrosshairs from './crosshairs';
import drawMinimap from './minimap';
import MTLLoader from './external_sources/MTLLoader';
import OBJLoader from './external_sources/OBJLoader';
import PointerLockControls from './PointerLockControls';
import Stats from 'stats-js';

export default class Game {
  constructor(store) {
    // TODO: Remove before production
    this.stats = new Stats();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);

    this.WIDTH = window.innerWidth;
    this.HEIGHT = window.innerHeight;
    this.ASPECT = this.WIDTH / this.HEIGHT;
    this.UNITSIZE = 128; // Pixels
    // SUE: For bug-catching
    this.AIMOVESPEED = 100;

    this.camera = new t.PerspectiveCamera(75, this.ASPECT, 1, 10000); // Player view
    this.controls = new PointerLockControls(this.camera); // First person controls
    this.renderer = new t.WebGLRenderer({
      antialias: false // Less work for the graphic loader = better performance
    });

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = t.BasicShadowMap;

    this.models = {}; // To house weapon objects

    this.scene = new t.Scene();

    // JULIAN: Sets number of bugs on the map
    this.NUMAI = 30;
    this.ai = [];
    this.aiAnimations = []; // Bug animations are stored here

    // JULIAN: Set initial player stats
    this.gameOver = false;

    this.setupAI = this.setupAI.bind(this);
    this.setupScene = this.setupScene.bind(this);
    this.init = this.init.bind(this);
    this.animate = this.animate.bind(this);
    // Set up camera listener for AI audio JULIAN
    // this.listener = new t.AudioListener();

    // ERIC: For controls
    this.direction = new t.Vector3();
    this.keypresses = { forward: false, backward: false, left: false, right: false, canJump: true };
    this.prevTime = performance.now();
    this.velocity = new t.Vector3();

    // Creates a 2D grid of 1s and 0s, which will be used to render the 3D world
    this.map = new BSPTree().generateMap(64, 64);

    // Dispatch testing
    this.store = store;
  }

  setupScene() {
    GameUtil.sceneSetup(this.scene, this.map); // Sets up the game environment
    // Loads and sets up player weapon
    const mtlLoader = new MTLLoader();

    mtlLoader.setPath("./assets/models/");
    mtlLoader.load('pistol.mtl', (materials) => {
      materials.preload();

      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath("./assets/models/");
      objLoader.load('pistol.obj', (object) => {
        this.models.weapon = object.clone();
        this.models.weapon.position.y = 16
        this.models.weapon.scale.set(200, 200, 200);
        this.models.weapon.rotation.set(0, 3.2, 0);
        this.scene.add(this.models.weapon);
      });
    });
  }

  setupAI() {
    for (var i = 0; i < this.NUMAI; i++) {
      GameUtil.addAI(this.controls.getObject(), this.map, this.scene, this.ai, this.aiAnimations);
    }
  }

  init() {
    let cam = this.controls.getObject();
    let map = this.map;
    let ai = this.ai;
    setInterval(drawMinimap(cam, map, ai, 128), 1000);

    this.scene.fog = new t.FogExp2('black', 0.0015);
    this.camera.position.y = this.UNITSIZE * 0.1; // Ensures the player is above the floor
    GameUtil.checkSpawn(this.map, this.controls.getObject(), this.UNITSIZE);

    // It may not look like it, but this adds the camera to the scene
    this.scene.add(this.controls.getObject());

    // SUE: Add crosshair for weapon
    createCrosshairs(this.camera);

    // SUE: Used in conjunction w Raycaster - tracks mouse position (set mouse.x and mouse.y to pointer coordinates) so we know where to shoot
    // document.addEventListener('mousemove', onDocumentMouseMove, false);
    // TODO: Move the controls logic into another file if possible
    document.addEventListener('click', () => {
      this.controls.lock();
      const audio1 = new Audio('./assets/sounds/gunshot1.mp3');
      const audio2 = new Audio('./assets/sounds/gunshot2.mp3');
      if (Math.random() > 0.5) {
        audio1.play();
      } else {
        audio2.play();
      }

      // SUE: invoke swingHammer function upon clicking
      BugCaptureUtil.swingHammer(this.ai, this.controls.getObject(), this.store);
    }, false);

    document.addEventListener('keydown', (e) => KeypressHandler.onKeyDown(e, this.keypresses, this.velocity), false);
    document.addEventListener('keyup', (e) => KeypressHandler.onKeyUp(e, this.keypresses), false);

    // Add objects to the world
    this.setupScene();
    // Add buggers
    this.setupAI();

    // Add the canvas to the document
    this.renderer.setClearColor('#111111', 1); // Sky color (if the sky was visible)
    document.body.appendChild(this.renderer.domElement);
    // TODO: Is there a cleaner way to do this?
    const minimap = document.createElement('canvas');
    minimap.setAttribute('id', 'minimap')
    minimap.setAttribute('width', 220);
    minimap.setAttribute('height', 220);
    document.body.appendChild(minimap);
  }

  animate() {
    requestAnimationFrame(this.animate);

    this.stats.begin(); // TODO: Remove before production
    // Controls/movement related logic
    const time = performance.now();
    const delta = (time - this.prevTime) / 1000;
    this.velocity.x -= this.velocity.x * 10.0 * delta;
    this.velocity.z -= this.velocity.z * 10.0 * delta;
    this.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
    this.direction.z = Number(this.keypresses.forward) - Number(this.keypresses.backward);
    this.direction.x = Number(this.keypresses.left) - Number(this.keypresses.right);
    this.direction.normalize(); // Ensures consistent movement in all directions

    const camPos = this.controls.getObject().position;

    const audio = new Audio('./assets/sounds/oof.mp3');

    if (this.keypresses.forward || this.keypresses.backward) {
      this.velocity.z -= this.direction.z * 1200.0 * delta;
      if (GameUtil.checkWallCollision(camPos, this.map, this.UNITSIZE)) {
        audio.play();
        this.velocity.z -= this.velocity.z * 4;
      }
    }

    if (this.keypresses.left || this.keypresses.right) {
      this.velocity.x -= this.direction.x * 1200.0 * delta;
      if (GameUtil.checkWallCollision(camPos, this.map, this.UNITSIZE)) {
        audio.play();
        this.velocity.x -= this.velocity.x * 4;
      }
    }

    this.controls.getObject().translateX(this.velocity.x * delta);
    this.controls.getObject().translateY(this.velocity.y * delta);
    this.controls.getObject().translateZ(this.velocity.z * delta);

    if (this.models.weapon) {
      this.models.weapon.position.x = this.controls.getObject().position.x;
      this.models.weapon.position.z = this.controls.getObject().position.z;
      // this.models.weapon.rotation.copy(this.controls.getObject().rotation);
      this.models.weapon.rotation.x = this.controls.getObject().rotation.x;
      this.models.weapon.rotation.y = this.controls.getObject().rotation.y + (Math.PI / 2) * -1.9;
      this.models.weapon.rotation.z = this.controls.getObject().rotation.z;
      this.models.weapon.updateMatrix();
      this.models.weapon.translateX(-17);
      this.models.weapon.translateZ(14);
      // this.models.weapon.rotation.x -= Math.PI / 4;
    }

    if (this.controls.getObject().position.y < 10) {
      this.velocity.y = 0;
      this.controls.getObject().position.y = 10;
      this.keypresses.canJump = true;
    }
    this.prevTime = time;

    // Animate AI
    this.aiAnimations.forEach(animation => {
      animation.update(Math.floor(Math.random() * 1800) * delta);
    });

    // Update AI.
    const aispeed = delta * this.AIMOVESPEED;
    for (let i = this.ai.length - 1; i >= 0; i--) {
      let aiObj = this.ai[i];

      // Generate new random coord values 
      let r = Math.random();
      if (r > 0.995) {
        aiObj.randomX = Math.random() * 2 - 1;
        aiObj.randomZ = Math.random() * 2 - 1;
      }

      // Attempt moving bugger across the axis at aispeed
      aiObj.translateX(aispeed * aiObj.randomX);
      aiObj.translateZ(aispeed * aiObj.randomZ);

      // Check if trajectory is leading off the map or hitting a wall
      // Reverse trajectory if true
      let aiPos = GameUtil.getMapSector(aiObj.position, this.map, this.UNITSIZE);

      // TODO: This is a potential fix for undefined errors
      if (this.map[aiPos.x]) {
        if (this.map[aiPos.x][aiPos.z] || aiPos.x < 0
          || aiPos.x >= this.map.length || GameUtil.checkWallCollision(aiObj.position, this.map, this.UNITSIZE)) {
          aiObj.translateX(-2 * aispeed * aiObj.randomX);
          aiObj.translateZ(-2 * aispeed * aiObj.randomZ);
          aiObj.randomX = Math.random() * 2 - 1;
          aiObj.randomZ = Math.random() * 2 - 1;
        }
      }

      // Check if bug is off the map, and if true remove and add a new one
      if (aiPos.x < -1 || aiPos.x > this.map.length || aiPos.z < -1 || aiPos.z > this.map[0].length) {
        this.ai.splice(i, 1);
        this.scene.remove(aiObj);
        GameUtil.addAI(camPos, this.map, this.scene, this.ai, this.aiAnimations);
      }
    }

    // Deals with what portion of the scene the player sees
    this.renderer.render(this.scene, this.camera);
    this.stats.end(); // TODO: Remove before production
  }
}
