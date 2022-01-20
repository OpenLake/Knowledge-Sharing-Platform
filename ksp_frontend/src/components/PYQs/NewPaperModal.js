import React, {Component, Fragment} from "react";
import {Button, Modal, ModalHeader, ModalBody} from "reactstrap";
import NewForm from "../NewForm";
import "../../App.css";

class NewPaperModal extends Component {
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
            var title = "ADD NEW PAPERS";

            var button = (
                <Button
                    onClick={this.toggle}
                    className="button-style"
                    style={{backgroundColor: "#3c52ad"}}

                >
                    <span> ADD PAPER </span>
                </Button>
            );
        }

        return (
            <Fragment>
                <div className="button">
                    {button}
                </div>

                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}><span>{title}</span></ModalHeader>

                    <ModalBody>
                        <NewForm
                            resetState={this.props.resetState}
                            toggle={this.toggle}
                            student={this.props.student}
                        />
                    </ModalBody>
                </Modal>
            </Fragment>
        );
    }
}

export default NewPaperModal;
