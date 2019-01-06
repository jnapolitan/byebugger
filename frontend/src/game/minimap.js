import { getMapSector } from './utilities/game_utils';

// This is a callback fn used to redraw the minimap every 1 second
const drawMinimap = (cam, map, ai, UNITSIZE) => {
  return () => {
    const mapCoords = getMapSector(cam.position, map, UNITSIZE);
    var context = document.getElementById('minimap').getContext('2d');

    // Iterate through the 2D representation of the world
    // check for player, bugs, walls, and empty spaces
    for (let x = 0; x < map.length; x++) {
      for (let y = 0; y < map.length; y++) {

        let isBug = false;
        for (let n = 0; n < ai.length; n++) {
          let bugCoords = getMapSector(ai[n].position, map, UNITSIZE);
          if (x === bugCoords.x && y === bugCoords.z) {
            isBug = true;
            break;
          }
        }

        // Colors every square on the minimap based on what the object is
        if (x === mapCoords.x && y === mapCoords.z) {
          // Player square is blue
          context.fillStyle = '#2011a2';
          context.fillRect(x * 4, y * 4, (x + 1) * 4, (y + 1) * 4);

        } else if (isBug) {
          // Bug squares are pink
          context.fillStyle = '#ff34b3';
          context.fillRect(x * 4, y * 4, (x + 1) * 4, (y + 1) * 4);

        } else if (map[x][y]) {
          // Wall squares are black
          context.fillStyle = '#111111';
          context.fillRect(x * 4, y * 4, (x + 1) * 4, (y + 1) * 4);

        } else {
          // Empty squares/spaces are white
          context.fillStyle = '#ffffff';
          context.fillRect(x * 4, y * 4, (x + 1) * 4, (y + 1) * 4);
        }
      }
    }
  }

};

export default drawMinimap;
