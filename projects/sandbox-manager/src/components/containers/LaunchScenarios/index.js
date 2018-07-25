import React, { Component } from 'react';
import {
    app_setScreen, loadLaunchScenarios, fetchPersonas, getPersonasPage, createScenario, deleteScenario, doLaunch, updateLaunchScenario, lookupPersonasStart,
    fetchPatient, setFetchingSinglePatientFailed, setSinglePatientFetched, setFetchSingleEncounter, setSingleEncounter, setFetchingSingleEncounterError, fetchEncounter
} from '../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withErrorHandler from 'sandbox-manager-lib/hoc/withErrorHandler';
import { CircularProgress, Card, IconButton, FloatingActionButton, CardMedia, Popover, Menu, MenuItem } from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';
import EditIcon from 'material-ui/svg-icons/image/edit';
import PersonaList from '../Persona/List';
import LaunchIcon from "material-ui/svg-icons/action/launch";
import HospitalIcon from "svg-react-loader?name=Patient!sandbox-manager-lib/icons/round-location_city.svg";
import DescriptionIcon from "svg-react-loader?name=Patient!sandbox-manager-lib/icons/round-description.svg";
import LinkIcon from "svg-react-loader?name=Patient!sandbox-manager-lib/icons/round-link.svg";
import FullScreenIcon from "svg-react-loader?name=Patient!sandbox-manager-lib/icons/baseline-fullscreen.svg";
import BulbIcon from "svg-react-loader?name=Patient!sandbox-manager-lib/icons/lightbulb.svg";
import WebIcon from "material-ui/svg-icons/av/web";
import AccountIcon from "material-ui/svg-icons/action/account-box";
import DeleteIcon from "material-ui/svg-icons/action/delete";
import MoreIcon from "material-ui/svg-icons/navigation/more-vert";
import EventIcon from "material-ui/svg-icons/action/event";
import DownIcon from "material-ui/svg-icons/hardware/keyboard-arrow-down";
import FilterList from "material-ui/svg-icons/content/filter-list";
import Patient from "svg-react-loader?name=Patient!sandbox-manager-lib/icons/patient.svg";
import ContextIcon from "svg-react-loader?name=Patient!sandbox-manager-lib/icons/context-icon.svg";
import Page from 'sandbox-manager-lib/components/Page';
import DohMessage from "sandbox-manager-lib/components/DohMessage";
import ConfirmModal from "sandbox-manager-lib/components/ConfirmModal";
import Filters from './Filters';
import muiThemeable from "material-ui/styles/muiThemeable";
import Edit from "./Edit";
import Create from './Create';

import './styles.less';

class LaunchScenarios extends Component {

    createKey = 0;

    constructor (props) {
        super(props);

        this.state = {
            showModal: false,
            showMenuForItem: false,
            showConfirmModal: false,
            descriptionEditing: false,
            selectedScenario: undefined,
            scenarioToEdit: undefined,
            scenarioToDelete: undefined,
            description: ''
        }
    }

    componentDidMount () {
        this.props.app_setScreen('launch');
        this.props.loadLaunchScenarios();
    }

    componentWillReceiveProps (nextProps) {
        ((this.props.creating && !nextProps.creating) || (this.props.deleting && !nextProps.deleting)) && this.props.loadLaunchScenarios();
    }

    render () {
        return <Page title='Launch Scenarios'>
            {this.state.scenarioToEdit && <Edit open={!!this.state.scenarioToEdit} muiTheme={this.props.muiTheme} value={this.state.scenarioToEdit.description} onCancel={() => this.selectScenarioForEditing()}
                                                onConfirm={this.updateScenario} descriptionError={this.state.descriptionError}/>}
            <ConfirmModal open={this.state.showConfirmModal} red confirmLabel='Delete' onConfirm={() => {
                this.props.deleteScenario(this.state.scenarioToDelete);
                this.setState({ showConfirmModal: false })
            }} onCancel={() => this.setState({ showConfirmModal: false, scenarioToDelete: undefined })} title='Confirm'>
                <p>
                    Are you sure you want to delete "{this.state.scenarioToDelete ? this.state.scenarioToDelete.description : ''}"?
                </p>
            </ConfirmModal>
            <div className='launch-scenarios-wrapper'>
                <div className='filter-wrapper'>
                    <FilterList color={this.props.muiTheme.palette.primary3Color}/>
                    {!this.props.scenariosLoading && this.props.scenarios && this.props.scenarios.length > 0 &&
                    <Filters {...this.props} apps={this.props.apps} onFilter={this.onFilter} appliedTypeFilter={this.state.typeFilter} appliedIdFilter={this.state.appIdFilter}/>}
                    <div className='actions'>
                        <FloatingActionButton onClick={this.toggleCreateModal}>
                            <ContentAdd/>
                        </FloatingActionButton>
                    </div>
                </div>
                <div>
                    {(this.props.scenariosLoading || this.props.creating || this.props.deleting) && <div className='loader-wrapper'><CircularProgress size={80} thickness={5}/></div>}
                    {!this.props.scenariosLoading && !this.props.deleting && this.props.scenarios && this.props.scenarios.length > 0 && this.getScenarios()}
                    {!this.props.scenariosLoading && !this.props.deleting && this.props.scenarios && this.props.scenarios.length === 0 && <DohMessage message='No launch scenarios in sandbox.' topMargin/>}
                </div>
                <Create key={this.createKey} open={this.state.showModal} close={this.toggleCreateModal} create={this.createScenario} {...this.props}/>
            </div>
        </Page>
    }

    selectScenarioForEditing = (scenarioToEdit) => {
        this.toggleMenuForItem();
        this.setState({ scenarioToEdit });
    };

    onFilter = (type, appId) => {
        let state = {};
        state[type] = appId;
        this.setState(state);
    };

    launchScenario = (e, sc) => {
        this.preventDefault(e);
        sc.app && this.props.doLaunch(sc.app, sc.patient, sc.userPersona);
        !sc.app && this.props.doLaunch(this.state.selectedApp, this.state.selectedPatient, this.state.selectedPersona);
    };

    handleRowSelect = (row) => {
        let selection = this.state.selectedScenario !== row ? row : undefined;
        this.setState({ selectedScenario: selection });
    };

    createScenario = (data) => {
        this.props.createScenario(data);
        this.toggleCreateModal();
    };

    showDeleteScenario = (sc) => {
        this.toggleMenuForItem();
        this.setState({ showConfirmModal: true, scenarioToDelete: sc });
    };

    toggleCreateModal = () => {
        let showModal = !this.state.showModal;
        let selectedScenario = showModal ? this.state.selectedScenario : undefined;
        showModal && !selectedScenario && !this.props.personas && this.props.fetchPersonas(PersonaList.TYPES.persona);
        showModal && !selectedScenario && !this.props.patients.length && this.props.fetchPersonas(PersonaList.TYPES.patient);
        showModal && !selectedScenario && this.state.selectedPersona && this.props.fetchPersonas(PersonaList.TYPES.patient);
        this.setState({ showModal, selectedScenario, selectedPatient: undefined, selectedPersona: undefined, selectedApp: undefined, description: '' });
        this.createKey++;
    };

    getScenarios = () => {
        return <div className='scenarios-list'>
            {this.props.scenarios.map((sc, index) => {
                    let isSelected = this.state.selectedScenario === index;
                    let itemStyles = { backgroundColor: this.props.muiTheme.palette.canvasColor };
                    let contentStyles = isSelected ? { borderTop: '1px solid ' + this.props.muiTheme.palette.primary7Color } : {};
                    let isPatient = sc.userPersona.resource !== 'Practitioner';
                    let iconStyle = isPatient
                        ? {
                            backgroundColor: this.props.muiTheme.palette.accent1Color,
                            color: this.props.muiTheme.palette.primary5Color
                        }
                        : {
                            backgroundColor: this.props.muiTheme.palette.primary5Color,
                            color: this.props.muiTheme.palette.accent1Color
                        };

                    let details = <div key={1} className='expanded-content'>
                        {this.getDetailsContent(sc)}
                    </div>;
                    let filter = (!this.state.appIdFilter || this.state.appIdFilter === sc.app.authClient.clientId) &&
                        (!this.state.typeFilter || this.state.typeFilter === sc.userPersona.resource);
                    let showMenuForItem = this.state.showMenuForItem === index;
                    if (filter) {
                        return <div key={index} style={itemStyles} onClick={() => this.handleRowSelect(index)} className={'scenarios-list-row' + (isSelected ? ' active' : '')}>
                            <div className='left-icon-wrapper' style={iconStyle}>
                                <span className='left-icon'>
                                    {isPatient
                                        ? <i><Patient/></i>
                                        : <i className='fa fa-user-md fa-lg'/>}
                                </span>
                            </div>
                            <div className='title-wrapper'>
                                <span className='launch-scenario-title'>{sc.description}</span>
                                <span className='launch-scenario-app-name'>{sc.app.authClient.clientName}</span>
                            </div>
                            <div className='actions-wrapper'>
                                <IconButton onClick={e => this.launchScenario(e, sc)} tooltip='Launch'>
                                    <LaunchIcon color={this.props.muiTheme.palette.primary3Color} style={{ width: '24px', height: '24px' }}/>
                                </IconButton>
                                <IconButton onClick={e => this.toggleMenuForItem(e, index)}>
                                    <span className='anchor' ref={'anchor' + index.toString()}/>
                                    <MoreIcon color={this.props.muiTheme.palette.primary3Color} style={{ width: '24px', height: '24px' }}/>
                                </IconButton>
                                {showMenuForItem &&
                                <Popover open={showMenuForItem} anchorEl={this.refs['anchor' + index]} anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                                         targetOrigin={{ horizontal: 'right', vertical: 'top' }} onRequestClose={this.toggleMenuForItem}>
                                    <Menu desktop autoWidth={false} width='100px'>
                                        <MenuItem className='scenario-menu-item' primaryText='Edit' leftIcon={<EditIcon/>} onClick={() => this.selectScenarioForEditing(sc)}/>
                                        <MenuItem className='scenario-menu-item' primaryText='Delete' leftIcon={<DeleteIcon/>} onClick={() => this.showDeleteScenario(sc)}/>
                                    </Menu>
                                </Popover>}
                                <IconButton className='expanded-toggle'>
                                    <DownIcon color={this.props.muiTheme.palette.primary3Color} style={{ width: '24px', height: '24px' }}/>
                                </IconButton>
                            </div>
                            <div className='content' style={contentStyles} onClick={e => e.stopPropagation()}>
                                {details}
                            </div>
                        </div>
                    }
                }
            )}
        </div>
    };

    preventDefault = (e) => {
        e && e.preventDefault && e.preventDefault();
        e && e.stopPropagation && e.stopPropagation();
    };

    toggleMenuForItem = (e, itemIndex) => {
        this.preventDefault(e);
        this.setState({ showMenuForItem: itemIndex });
    };

    getDetailsContent = (selectedScenario) => {
        let lightColor = { color: this.props.muiTheme.palette.primary3Color, alpha: '.7' };
        let normalColor = { color: this.props.muiTheme.palette.primary3Color };
        let darkColor = { color: this.props.muiTheme.palette.primary6Color };
        let iconStyle = { color: this.props.muiTheme.palette.primary6Color, fill: this.props.muiTheme.palette.primary6Color, width: '24px', height: '24px' };
        let iconStyleLight = { color: this.props.muiTheme.palette.primary3Color, fill: this.props.muiTheme.palette.primary3Color, width: '24px', height: '24px' };

        return <div className='launch-scenario-wrapper'>
            <div className='persona-wrapper'>
                <span className='section-title' style={darkColor}><AccountIcon style={iconStyle}/>Persona</span>
                <span className='persona-name' style={normalColor}>{selectedScenario.userPersona.fhirName}</span>
                <span className='persona-id' style={lightColor}>{selectedScenario.userPersona.personaUserId}</span>
                <div className='app-wrapper'>
                    <span className='section-title' style={darkColor}><WebIcon style={iconStyle}/>App</span>
                    <Card className='app-card small'>
                        <CardMedia className='media-wrapper'>
                            <img style={{ height: '100%' }} src={selectedScenario.app.logoUri || 'https://content.hspconsortium.org/images/hspc/icon/HSPCSandboxNoIconApp-512.png'} alt='HSPC Logo'/>
                        </CardMedia>
                        <div className='card-title' style={{ backgroundColor: 'rgba(0,87,120, 0.75)' }}>
                            <span className='app-name'>{selectedScenario.app.authClient.clientName}</span>
                        </div>
                    </Card>
                </div>
            </div>
            <div className='context-wrapper'>
                <span className='section-title' style={darkColor}><ContextIcon style={iconStyle}/>Context</span>
                <div>
                    <span className='section-value' style={lightColor}>
                        <Patient style={iconStyleLight}/>
                        {selectedScenario.patient.name ? selectedScenario.patient.name : '-'}
                    </span>
                    <span className='section-value' style={lightColor}>
                        <EventIcon style={iconStyleLight}/>
                        {selectedScenario.encounterId ? selectedScenario.encounterId : '-'}
                    </span>
                    <span className='section-value' style={lightColor}>
                        <HospitalIcon style={iconStyleLight}/>
                        {selectedScenario.locationId ? selectedScenario.locationId : '-'}
                    </span>
                    <span className='section-value' style={lightColor}>
                        <DescriptionIcon style={iconStyleLight}/>
                        {selectedScenario.resource ? selectedScenario.resource : '-'}
                    </span>
                    <span className='section-value' style={lightColor}>
                        <BulbIcon style={iconStyleLight}/>
                        {selectedScenario.intent ? selectedScenario.intent : '-'}
                    </span>
                    <span className='section-value' style={lightColor}>
                        <LinkIcon style={iconStyleLight}/>
                        {selectedScenario.url ? selectedScenario.url : '-'}
                    </span>
                    <span className='section-value' style={lightColor}>
                        <FullScreenIcon style={iconStyleLight}/>
                        Needs Patient Banner: {selectedScenario.patientBanner ? 'Yes' : 'No'}
                    </span>
                </div>
            </div>
        </div>
    };

    updateScenario = (description) => {
        if (description.length > 2) {
            description !== this.state.scenarioToEdit.description && this.props.updateLaunchScenario(this.state.scenarioToEdit, description);
            this.selectScenarioForEditing();
        } else {
            this.setState({ descriptionError: 'You need to provide description longer than 2 characters!' });
        }
    };
}

const mapStateToProps = state => {
    return {
        user: state.users.oauthUser,
        apps: state.apps.apps,
        fetchingSingleEncounter: state.sandbox.fetchingSingleEncounter,
        singleEncounterLoadingError: state.sandbox.singleEncounterLoadingError,
        singleEncounter: state.sandbox.singleEncounter,
        fetchingSinglePatient: state.patient.fetchingSingle,
        fetchingSinglePatientError: state.patient.fetchingSingleError,
        singlePatient: state.patient.singlePatient,
        creating: state.sandbox.launchScenarioCreating,
        deleting: state.sandbox.launchScenarioDeleting,
        scenariosLoading: state.sandbox.launchScenariosLoading,
        scenarios: state.sandbox.launchScenarios,
        personasPagination: state.persona.personasPagination,
        personas: state.persona.personas,
        patientsPagination: state.persona.patientsPagination,
        patients: state.persona.patients,
        personaLoading: state.persona.loading,
        sandbox: state.sandbox.sandboxes.find(i => i.sandboxId === sessionStorage.sandboxId)
    }
};

const mapDispatchToProps = dispatch => bindActionCreators(
    {
        setFetchingSinglePatientFailed, fetchPatient, app_setScreen, loadLaunchScenarios, fetchPersonas, getPersonasPage, createScenario, deleteScenario, doLaunch, updateLaunchScenario, lookupPersonasStart,
        setSinglePatientFetched, setFetchSingleEncounter, setSingleEncounter, setFetchingSingleEncounterError, fetchEncounter
    },
    dispatch
);


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(muiThemeable()(LaunchScenarios)))
