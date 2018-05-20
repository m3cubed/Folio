import React from "react";
import { Menu, Dropdown, Icon, List, Checkbox, Row, Col, Spin } from "antd";
import { store } from "../../base";
import "./CourseSelector.css";

class CourseSelector extends React.Component {
  /*static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.defaultData) {
      return {
        grade: nextProps.defaultData.grade,
        subject: nextProps.defaultData.subject,
        subjectVisible: false,
        unit: nextProps.defaultData.unit,
        unitVisible: false,
        course: nextProps.defaultData.course,
        courseVisible: false,
      };
      this.getOutlines;
    }
  }*/
  constructor(props) {
    super(props);
    this.state = {
      grade: "Choose Grade",
      subject: "Choose Subject",
      course: "Choose Course",
      unit: "Choose Unit",
      subjectVisible: true,
      subjectMenu: "",
      courseVisible: true,
      courseMenu: "",
      unitVisible: true,
      unitMenu: "",
      overall: "",
      loading: false,
      overallExpecatations: "",
      specificExpectations: "",
      dataKey: "",
      dataDescription: "",
    };
  }

  handleOverall = data => {
    const overallExpecations = [];
    for (let i = 0; i < data.key.length; i++) {
      overallExpecations.push(
        <div>
          <h5>
            <strong>{data.key}</strong>
          </h5>
          <p>{data.description}</p>
        </div>,
      );
    }
    this.setState({
      overallExpecations: overallExpecations,
    });
  };

  getSubjects = e => {
    const key = e.key;
    const subjectsKey = Object.keys(this.state.curriculumChoices[key]);
    const subjectsMenu = [];
    for (let i = 0; i < subjectsKey.length; i++) {
      subjectsMenu.push(
        <Menu.Item key={subjectsKey[i]}>{subjectsKey[i]}</Menu.Item>,
      );
    }
    this.setState({
      grade: key,
      subject: "Choose Subject",
      course: "Choose Course",
      unit: "Choose Unit",
      subjectVisible: false,
      subjectMenu: subjectsMenu,
      courseVisible: true,
      courseMenu: "",
      unitVisible: true,
      unitMenu: "",
    });
  };

  getCourses = e => {
    const key = e.key;
    const coursesKey = Object.keys(
      this.state.curriculumChoices[this.state.grade][key],
    );
    const coursesMenu = [];
    for (let i = 0; i < coursesKey.length; i++) {
      coursesMenu.push(
        <Menu.Item key={coursesKey[i]}>{coursesKey[i]}</Menu.Item>,
      );
    }
    this.setState({
      subject: key,
      course: "Choose Course",
      unit: "Choose Unit",
      courseVisible: false,
      courseMenu: coursesMenu,
      unitVisible: true,
      unitMenu: "",
    });
  };

  getUnits = e => {
    const key = e.key;
    const unitsKey = this.state.curriculumChoices[this.state.grade][
      this.state.subject
    ][key];

    const unitsMenu = [];
    for (let i = 0; i < unitsKey.length; i++) {
      unitsMenu.push(<Menu.Item key={unitsKey[i]}>{unitsKey[i]}</Menu.Item>);
    }
    this.setState({
      course: key,
      unit: "Choose Unit",
      unitVisible: false,
      unitMenu: unitsMenu,
    });
  };

  getOutlines = e => {
    const key = e.key;
    this.setState(
      {
        loading: true,
        overallExpecatations: "",
        specificExpectations: "",
        dataKey: "",
        dataDescription: "",
      },
      function() {
        store
          .get(
            `/Curriculum/Ontario/High School/${this.state.grade}/${
              this.state.subject
            }/${this.state.course}/${key}/Overall Expectations`,
            {
              context: this,
            },
          )
          .then(data => {
            this.setState({
              unit: key,
            });
            const overallExpecations = [];
            overallExpecations.push(
              <h2 key="Overall">Overall Expectations</h2>,
            );
            for (let i = 0; i < data.key.length; i++) {
              overallExpecations.push(
                <div key={data.key[i]}>
                  <h3>
                    <strong>{data.key[i]}</strong>
                  </h3>
                  <p>{data.description[i]}</p>
                </div>,
              );
            }
            this.setState({
              overallExpecatations: overallExpecations,
            });
          });
        store
          .get(
            `/Curriculum/Ontario/High School/${this.state.grade}/${
              this.state.subject
            }/${this.state.course}/${key}/Specific Expectations`,
            { context: this },
          )
          .then(data => {
            //Render list and checkbox
            const specific = [];
            for (let i = 0; i < data.key.length; i++) {
              specific.push(
                <List.Item key={data.key[i]}>
                  <List.Item.Meta
                    title={
                      <div>
                        <Checkbox
                          value={data.key[i]}
                          style={{ marginRight: 3 }}
                        />
                        <strong>{data.key[i]}.</strong>
                      </div>
                    }
                    description={data.description[i]}
                  />
                </List.Item>,
              );
            }
            const specificComplete = (
              <div>
                <h2>Specific Expectations</h2>
                <div className="Curriculum_Specific_List">
                  <List itemLayout="horizontal">
                    <Checkbox.Group onChange={this.handleCheckbox}>
                      {specific}
                    </Checkbox.Group>
                  </List>
                </div>
              </div>
            );

            this.setState({
              loading: false,
              specificExpectations: specificComplete,
              dataKey: data.key,
              dataDescription: data.description,
            });
          });
      },
    );
  };

  renderSpin = () => {
    switch (this.state.loading) {
      case true:
        return (
          <div className="Loading_Spin">
            <Spin size="large" />
          </div>
        );
      case false:
        return null;
      default:
        return null;
    }
  };

  //Create list of curriculum to send back to modal
  handleCheckbox = checkValues => {
    const position = [];
    const keys = [];
    const descriptions = [];
    for (let i = 0; i < checkValues.length; i++) {
      position.push(this.state.dataKey.indexOf(checkValues[i]));
      keys.push(this.state.dataKey[position[i]]);
      descriptions.push(this.state.dataDescription[position[i]]);
    }
    const backToModal = {
      keys: keys,
      description: descriptions,
      course: this.state.course,
      unit: this.state.unit,
      grade: this.state.grade,
      subject: this.state.subject,
    };
    this.props.backToModal(backToModal);
  };

  componentDidMount() {
    store
      .get(`/Curriculum/Ontario/High School/Choices`, {
        context: this,
      })
      .then(data => {
        const gradesKey = Object.keys(data);
        const gradesMenu = [];
        for (let i = 0; i < gradesKey.length; i++) {
          gradesMenu.push(
            <Menu.Item key={gradesKey[i]}>{gradesKey[i]}</Menu.Item>,
          );
        }
        this.setState(
          {
            curriculumChoices: data,
            gradesMenu: gradesMenu,
          },
          function() {},
        );
      });
  }

  render() {
    const gradeMenu = (
      <Menu onClick={this.getSubjects}>{this.state.gradesMenu}</Menu>
    );

    const subjectMenu = (
      <Menu onClick={this.getCourses}>{this.state.subjectMenu}</Menu>
    );

    const courseMenu = (
      <Menu onClick={this.getUnits}>{this.state.courseMenu}</Menu>
    );

    const unitMenu = (
      <Menu onClick={this.getOutlines}>{this.state.unitMenu}</Menu>
    );
    return (
      <div>
        <span>
          <Dropdown overlay={gradeMenu}>
            <a className="ant-dropdown-link">
              {this.state.grade} <Icon type="down" />
            </a>
          </Dropdown>
        </span>

        <span style={{ marginLeft: "20px" }}>
          <Dropdown overlay={subjectMenu} disabled={this.state.subjectVisible}>
            <a className="ant-dropdown-link">
              {this.state.subject} <Icon type="down" />
            </a>
          </Dropdown>
        </span>

        <span style={{ marginLeft: "20px" }}>
          <Dropdown overlay={courseMenu} disabled={this.state.courseVisible}>
            <a className="ant-dropdown-link">
              {this.state.course} <Icon type="down" />
            </a>
          </Dropdown>
        </span>

        <span style={{ marginLeft: "20px" }}>
          <Dropdown overlay={unitMenu} disabled={this.state.unitVisible}>
            <a className="ant-dropdown-link">
              {this.state.unit} <Icon type="down" />
            </a>
          </Dropdown>
        </span>
        <hr />
        {this.renderSpin(this.state.loading)}
        <Row gutter={24}>
          <Col span={12}>
            <div className="Courseselect_Overall">
              {this.state.overallExpecatations}
            </div>
          </Col>
          <Col span={12}>
            <div className="Courseselct_Specific">
              {this.state.specificExpectations}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CourseSelector;
