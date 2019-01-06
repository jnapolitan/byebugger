import { getMapSector } from './utilities/game_utils';

const drawMinimap = (cam, map, ai, UNITSIZE) => {
  return () => {
    var c = getMapSector(cam.position, map, UNITSIZE);
    var context = document.getElementById('radar').getContext('2d');
    context.font = '2px Georgia';
    for (var i = 0; i < map.length; i++) {
      for (var j = 0, m = map[i].length; j < m; j++) {
        var d = 0;
        for (var k = 0, n = ai.length; k < n; k++) {
          var e = getMapSector(ai[k].position, map, UNITSIZE);
          if (i === e.x && j === e.z) {
            d++;
          }
        }
        if (i === c.x && j === c.z && d === 0) {
          context.fillStyle = 'rgba(170, 51, 255, 1)';
          context.fillRect(i * 2, j * 2, (i + 1) * 2, (j + 1) * 2);
        } else if (i === c.x && j === c.z) {
          context.fillStyle = '#AA33FF';
          context.fillRect(i * 2, j * 2, (i + 1) * 2, (j + 1) * 2);
          context.fillStyle = '#000000';
          context.fillText('' + d, i * 2 + 8, j * 2 + 12);
        } else if (d > 0 && d < 10) {
          context.fillStyle = '#FF0000';
          context.fillRect(i * 2, j * 2, (i + 1) * 2, (j + 1) * 2);
          context.fillStyle = '#000000';
          context.fillText('' + d, i * 2 + 8, j * 2 + 12);
        } else if (map[i][j] > 0) {
          context.fillStyle = 'rgba(102, 102, 102, 1)';
          context.fillRect(i * 2, j * 2, (i + 1) * 2, (j + 1) * 2);
        } else {
          context.fillStyle = '#CCCCCC';
          context.fillRect(i * 2, j * 2, (i + 1) * 2, (j + 1) * 2);
        }
      }
    }
  }
};

export default drawMinimap;
