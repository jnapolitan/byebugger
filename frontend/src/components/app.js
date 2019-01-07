import React from 'react';
import { Route } from 'react-router-dom';

import Main from './Main';
import HudContainer from '../components/hud/hud_container';

const App = ({ store }) => (
  <>
    <Route path="/" component={() => <Main store={ store } />} />
    <Route path="/" component={HudContainer} />
  </>
);

export default App;
