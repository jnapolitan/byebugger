import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Main from './Main';

const App = ({ store }) => (
  <>
    <Switch>
        <Route path="/" component={() => <Main store={ store } />} />
    </Switch>
  </>
);

export default App;
