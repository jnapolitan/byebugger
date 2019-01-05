const getMapSector = (v) => {
  let UNITSIZE = 128;
  let x = Math.floor(((v.x + 20) + UNITSIZE / 2) / UNITSIZE + mapW / 2);
  let z = Math.floor(((v.z + 20) + UNITSIZE / 2) / UNITSIZE + mapW / 2);
  let x2 = Math.floor(((v.x - 20) + UNITSIZE / 2) / UNITSIZE + mapW / 2);
  let z2 = Math.floor(((v.z - 20) + UNITSIZE / 2) / UNITSIZE + mapW / 2);
  return {
    x: x,
    z: z,
    x2: x2,
    z2: z2
  };
};

// Texture animator for AI utilizing sprites 
// Sprite frames are animated during the update function using the specified duration
function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) {
  // note: texture passed by reference, will be updated by the update function.

  this.tilesHorizontal = tilesHoriz;
  this.tilesVertical = tilesVert;
  // how many images does this spritesheet contain?
  //  usually equals tilesHoriz * tilesVert, but not necessarily,
  //  if there at blank tiles at the bottom of the spritesheet. 
  this.numberOfTiles = numTiles;
  texture.wrapS = texture.wrapT = t.RepeatWrapping;
  texture.repeat.set(1 / this.tilesHorizontal, 1 / this.tilesVertical);

  // how long should each image be displayed?
  this.tileDisplayDuration = tileDispDuration;

  // how long has the current image been displayed?
  this.currentDisplayTime = 0;

  // which image is currently being displayed?
  this.currentTile = 0;

  this.update = function (milliSec) {
    this.currentDisplayTime += milliSec;
    while (this.currentDisplayTime > this.tileDisplayDuration) {
      this.currentDisplayTime -= this.tileDisplayDuration;
      this.currentTile++;
      if (this.currentTile == this.numberOfTiles)
        this.currentTile = 0;
      var currentColumn = this.currentTile % this.tilesHorizontal;
      texture.offset.x = currentColumn / this.tilesHorizontal;
      var currentRow = Math.floor(this.currentTile / this.tilesHorizontal);
      texture.offset.y = currentRow / this.tilesVertical;
    }
  };
}
