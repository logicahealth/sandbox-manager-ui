import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import * as glib from "../../../../../lib/utils/";
import * as lib from "../../lib/";
import * as actionCreators from "../../redux/action-creators";

import * as React from "react";
import * as PropTypes from "prop-types";

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Layout from '../../../../../lib/components/Layout';

import Init from "../Init/";

import "./style.less";

class App extends React.Component {
    componentDidMount () {
        window.addEventListener("resize", this.onResize);
    }

    componentWillUnmount () {
        window.removeEventListener("resize", this.onResize);
    }

    render () {
        return this.props.ui && <MuiThemeProvider muiTheme={getMuiTheme(this.props.ui.theme)}>
            <Layout path={this.props.history.location.pathname}>
                <div className='app-root' ref={this.refStage()}>
                    <Init {...this.props} />
                    <div className='stage' style={{ marginBottom: this.props.ui.footerHeight }}>
                        {this.props.children}
                    </div>
                </div>
            </Layout>
        </MuiThemeProvider>;
    }

    // Event handlers ----------------------------------------------------------
    onResize = () => this.forceUpdate();

    // Refs --------------------------------------------------------------------
    refStage = () => (el) => {
        if (el && this.props.ui.clientWidth !== el.clientWidth) {
            this.props.ui_SetClientWidth(el.clientWidth);
        }
    }
}

App.propTypes = {
    fhir: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({ ...glib, ...lib, ...state, ...ownProps });
const mapDispatchToProps = (dispatch) => bindActionCreators({ ...actionCreators }, dispatch);

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(App);
export { connectedComponent };
export default withRouter(connectedComponent);
