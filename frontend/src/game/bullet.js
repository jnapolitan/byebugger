import * as t from 'three';

const createBullet = (controls, position, quaternion, activeBullets, scene, wepPos) => {
  const bulletGeo = new t.SphereGeometry(8, 16, 12);
  bulletGeo.applyMatrix(new t.Matrix4().makeScale(1.0, 1.2, 1.5));
  const bulletMat = new t.MeshPhongMaterial({
    emissive: 'yellow',
    emissiveIntensity: 2
  });

  let bullet = new t.Mesh(bulletGeo, bulletMat);

  wepPos.z += 10; 
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
