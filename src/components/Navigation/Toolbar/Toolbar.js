import React, { Component } from 'react';
import * as  actions from '../../../store/actions/index';
import { connect } from 'react-redux';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';

import axios from '../../../axiox';


import classes from './Toolbar.css';
import SideNavToggle from '../SideNav/SideNavToggle/SideNavToggle';
import SandboxSelector from './SandboxSelector/SandboxSelector';
import SandboxTitle from './SandboxTitle/SandboxTitle';
import Logo from '../../Logo/Logo';
import User from '../Toolbar/User/User';


class Toolbar extends Component {

    render() {
        const style = {
            display : 'inline-flex',
            boxShadow: 'rgba(0, 0, 0, 0.156863) 0px 3px 10px, rgba(0, 0, 0, 0.227451) 0px 5px 10px',
            width: 256,
            backgroundColor: '#0186d5',
            padding: 7,
            boxSizing: 'border-box'
        };


        let sideNavToggle = null;
        let sandboxSelector = "";

        let sandboxId = localStorage.getItem("sandboxId");

        if(sandboxId){
           sideNavToggle = (<SideNavToggle click={this.props.click}/>);
           sandboxSelector = (<SandboxSelector/>);
        }



        return(
            <header className={classes.Toolbar}>
                <div style={style}>
                    <Logo/>
                    {sideNavToggle}
                </div>
                {sandboxSelector}
                <SandboxTitle/>
                <User user={this.props.user}></User>
            </header>
        );
    };
}


const mapStateToProps = state => {
    return {
        sandbox : state.sandbox.sandboxes.filter(sandbox => sandbox.sandboxId === state.sandbox.selectedSandbox)[0]
    };
};

const mapDispatchToProps = dispatch => {
    return {
        selectSandbox: (sandboxId) => dispatch( actions.selectSandbox(sandboxId) )
    };
};

export default connect( mapStateToProps, mapDispatchToProps )( withErrorHandler( Toolbar, axios ) )
