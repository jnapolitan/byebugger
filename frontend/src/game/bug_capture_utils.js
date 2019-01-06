import * as t from 'three';

// SUE

export const checkLineIntersection = (line1start, line1end, line2start, line2end) => {
  let det, gamma, lambda;
  const a = line1start.x;
  const b = line1start.z;
  const c = line1end.x;
  const d = line1end.z;
  const p = line2start.x;
  const q = line2start.z;
  const r = line2end.x;
  const s = line2end.z;
  det = (c - a) * (s - q) - (r - p) * (d - b);
  if (det === 0) {
    return false;
  } else {
    lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
  }
};

export const checkIfBugHit = (playerPosition, hammerEnd, bugCenterPosition) => {
  //find coordinates for vertices of bug from bug's center (numbering done in clockwise direction from bottom left corner)
  const vertex1 = {
    x: bugCenterPosition.x - 20,
    z: bugCenterPosition.z - 20
  };
  const vertex2 = {
    x: bugCenterPosition.x + 20,
    z: bugCenterPosition.z - 20
  };
  const vertex3 = {
    x: bugCenterPosition.x + 20,
    z: bugCenterPosition.z + 20
  };
  const vertex4 = {
    x: bugCenterPosition.x - 20,
    z: bugCenterPosition.z + 20
  };

  //check if any of the rectangle's sides intersect with line from player's position to hammer's end
  if (checkLineIntersection(playerPosition, hammerEnd, vertex1, vertex2) ||
    checkLineIntersection(playerPosition, hammerEnd, vertex2, vertex3) ||
    checkLineIntersection(playerPosition, hammerEnd, vertex3, vertex4) ||
    checkLineIntersection(playerPosition, hammerEnd, vertex4, vertex1)) {
    return true;
  } else {
    return false;
  }
};

export const swingHammer = (ai, cam) => {
  //NOTE: bug offset ~= 20 (from center)

  //determine direction of the swing 
  //  1) position of player 2) point of click => these two will determine direction of swing vector
  let player = cam;
  let playerPosition = player.position;
  const vector = new t.Vector3();
  cam.getWorldDirection(vector);
  // swing vector has a fixed length (equal to hammer length)
  const hammerLength = 150;
  vector.setLength(hammerLength);
  // set camera-direction vector's origin to player's position
  const playerPositionX = playerPosition.x;
  const playerPositionZ = playerPosition.z;
  const vectorX = vector.x * -1;
  const vectorZ = vector.z * -1;
  const hammerVectorX = playerPositionX + vectorX;
  const hammerVectorZ = playerPositionZ + vectorZ;
  const hammerHeadPosition = {
    x: hammerVectorX,
    z: hammerVectorZ
  };

  // console.log(vector);
  // if bug is in direction of vector and hammerLength away - collision = true
  ai.forEach(bug => {
    if (checkIfBugHit(playerPosition, hammerHeadPosition, bug.position)) {
      console.log("SPLAT");
    }
  });
};