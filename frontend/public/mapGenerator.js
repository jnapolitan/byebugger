// Helper for 2D grid
function createGrid(num, dimensions) {
  const grid = [];
  for (let i = 0; i < dimensions; i++) {
    grid.push([]);
    for (let j = 0; j < dimensions; j++) {
      grid[i].push(num);
    }
  }
  return grid
}

function createMap() {
  let dimensions = 20, // width and height of the map
    maxTunnels = 50, // max number of tunnels possible
    maxLength = 20, // max length each tunnel can have
    map = createGrid(1, dimensions),
    currentRow = Math.floor(Math.random() * dimensions), // our current row - start at a random spot
    currentColumn = Math.floor(Math.random() * dimensions), // our current column - start at a random spot
    directions = [[-1, 0], [1, 0], [0, -1], [0, 1]], // array to get a random direction from (left,right,up,down)
    lastDirection = [], // save the last direction we went
    randomDirection; // next turn/direction - holds a value from directions

  // lets create some tunnels - while maxTunnels, dimentions, and maxLength  is greater than 0.
  while (maxTunnels && dimensions && maxLength) {
    // lets get a random direction - until it is a perpendicular to our lastDirection
    // if the last direction = left or right,
    // then our new direction has to be up or down,
    // and vice versa
    do {
      randomDirection = directions[Math.floor(Math.random() * directions.length)];
    } while ((randomDirection[0] === -lastDirection[0] && randomDirection[1] === -lastDirection[1]) || (randomDirection[0] === lastDirection[0] && randomDirection[1] === lastDirection[1]));

    var randomLength = Math.ceil(Math.random() * maxLength),
      tunnelLength = 0;

    // lets loop until our tunnel is long enough or until we hit an edge
    while (tunnelLength < randomLength) {
      // break the loop if it is going out of the map
      if (((currentRow === 0) && (randomDirection[0] === -1)) ||
        ((currentColumn === 0) && (randomDirection[1] === -1)) ||
        ((currentRow === dimensions - 1) && (randomDirection[0] === 1)) ||
        ((currentColumn === dimensions - 1) && (randomDirection[1] === 1))) {
        break;
      } else {
        map[currentRow][currentColumn] = 0;
        currentRow += randomDirection[0];
        currentColumn += randomDirection[1];
        tunnelLength++;
      }
    }

    if (tunnelLength) {
      lastDirection = randomDirection;
      maxTunnels--;
    }
  }
  return map;
};
