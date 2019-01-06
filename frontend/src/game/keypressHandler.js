export const onKeyDown = (event, keypresses, velocity) => {
    switch (event.keyCode) {
      case 38: // Up
      case 87: // W
        keypresses.forward = true;
        break;
      case 37: // Left
      case 65: // A
        keypresses.left = true;
        break;
      case 40: // Down
      case 83: // S
        keypresses.backward = true;
        break;
      case 39: // Right
      case 68: // D
        keypresses.right = true;
        break;
      case 32: // Space
        if (keypresses.canJump === true) velocity.y += 350;
        keypresses.canJump = false;
        break;
      default:
        break;
    }
};

export const onKeyUp = (event, keypresses) => {
    switch (event.keyCode) {
      case 38: // Up
      case 87: // W
        keypresses.forward = false;
        break;
      case 37: // Left
      case 65: // A
        keypresses.left = false;
        break;
      case 40: // Down
      case 83: // S
        keypresses.backward = false;
        break;
      case 39: // Right
      case 68: // D
        keypresses.right = false;
        break;
      default:
        break;
    }
};
