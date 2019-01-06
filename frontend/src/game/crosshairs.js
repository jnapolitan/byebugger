import * as t from 'three';

// SUE: Add crosshairs for aiming with weapon
const createCrosshairs = (camera) => {
  const material = new t.LineBasicMaterial({
    color: 0xffffff,
    linewidth: 1
  });

  // Crosshair size and shape
  const x = 10;
  const y = 10;
  const geometry = new t.Geometry();
  geometry.vertices.push(new t.Vector3(0, y, 0));
  geometry.vertices.push(new t.Vector3(0, -y, 0));
  geometry.vertices.push(new t.Vector3(0, 0, 0));
  geometry.vertices.push(new t.Vector3(x, 0, 0));
  geometry.vertices.push(new t.Vector3(-x, 0, 0));

  const crosshairs = new t.Line(geometry, material);
  // Place in the center of the center
  let crosshairPositionX = (50 / 100) * 2 - 1;
  let crosshairPositionY = (50 / 100) * 2 - 1;

  crosshairs.position.x = crosshairPositionX * camera.aspect;
  crosshairs.position.y = crosshairPositionY;

  crosshairs.position.z = -0.3;

  camera.add(crosshairs);
};

export default createCrosshairs;
