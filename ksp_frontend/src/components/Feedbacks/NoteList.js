import React, { Component } from "react";
import { Table } from "reactstrap";
import "../../App.css";


class NoteList extends Component {
  render() {
    const notes = this.props.notes;
    return (
      <Table dark bordered responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Name</th>
            <th>Course ID</th>
            <th>Batch</th>
            <th>Course Instructor</th>
            <th>Feedback</th>
          </tr>
        </thead>
        <tbody>
          {!notes || notes.length <= 0 ? (
            <tr>
              <td colSpan="6" align="center" width="400px">
                <b>Oops, nothing here yet</b>
              </td>
            </tr>
          ) : (
            notes.map(note => (
              <tr key={note.pk}>
                <td>{note.title}</td>
                <td>{note.name}</td>
                <td>{note.course_id}</td>
                <td>{note.batch}</td>
                <td>{note.course_instructor}</td>
                <td>{note.feedback}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    );
  }
}

export default NoteList;
