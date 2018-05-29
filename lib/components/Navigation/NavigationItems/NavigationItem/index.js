import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export default class NavigationItem extends Component {
    render () {
        return <li className='navigation-item'>
            <NavLink to={this.props.link}>
                {this.props.children}
            </NavLink>
        </li>
    };
}