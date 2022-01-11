import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch ,NavLink} from 'react-router-dom';

import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import './Login.css';
import Theme from './Theme.js';

ReactDOM.render(
    <Theme>
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={Login} />
            <Route exact path='/register' component={Register} />
            <Route path='/dashboard' component={Dashboard} />
            {/* <Route component={NotFound}/> */}
        </Switch>
    </BrowserRouter>
    </Theme>,
    document.getElementById('root')
);