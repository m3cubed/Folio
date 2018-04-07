import React from "react";
import firebase from "firebase";
import { app, base } from "./base";
import {
  Button,
  Modal,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
} from "react-bootstrap";

class LessonPlanList extends React.Component {
  constructor() {
    super();
    this.state = {
      lessonTitle: "",
      show: false,
      FireBaseDates: {},
    };
    this.handleChange = this.handleChange.bind(this);
    this.lessonAdd = this.lessonAdd.bind(this);
  }
  componentWillMount() {
    this.removeAuthListener = app.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authenticated: true,
          currentUser: user,
          loading: false,
        });

        this.dateRef = base.syncState(`users/${user.uid}/date`, {
          context: this,
          state: "FireBaseDates",
        });
      } else {
        this.setState({
          authenticated: false,
          currentUser: null,
          loading: false,
        });
      }
    });
  }

  handleChange(e) {
    this.setState({ lessonTitle: e.target.value });
  }

  /*dateValueAdd = () => {
    const FireBaseDates = { ...this.state.FireBaseDates };
    const user = firebase.auth().currentUser;
    const id = Date.now();
    FireBaseDates[id] = {
      id: id,
      owner: user.uid,
      date: this.state.lessonTitle,
    };
    this.setState({ FireBaseDates });
    this.setState({ show: false});
  };*/

  lessonAdd = () => {
    const user = firebase.auth().currentUser;
    var immediatelyAvailableReference = base
      .push(`users/${user.uid}/lesson`, {
        data: {
          lessonTitle: `${this.state.lessonTitle}`,
          owner: `${user.uid}`,
        },
      })
      .then(newLocation => {
        var generatedKey = newLocation.key;
        this.setState({
          show: false,
        });
      })
      .catch(err => {
        //handle error
      });
    //available immediately, you don't have to wait for the Promise to resolve
    var generatedKey = immediatelyAvailableReference.key;
  };

  render() {
    return (
      <div>
        <div>
          <Modal
            show={this.state.show}
            onHide={() => {
              this.setState({ show: false });
            }}
          >
            <Modal.Header>
              <Modal.Title>Pick a Date</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form inline>
                <FormGroup controlId="formBasicText">
                  <ControlLabel>Input title: </ControlLabel>
                  <FormControl
                    type="text"
                    value={this.state.lessonTitle}
                    placeholder="Enter text"
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                onClick={() => {
                  this.setState({ show: false });
                }}
              >
                Close
              </Button>
              <Button bsStyle="primary" onClick={this.lessonAdd}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
        </div>

        <div>
          <Button
            onClick={() => {
              this.setState({ show: true });
            }}
          >
            Add New A Lesson Plan
          </Button>
          <div>
            <Button
              onClick={() => {
                var user = firebase.auth().currentUser;
                console.log(user);
              }}
            >
              User Check
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default LessonPlanList;
