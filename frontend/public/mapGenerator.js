class Rect {

  constructor(x, y, width, height) {
    this.x1 = x;
    this.y1 = y;
    this.x2 = x + width;
    this.y2 = y + height;
  }

  center() {
    return (
      [Math.floor((this.x1 + this.x2) / 2),
       Math.floor((this.y1 + this.y2) / 2)]
    );
  }

}

class BSPTree {

  constructor() {
    this.level = [];
    this.room = null;
    this.MAX_LEAF_SIZE = 24;
    this.ROOM_MAX_SIZE = 15;
    this.ROOM_MIN_SIZE = 6;

    this.generateLevel = this.generateLevel.bind(this);
    this.createRoom = this.createRoom.bind(this);
    this.createHall = this.createHall.bind(this);
    this.createHorTunnel = this.createHorTunnel.bind(this);
    this.createVerTunnel = this.createVerTunnel.bind(this);
  }

  generateLevel(mapWidth, mapHeight) {
    for (let i = 0; i < mapWidth; i++) {
      this.level.push([]);
      for (let j = 0; j < mapHeight; j++) {
        this.level[i].push(1);
      }
    }

    let leafs = [];

    let rootLeaf = new Leaf(0, 0, mapWidth, mapHeight);
    leafs.push(rootLeaf);

    let splitSuccessfully = true;
    while (splitSuccessfully) {
      splitSuccessfully = false;
      for (let i = 0; i < leafs.length; i++) {
        let l = leafs[i];
        if (l.child_1 === null && l.child_2 === null) {
          if (l.width > this.MAX_LEAF_SIZE ||
            l.height > this.MAX_LEAF_SIZE ||
            Math.random() > 0.8) {
            if (l.splitLeaf()) {
              leafs.push(l.child_1);
              leafs.push(l.child_2);
              splitSuccessfully = true;
            }
          }
        }
      }
    }


    var that = this;
    rootLeaf.createRooms(that);

    return this.level;
  }

  createRoom(room) {
    for (let x = room.x1 + 1; x < room.x2; x++) {
      for (let y = room.y1 + 1; y < room.y2; y++) {
        this.level[x][y] = 0;
      }
    }
  }

  createHall(room1, room2) {
    let center1 = room1.center();
    let center2 = room2.center();
    let x1 = center1[0];
    let y1 = center1[1];
    let x2 = center2[0];
    let y2 = center2[1];
    if (Math.random() < 0.5) {
      this.createHorTunnel(x1, x2, y1);
      this.createVerTunnel(y1, y2, x2);
    } else {
      this.createVerTunnel(y1, y2, x1);
      this.createHorTunnel(x1, x2, y2);
    }
  }

  createHorTunnel(x1, x2, y) {
    let lowerBound = Math.min(x1, x2);
    let upperBound = Math.max(x1, x2) + 1;
    for (let x = lowerBound; x < upperBound; x++) {
      this.level[x][y] = 0;
    }
  }

  createVerTunnel(y1, y2, x) {
    let lowerBound = Math.min(y1, y2);
    let upperBound = Math.max(y1, y2) + 1;
    for (let y = lowerBound; y < upperBound; y++) {
      this.level[x][y] = 0;
    }
  }

}

class Leaf {

  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.MIN_LEAF_SIZE = 10;
    this.child_1 = null;
    this.child_2 = null;
    this.room = null;
    this.hall = null;

    this.splitLeaf = this.splitLeaf.bind(this);
    this.createRooms = this.createRooms.bind(this);
    this.getRoom = this.getRoom.bind(this);
  }

  splitLeaf() {
    if (this.child_1 !== null || this.child_2 !== null) {
      return false;
    }

    let splitHorizontally = Math.random() < 0.5 ? true : false;
    if (this.width / this.height >= 1.25) {
      splitHorizontally = false;
    } else if (this.height / this.width >= 1.25) {
      splitHorizontally = true;
    }

    let max;
    if (splitHorizontally) {
      max = this.height - this.MIN_LEAF_SIZE;
    } else {
      max = this.width - this.MIN_LEAF_SIZE;
    }

    if (max <= this.MIN_LEAF_SIZE) {
      return false;
    }

    let split = Math.floor(Math.random() * (max - this.MIN_LEAF_SIZE)) + this.MIN_LEAF_SIZE;

    if (splitHorizontally) {
      this.child_1 = new Leaf(this.x, this.y, this.width, split);
      this.child_2 = new Leaf(this.x, this.y + split, this.width, this.height - split);
    } else {
      this.child_1 = new Leaf(this.x, this.y, split, this.height);
      this.child_2 = new Leaf(this.x + split, this.y, this.width - split, this.height);
    }

    return true;

  }

  createRooms(bspTree) {
    if (this.child_1 || this.child_2) {
      if (this.child_1) {
        this.child_1.createRooms(bspTree);
      }
      if (this.child_2) {
        this.child_2.createRooms(bspTree);
      }

      if (this.child_1 && this.child_2) {
        bspTree.createHall(this.child_1.getRoom(),
          this.child_2.getRoom());
      }
    } else {
      let w = Math.floor(Math.random() * ((Math.min(bspTree.ROOM_MAX_SIZE, this.width - 1)) - bspTree.ROOM_MIN_SIZE)) + bspTree.ROOM_MIN_SIZE;
      let h = Math.floor(Math.random() * ((Math.min(bspTree.ROOM_MAX_SIZE, this.height - 1)) - bspTree.ROOM_MIN_SIZE)) + bspTree.ROOM_MIN_SIZE;
      let x = Math.floor(Math.random() * (((this.width - 1) - w) - this.x)) + this.x;
      let y = Math.floor(Math.random() * (((this.height - 1) - h) - this.y)) + this.y;
      this.room = new Rect(x, y, w, h);
      bspTree.createRoom(this.room);
    }

  }

  getRoom() {
    let room_1;
    let room_2;
    if (this.room) {
      return this.room;
    } else {
      if (this.child_1) {
        room_1 = this.child_1.getRoom();
      }
      if (this.child_2) {
        room_2 = this.child_2.getRoom();
      }

      if (!room_1 && !room_2) {
        return null;
      } else if (!room_2) {
        return room_1;
      } else if (!room_1) {
        return room_2;
      } else if (Math.random() < 0.5) {
        return room_1;
      } else {
        return room_2;
      }

    }
  }

}
