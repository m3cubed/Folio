import React from "react";
import ReactGridLayout from "react-grid-layout";
import PropTypes from "prop-types";
import "./LessonPlanner.css";
import GridModal from "./Modal";
import { message, List, Card, Steps, notification, Switch } from "antd";
import firebase from "@firebase/app";
import { store } from "./base";
import update from "immutability-helper";
import QuillEditor from "./Quill";
import { Timeline, TimelineEvent } from "react-event-timeline";
import TextareaAutosize from "react-autosize-textarea";

const Step = Steps.Step;

const styles = {
  fontFamily: "sans-serif",
  textAlign: "left",
  width: "1203px",
  margin: "0 auto"
};

class MyFirstGrid extends React.Component {
  componentDidMount() {
    document.title = "Lesson Plan Maker";

    this.removeAuthListener = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          currentUserID: user.uid,
          gridLoading: false
        });
        store
          .get(
            `/users/${this.state.currentUserID}/lessons/${
              this.props.Id.match.params.id
            }`,
            {
              context: this
            }
          )
          .then(data => {
            if (data.headings) {
              this.setState({
                headings: data.headings
              });
            }
            if (data.showHeadings) {
              this.setState({
                showHeadings: data.showHeadings
              });
            }
            if (data.layoutChange) {
              const layout = JSON.parse(data.layoutChange);

              if (data.rawData !== "{}") {
                const rawData = JSON.parse(data.rawData);

                this.setState(
                  {
                    lessonTitle: data.lessonTitle,
                    lessonDate: data.date,
                    layout: layout,
                    gridNUM: layout.length,
                    rawData: rawData,
                    gridLoading: false
                  },
                  function() {
                    const gridIDs = Object.keys(rawData);

                    for (let i in gridIDs) {
                      this.renderModalContent(gridIDs[i]);
                    }
                  }
                );
              } else {
                this.setState(
                  {
                    lessonTitle: data.lessonTitle,
                    lessonDate: data.date,
                    layout: layout,
                    gridNUM: layout.length,
                    gridLoading: false
                  },
                  function() {
                    this.renderGrids(this.state.layout);
                  }
                );
              }
            } else {
              this.setState(
                {
                  lessonTitle: data.lessonTitle,
                  lessonDate: data.date
                },
                function() {
                  this.renderGrids(this.state.layout);
                }
              );
            }
          });
      } else {
        this.setState({
          gridLoading: true
        });
      }
    });
  }
  componentWillUnmount() {
    const rawData = JSON.stringify(this.state.rawData);
    store.updateDoc(
      `/users/${this.state.currentUserID}/lessons/${
        this.props.Id.match.params.id
      }`,
      {
        layoutChange: this.state.layoutChange,
        rawData: rawData,
        lessonDate: this.state.lessonDate,
        lessonTitle: this.state.lessonTitle,
        headings: this.state.headings,
        showHeadings: this.state.showHeadings
      }
    );
  }
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      gridNUM: 4,
      addGrid: false,
      isDraggable: true,
      isResizable: true,
      layout: [],
      rawData: {},
      headings: {},
      modalGridID: "",
      showHeadings: {},
      viewOnly: false
    };
    this.renderGrids = this.renderGrids.bind(this);
    this.handleModalContent = this.handleModalContent.bind(this);
    this.renderModalContent = this.renderModalContent.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  createGridUID = () => {
    const uniqueID =
      Math.random()
        .toString(36)
        .substring(2) + new Date().getTime().toString(36);
    return uniqueID;
  };

  toggleModal = () => {
    this.setState({
      showModal: !this.state.showModal
    });
  };

  gridNUMincrease = () => {
    const data = this.state.layout;
    const id = this.createGridUID();
    data.push({
      i: id,
      x: Infinity,
      y: Infinity,
      w: 10,
      h: 5,
      minH: 5
    });
    this.setState(
      update(this.state, {
        layout: { $set: data },
        gridNUM: { $set: this.state.gridNUM + 1 },
        rawData: { $merge: { [id]: { type: "", data: [] } } }
      }),
      function() {
        this.renderGrids(this.state.layout);
      }
    );
  };

  handleModalContent = (data, gridID, type) => {
    //Write to rawData the gridID and what it will contain. rawData is meant to be sent to the database for storage.
    if (this.state.rawData[gridID]) {
      this.setState(
        update(this.state, {
          rawData: {
            [gridID]: { $merge: { type, data } }
          }
        }),
        function() {
          //Send gridID to be render to Grid
          this.renderModalContent(gridID);
        }
      );
    } else {
      this.setState(
        {
          rawData: Object.assign(
            { [gridID]: { type, data } },
            this.state.rawData
          )
        },
        function() {
          //Send gridID to be render to Grid
          this.renderModalContent(gridID);
        }
      );
    }
  };

  agendaDescriptionChange = (content, gridID, key) => {
    const rawData = this.state.rawData;
    rawData[gridID].data[key].description = content;
    this.setState(
      {
        rawData: rawData
      },
      function() {
        this.renderGrids(this.state.layout);
      }
    );
  };

  renderModalContent = gridID => {
    const rawData = this.state.rawData;
    const data = rawData[gridID].data;
    const type = rawData[gridID].type;
    let content;
    this.setState({
      modalGridID: ""
    });
    switch (type) {
      case "Curriculum": {
        const listContent = [];

        for (let i = 0; i < data.keys.length; i++) {
          listContent.push(
            <List.Item key={data.keys[i]}>
              <List.Item.Meta
                title={<strong>{data.keys[i]}.</strong>}
                description={data.description[i]}
              />
            </List.Item>
          );
        }

        content = (
          <div className="Modal-Content" key={`CurriculumList${gridID}`}>
            <h2 style={{ fontFamily: "Proxima Nova" }}>{data.course}</h2>
            <h3
              style={{
                margin: "0px",
                width: "200px",
                fontFamily: "Proxima Nova"
              }}
            >
              <i>{data.unit}</i>
            </h3>
            <hr style={{ marginTop: "4px" }} />
            <List>{listContent}</List>
          </div>
        );
        break;
      }
      case "Text": {
        if (data.blocks) return null;
        const JSONdata = JSON.parse(data);
        content = (
          <QuillEditor
            theme={"bubble"}
            default={JSONdata}
            id={gridID}
            modalContent={this.handleModalContent}
          />
        );
        break;
      }
      case "Checklist": {
        const cards = [];
        const keys = Object.keys(data);
        for (let i in keys) {
          const cardList = [];
          for (let j in data[keys[i]]) {
            cardList.push(<div key={j}>{data[keys[i]][j]}</div>);
          }
          cards.push(
            <Card title={keys[i]} key={keys[i]}>
              {cardList}
            </Card>
          );
        }
        content = (
          <div className="Modal-Content" key={`CheckBox${gridID}`}>
            {cards}
          </div>
        );
        break;
      }
      case "Agenda": {
        const steps = [];
        const agendaKeys = Object.keys(data);
        for (let i = agendaKeys.length - 1; i >= 0; i--) {
          steps.push(
            <TimelineEvent
              key={`AgendaItem${i}`}
              createdAt={`${data[agendaKeys[i]].time} min`}
              title={data[agendaKeys[i]].title}
              icon={<i className="fas fa-clock fa-lg" />}
              iconColor="#6fba1c"
              iconStyle={{ fontSize: "1.2em" }}
              titleStyle={{ fontSize: "15px" }}
              contentStyle={{ backgroundColor: "#e7f2f6", fontSize: "13px" }}
            >
              {/*<QuillEditor
                theme="snow"
                default={data[agendaKeys[i]].description}
                style={{
                  width: "100%",
                  backgroundColor: "transparent",
                  border: "none",
                  height: "fill"
                }}
                id={gridID}
                agendaKey={agendaKeys[i]}
                agendaContent={this.agendaDescriptionChange}
              />*/}
              <TextareaAutosize
                style={{
                  width: "100%",
                  backgroundColor: "transparent",
                  border: "none"
                }}
                onChange={e => {
                  this.agendaDescriptionChange(
                    e.target.value,
                    gridID,
                    agendaKeys[i]
                  );
                }}
                defaultValue={data[agendaKeys[i]].description}
              />
            </TimelineEvent>
          );
        }
        content = (
          <div className="Modal-Content" key={`Agenda${gridID}`}>
            <Timeline>{steps}</Timeline>
          </div>
        );
        break;
      }
      default:
        return null;
    }
    const gridIDContent = `${gridID}Content`;
    this.setState(
      {
        [gridIDContent]: content,
        modalGridID: ""
      },
      function() {
        this.renderGrids(this.state.layout);
      }
    );
  };

  toggleHeading = gridID => {
    const value = !this.state.showHeadings[gridID];

    this.setState(
      update(this.state, {
        showHeadings: {
          [gridID]: { $set: value }
        }
      }),
      function() {
        this.renderGrids(this.state.layout);
      }
    );
  };

  removeGrid = gridID => {
    const newLayout = this.state.layout.filter(
      item => item.i !== gridID.toString()
    );
    this.setState(
      {
        layout: newLayout,
        gridNUM: this.state.gridNUM - 1
      },
      function() {
        this.renderGrids(this.state.layout);
      }
    );
  };

  renderGrids = data => {
    const gridNUM = this.state.gridNUM;
    const rows = [];
    let layout = [];
    if (data[0] === undefined) {
      let rawData = {};

      for (let j = 0; j < gridNUM; j++) {
        const gridID = this.createGridUID();
        rawData = Object.assign({ [gridID]: { type: "", data: [] } }, rawData);

        if (j === 0) {
          layout.push({
            i: gridID,
            x: 3,
            y: 0,
            w: 30,
            h: 5,
            static: true
          });
          rows.push(
            <div key={gridID} data-grid={layout[j]}>
              <textarea
                className="LessonDate"
                placeholder="Date"
                onChange={e => {
                  if (e.target.value === "") {
                    message.error("Date cannot be empty!");
                  } else {
                    this.setState({ lessonDate: e.target.value });
                  }
                }}
                defaultValue={this.state.lessonDate}
              />
              <div>
                <textarea
                  className="LessonText"
                  placeholder="Lesson Title"
                  onChange={e => {
                    if (e.target.value === "") {
                      message.error("Title cannot be empty!");
                    } else {
                      this.setState({ lessonTitle: e.target.value });
                    }
                  }}
                  defaultValue={this.state.lessonTitle}
                />
              </div>
            </div>
          );
        } else {
          //const gridID = this.createGridUID();
          const thisState = this.state;
          const gridIDContent = `${gridID}Content`;
          layout.push({
            i: gridID,
            x: 3 + 3 * j,
            y: 0,
            w: 30,
            h: 5,
            minH: 5
          });
          rows.push(
            <div className="Grid_Main" key={gridID} data-grid={layout[j]}>
              <textarea
                className="Grid_Header"
                placeholder="Header"
                id={gridID}
                defaultValue={this.state.headings[gridID]}
                onChange={e => {
                  const headings = Object.defineProperty(
                    this.state.headings,
                    e.target.id,
                    {
                      value: e.target.value,
                      writable: true,
                      enumerable: true,
                      configurable: true
                    }
                  );
                  this.setState({
                    headings: headings
                  });
                }}
              />
              <div className="Grid_Drag_Handle">
                <span className="Grid_Custom_Menu">
                  <i className="fas fa-caret-down" />
                </span>
                <div className="Grid_Menu">
                  <button
                    className="Grid_Button"
                    style={{
                      backgroundColor: this.state.showHeadings[gridID]
                        ? "#0c69ce8c"
                        : "transparent"
                    }}
                    onClick={this.removeGrid.bind(this, gridID)}
                  >
                    <i className="fas fa-heading fa-2x" />
                    <br />
                    Heading
                  </button>

                  <button
                    className="Grid_Button"
                    onClick={e => {
                      this.setState({
                        modalGridID: gridID,
                        modalGridType: this.state.rawData[gridID].type
                      });
                      this.toggleModal();
                    }}
                  >
                    <i className="fas fa-plus-circle fa-2x" />
                    <br />
                    Content
                  </button>

                  <button
                    className="Grid_Button"
                    onClick={this.removeGrid.bind(this, gridID)}
                  >
                    <i className="fas fa-times fa-2x" />
                    <br />
                    Delete
                  </button>
                </div>
              </div>

              <div className="Grid_Content">{thisState[gridIDContent]}</div>
            </div>
          );
        }
      }

      this.setState({
        rawData: rawData
      });
    } else {
      layout = data;
      for (let j = 0; j < gridNUM; j++) {
        const gridID = data[j].i;

        if (j === 0) {
          rows.push(
            <div key={data[j].i} data-grid={layout[j]}>
              <textarea
                className="LessonDate"
                placeholder="Date"
                onChange={e => {
                  if (e.target.value === "") {
                    message.error("Date cannot be empty!");
                  } else {
                    this.setState({ lessonDate: e.target.value });
                  }
                }}
                defaultValue={this.state.lessonDate}
              />
              <div>
                <textarea
                  className="LessonText"
                  placeholder="Lesson Title"
                  onChange={e => {
                    if (e.target.value === "") {
                      message.error("Title cannot be empty!");
                    } else {
                      this.setState({ lessonTitle: e.target.value });
                    }
                  }}
                  defaultValue={this.state.lessonTitle}
                />
              </div>
            </div>
          );
        } else {
          const thisState = this.state;
          //Grid Content
          const gridIDContent = `${gridID}Content`;
          //Toggle Grid Headings
          let gridHeading;
          if (this.state.showHeadings[gridID] !== "" || undefined) {
            gridHeading = this.state.showHeadings[gridID];
          } else {
            Object.defineProperty(this.state.showHeadings, gridID, {
              value: true,
              writable: true,
              enumerable: true,
              configurable: true
            });
          }
          const display = gridHeading ? "initial" : "none";
          const headingHeight = gridHeading
            ? "calc(100% - 51px)"
            : "calc(100% - 10px)";
          //Make rows
          rows.push(
            <div className="Grid_Main" key={gridID} data-grid={layout[j]}>
              <textarea
                className="Grid_Header"
                placeholder="Header"
                id={gridID}
                defaultValue={this.state.headings[gridID]}
                style={{ display: display }}
                onChange={e => {
                  const headings = Object.defineProperty(
                    this.state.headings,
                    e.target.id,
                    {
                      value: e.target.value,
                      writable: true,
                      enumerable: true,
                      configurable: true
                    }
                  );
                  this.setState({
                    headings: headings
                  });
                }}
              />
              <div className="Grid_Drag_Handle">
                <span className="Grid_Custom_Menu">
                  <i className="fas fa-caret-down" />
                </span>

                <div className="Grid_Menu">
                  <button
                    style={{
                      backgroundColor: this.state.showHeadings[gridID]
                        ? "#0c69ce8c"
                        : "transparent"
                    }}
                    className="Grid_Button"
                    onClick={this.toggleHeading.bind(this, gridID)}
                  >
                    <i className="fas fa-heading fa-2x" />
                    <br />
                    Heading
                  </button>

                  <button
                    className="Grid_Button"
                    onClick={e => {
                      this.setState({
                        modalGridID: gridID,
                        modalGridType: this.state.rawData[gridID].type
                      });
                      this.toggleModal();
                    }}
                  >
                    <i className="fas fa-plus-circle fa-2x" />
                    <br />
                    Content
                  </button>

                  <button
                    className="Grid_Button"
                    onClick={this.removeGrid.bind(this, gridID)}
                  >
                    <i className="fas fa-trash-alt fa-2x" />
                    <br />
                    Delete
                  </button>
                </div>
              </div>
              <div className="Grid_Content" style={{ height: headingHeight }}>
                {thisState[gridIDContent]}
              </div>
            </div>
          );
        }
      }
      layout = data;
    }
    this.setState({
      layout: layout,
      gridRows: rows,
      layoutChange: JSON.stringify(layout)
    });
    return { rows };
  };

  openSaveNotification = () => {
    notification.open({
      message: "Lesson Plan Saved!",
      duration: 2
    });
  };

  saveDoc = () => {
    this.openSaveNotification();
    const rawData = JSON.stringify(this.state.rawData);
    store.updateDoc(
      `/users/${this.state.currentUserID}/lessons/${
        this.props.Id.match.params.id
      }`,
      {
        layoutChange: this.state.layoutChange,
        rawData: rawData,
        lessonDate: this.state.lessonDate,
        lessonTitle: this.state.lessonTitle,
        headings: this.state.headings,
        showHeadings: this.state.showHeadings
      }
    );
  };

  render() {
    const renderModal =
      this.state.modalGridID === "" ? null : (
        <GridModal
          Id={this.props.Id.match.params.id}
          gridID={this.state.modalGridID}
          handleGridData={this.handleModalContent.bind(this)}
          showModal={this.state.showModal}
          toggleModal={this.toggleModal}
          gridType={this.state.modalGridType}
          rawData={this.state.rawData}
        />
      );
    return (
      <div className="Legal_Size_Page">
        <div className="TEST">
          {renderModal}
          <ReactGridLayout
            className="layout"
            cols={24}
            rowHeight={20}
            width={1103}
            containerPadding={[0, 0]}
            margin={[3, 3]}
            userCSSTransforms={true}
            isDraggable={this.state.isDraggable}
            isResizable={this.state.isResizable}
            draggableHandle=".Grid_Drag_Handle:hover"
            onLayoutChange={layout => {
              layout = JSON.stringify(layout);
              this.setState({
                layoutChange: layout,
                layout: JSON.parse(layout)
              });
            }}
            draggableCancel="input, textarea ,button, .ant-modal-wrap, .ant-modal, .Modal_Base, .Grid_Custom_Menu, .Grid_Menu"
          >
            {/*Regular Grids------------------------------------------*/}
            {this.state.gridRows}
            {/*-------------------------------------------------------*/}
          </ReactGridLayout>
          <div className="Bottom_Options">
            Options <i className="fas fa-chevron-circle-down fa-lg" />
            <div className="Bottom_Options_Expanded">
              <span className="Add_Grid_Wrapper">
                <button
                  className="Add_Grid_Button"
                  onClick={this.gridNUMincrease}
                >
                  <i className="fas fa-plus fa-2x" />
                </button>
              </span>

              <span className="Add_Grid_Wrapper">
                <button
                  className="Add_Grid_Button"
                  style={{
                    backgroundColor: this.state.viewOnly
                      ? "#497fd0"
                      : "transparent",
                    color: this.state.viewOnly ? "white" : "auto"
                  }}
                  onClick={() => {
                    this.renderGrids(this.state.layout);
                    this.setState({
                      viewOnly: !this.state.viewOnly,
                      isDraggable: !this.state.isDraggable,
                      isResizable: !this.state.isResizable
                    });
                  }}
                >
                  <i className="fas fa-eye fa-2x" />
                </button>
              </span>

              <span className="Add_Grid_Wrapper">
                <button className="Add_Grid_Button" onClick={this.saveDoc}>
                  <i className="far fa-save fa-2x" />
                </button>
              </span>

              <span className="Add_Grid_Wrapper">
                <button
                  className="Add_Grid_Button"
                  onClick={() => window.print()}
                >
                  <i className="fas fa-print fa-2x" />
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const LessonPlanner = props => (
  <div>
    <div style={styles}>
      <MyFirstGrid Id={props} />
    </div>
  </div>
);
export default LessonPlanner;

MyFirstGrid.propTypes = {
  getElementHeight: PropTypes.func
};
