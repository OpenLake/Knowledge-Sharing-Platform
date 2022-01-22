import React, {Component} from "react";
import {Col, Container, Row} from "reactstrap";
import NewPaperModal from "./NewPaperModal";
import axios from "axios";
import NoteList from "./NoteList";
import {API_URL_P} from "../../constants/api";
import "../../App.css";

class Home1 extends Component {
    state = {
        notes: []
    };

    componentDidMount() {
        this.resetState();
    }

    getNotes = () => {
        axios.get(API_URL_P).then(res => this.setState({notes: res.data}));
    };

    resetState = () => {
        this.getNotes();
    };

    render() {
        return (
            <Container style={{marginTop: "6%"}}>
                <Row>
                    <Col>
                        <NewPaperModal create={true} resetState={this.resetState}/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <NoteList
                            notes={this.state.notes}
                            resetState={this.resetState}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Home1;