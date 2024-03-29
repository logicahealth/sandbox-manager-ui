import React, { Component } from 'react';
import strings from '../../../assets/strings';
import './styles.less';

export default class Logo extends Component {
    render () {
        return <div className={'logo' + (this.props.isDashboard ? ' dashboard' : '')} onClick={() => this.props.history.push('/dashboard')} data-qa='header-logo'>
            <img src='/img/hspc-sndbx-logo-white.png' alt={strings.logoAltText} />
        </div>
    };
}
