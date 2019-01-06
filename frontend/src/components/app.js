import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Main from './Main';

const App = () => (
  <>
    <Switch>
        <Route path="/" component={Main} />
    </Switch>
  </>
);

export default App;
