import React, { Component } from "react";
import { Table } from "reactstrap";
import NewNoteModal from "./NewNoteModal";



class NoteList extends Component {
  render() {
    const notes = this.props.notes;
    return (
      <Table dark>
        <thead>
          <tr>
            <th>Title</th>
            <th>Name</th>
            <th>Course ID</th>
            <th>Batch</th>
            <th>Course Instructor</th>
            <th>Link</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {!notes || notes.length <= 0 ? (
            <tr>
              <td colSpan="6" align="center">
                <b>Ops, no one here yet</b>
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
                <td>{note.gdrive_link}</td>
                <td align="center">
                  <NewNoteModal
                    create={false}
                    note={note}
                    resetState={this.props.resetState}
                  />
                  &nbsp;&nbsp;
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    );
  }
}

export default NoteList;
