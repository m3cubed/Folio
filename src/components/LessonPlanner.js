import React from "react";
import ReactGridLayout from "react-grid-layout";
import PropTypes from "prop-types";
import "./LessonPlanner.css";
import GridModal from "./Modal";
import { message, List, Card } from "antd";
import firebase from "@firebase/app";
import { store } from "./base";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "left",
  width: "1203px",
  margin: "0 auto",
};

class MyFirstGrid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      gridNUM: 4,
      addGrid: false,
      isDraggable: true,
      layout: [],
      rawData: {},
      headings: {},
      modalGridID: "",
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
      showModal: !this.state.showModal,
    });
    console.log(this.state.showModal);
  };

  gridNUMincrease = () => {
    const data = this.state.layout;
    data.push({
      i: "N" + this.state.gridNUM,
      x: Infinity,
      y: Infinity,
      w: 7,
      h: 4,
    });
    this.setState(
      {
        layout: data,
        gridNUM: this.state.gridNUM + 1,
      },
      function() {
        this.renderGrids(this.state.layout);
      },
    );
  };

  handleModalContent = (data, gridID, type) => {
    console.log(data);
    console.log(gridID);
    console.log(type);
    //Write to rawData the gridID and what it will contain. rawData is meant to be sent to the database for storage.
    const rawData = this.state.rawData;
    Object.defineProperty(rawData, gridID, {
      value: { type: type, data: data },
      writable: true,
      enumerable: true,
      configurable: true,
    });
    this.setState(
      {
        [`${gridID}RawData`]: rawData,
      },
      function() {
        console.log(this.state);
        //Send gridID to be render to Grid
        this.renderModalContent(gridID);
      },
    );
  };

  renderModalContent = gridID => {
    const rawData = this.state.rawData;
    const data = rawData[gridID].data;
    const type = rawData[gridID].type;
    console.log(gridID);
    console.log(type);
    console.log(data);
    let content;
    switch (type) {
      case "Curriculum":
        const listContent = [];
        for (let i = 0; i < data[0].length; i++) {
          listContent.push(
            <List.Item key={data[0][i]}>
              <List.Item.Meta
                title={<strong>{data[0][i]}.</strong>}
                description={data[1][i]}
              />
            </List.Item>,
          );
        }
        content = (
          <div className="Modal-Content" key={`CurriculumList${gridID}`}>
            <List>{listContent}</List>
          </div>
        );
        break;
      case "Text":
        break;
      case "Checklist":
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
            </Card>,
          );
        }
        content = (
          <div className="Modal-Content" key={`CheckBox${gridID}`}>
            {cards}
          </div>
        );
        console.log(content);
        break;
      default:
        return null;
    }
    const gridIDContent = `${gridID}Content`;
    this.setState(
      {
        [gridIDContent]: content,
      },
      function() {
        this.renderGrids(this.state.layout);
      },
    );
  };

  removeGrid = gridID => {
    const newLayout = this.state.layout.filter(
      item => item.i !== gridID.toString(),
    );
    this.setState(
      {
        layout: newLayout,
        gridNUM: this.state.gridNUM - 1,
      },
      function() {
        this.renderGrids(this.state.layout);
      },
    );
  };

  renderGrids = data => {
    const gridNUM = this.state.gridNUM;
    const rows = [];
    let layout = [];
    if (data[0] === undefined) {
      for (let j = 0; j < gridNUM; j++) {
        const gridID = this.createGridUID();

        if (j === 0) {
          layout.push({
            i: gridID,
            x: 3,
            y: 0,
            w: 30,
            h: 4,
            static: true,
          });
          rows.push(
            <div key={gridID}>
              <div>
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
              </div>
              <div>
                <textarea
                  className="LessonText"
                  placeholder="Lesson Title"
                  onChange={e => {
                    console.log(e.target.value);
                    if (e.target.value === "") {
                      message.error("Title cannot be empty!");
                    } else {
                      this.setState({ lessonTitle: e.target.value });
                    }
                  }}
                  defaultValue={this.state.lessonTitle}
                />
              </div>
            </div>,
          );
        } else {
          const gridID = this.createGridUID();
          const thisState = this.state;
          const gridIDContent = `${gridID}Content`;
          layout.push({
            i: gridID,
            x: 3 + 3 * j,
            y: 0,
            w: 30,
            h: 5,
            minH: 5,
          });
          rows.push(
            <div className="Grid_Main" key={gridID}>
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
                      configurable: true,
                    },
                  );
                  this.setState({
                    headings: headings,
                  });
                }}
              />
              <div className="Grid_Drag_Handle">
                <span className="Grid_Custom_Menu">
                  <i className="fas fa-cog" />
                </span>
                <div className="Grid_Menu">
                  <button
                    className="Grid_Button"
                    onClick={e => {
                      this.setState({ modalGridID: gridID });
                      this.toggleModal();
                    }}
                  >
                    <i className="fas fa-plus-circle fa-2x" />
                    <br />
                    Content
                  </button>

                  <hr className="Grid_Menu_Linebreak" />
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
            </div>,
          );
        }
      }
    } else {
      for (let j = 0; j < gridNUM; j++) {
        const gridID = data[j].i;

        if (j === 0) {
          rows.push(
            <div key={data[j].i} data-grid={data[j]}>
              <div>
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
              </div>
              <div>
                <textarea
                  className="LessonText"
                  placeholder="Lesson Title"
                  onChange={e => {
                    console.log(e.target.value);
                    if (e.target.value === "") {
                      message.error("Title cannot be empty!");
                    } else {
                      this.setState({ lessonTitle: e.target.value });
                    }
                  }}
                  defaultValue={this.state.lessonTitle}
                />
              </div>
            </div>,
          );
        } else {
          const thisState = this.state;

          const gridIDContent = `${gridID}Content`;
          rows.push(
            <div className="Grid_Main" key={gridID} data-grid={data[j]}>
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
                      configurable: true,
                    },
                  );
                  this.setState({
                    headings: headings,
                  });
                }}
              />

              <div className="Grid_Drag_Handle">
                <span className="Grid_Custom_Menu">
                  <i className="fas fa-cog" />
                </span>

                <div className="Grid_Menu">
                  <span className="Grid_Button_Wrapper">
                    <button
                      className="Grid_Button"
                      onClick={e => {
                        this.setState({ modalGridID: gridID });
                        this.toggleModal();
                      }}
                    >
                      <i className="fas fa-plus-circle fa-2x" />
                      <br />
                      Content
                    </button>
                  </span>
                  <span className="Grid_Button_Wrapper">
                    <button
                      className="Grid_Button"
                      onClick={this.removeGrid.bind(this, gridID)}
                    >
                      <i className="fas fa-trash-alt fa-2x" />
                      <br />
                      Delete
                    </button>
                  </span>
                </div>
              </div>

              <div className="Grid_Content">{thisState[gridIDContent]}</div>
            </div>,
          );
        }
      }
      layout = data;
    }
    this.setState({
      layout: layout,
      gridRows: rows,
      layoutChange: JSON.stringify(layout),
    });
    return { rows };
  };

  componentDidMount() {
    this.removeAuthListener = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          currentUserID: user.uid,
          gridLoading: false,
        });
        store
          .get(
            `/users/${this.state.currentUserID}/lessons/${
              this.props.Id.match.params.id
            }`,
            {
              context: this,
            },
          )
          .then(data => {
            if (data.headings) {
              this.setState({
                headings: data.headings,
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
                    gridLoading: false,
                  },
                  function() {
                    const gridIDs = Object.keys(rawData);

                    for (let i in gridIDs) {
                      this.renderModalContent(gridIDs[i]);
                    }
                  },
                );
              } else {
                this.setState(
                  {
                    lessonTitle: data.lessonTitle,
                    lessonDate: data.date,
                    layout: layout,
                    gridNUM: layout.length,
                    gridLoading: false,
                  },
                  function() {
                    this.renderGrids(this.state.layout);
                  },
                );
              }
            } else {
              this.setState(
                {
                  lessonTitle: data.lessonTitle,
                  lessonDate: data.date,
                },
                function() {
                  this.renderGrids(this.state.layout);
                },
              );
            }
          });
      } else {
        this.setState({
          gridLoading: true,
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
      },
    );
  }

  render() {
    return (
      <div className="Legal_Size_Page">
        <div className="TEST">
          <GridModal
            Id={this.props.Id.match.params.id}
            gridID={this.state.modalGridID}
            handleGridData={this.handleModalContent.bind(this)}
            showModal={this.state.showModal}
            toggleModal={this.toggleModal}
          />

          <ReactGridLayout
            className="layout"
            cols={24}
            rowHeight={20}
            width={1103}
            layout={this.state.layout}
            containerPadding={[0, 0]}
            margin={[3, 3]}
            userCSSTransforms={true}
            isDraggable={this.state.isDraggable}
            draggableHandle=".Grid_Drag_Handle:hover"
            onLayoutChange={layout => {
              layout = JSON.stringify(layout);
              this.setState({
                layoutChange: layout,
                layout: JSON.parse(layout),
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
                  onClick={() =>
                    this.setState({ isDraggable: !this.state.isDraggable })
                  }
                >
                  <i className="fas fa-eye fa-2x" />
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
  getElementHeight: PropTypes.func,
};
