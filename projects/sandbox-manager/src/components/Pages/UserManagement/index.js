import React, {Component} from 'react';
import {Dialog, Button, IconButton, CircularProgress, TableRowColumn, TableRow, TableBody, Table, TableHeader, TableHeaderColumn, Popover, Menu, MenuItem, Fab, TextField, Snackbar} from '@material-ui/core';
import MoreIcon from "@material-ui/icons/MoreVert";
import Redo from '@material-ui/icons/Redo';
import ContentAdd from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import {inviteNewUser, removeInvitation, fetchSandboxInvites, removeUser, toggleUserAdminRights} from '../../../redux/action-creators';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import withErrorHandler from '../../UI/hoc/withErrorHandler';
import './styles.less';
import {withRouter} from "react-router";

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class Users extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userToRemove: '',
            email: '',
            action: '',
            open: false,
            usersToImport: '',
            importUsersModal: false
        };
    }

    componentDidMount() {
        // this.props.fetchSandboxInvites();
    }

    render() {
        let palette = this.props.muiTheme.palette;
        let titleStyle = {
            backgroundColor: palette.primary2Color,
            color: palette.alternateTextColor
        };
        let underlineFocusStyle = {borderColor: palette.primary2Color};
        let floatingLabelFocusStyle = {color: palette.primary2Color};
        let sending = this.state.action === 'sending';

        return <div className='users-wrapper'>
            <div>
                <div className='invitation-buttons-wrapper'>
                    <Button variant='contained' label='MANAGE INVITES' backgroundColor={this.props.muiTheme.palette.primary2Color} labelColor='#FFF' onClick={this.showInvitationsModal}/>
                    <Button variant='contained' label='EXPORT USERS' primary onClick={this.exportUsers}/>
                    <Button variant='contained' label='IMPORT USERS' secondary onClick={this.toggleImportUsersModal}/>
                </div>
                {this.state.inviteModal &&
                <Dialog modal={false} open={this.state.inviteModal} onRequestClose={this.handleClose} actionsContainerClassName='invite-dialog-actions-wrapper'
                        paperClassName='invitations-modal' actions={[<Button variant='contained' label="Send" primary keyboardFocused onClick={this.handleSendInvite}/>]}>
                    <div className='screen-title invitations' style={titleStyle}>
                        <h1 style={titleStyle}>INVITE</h1>
                        <IconButton className="close-button" onClick={this.handleClose}>
                            <i className="material-icons" data-qa="modal-close-button">close</i>
                        </IconButton>
                    </div>
                    <div className='screen-content-invite-modal'>
                        <TextField fullWidth value={this.state.email} label="Email Address of New User" onChange={(event) => this.handleInviteEmailChange(event)} errorText={this.state.emailError}
                                   underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle} onKeyPress={this.submitMaybe} id='newEmailAddress'/>
                    </div>
                </Dialog>}
                {this.state.invitationsModal && <Dialog modal={false} open={this.state.invitationsModal} onRequestClose={this.handleClose} actionsContainerClassName='invites-dialog-actions-wrapper'
                                                        actions={[<Fab onClick={this.toggleCreateModal}><ContentAdd/></Fab>]} paperClassName='invitations-modal'>
                    <div className='screen-title invitations' style={titleStyle}>
                        <h1 style={titleStyle}>INVITES</h1>
                        <IconButton className="close-button" onClick={this.handleClose}>
                            <i className="material-icons" data-qa="modal-close-button">close</i>
                        </IconButton>
                    </div>
                    <div className='screen-content-invites-modal'>
                        <Table className='sandbox-invitations-list'>
                            <TableHeader className='invitations-table-header' displaySelectAll={false} adjustForCheckbox={false} enableSelectAll={false}
                                         style={{backgroundColor: this.props.muiTheme.palette.primary7Color}}>
                                <TableRow>
                                    <TableHeaderColumn style={{color: 'black', fontWeight: 'bold', fontSize: '12px'}}>Email</TableHeaderColumn>
                                    <TableHeaderColumn style={{color: 'black', fontWeight: 'bold', fontSize: '12px'}}>Date Sent</TableHeaderColumn>
                                    <TableHeaderColumn/>
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={false} selectable={false}>
                                {this.props.invitations && this.getInvitations()}
                            </TableBody>
                        </Table>
                    </div>
                </Dialog>}
                {this.state.userToRemove && <Dialog modal={false} open={this.state.open} onRequestClose={this.handleClose} actionsContainerClassName='user-remove-dialog-actions-wrapper'
                                                    actions={<Button variant='contained' label="Remove" labelColor={this.props.muiTheme.palette.primary5Color}
                                                                     backgroundColor={this.props.muiTheme.palette.primary4Color}
                                                                     keyboardFocused onClick={this.deleteSandboxUserHandler}/>}>
                    <div className='screen-title invitations' style={titleStyle}>
                        <h1 style={titleStyle}>Remove User from Sandbox</h1>
                        <IconButton className="close-button" onClick={this.handleClose}>
                            <i className="material-icons" data-qa="modal-close-button">close</i>
                        </IconButton>
                    </div>
                    <div className='screen-content-delete-modal'>
                        Are you sure you want to remove {(this.props.sandbox.userRoles.find(r => r.user.sbmUserId === this.state.userToRemove) || {user: {email: '"not found"'}}).user.email}?
                    </div>
                </Dialog>}
                {this.state.importUsersModal &&
                <Dialog modal={false} open={this.state.importUsersModal} onRequestClose={this.toggleImportUsersModal} actionsContainerClassName='user-remove-dialog-actions-wrapper'
                        actions={[<Button variant='contained' label="Import" style={{marginRight: '10px'}} onClick={this.importUsers} primary/>,
                            <Button variant='contained' label='Load from file (csv)' primary onClick={() => this.refs.file.click()}/>]}>
                    <div className='screen-title imports' style={titleStyle}>
                        <h1 style={titleStyle}>Import users</h1>
                        <IconButton className="close-button" onClick={this.toggleImportUsersModal}>
                            <i className="material-icons" data-qa="modal-close-button">close</i>
                        </IconButton>
                    </div>
                    <div className='screen-content-import-modal'>
                        <input type='file' id='file' ref='file' style={{display: 'none'}} onChange={this.readFile}/>
                        <TextField multiLine fullWidth label='Enter comma separated emails' onChange={(_, usersToImport) => this.setState({usersToImport})}
                                   value={this.state.usersToImport} onKeyUp={this.importMaybe} id='emailList'/>
                    </div>
                </Dialog>}
                {!this.props.updatingUser && <Table className='sandbox-users-list'>
                    <TableHeader className='users-table-header' displaySelectAll={false} adjustForCheckbox={false} enableSelectAll={false} style={{backgroundColor: this.props.muiTheme.palette.primary7Color}}>
                        <TableRow>
                            <TableHeaderColumn style={{color: 'black', fontWeight: 'bold', fontSize: '14px'}}>Name</TableHeaderColumn>
                            <TableHeaderColumn style={{color: 'black', fontWeight: 'bold', fontSize: '14px'}}>Identifier</TableHeaderColumn>
                            <TableHeaderColumn style={{color: 'black', fontWeight: 'bold', fontSize: '14px'}}>Role</TableHeaderColumn>
                            <TableHeaderColumn style={{color: 'black', fontWeight: 'bold', fontSize: '14px'}}>Signed In</TableHeaderColumn>
                            <TableHeaderColumn/>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} selectable={false}>
                        {this.props.sandbox && this.getRows()}
                    </TableBody>
                </Table>}
                {this.props.updatingUser && <div className='loader-wrapper'>
                    <p>
                        Updating user
                    </p>
                    <CircularProgress size={80} thickness={5}/>
                </div>}
            </div>
            <Snackbar open={this.props.inviting} message={sending ? 'Sending invitation to user...' : 'Deleting user invitation...'} autoHideDuration={30000}
                      bodyStyle={{margin: '0 auto', backgroundColor: sending ? palette.primary2Color : palette.primary4Color}}/>
        </div>;
    }

    submitMaybe = (event) => {
        [10, 13].indexOf(event.charCode) >= 0 && this.handleSendInvite();
    };

    importMaybe = (event) => {
        [10, 13].indexOf(event.keyCode) >= 0 && event.ctrlKey && this.importUsers();
    };

    readFile = () => {
        let fr = new FileReader();

        fr.onload = (e) => {
            this.setState({usersToImport: e.target.result});
        };

        fr.readAsText(this.refs.file.files.item(0));
    };

    importUsers = () => {
        let users = this.state.usersToImport.split(',') || [];
        users.map(user => {
            this.props.inviteNewUser(user);
        });
        this.toggleImportUsersModal();
    };

    toggleImportUsersModal = () => {

        this.setState({importUsersModal: !this.state.importUsersModal}, () => {
            setTimeout(() => {
                let field = document.getElementById('emailList');
                field && field.focus();
            }, 200);
        });
    };

    exportUsers = () => {
        let users = [];
        this.props.sandbox.userRoles.map(r => {
            users.push(r.user.email);
        });

        users = [...new Set(users)];

        let blob = new Blob([users.concat(',')], {type: 'text/csv'});

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, 'usersExport.csv');
        } else {
            let e = document.createEvent('MouseEvents');
            let a = document.createElement('a');

            a.download = 'usersExport.csv';
            a.href = window.URL.createObjectURL(blob);
            a.dataset.downloadurl = ['text/csv', a.download, a.href].join(':');
            e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
        }
    };

    toggleCreateModal = () => {
        this.setState({inviteModal: true, invitationsModal: false}, () => {
            setTimeout(() => {
                let field = document.getElementById('newEmailAddress');
                field && field.focus();
            }, 200);
        });
    };

    showInvitationsModal = () => {
        this.props.fetchSandboxInvites();
        this.setState({invitationsModal: true});
    };

    getRows = () => {
        let users = {};
        let currentIsAdmin = false;
        let adminCount = 0;
        this.props.sandbox.userRoles.map(r => {
            users[r.user.id] = users[r.user.id] || {
                name: r.user.name,
                email: r.user.email,
                sbmUserId: r.user.sbmUserId,
                roles: []
            };
            r.user.sbmUserId === this.props.user.sbmUserId && r.role === 'ADMIN' && (currentIsAdmin = true);
            r.role === 'ADMIN' && (adminCount++);
            users[r.user.id].roles.push(r.role);
        });

        let keys = Object.keys(users);

        return keys.map(key => {
            let user = users[key];
            let isAdmin = user.roles.indexOf('ADMIN') >= 0;

            let canRemoveUser = keys.length > 1 && (
                (currentIsAdmin && user.sbmUserId !== this.props.user.sbmUserId) ||
                (user.sbmUserId === this.props.user.sbmUserId && (!currentIsAdmin || adminCount > 1))
            );
            let lastLogin = (this.props.loginInfo.find(i => i.sbmUserId === user.sbmUserId) || {}).accessTimestamp;
            if (lastLogin !== undefined) {
                lastLogin = new Date(lastLogin);
                let myDateString = lastLogin.getFullYear() + '-' + ('0' + (lastLogin.getMonth() + 1)).slice(-2) + '-'
                    + ('0' + lastLogin.getDate()).slice(-2);
                lastLogin = myDateString + ' ' + ('0' + (lastLogin.getHours())).slice(-2) + ':' + ('0' + (lastLogin.getMinutes())).slice(-2);
            } else {
                lastLogin = 'unknown';
            }

            return <TableRow key={key} selectable={false}>
                <TableRowColumn>{user.name || ''}</TableRowColumn>
                <TableRowColumn>{user.email || ''}</TableRowColumn>
                <TableRowColumn>{isAdmin ? 'Admin' : ''}</TableRowColumn>
                <TableRowColumn>{lastLogin}</TableRowColumn>
                <TableRowColumn>
                    <IconButton onClick={() => this.toggleMenu(key)}>
                        <span className='anchor' ref={'anchor_' + key}/>
                        <MoreIcon color={this.props.muiTheme.palette.primary3Color} style={{width: '24px', height: '24px'}}/>
                        {this.state.showMenu && key === this.state.menuItem &&
                        <Popover open={this.state.showMenu && key === this.state.menuItem} anchorEl={this.refs['anchor_' + key]} anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                                 targetOrigin={{horizontal: 'right', vertical: 'top'}} onRequestClose={this.toggleMenu}>
                            <Menu desktop autoWidth={false} width='100px'>
                                {isAdmin && <MenuItem disabled={adminCount === 1} className='scenario-menu-item' primaryText='Revoke admin' onClick={() => this.toggleAdmin(user.sbmUserId, isAdmin)}/>}
                                {currentIsAdmin && !isAdmin && <MenuItem className='scenario-menu-item' primaryText='Make admin' onClick={() => this.toggleAdmin(user.sbmUserId, isAdmin)}/>}
                                <MenuItem disabled={!canRemoveUser} className='scenario-menu-item'
                                          primaryText={user.sbmUserId === this.props.user.sbmUserId ? 'Leave sandbox' : 'Remove user'}
                                          onClick={() => this.handleOpen(user.sbmUserId)}/>
                            </Menu>
                        </Popover>}
                    </IconButton>
                </TableRowColumn>
            </TableRow>
        });
    };

    handleInviteEmailChange = (event) => {
        this.setState({email: event.target.value, emailError: undefined});
    };

    getInvitations = () => {
        if (this.props.userInvitesLoading) {
            return <TableRow>
                <TableRowColumn colSpan={3} style={{textAlign: 'center'}}>
                    <CircularProgress/>
                </TableRowColumn>
            </TableRow>
        } else {
            let buttonStyles = {width: '30px', height: '30px', color: this.props.muiTheme.palette.primary3Color};
            let style = {width: '55px', height: '55px'};
            let revokeStyle = {width: '30px', height: '30px', color: this.props.muiTheme.palette.primary4Color};

            return this.props.invitations.map((invitation, key) => {
                let timestamp = invitation.inviteTimestamp;
                if (timestamp !== undefined) {
                    timestamp = new Date(timestamp);
                    timestamp = timestamp.getFullYear() + '-' + ('0' + (timestamp.getMonth() + 1)).slice(-2) + '-' + ('0' + timestamp.getDate()).slice(-2);
                } else {
                    timestamp = '';
                }
                return <TableRow key={key}>
                    <TableRowColumn>{invitation.invitee.email}</TableRowColumn>
                    <TableRowColumn>{timestamp}</TableRowColumn>
                    <TableRowColumn className='invite-buttons-wrapper'>
                        <IconButton iconStyle={buttonStyles} style={style} onClick={() => this.resendEmail(invitation.invitee.email)} tooltip='Resend'>
                            <Redo/>
                        </IconButton>
                        <IconButton iconStyle={revokeStyle} style={style} onClick={() => this.revokeInvitation(invitation.id)} tooltip='Revoke'>
                            <DeleteIcon/>
                        </IconButton>
                    </TableRowColumn>
                </TableRow>;
            });
        }
    };

    resendEmail = (email) => {
        EMAIL_REGEX.test(String(email).toLowerCase()) && this.props.inviteNewUser(email);
        this.handleClose();
        this.setState({action: 'sending'});
    };

    revokeInvitation = (id) => {
        this.props.removeInvitation(id);
        this.handleClose();
        this.setState({action: 'rejecting'});
    };

    toggleMenu = (menuItem) => {
        this.setState({showMenu: !this.state.showMenu, menuItem});
    };

    toggleAdmin = (userId, toggle) => {
        this.props.toggleUserAdminRights(userId, !toggle);
        this.toggleMenu();
    };

    handleOpen = (userId) => {
        this.setState({open: true, userToRemove: userId});
        this.toggleMenu();
    };

    handleClose = () => {
        this.setState({open: false, invitationsModal: false, inviteModal: false});
    };

    handleSendInvite = () => {
        if (EMAIL_REGEX.test(String(this.state.email).toLowerCase())) {
            this.props.inviteNewUser(this.state.email);
            this.setState({email: '', action: 'sending'});
            this.handleClose();
        } else {
            this.setState({emailError: 'Please enter a valid email address!'});
        }
    };

    deleteSandboxUserHandler = () => {
        this.setState({userToRemove: undefined});
        this.props.removeUser(this.state.userToRemove, this.props.history);
    };
}

const mapStateToProps = state => {
    return {
        invitations: state.sandbox.invitations,
        userInvitesLoading: state.sandbox.invitesLoading,
        inviting: state.sandbox.inviting,
        sandbox: state.sandbox.sandboxes.find(i => i.sandboxId === sessionStorage.sandboxId),
        user: state.users.user,
        updatingUser: state.sandbox.updatingUser,
        loginInfo: state.sandbox.userLoginInfo || []
    }
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({fetchSandboxInvites, removeUser, toggleUserAdminRights, inviteNewUser, removeInvitation}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(withRouter(Users)));
