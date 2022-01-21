import React from "react";
import {Button, Form, FormGroup, Input, Label} from "reactstrap";
import axios from "axios";
import {API_URL_P} from "../../constants/api";

class NewPaperForm extends React.Component {
    state = {
        pk: 0, title: "", name: "", course_id: "", course_instructor: "", batch: "", gdrive_link: ""
    };

    componentDidMount() {
        if (this.props.note) {
            const {pk, title, name, course_id, course_instructor, batch, gdrive_link} = this.props.note;
            this.setState({pk, title, name, course_id, course_instructor, batch, gdrive_link});
        }
    }

    onChange = e => {
        this.setState({[e.target.name]: e.target.value});
    };

    createNote = e => {
        e.preventDefault();
        axios.post(API_URL_P, this.state).then(() => {
            this.props.resetState();
            this.props.toggle();
        });
    };


    defaultIfEmpty = value => {
        return value === "" ? "" : value;
    };

    render() {
        return (
            <Form onSubmit={this.createNote}>
                <FormGroup>
                    <Label for="title" style={{fontSize: "2em"}}>Course name:</Label>
                    <Input
                        type="text"
                        name="title"
                        bsSize="lg"
                        onChange={this.onChange}
                        value={this.defaultIfEmpty(this.state.title)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="name" style={{fontSize: "2em"}}>Author:</Label>
                    <Input
                        type="text"
                        name="name"
                        bsSize="lg"
                        onChange={this.onChange}
                        value={this.defaultIfEmpty(this.state.name)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="course_id" style={{fontSize: "2em"}}>Course id:</Label>
                    <Input
                        type="text"
                        name="course_id"
                        bsSize="lg"
                        onChange={this.onChange}
                        value={this.defaultIfEmpty(this.state.course_id)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="course_instructor" style={{fontSize: "2em"}}>Course instructor:</Label>
                    <Input
                        type="text"
                        name="course_instructor"
                        bsSize="lg"
                        onChange={this.onChange}
                        value={this.defaultIfEmpty(this.state.course_instructor)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="batch" style={{fontSize: "2em"}}>Batch:</Label>
                    <Input
                        type="select"
                        name="batch"
                        bsSize="lg"
                        onChange={this.onChange}
                        value={this.defaultIfEmpty(this.state.batch)}
                    >
                        <option> </option>
                        <option>2016</option>
                        <option>2017</option>
                        <option>2018</option>
                        <option>2019</option>
                        <option>2020</option>
                        <option>2021</option>
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="gdrive_link" style={{fontSize: "2em"}}>Link:</Label>
                    <Input
                        type="url"
                        name="gdrive_link"
                        bsSize="lg"
                        onChange={this.onChange}
                        value={this.defaultIfEmpty(this.state.gdrive_link)}
                    />
                </FormGroup>

                <Button style={{minWidth: "100px", backgroundColor: "#3c52ad"}}><span>SUBMIT</span></Button>
            </Form>

        );
    }
}

export default NewPaperForm;