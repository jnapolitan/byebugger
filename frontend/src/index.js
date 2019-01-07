import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/root';
import configureStore from './store/store';
import { fetchStats, receiveNewStat } from './actions/stat_actions';

document.addEventListener('DOMContentLoaded', () => {
  const store = configureStore();
  const root = document.getElementById('root');
  ReactDOM.render(<Root store={store} />, root);

  // TESTING
  window.store = store.getState();
  window.dispatch = store.dispatch;
  window.fetchStats = fetchStats;
  window.receiveNewStat = receiveNewStat;
});
