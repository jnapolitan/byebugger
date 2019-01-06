import React from 'react';
import { Route } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import { Switch } from 'react-router-dom';

import Main from './Main';
import LoginFormContainer from './session/login_form_container';
import SignupFormContainer from './session/signup_form_container';

const App = () => (
  <>
    <Switch>
        <Route path="/" component={Main} />
        <AuthRoute exact path="/login" component={LoginFormContainer} />
        <AuthRoute exact path="/signup" component={SignupFormContainer} />

        {/* <ProtectedRoute exact path="/profile" />
        <ProtectedRoute exact path="/new_game" /> */}
    </Switch>
  </>
);

export default App;
