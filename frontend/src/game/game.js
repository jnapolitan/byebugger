import * as t from 'three';
import * as BugCaptureUtil from './utilities/bug_capture_utils';
import * as GameUtil from './utilities/game_utils';
import * as KeypressHandler from './keypressHandler';

import BSPTree from './mapGenerator';
import MTLLoader from './external_sources/MTLLoader';
import OBJLoader from './external_sources/OBJLoader';
import PointerLockControls from './PointerLockControls';

export default class Game {
  constructor() {
    this.WIDTH = window.innerWidth;
    this.HEIGHT = window.innerHeight;
    this.ASPECT = this.WIDTH / this.HEIGHT;
    this.UNITSIZE = 128; // In pixels
    this.AIMOVESPEED = 100;

    this.camera = new t.PerspectiveCamera(75, this.ASPECT, 1, 10000);
    this.controls = new PointerLockControls(this.camera);

    this.models = {}; // To house weapon objects

    this.renderer = new t.WebGLRenderer({
      antialias: false
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = t.BasicShadowMap;

    this.scene = new t.Scene();

    // Initialize constant for number of AI and 
    // global array variable to house AI objects JULIAN
    this.NUMAI = 100;
    this.ai = [];

    // Initialize global array variable to house AI animations JULIAN
    this.aiAnimations = [];

    // TODO Move AI logic
    this.setupAI = this.setupAI.bind(this);
    this.setupScene = this.setupScene.bind(this);
    this.init = this.init.bind(this);
    this.animate = this.animate.bind(this);

    // Set up camera listener for AI audio JULIAN
    // this.listener = new t.AudioListener();

    this.direction = new t.Vector3();
    this.keypresses = { forward: false, backward: false, left: false, right: false, canJump: true };
    this.prevTime = performance.now();
    this.velocity = new t.Vector3();

    // Creates a 2D grid of 1s and 0s, which will be used to render the 3D world
    this.map = new BSPTree().generateMap(64, 64);
  }

  setupScene() {
    GameUtil.sceneSetup(this.scene, this.map);
  
    // Loads and sets up player weapon
    const mtlLoader = new MTLLoader();
    mtlLoader.setPath("./assets/models/");

    mtlLoader.load('shotgun.mtl', (materials) => {
      materials.preload();

      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath("./assets/models/");
      objLoader.load('shotgun.obj', (object) => {
        this.models.weapon = object.clone();
        this.models.weapon.position.y = 18
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
    this.scene.fog = new t.FogExp2('black', 0.0015);
    this.camera.position.y = this.UNITSIZE * 0.1; // Ensures the player is above the floor
    GameUtil.checkSpawn(this.map, this.controls.getObject(), this.UNITSIZE);

    //////////////////////////////////////////////////////////////////
    //SUE: add crosshair for aiming hammer
    const material = new t.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 1
    });

    // crosshair size
    let x = 10;
    let y = 10;

    const geometry = new t.Geometry();

    // crosshair
    geometry.vertices.push(new t.Vector3(0, y, 0));
    geometry.vertices.push(new t.Vector3(0, -y, 0));
    geometry.vertices.push(new t.Vector3(0, 0, 0));
    geometry.vertices.push(new t.Vector3(x, 0, 0));
    geometry.vertices.push(new t.Vector3(-x, 0, 0));

    let crosshair = new t.Line(geometry, material);

    // place it in the center
    let crosshairPercentX = 50;
    let crosshairPercentY = 50;
    let crosshairPositionX = (crosshairPercentX / 100) * 2 - 1;
    let crosshairPositionY = (crosshairPercentY / 100) * 2 - 1;

    crosshair.position.x = crosshairPositionX * this.camera.aspect;
    crosshair.position.y = crosshairPositionY;

    crosshair.position.z = -0.3;

    this.camera.add(crosshair);

    // It may not look like it, but this adds the camera to the scene
    this.scene.add(this.controls.getObject());
    //////////////////////////////////////////////////////////////////

    //SUE: Used in conjunction w Raycaster - tracks mouse position (set mouse.x and mouse.y to pointer coordinates) so we know where to shoot
    // document.addEventListener('mousemove', onDocumentMouseMove, false);
    // TODO: Move the controls logic into another file if possible
    document.addEventListener('click', () => {
      this.controls.lock();
      //SUE: invoke swingHammer function upon clicking
      BugCaptureUtil.swingHammer(this.ai, this.controls.getObject());
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

    // Add the minimap
    // document.body.appendChild('<canvas id="radar" width="180" height="180"></canvas>');
  }

  animate() {
    requestAnimationFrame(this.animate);

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
        // audio.play();
        this.velocity.x -= this.velocity.x * 4;
      }
    }

    this.controls.getObject().translateX(this.velocity.x * delta);
    this.controls.getObject().translateY(this.velocity.y * delta);
    this.controls.getObject().translateZ(this.velocity.z * delta);

    if (this.models.weapon) {
      this.models.weapon.position.set(
        this.controls.getObject().position.x - Math.sin(this.controls.getObject().rotation.y + Math.PI / 6) * 0.75,
        18,
        this.controls.getObject().position.z + Math.cos(this.controls.getObject().rotation.y + Math.PI / 6) * 0.75
      );
      this.models.weapon.rotation.set(
        this.controls.getObject().rotation.x,
        this.controls.getObject().rotation.y - Math.PI,
        this.controls.getObject().rotation.z
      );
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
  }
}
