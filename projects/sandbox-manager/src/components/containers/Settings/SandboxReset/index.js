import React, { Component } from 'react';

import { Checkbox, IconButton } from 'material-ui';

import './styles.less';

class SandboxReset extends Component {

    render () {
        let titleStyle = {
            backgroundColor: this.props.theme.primary4Color,
            color: this.props.theme.alternateTextColor,
            paddingLeft: '10px',
            marginLeft: '0'
        };

        return <div className='reset-wrapper'>
            <div className='screen-title' style={titleStyle}>
                <IconButton className="close-button" onClick={this.props.onClose}>
                    <i className="material-icons">close</i>
                </IconButton>
                <h1 style={titleStyle}>RESET SANDBOX</h1>
            </div>
            <div className='reset-content'>
                <p>Resetting the sandbox will delete:</p>
                <ul>
                    <li>All FHIR data</li>
                    <li>Launch scenarios</li>
                    <li>Personas</li>
                </ul>
                <p>This is NOT reversible!</p>
                <p>Unaffected:</p>
                <ul>
                    <li>Registered apps</li>
                    <li>Sandbox members</li>
                </ul>
                <Checkbox label='Import sample patients and practitioners' onCheck={(_e, defaultData) => this.props.toggleSampleData(defaultData)} labelStyle={{ color: this.props.theme.primary2Color }} />
                <p>If not selected, the sandbox will be empty</p>
                {this.props.sandbox &&
                <Checkbox label={'Are you sure you want to reset sandbox ' + this.props.sandbox.name + '?'}
                          onCheck={(_e, reset) => this.props.toggleReset(reset)} labelStyle={{ color: this.props.theme.primary2Color }} />}
            </div>
        </div>;
    }
}


export default SandboxReset;
