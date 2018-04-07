import React from "react";
import { render } from "react-dom";
import ReactGridLayout from "react-grid-layout";
import "./base.css";
import _ from "lodash";
import SNC1D from "./SNC1D.js";
import CourseSelector from "./Course Selector.js";
import { ReactHeight } from "react-height";
import PropTypes from "prop-types";
import "./LessonPlanner.css";
import "./checkbox.js";
import GridModal from "./Modal";
import {
  Button,
  Modal,
  Glyphico,
  ListGroup,
  ListGroupItem,
  Dropdown,
  DropdownButton,
  MenuItem,
  Nav,
  NavItem,
  Table,
  FormGroup,
  FormControl,
  LabelGroup,
  ControlLabel,
  Form,
} from "react-bootstrap";
import LessonCalendar from "./Lesson Calendar.js";
import firebase from "firebase";
import { auth, base, app, store } from "./base";

const teachingStrat = [
  "Think-Pair-Share",
  "Numbered Heads",
  "Direct Instruction",
  "Seminar",
  "Questioning/Socratic",
  "Interview",
  "Simulation/Role Play",
  "Debate",
  "Small Group Work",
  "Case Study",
  "Presentation",
  "Computer Lab",
  "Video/Film",
  "Surverys",
  "Jigsaw",
  "Class Discussion",
  "Concept Attainment/Formation",
  "Four Corners",
  "Cloze Passage",
  "Brainstorm/Concept Mapping",
  "Learning Centers",
  "Portfolio",
  "Independent Study",
  "Articles",
  "PML/KWL",
  "Note Making",
  "Graphic Organizer",
  "Case Studies",
  "Anticipation Guide",
  "Inquiry",
];

const assessment = [
  "Test/Quiz",
  "Presentations",
  "Observation",
  "Exit Card",
  "Boardrooms",
  "Challenges",
  "Self/Peer Assessment",
  "Mini Challenges",
  "Conversation/Conferences",
  "Learning Skill",
  "Lab Activity",
];

const achievement = [
  "Knowledge/Understanding",
  "Thinking",
  "Communication",
  "Application",
];

const materials = [
  "Moodle",
  "Video",
  "Film",
  "Handouts",
  "LCD",
  "Computers/Laptops",
  "Course Pack/Textbook",
];

const accomodations = [
  "Notes/Organizers",
  "Extra Time",
  "Breaks",
  "Chunking of Lesson",
  "SEA laptops",
];

const styles = {
  fontFamily: "sans-serif",
  textAlign: "left",
  width: "1203px",
  margin: "0 auto",
};

const gridItem = {
  backgroundColor: "white",
  color: "light grey",
  border: "3px solid grey",
  overflowY: "hidden",
  whiteSpace: "pre-wrap",
  wordWrap: "break-word",
  overflowX: "hidden",
};

const para = {
  overflowY: "hidden",
};

const textbox = {
  width: "100%",
  height: "300px",
  margin: "0 auto",
  resize: "none",
  borderRadius: "3px",
  marginTop: "12px",
};

/*var layout = [];
for (var i = 0; i < 4; i++) {
  var layouti = { i: "N" + i.toString(), x: 0 + 3 * i, y: 0, w: 3, h: 30 };
  layout.push(layouti);
}*/

class MyFirstGrid extends React.Component {
  componentDidMount() {
    var thisState = this.state;
    for (let a = 0; a < teachingStrat.length; a++) {
      this.setState({
        [teachingStrat[a]]: false,
      });
    }
    for (let a = 0; a < assessment.length; a++) {
      this.setState({
        [assessment[a]]: false,
      });
    }
    for (let a = 0; a < achievement.length; a++) {
      this.setState({
        [achievement[a]]: false,
      });
    }
    for (let a = 0; a < accomodations.length; a++) {
      this.setState({
        [accomodations[a]]: false,
      });
    }
    for (let a = 0; a < materials.length; a++) {
      this.setState({
        [materials[a]]: false,
      });
    }
  }
  static defaultProps = {
    className: "layout",
    cols: 12,
    rowHeight: 30,
    width: 1200,
  };
  constructor(props) {
    super(props);

    this.state = {
      HeightN0: 30,
      modalType: "",
      whichModal: "",
      checkBoxType: "teachingStrat",
      show: false,
      gridNUM: 4,
    };
    //this.courseContent = this.courseContent.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  toggleModal = e => {
    console.log(e.target.id);
    this.setState({
      show: !this.state.show,
      whichModal: e.target.id,
    });
    console.log(this.state.whichModal);
  };

  toggleModalClose = e => {
    this.setState({
      show: !this.state.show,
      whichModal: "",
    });
  };

  handleChange = e => {
    var text = e.target.value;
    this.setState({
      [e.target.id]: text.toString(),
    });
  };

  handleMainContent = value => {
    this.setState({
      [this.state.whichModal]: value,
    });
  };

  textChoose = e => {
    this.setState({
      [e.target.id]: "",
    });
  };
  gridNUMincrease = () => {
    this.setState({
      gridNUM: this.state.gridNUM + 1,
    });
  };
  checkBoxChange = e => {
    this.setState({
      checkBoxType: e.target.value,
    });
  };

  tableOutput = value => {
    var table = (
      <div>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>Time</th>
              <th className="Table_Width">Content</th>
            </tr>
          </thead>
          <tbody>{value}</tbody>
        </Table>
      </div>
    );
    console.log(table);
    this.setState({ [this.state.whichModal]: table });
  };

  checkBoxToggle = e => {
    var thisState = this.state;
    this.setState({
      [e.target.id]: !thisState[e.target.id],
    });
  };

  checkBoxSubmit = e => {
    e.preventDefault();
    const gridContent = [];
    var thisState = this.state;
    switch (this.state.checkBoxType) {
      case "teachingStrat":
        for (let j = 0; j < teachingStrat.length; j++) {
          if (thisState[teachingStrat[j]] === true) {
            gridContent.push(
              <li key={teachingStrat[j]}>{teachingStrat[j]}</li>,
            );
          }
        }
        this.setState({
          [this.state.whichModal]: gridContent,
        });
        break;
      case "assessment":
        for (let j = 0; j < assessment.length; j++) {
          if (thisState[assessment[j]] === true) {
            gridContent.push(<li key={assessment[j]}>{assessment[j]}</li>);
          }
        }
        this.setState({
          [this.state.whichModal]: gridContent,
        });
        break;
      case "achievement":
        for (let j = 0; j < achievement.length; j++) {
          if (thisState[achievement[j]] === true) {
            gridContent.push(<li key={achievement[j]}>{achievement[j]}</li>);
          }
        }
        this.setState({
          [this.state.whichModal]: gridContent,
        });
        break;
      case "materials":
        for (let j = 0; j < materials.length; j++) {
          if (thisState[materials[j]] === true) {
            gridContent.push(<li key={materials[j]}>{materials[j]}</li>);
          }
        }
        this.setState({
          [this.state.whichModal]: gridContent,
        });
        break;
      case "accomodations":
        for (let j = 0; j < accomodations.length; j++) {
          if (thisState[accomodations[j]] === true) {
            gridContent.push(
              <li key={accomodations[j]}>{accomodations[j]}</li>,
            );
          }
        }
        this.setState({
          [this.state.whichModal]: gridContent,
        });
      default:
        return null;
    }
  };

  checkBoxContent() {
    var checkBox = [];
    var thisState = this.state;
    switch (this.state.checkBoxType) {
      case "teachingStrat":
        for (let j = 0; j < teachingStrat.length; j++) {
          checkBox.push(
            <ListGroupItem
              className="list-group-item"
              key={teachingStrat[j]}
              id={teachingStrat[j]}
              value={teachingStrat[j]}
              onClick={this.checkBoxToggle}
              active={thisState[teachingStrat[j]]}
            >
              {teachingStrat[j]}
            </ListGroupItem>,
          );
        }
        return (
          <form onSubmit={this.checkBoxSubmit}>
            <fieldset>
              <ListGroup componentClass="ul">{checkBox}</ListGroup>
              <div>
                <button type="submit" id="teachingStrat">
                  Submit
                </button>
              </div>
            </fieldset>
          </form>
        );
      case "assessment":
        for (let j = 0; j < assessment.length; j++) {
          checkBox.push(
            <ListGroupItem
              className="list-group-item"
              key={assessment[j]}
              id={assessment[j]}
              value={assessment[j]}
              onClick={this.checkBoxToggle}
              active={thisState[assessment[j]]}
            >
              {assessment[j]}
            </ListGroupItem>,
          );
        }
        return (
          <form onSubmit={this.checkBoxSubmit}>
            <fieldset>
              <ListGroup componentClass="ul">{checkBox}</ListGroup>
              <div>
                <button type="submit" id="assessment">
                  Submit
                </button>
              </div>
            </fieldset>
          </form>
        );
      case "achievement":
        for (let j = 0; j < achievement.length; j++) {
          checkBox.push(
            <ListGroupItem
              className="list-group-item"
              key={achievement[j]}
              id={achievement[j]}
              value={achievement[j]}
              onClick={this.checkBoxToggle}
              active={thisState[achievement[j]]}
            >
              {achievement[j]}
            </ListGroupItem>,
          );
        }
        return (
          <form onSubmit={this.checkBoxSubmit}>
            <fieldset>
              <ListGroup componentClass="ul">{checkBox}</ListGroup>
              <div>
                <button type="submit" id="achievement">
                  Submit
                </button>
              </div>
            </fieldset>
          </form>
        );
      case "materials":
        for (let j = 0; j < materials.length; j++) {
          checkBox.push(
            <ListGroupItem
              className="list-group-item"
              key={materials[j]}
              id={materials[j]}
              value={materials[j]}
              onClick={this.checkBoxToggle}
              active={thisState[materials[j]]}
            >
              {materials[j]}
            </ListGroupItem>,
          );
        }
        return (
          <form onSubmit={this.checkBoxSubmit}>
            <fieldset>
              <ListGroup componentClass="ul">{checkBox}</ListGroup>
              <div>
                <button type="submit" id="materials">
                  Submit
                </button>
              </div>
            </fieldset>
          </form>
        );
      case "accomodations":
        for (let j = 0; j < accomodations.length; j++) {
          checkBox.push(
            <ListGroupItem
              className="list-group-item"
              key={accomodations[j]}
              id={accomodations[j]}
              value={accomodations[j]}
              onClick={this.checkBoxToggle}
              active={thisState[accomodations[j]]}
            >
              {accomodations[j]}
            </ListGroupItem>,
          );
        }
        return (
          <form onSubmit={this.checkBoxSubmit}>
            <fieldset>
              <ListGroup componentClass="ul">{checkBox}</ListGroup>
              <div>
                <button type="submit" id="accomodations">
                  Submit
                </button>
              </div>
            </fieldset>
          </form>
        );
      default:
        return null;
    }
  }

  textSelectClear = e => {
    var renderModals = e.target.id;
    var thisState = this.state;
    console.log(thisState[renderModals]);
    this.setState({
      [thisState[renderModals]]: "",
    });
  };

  renderHeading = e => {
    console.log(e.target.value);
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  modalContent() {
    var renderModals = this.state.whichModal;
    var thisState = this.state;
    var modalType = "modalType" + renderModals;
    switch (thisState[modalType]) {
      case "Text":
        return (
          <div>
            <textarea
              style={textbox}
              onChange={this.handleChange}
              id={renderModals}
              value={thisState[renderModals]}
            />
          </div>
        );
      case "Curriculum":
        return (
          <CourseSelector
            courseMainContent={this.handleMainContent.bind(this)}
            className={renderModals}
          />
        );
      case "Checkbox":
        return (
          <div>
            <select onChange={this.checkBoxChange.bind(this)}>
              <option value="teachingStrat">Teaching Strategies</option>
              <option value="assessment">Assessment/Evaluation</option>
              <option value="achievement">Achievement</option>
              <option value="materials">Materials/Tools</option>
              <option value="accomodations">Accomodations</option>
            </select>
            {this.checkBoxContent(this.state.checkBoxType)}
          </div>
        );
      case "Lesson Calendar":
        return <LessonCalendar tableOutput={this.tableOutput.bind(this)} />;
      default:
        return null;
    }
  }

  renderModal() {
    var renderModals = this.state.whichModal;
    var thisState = this.state;
    var modalType = "modalType" + renderModals;
    let jHeading = "Heading" + renderModals;
    switch (this.state.whichModal) {
      case renderModals:
        return (
          <div key={renderModals} id={renderModals}>
            <Modal
              show={this.state.show}
              onHide={this.toggleModalClose}
              animation={true}
            >
              <Modal.Header closeButton>
                <Modal.Title>Pick Your Poison</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div>
                  <h4>Heading</h4>
                  <textarea
                    className="Heading_Input"
                    placeholder="Click here to type the heading."
                    id={jHeading}
                    onChange={this.renderHeading}
                  />
                </div>
                <div>
                  <select
                    className="Drop_Down"
                    id={renderModals}
                    onChange={this.modalChange.bind(this)}
                    value={thisState[modalType]}
                  >
                    <option value="" />
                    <option value="Curriculum"> Curriculum </option>
                    <option
                      value="Text"
                      id={renderModals}
                      onClick={this.textChoose}
                    >
                      Text
                    </option>
                    <option value="Checkbox">Checkbox</option>
                    <option value="Lesson Calendar">Lesson Calendar</option>
                  </select>

                  {this.modalContent(thisState[modalType])}
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.toggleModalClose}>Close</Button>
              </Modal.Footer>
            </Modal>
          </div>
        );

      default:
        return null;
    }
  }
  modalChange = e => {
    var modalType = "modalType" + e.target.id;
    var thisState = this.state;
    console.log(e.target.id);
    console.log(e.target.value);
    this.setState({
      [e.target.id]: null,
      [modalType]: e.target.value,
    });
  };

  renderHeight(height) {
    var layoutHeight = Math.ceil(height / 10).toString();
  }

  render() {
    //create the content on each grid dynamically--------------------------------
    let gridNUM = this.state.gridNUM;
    let rows = [];
    for (let j = 0; j < gridNUM + 1; j++) {
      var Nj = "N" + j;
      let jHeight = "Height" + Nj;
      let jHeading = "Heading" + Nj;
      var newState = this.state;
      if (j === 0) {
        rows.push(
          <div
            style={gridItem}
            key={Nj}
            data-grid={{
              i: "N" + j,
              x: 3,
              y: 0,
              w: 30,
              h: 2,
              static: true,
            }}
          >
            {/*this.props.selected????*/}
            {/*Height detector----------------------------*/}
            <ReactHeight onHeightReady={height => console.log(height)}>
              <div className="Modal_Div" className="Name_Date_Div">
                <p>
                  <strong>Lesson:</strong>
                </p>
              </div>
              <div>
                <textarea
                  className="LessonText"
                  placeholder="Click here to type"
                />
              </div>
            </ReactHeight>
            {/*---------------------------------------------*/}
          </div>,
        );
      } else {
        rows.push(
          <div
            style={gridItem}
            key={Nj}
            data-grid={{
              i: "N" + j,
              x: 3 + 3 * j,
              y: 0,
              w: 30,
              h: 4,
            }}
          >
            <div className="Heading_Div">{newState[jHeading]}</div>
            <div className="Grid_Display">{newState[Nj]}</div>
            {/*<button
                className="Modal_Button"
                onClick={this.toggleModal}
                id={Nj}
              >
                <i className="fas fa-edit" />
              </button>*/}
            <GridModal Nj={Nj} />
          </div>,
        );
      }
    }
    //create the content on each grid dynamically END--------------------------------------------------------------------
    return (
      <div>
        {this.renderModal(this.state.whichModal)}
        <ReactGridLayout
          draggableCancel="input, textarea ,button"
          {...this.props}
        >
          {/*Regular Grids------------------------------------------*/}
          {rows}
          {/*-------------------------------------------------------*/}
        </ReactGridLayout>
        <Button onClick={this.gridNUMincrease}>+</Button>
        <Button
          onClick={() => {
            var user = firebase.auth().currentUser;
            console.log(user);
          }}
        >
          User Check
        </Button>
        <Button
          onClick={() => {
            const uid = firebase.auth().currentUser.uid;
            this.setState({
              uid: uid,
            });
            const state = this.state;
            base.post(`users/${uid}/lessonplan`, { data: { state: state } });
          }}
        >
          Save States
        </Button>
        <Button
          onClick={() => {
            console.log(this.state);
          }}
        >
          Check State
        </Button>
      </div>
    );
  }
}

class DatePicker extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      DateValue: "",
    };
  }

  componentWillMount() {
    this.removeAuthListener = app.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authenticated: true,
          currentUser: user,
          loading: false,
        });

        this.dateRef = base.syncState(`date/${user.uid}`, {
          context: this,
          state: "date",
        });
      } else {
        this.setState({
          authenticated: false,
          currentUser: null,
          loading: false,
        });

        base.removeBinding(this.dateRef);
      }
    });
  }

  componentWillUnmount() {
    this.removeAuthListener();
    base.removeBinding(this.dateRef);
  }

  handleChange(e) {
    this.setState({ DateValue: e.target.value });
  }

  render() {
    return (
      <Form inline>
        <FormGroup controlId="formBasicText">
          <ControlLabel>Input Date</ControlLabel>
          <FormControl
            type="text"
            value={this.state.DateValue}
            placeholder="Enter text"
            onChange={this.handleChange}
          />
        </FormGroup>
        <Button>Submit</Button>
      </Form>
    );
  }
}

const LessonPlanner = () => (
  <div>
    <DatePicker />
    <div style={styles}>
      <MyFirstGrid />
    </div>
  </div>
);
export default LessonPlanner;

MyFirstGrid.propTypes = {
  getElementHeight: PropTypes.func,
};
