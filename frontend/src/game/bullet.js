import * as t from 'three';

const createBullet = (controls, position, quaternion, activeBullets, scene, wepPos, wepQuaternion) => {
  const bulletGeo = new t.SphereGeometry(5, 15, 15);
  const bulletMat = new t.MeshPhongMaterial({
    emissive: 0xffffff,
    emissiveIntensity: 1
  });

  let bullet = new t.Mesh(bulletGeo, bulletMat);

  bullet.position.copy(wepPos);
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
