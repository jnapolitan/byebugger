export const RECEIVE_CURRENT_HEALTH = 'RECEIVE_HEALTH';
export const RECEIVE_NEW_HEALTH = 'RECEIVE_NEW_HEALTH';

export const receiveCurrentHealth = (currentHealth) => ({
  type: RECEIVE_CURRENT_HEALTH,
  currentHealth
});

export const receiveNewHealth = (newHealth) => ({
  type: RECEIVE_NEW_HEALTH,
  newHealth
});

