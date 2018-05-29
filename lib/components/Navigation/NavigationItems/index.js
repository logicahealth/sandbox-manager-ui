import React, { Component } from 'react';
import NavigationItem from './NavigationItem';
import strings from '../../../strings';
import './styles.less';

export default class NavigationItems extends Component {
    render () {
        let ehrSimulatorUrl = this.props.sandbox && window.fhirClient
            ? `${window.location.protocol}//${window.location.hostname}:3002/launch/${this.props.sandbox.sandboxId}/${this.props.sandboxApiUrl}/${window.fhirClient.server.serviceUrl.split('/')[2]}/${window.fhirClient.server.auth.token}`
            : undefined;

        return <ul className='navigation-items'>
            {this.props.sandbox && <li className='navigation-item'>
                <a href={ehrSimulatorUrl} target='_blank'>
                    <i className='fa fa-book' />{strings.navigation.ehrSimulator}
                </a>
            </li>}
            <NavigationItem link={'/apps'}>
                <i className='fa fa-th fa-lg' />{strings.navigation.apps}
            </NavigationItem>
            <NavigationItem link={'/launch'}>
                <i className='fa fa-list fa-lg' />{strings.navigation.launchScenarios}
            </NavigationItem>
            <NavigationItem link={'/patients'}>
                <i className='fa fa-bed fa-lg' />{strings.navigation.patients}
            </NavigationItem>
            <NavigationItem link={'/practitioners'}>
                <i className='fa fa-user-md fa-lg' />{strings.navigation.practitioners}
            </NavigationItem>
            <NavigationItem link={'/personas'}>
                <i className='fa fa-users fa-lg' />{strings.navigation.personas}
            </NavigationItem>
            <NavigationItem link={'/data-manager'}>
                <i className='fa fa-database fa-lg' />{strings.navigation.dataManager}
            </NavigationItem>
            <NavigationItem link={'/user-management'}>
                <i className='fa fa-users' />{strings.navigation.userManagement}
            </NavigationItem>
            <NavigationItem link={'/integration'}>
                <i className='fa fa-gears fa-lg' />{strings.navigation.ehrIntegration}
            </NavigationItem>
            <li className='navigation-item'>
                <a href='https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/64585866/HSPC+Sandbox' target='_blank'>
                    <i className='fa fa-book' />{strings.navigation.documentation}
                </a>
            </li>
            <NavigationItem link={'/settings'} active={this.props.screen === 'settings'}>
                <i className='fa fa-gear fa-lg' />{strings.navigation.settings}
            </NavigationItem>
        </ul>
    }
}