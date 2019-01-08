import React from 'react';
import { Route } from 'react-router-dom';

import Main from './Main';
import HudContainer from '../components/hud/hud_container';
import StatsContainer from '../components/stats/stats_container'

const App = ({ store }) => (
  <>
    <Route path="/" component={() => <Main store={ store } />} />
    <Route path="/" component={HudContainer} />
    <Route path="/" component = {StatsContainer} />
  </>
);

export default App;
