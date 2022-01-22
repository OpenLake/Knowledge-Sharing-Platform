import React from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import axios from "axios";
import { API_URL_F } from "../../constants/api";

class NewFeedbackForm extends React.Component {
  state = {
    pk: 0 , title: "" ,name: "", course_id: "",course_instructor: "",batch: "",Feedback: ""
  };

  componentDidMount() {
    if (this.props.note) {
      const { pk, title ,name, course_id,course_instructor,batch,Feedback } = this.props.note;
      this.setState({ pk, title ,name, course_id,course_instructor,batch,Feedback });
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  createNote = e => {
    e.preventDefault();
    axios.post(API_URL_F, this.state).then(() => {
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
          <Label for="course_id" style={{fontSize: "2em"}}>Course ID:</Label>
          <Input
            type="text"
            name="course_id"
            bsSize="lg"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.course_id)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="course_instructor" style={{fontSize: "2em"}}>Course Instructor:</Label>
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
          <Label for="Feedback" style={{fontSize: "2em"}}>Feedback:</Label>
          <Input
            type="text"
            name="Feedback"
            bsSize="lg"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.Feedback)}
          />
        </FormGroup>

        <Button style={{minWidth: "100px", backgroundColor: "#3c52ad"}}><span>SUBMIT</span></Button>
      </Form>

    );
  }
}

export default NewFeedbackForm;