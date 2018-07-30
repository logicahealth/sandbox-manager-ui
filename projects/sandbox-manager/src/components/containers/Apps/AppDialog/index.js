import React, { Component } from 'react';
import { MenuItem, DropDownMenu, RaisedButton, Paper, TextField, Dialog, Toggle, IconButton } from 'material-ui';
import './styles.less';

class AppDialog extends Component {
    constructor (props) {
        super(props);

        let clientJSON = props.app && props.app.clientJSON && JSON.parse(props.app.clientJSON);
        let redirectUris = clientJSON && clientJSON.redirectUris && clientJSON.redirectUris.join(',');
        let scope = clientJSON && clientJSON.scope && clientJSON.scope.join(' ');

        let app = {
            clientName: props.app ? props.app.authClient.clientName : '',
            launchUri: props.app ? props.app.launchUri : '',
            samplePatients: props.app && props.app.samplePatients ? props.app.samplePatients : '',
            redirectUris: redirectUris ? redirectUris : '',
            scope: scope ? scope : '',
            logoUri: props.app && props.app.logoUri || '',
            briefDescription: props.app && props.app.briefDescription || '',
            tokenEndpointAuthMethod: clientJSON && clientJSON.tokenEndpointAuthMethod || 'NONE',
            clientJSON: props.app ? props.app.clientJSON : {},
            patientScoped: true
        };

        this.state = {
            value: 'PublicClient',
            modalOpen: false,
            changes: [],
            app,
            originalApp: Object.assign({}, app)
        }
    }

    componentWillReceiveProps (nextProps) {
        if ((this.props.app && !this.props.app.clientJSON && nextProps.app.clientJSON) ||
            (this.props.app && this.props.app.clientJSON && nextProps.app.clientJSON && this.props.app.clientJSON.length !== nextProps.app.clientJSON.length)) {
            let clientJSON = nextProps.app && nextProps.app.clientJSON && JSON.parse(nextProps.app.clientJSON);
            let redirectUris = clientJSON && clientJSON.redirectUris && clientJSON.redirectUris.join(',');
            let scope = clientJSON && clientJSON.scope && clientJSON.scope.join(' ');

            let app = Object.assign({}, this.state.app, { scope, redirectUris, clientJSON });

            this.setState({ app });
        }
    }

    render () {
        let clientId = null;
        let theme = this.props.muiTheme.palette;

        if (this.props.app) {
            clientId = <div className='label-value'>
                <span>Client Id: </span>
                <span>{this.props.app.authClient.clientId}</span>
            </div>;
        }
        let sApp = this.state.app;

        let saveEnabled = this.props.app
            ? this.state.changes.length > 0
            : sApp.clientName.length > 2 && sApp.launchUri.length > 2 && sApp.redirectUris.length > 2;
        let actions = [
            <RaisedButton primary label='Save' onClick={this.save} disabled={!saveEnabled}/>
        ];

        this.props.app && actions.push(<RaisedButton backgroundColor={theme.primary4Color} label='Delete' onClick={this.delete} labelColor={theme.primary5Color}/>);
        this.props.app && actions.push(<RaisedButton label='Launch' onClick={this.props.doLaunch}/>);

        let paperClasses = 'app-dialog' + (this.props.app ? ' small' : '');
        let underlineFocusStyle = { borderColor: theme.primary2Color };
        let floatingLabelFocusStyle = { color: theme.primary2Color };

        return <Dialog paperClassName={paperClasses} modal={false} open={!!this.props.open} onRequestClose={this.props.onClose} actions={actions}
                       actionsContainerClassName='app-dialog-actions-wrapper'>
            <Paper className='paper-card'>
                <IconButton style={{ color: this.props.muiTheme.palette.primary5Color }} className="close-button" onClick={this.handleClose}>
                    <i className="material-icons">close</i>
                </IconButton>
                <h3>Registered App Details</h3>
                <div className='paper-body'>
                    <form>
                        <TextField floatingLabelText='App Name*' fullWidth value={this.state.app.clientName} hintText='Human Readable Name for Your App e.g.: Growth Chart'
                                   onChange={(_e, newVal) => this.onChange('clientName', newVal)} underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle}/><br/>
                        <div>
                            <div style={{ color: 'rgba(0, 0, 0, 0.3)', display: 'inline-block', transform: 'translate(0, -20%)' }}>Client Type</div>
                            <DropDownMenu value={this.state.app.tokenEndpointAuthMethod} onChange={(_e, _k, value) => this.onChange('tokenEndpointAuthMethod', value)}
                                          style={{ top: '16px' }}>
                                <MenuItem value='NONE' primaryText='Public Client'/>
                                <MenuItem value='SECRET_BASIC' primaryText='Confidential Client'/>
                            </DropDownMenu>
                        </div>
                        {clientId}
                        <TextField multiLine floatingLabelText='Description' value={this.state.app.briefDescription} fullWidth
                                   onChange={(_e, newVal) => this.onChange('briefDescription', newVal)} underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle}/>
                        <TextField floatingLabelText='App Launch URI*' value={this.state.app.launchUri} fullWidth onChange={(_e, newVal) => this.onChange('launchUri', newVal)}
                                   hintText='e.g.: https://mydomain.com/growth-chart/launch.html' underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle}/>
                        <br/>
                        <TextField value={this.state.app.redirectUris} fullWidth floatingLabelText='App Redirect URIs*' underlineFocusStyle={underlineFocusStyle}
                                   floatingLabelFocusStyle={floatingLabelFocusStyle}
                                   onChange={(_e, newVal) => this.onChange('redirectUris', newVal)} hintText='e.g.: https://mydomain.com/growth-chart/index.html'/>
                        <span className='subscript'>
                            Note: If you provide one or more redirect URIs, your client code must send one of the provided values when performing OAuth2 authorization or you will receive an 'Invalid redirect' error.
                        </span>
                        <TextField fullWidth floatingLabelText='Scopes' value={this.state.app.scope} onChange={(_e, newVal) => this.onChange('scope', newVal)}
                                   hintText='eg: launch patient/*.* openid profile' underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle}/>
                        <span className='subscript'>
                            Note: If you do not provide scope, defaults will be set.
                        </span>
                        <TextField fullWidth floatingLabelText='Sample Patients' hintText='e.g.: Patient?_id=SMART-1032702,SMART-621799' underlineFocusStyle={underlineFocusStyle}
                                   floatingLabelFocusStyle={floatingLabelFocusStyle}
                                   value={this.state.app.samplePatients} onChange={(_e, newVal) => this.onChange('samplePatients', newVal)}/>
                        {this.props.app &&
                        <span className='subscript'>Space separated list of scopes.</span>}
                        {this.props.app &&
                        <span className='subscript'>This is a FHIR query to limit the Patient Picker on launch.</span>}
                        {!this.props.app && <div className='toggle-wrapper'>
                            <Toggle label='Allow offline access' defaultToggled={false}
                                    thumbStyle={{ backgroundColor: this.props.muiTheme.palette.primary5Color }}
                                    trackStyle={{ backgroundColor: this.props.muiTheme.palette.primary3Color }}/>
                            <Toggle label='Patient Scoped App' defaultToggled={true} onChange={(_e, _k, value) => this.onChange('patientScoped', value)}
                                    thumbStyle={{ backgroundColor: this.props.muiTheme.palette.primary5Color }}
                                    trackStyle={{ backgroundColor: this.props.muiTheme.palette.primary3Color }}/>
                        </div>}
                        < br/>
                        <div className='image-button-wrapper'>
                            <RaisedButton label='Select Image' onClick={() => this.refs.image.click()}/>
                            <div>
                                <span className='subscript'>(Display size 300px W X 200px H)</span>
                            </div>
                            <div>
                                <span className='subscript'>For best retina experience we recommend pictures with size: 600px X 400px</span>
                            </div>
                        </div>
                        <div className='image-wrapper'>
                            <input ref='image' type='file' style={{ 'display': 'none' }} onChange={this.onFileInput}/>
                            <img src={this.state.app.logoUri}/>
                        </div>
                    </form>
                </div>
            </Paper>
        </Dialog>
    }

    handleLaunch = () => {
        this.setState({ modalOpen: true });
    };

    handleClose = () => {
        this.setState({ modalOpen: false });
        this.props.onClose();
    };

    delete = () => {
        this.props.onDelete && this.props.onDelete();
    };

    onFileInput = () => {
        let input = this.refs.image;
        if (input.files && input.files[0]) {
            let reader = new FileReader();

            reader.onload = (e) => {
                let app = Object.assign({}, this.state.app);
                app.logoUri = e.target.result;
                app.logoFile = input.files[0];
                let changes = this.state.changes.slice();
                changes.indexOf('logo') === -1 && changes.push('image');
                this.setState({ app, changes })
            };

            reader.readAsDataURL(input.files[0]);
        }
    };

    onChange = (prop, val) => {
        let app = this.state.app || this.props.app || {};
        app[prop] = val;

        let changes = this.state.changes.slice();
        let index = changes.indexOf(prop);

        if (index >= 0) {
            changes.splice(index, 1);
        }

        if (this.props.app && this.state.originalApp[prop] !== val) {
            changes.push(prop);
        }

        this.setState({ app, changes });
    };

    save = () => {
        this.props.onSubmit && this.props.onSubmit(this.state.app);
    }

}

export default AppDialog;
