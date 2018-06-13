import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui';
import withErrorHandler from '../../../../../../lib/hoc/withErrorHandler';
import { importData, app_setScreen, customSearch, fhir_setCustomSearchResults, clearResults } from '../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import QueryBrowser from './QueryBrowser';
import Import from "./Import";

import './styles.less';

class DataManager extends Component {
    constructor (props) {
        super(props);

        this.state = {
            activeTab: 'browser'
        };
    }

    componentDidMount () {
        this.props.app_setScreen('data-manager');
    }

    render () {
        return <div className='data-manager-wrapper'>
            <Tabs className='data-tabs' contentContainerClassName='data-tabs-container'>
                <Tab label="Browser" className={'query-browser tab' + (this.state.activeTab === 'browser' ? ' active' : '')} onActive={() => this.setActiveTab('browser')}>
                    <QueryBrowser search={this.search} results={this.props.results} clearResults={this.props.fhir_setCustomSearchResults} />
                </Tab>
                <Tab label="Import" className={'import tab' + (this.state.activeTab === 'import' ? ' active' : '')} onActive={() => this.setActiveTab('import')}>
                    <Import importData={this.props.importData} results={this.props.importResults} clearResults={this.props.clearResults} />
                </Tab>
                <Tab label="Export" disabled>
                    <div>
                        <h2>Tab Four</h2>
                    </div>
                </Tab>
            </Tabs>
        </div>;
    }

    search = (query) => {
        this.props.customSearch(query);
    };

    setActiveTab = (tab) => {
        this.setState({activeTab: tab});
    };
}

const mapStateToProps = state => {

    return {
        results: state.fhir.customSearchResults,
        importResults: state.sandbox.importResults
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({ app_setScreen, customSearch, fhir_setCustomSearchResults, importData, clearResults }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(DataManager));
