import React from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import axios from "axios";
import { API_URL_N } from "../constants/api";

class NewNoteForm extends React.Component {
  state = {
    pk: 0 , title: "" ,name: "", course_id: "",course_instructor: "",batch: "",gdrive_link: ""
  };

  componentDidMount() {
    if (this.props.note) {
      const { pk, title ,name, course_id,course_instructor,batch,gdrive_link } = this.props.note;
      this.setState({ pk, title ,name, course_id,course_instructor,batch,gdrive_link });
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  createNote = e => {
    e.preventDefault();
    axios.post(API_URL_N, this.state).then(() => {
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
          <Label for="title">Title:</Label>
          <Input
            type="text"
            name="title"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.title)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="name">Name:</Label>
          <Input
            type="text"
            name="name"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.name)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="course_id">Course id:</Label>
          <Input
            type="text"
            name="course_id"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.course_id)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="course_instructor">Course instructor:</Label>
          <Input
            type="text"
            name="course_instructor"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.course_instructor)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="batch">Batch:</Label>
          <Input
            type="number"
            name="batch"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.batch)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="gdrive_link">Link:</Label>
          <Input
            type="text"
            name="gdrive_link"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.gdrive_link)}
          />
        </FormGroup>
  
        <Button>Send</Button>
      </Form>
      
    );
  }
}

export default NewNoteForm;
