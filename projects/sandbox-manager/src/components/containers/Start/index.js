import React, { Component } from 'react';
import { CircularProgress, Paper, RaisedButton } from 'material-ui';
import { init } from '../../../redux/action-creators';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import withErrorHandler from '../../../../../../lib/hoc/withErrorHandler';
import strings from '../../../../externals/strings/start';

import './styles.less';

class Start extends Component {
    render () {
        let language = this.props.language;

        let checkboxes = strings[language].checkboxes.map((checkbox, index) => (
            <p key={index}><i className='fa fa-check' aria-hidden='true'> </i>{checkbox}</p>
        ));
        let buttons = !this.props.skipLogin
            ? <div>
                <RaisedButton label={strings[language].signInLabel} className='paper-button' primary={true} onClick={this.handleSignIn} />
                <RaisedButton label={strings[language].signUpLabel} className='paper-button' primary={true} onClick={this.handleSignUp} />
            </div>
            : null;
        let content = <div className='start-page-wrapper'>
            <Paper className='paper-card'>
                <h3>{strings[language].title}</h3>
                <div className='paper-body'>
                    <p>{strings[language].description}</p>
                    {checkboxes}
                    <p>{strings[language].note}</p>
                    {buttons}
                </div>
            </Paper>
        </div>;

        return this.props.rehydrateDone && !this.props.hasSession
            ? content
            : <div className='loader-wrapper'>
                <CircularProgress size={80} thickness={5} />
                <h1>Loading session</h1>
            </div>;
    };

    handleSignIn = () => {
        this.props.onAuthInit();
    };

    handleSignUp = () => {
        window.location.href = this.props.settings.sandboxManager.userManagementUrl + '/public/newuser/?afterAuth=' + this.props.settings.sandboxManager.sandboxManagerUrl;
    };
}

const mapStateToProps = state => {
    return {
        selectedSandbox: state.sandbox.selectedSandbox,
        settings: state.config.xsettings.data,
        language: state.config.language,
        rehydrateDone: state.app.rehydrateDone,
        hasSession: !!state.fhir.smart.data.server
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({ onAuthInit: init }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Start));