import * as t from 'three';
import PointerLockControls from './PointerLockControls';
import BSPTree from './BSPTree';
import MTLLoader from './MTLLoader';
import OBJLoader from './OBJLoader';
import * as GameUtil from './game_utils';

export default class Game {
  constructor() {
    // this.player = player;
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

    // Set up camera listener for AI audio JULIAN
    // this.listener = new t.AudioListener();

    this.direction = new t.Vector3();
    this.moveBackward = false;
    this.moveForward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.prevTime = performance.now();
    this.velocity = new t.Vector3();

    // Creates a 2D grid of 1s and 0s, which will be used to render the 3D world
    //SUE: changed map size (originally 100, 100)
    this.map = new BSPTree().generateLevel(100, 100);
    this.mapW = this.map.length;
    this.mapH = this.map[0].length;
    console.log('we made it to the game');
  }

  setupScene() {
    GameUtil.sceneSetup(this.scene, this.map);

    // player weapon
    let gun;
    var mtlLoader = new MTLLoader();
    mtlLoader.setPath("./assets/models/");
    mtlLoader.load('shotgun.mtl', function (materials) {
      materials.preload();

      var objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath("./assets/models/");
      objLoader.load('shotgun.obj', function (object) {

        gun = object;
        this.models.gun = gun.clone();
        this.models.gun.position.y = 18
        this.models.gun.scale.set(200, 200, 200);
        this.models.gun.rotation.set(0, 3.2, 0);
        this.scene.add(this.models.gun);
      });
    });
  }

  setupAI() {
    for (var i = 0; i < this.NUMAI; i++) {
      GameUtil.addAI(this.controls.getObject(), this.map, this.scene, this.ai, this.aiAnimations);
    }
  }
}