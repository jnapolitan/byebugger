import * as t from 'three';

const createBullet = (controls, position, quaternion, activeBullets, scene) => {
  const bulletGeo = new t.SphereGeometry(1.5, 8, 4);
  const bulletMat = new t.MeshPhongMaterial({
    emissive: 0xFFD662,
    emissiveIntensity: 1
  });

  let bullet = new t.Mesh(bulletGeo, bulletMat);

  const emitter = new t.Object3D();
  emitter.position.copy(position);
  controls.getObject().add(emitter);
  bullet.position.copy(position);
  bullet.quaternion.copy(quaternion);

  bullet.active = true;
  setTimeout(() => {
    bullet.active = false;
    scene.remove(bullet);
  }, 1000);

  activeBullets.push(bullet);
  scene.add(bullet);
};

export default createBullet;
