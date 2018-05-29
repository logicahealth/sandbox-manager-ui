import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import App from '../components/App/';
import Apps from '../components/containers/Apps';
import Persona from '../components/containers/Persona';
import LaunchScenarios from '../components/containers/LaunchScenarios';
import LaunchApp from '../components/containers/LaunchApp';
import Settings from '../components/containers/Settings';
import EHRIntegration from '../components/containers/EHRIntegration';
import UserManagement from '../components/containers/UserManagement';
import Dashboard from '../components/containers/Dashboard';
import Start from '../components/containers/Start';
import AfterAuth from '../components/containers/AfterAuth';
import CreateSandbox from '../components/containers/CreateSandbox';
import DataManager from '../components/containers/DataManager';

export default <Router>
    <App>
        <Switch>
            <Route path='/apps' component={Apps} />
            <Route path='/launch' component={LaunchScenarios} />
            <Route path='/launchApp' component={LaunchApp} />
            <Route path='/patients' component={Persona} />
            <Route path='/practitioners' component={Persona} />
            <Route path='/personas' component={Persona} />
            <Route path='/data-manager' component={DataManager} />
            <Route path='/user-management' component={UserManagement} />
            <Route path='/integration' component={EHRIntegration} />
            <Route path='/settings' component={Settings} />
            <Route path='/dashboard' component={Dashboard} />
            <Route path='/start' component={Start} />
            <Route path='/after-auth' component={AfterAuth} />
            <Route path='/create-sandbox' component={CreateSandbox} />
            <Route path='/' component={Start} />
        </Switch>
    </App>
</Router>;