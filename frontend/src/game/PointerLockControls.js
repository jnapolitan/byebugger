/**
 * @author mrdoob / http://mrdoob.com/
 * @author Mugen87 / https://github.com/Mugen87
 */

// The MIT License

// Copyright © 2010 - 2019 three.js authors

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files(the "Software"), to deal
//   in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and / or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import * as t from 'three';

function PointerLockControls(camera, domElement) {
  var scope = this;

  // SUE: Used to track whether player has caught a bug
  this.hasCaughtBug = false;

  this.domElement = domElement || document.body;
  this.isLocked = true;

  camera.rotation.set(0, 0, 0);

  var pitchObject = new t.Object3D();
  pitchObject.add(camera);

  var yawObject = new t.Object3D();
  yawObject.position.y = 10;
  yawObject.add(pitchObject);

  var PI_2 = Math.PI / 2;

  function onMouseMove(event) {
    if (scope.isLocked === false) return;

    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    yawObject.rotation.y -= movementX * 0.002;
    pitchObject.rotation.x -= movementY * 0.002;
    pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));
  }

  function onPointerlockChange() {
    if (document.pointerLockElement === scope.domElement) {
      scope.dispatchEvent({
        type: 'lock'
      });
      scope.isLocked = true;
    } else {
      scope.dispatchEvent({
        type: 'unlock'
      });
      scope.isLocked = false;
    }
  }

  function onPointerlockError() {
    console.error('THREE.PointerLockControls: Unable to use Pointer Lock API');
  }

  this.connect = function () {
    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('pointerlockchange', onPointerlockChange, false);
    document.addEventListener('pointerlockerror', onPointerlockError, false);
  };

  this.disconnect = function () {
    document.removeEventListener('mousemove', onMouseMove, false);
    document.removeEventListener('pointerlockchange', onPointerlockChange, false);
    document.removeEventListener('pointerlockerror', onPointerlockError, false);
  };

  this.dispose = function () {
    this.disconnect();
  };

  this.getObject = function () {
    return yawObject;
  };

  this.getDirection = function () {
    // assumes the camera itself is not rotated
    var direction = new t.Vector3(0, 0, -1);
    var rotation = new t.Euler(0, 0, 0, 'YXZ');

    return function (v) {
      rotation.set(pitchObject.rotation.x, yawObject.rotation.y, 0);
      v.copy(direction).applyEuler(rotation);
      return v;
    };
  }();

  this.lock = function () {
    this.domElement.requestPointerLock();
  };

  this.unlock = function () {
    document.exitPointerLock();
  };

  this.connect();
};

PointerLockControls.prototype = Object.create(t.EventDispatcher.prototype);
PointerLockControls.prototype.constructor = PointerLockControls;

export default PointerLockControls;
