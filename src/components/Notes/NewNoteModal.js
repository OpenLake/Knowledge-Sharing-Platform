import React, {Component, Fragment} from "react";
import {Button, Modal, ModalHeader, ModalBody} from "reactstrap";
import NewNoteForm from "./NewNoteForm";
import "../../App.css";

class NewNoteModal extends Component {
    state = {
        modal: false
    };

    toggle = () => {
        this.setState(previous => ({
            modal: !previous.modal
        }));
    };

    render() {
        const create = this.props.create;

        if (create) {
            var title = "ADD NEW NOTES";

            var button = (
                <Button
                    onClick={this.toggle}
                    className="button-style"
                    style={{backgroundColor: "#3c52ad"}}
                >
                    <span> ADD NOTES </span>
                </Button>
            );
        }

        return (
            <Fragment>
                <div className="button">
                    {button}
                </div>

                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}> <span>{title}</span> </ModalHeader>

                    <ModalBody>
                        <NewNoteForm
                            resetState={this.props.resetState}
                            toggle={this.toggle}
                            note={this.props.note}
                        />
                    </ModalBody>
                </Modal>
            </Fragment>
        );
    }
}

export default NewNoteModal;
