import React, { Component } from 'react';
import { RaisedButton, TextField, Dialog, RadioButtonGroup, RadioButton } from 'material-ui';

import './styles.less';
import PersonaList from "../PersonaList";

export default class CreatePersona extends Component {

    constructor (props) {
        super(props);

        this.state = {
            dialogVisible: false,
            date: undefined,
            name: '',
            fName: '',
            birthDate: '',
            suffix: '',
            speciality: '',
            role: '',
            gender: ''
        };
    }

    render () {
        return <div>
            <Dialog open={this.state.dialogVisible} onRequestClose={this.toggleDialog} actions={[<RaisedButton label='Create' onClick={this.create} primary />]}>
                <TextField floatingLabelText='Name' fullWidth value={this.state.name} onChange={(_, name) => this.setState({ name })} />
                <TextField floatingLabelText='Family name' fullWidth value={this.state.fName} onChange={(_, fName) => this.setState({ fName })} />

                {this.props.type === PersonaList.TYPES.patient &&
                <div>
                    <TextField floatingLabelText="Birth date" hintText='YYYY-MM-DD' fullWidth value={this.state.birthDate}
                               onChange={(_, birthDate) => this.setState({ birthDate })} />
                    <h4>Gender</h4>
                    <RadioButtonGroup name="gender" valueSelected={this.state.gender} onChange={(_, gender) => this.setState({ gender })}>
                        <RadioButton value="male" label="Male" />
                        <RadioButton value="female" label="Female" />
                    </RadioButtonGroup>
                </div>}
                {this.props.type === PersonaList.TYPES.practitioner &&
                <div>
                    <TextField floatingLabelText="Suffix" hintText='MD ...' fullWidth value={this.state.suffix} onChange={(_, suffix) => this.setState({ suffix })} />
                    <TextField floatingLabelText="Speciality" hintText='Cardiology ...' fullWidth value={this.state.speciality}
                               onChange={(_, speciality) => this.setState({ speciality })} />
                    <TextField floatingLabelText="Role" hintText='Doctor ...' fullWidth value={this.state.role} onChange={(_, role) => this.setState({ role })} />
                </div>}
            </Dialog>
            <RaisedButton label='Create' onClick={this.toggleDialog} primary />
        </div>
    }

    toggleDialog = () => {
        this.setState({ dialogVisible: !this.state.dialogVisible });
    };

    create = () => {
        let data = {
            "active": true,
            "resourceType": this.props.type,
            "name": [{ "given": [this.state.name], "family": [this.state.fName], "text": `${this.state.name} ${this.state.fName}` }]
        };
        if (this.props.type === PersonaList.TYPES.patient) {
            data.birthDateTime = `${this.state.birthDate}T00:00:00.000Z`;
            data.gender = this.state.gender;
            data.birthDate = this.state.birthDate;
        } else {
            data.suffix = this.state.suffix;
            data.speciality = this.state.speciality;
            data.role = this.state.role;
        }

        this.props.create && this.props.create(data);
        this.toggleDialog();
    };
}