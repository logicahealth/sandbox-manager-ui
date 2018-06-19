import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Checkbox, RaisedButton, Paper, TextField, DropDownMenu, MenuItem, IconButton, Dialog } from 'material-ui';
import * as  actions from '../../../redux/action-creators';
import withErrorHandler from '../../../../../../lib/hoc/withErrorHandler';
import muiThemeable from "material-ui/styles/muiThemeable";
import { withRouter } from 'react-router';
import './styles.less';

class Index extends Component {
    constructor( props ) {
        super(props);

        this.state = {
            sandboxId: '',
            name: '',
            version: '',
            allowOpen: false,
            applyDefaultDataSet: true,
            applyDefaultApps: true,
            description: '',
            createDisabled: true,
            apiEndpointIndex: '6'
        };
    }

    render() {
        let duplicate = this.props.sandboxes.find(i => i.sandboxId === this.state.sandboxId);

        let actions = [
            <RaisedButton key={1} label='Create' disabled={this.state.createDisabled || !!duplicate} className='button' primary onClick={this.handleCreateSandbox}/>,
            <RaisedButton key={2} label='Cancel' className='button' default type='submit' onClick={( event ) => this.handleCancel(event)}/>
        ];

        return <Dialog paperClassName='create-sandbox-dialog' modal open={this.props.open} actions={actions} autoScrollBodyContent>
            <div className='create-sandbox-wrapper'>
                <Paper className='paper-card'>
                    <IconButton style={{ color: this.props.muiTheme.palette.primary5Color }} className="close-button" onClick={this.handleCancel}>
                        <i className="material-icons">close</i>
                    </IconButton>
                    <h3>
                        Create Sandbox
                    </h3>
                    <div className='paper-body'>
                        <form>
                            <TextField id='name' floatingLabelText='Sandbox Name' value={this.state.name} onChange={this.sandboxNameChangedHandler}/> <br/>
                            <div className='subscript'>Must be less than 50 characters. e.g., NewCo Sandbox</div>
                            <TextField id='id' floatingLabelText='Sandbox Id' value={this.state.sandboxId} onChange={this.sandboxIdChangedHandler}
                                       errorText={duplicate ? 'ID already in use' : undefined}/><br/>
                            <div className='subscript'>Letters and numbers only. Must be less than 20 characters.</div>
                            <div className='subscript'>Your sandbox will be available at http://localhost:3000/{this.state.sandboxId}</div>
                            <DropDownMenu value={this.state.apiEndpointIndex} onChange={( _e, _k, value ) => this.sandboxFhirVersionChangedHandler('apiEndpointIndex', value)}
                                          className='fhirVersion'>
                                <MenuItem value='5' primaryText='FHIR DSTU2 (v1.0.2)'/>
                                <MenuItem value='6' primaryText='FHIR STU3 (v3.0.1)'/>
                                <MenuItem value='7' primaryText='FHIR R4 (v3.2.0) [beta]'/>
                            </DropDownMenu>
                            <div className='subscript'>Choose a version of the FHIR Standard</div>
                            <br/>
                            <div className='checkboxes'>
                                <Checkbox label='Allow Open FHIR Endpoint' className='checkbox' onCheck={this.allowOpenChangeHandler}/>
                                <Checkbox label='Apply Default Data Set' className='checkbox' defaultChecked onCheck={this.applyDefaultChangeHandler}/>
                                <Checkbox label='Apply Default Apps Set' className='checkbox' defaultChecked onCheck={this.applyDefaultAppsChangeHandler}/>
                                <div className='subscript'>If not selected, the sandbox will be empty</div>
                            </div>
                            <TextField id='description' floatingLabelText='Description' onChange={this.sandboxDescriptionChange}/><br/>
                            <div className='subscript'>e.g., This sandbox is the QA environment for NewCo.</div>
                        </form>
                    </div>
                </Paper>
                <div style={{ clear: 'both' }}/>
            </div>
        </Dialog>
    }

    sandboxDescriptionChange = ( _e, description ) => {
        this.setState({ description });
    };

    handleCreateSandbox = ( event ) => {
        event.preventDefault();
        let createRequest = {
            createdBy: this.props.user,
            name: this.state.name.length === 0 ? this.state.sandboxId : this.state.name,
            sandboxId: this.state.sandboxId,
            description: this.state.description,
            dataSet: this.state.applyDefaultDataSet ? 'DEFAULT' : 'NONE',
            apps: this.state.applyDefaultApps ? 'DEFAULT' : 'NONE',
            apiEndpointIndex: this.state.apiEndpointIndex,
            allowOpenAccess: this.state.allowOpen,
            users: [this.props.user]
        };
        this.props.createSandbox(createRequest);
        this.props.onCancel && this.props.onCancel();
    };

    allowOpenChangeHandler = () => {
        this.setState(( oldState ) => {
            return {
                allowOpen: !oldState.checked,
            };
        });
    };

    applyDefaultChangeHandler = () => {
        this.setState(( oldState ) => {
            return {
                applyDefaultDataSet: !oldState.checked,
            };
        });
    };

    applyDefaultAppsChangeHandler = ( _, applyDefaultApps ) => {
        this.setState({ applyDefaultApps });
    };

    handleCancel = () => {
        this.props.onCancel && this.props.onCancel();
    };

    sandboxIdChangedHandler = ( event ) => {
        let value = event.target.value.replace(/[^a-z0-9]/gi, '');
        if (value.length > 20) {
            value = value.substring(0, 20);
        }
        this.setState({ sandboxId: value, createDisabled: value === 0 })
    };

    sandboxNameChangedHandler = ( event ) => {
        let value = event.target.value;
        if (value.length > 50) {
            value = value.substring(0, 50);
        }
        let cleanValue = value.replace(/[^a-z0-9]/gi, '');
        if (cleanValue.length > 20) {
            cleanValue = cleanValue.substring(0, 20);
        }
        this.setState({ name: value, sandboxId: cleanValue, createDisabled: value === 0 });
    };

    sandboxFhirVersionChangedHandler = ( prop, val ) => {
        let sandbox = this.state || this.props || {};
        sandbox[prop] = val;

        this.setState({ sandbox });
    };

}

const mapStateToProps = state => {
    return {
        user: state.users.oauthUser,
        sandboxes: state.sandbox.sandboxes
    };
};


const mapDispatchToProps = dispatch => {
    return {
        createSandbox: ( sandboxDetails ) => dispatch(actions.createSandbox(sandboxDetails))
    };
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(muiThemeable()(Index))));
