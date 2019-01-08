import * as t from 'three';

const createBullet = (controls, position, quaternion, activeBullets, scene, wepPos) => {
  const bulletGeo = new t.CubeGeometry(8, 8, 8);
  const bulletMat = new t.MeshPhongMaterial({
    emissive: 0xffffff,
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
