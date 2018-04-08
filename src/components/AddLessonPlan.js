import React, { Component } from "react";
import { store } from "./base.js";
import firebase from "firebase";
import { Link } from "react-router-dom";
import { Input, Modal, Button, Table } from "antd";

class AddLessonPlan extends Component {
  state = {};
  constructor() {
    super();
    this.state = {
      currentUserUID: "",
      visible: false,
      lessons: {},
    };
    this.lessonAdd = this.lessonAdd.bind(this);
  }

  componentWillMount() {
    //Call Firestore for user lessons

    this.removeAuthListener = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          currentUserUID: user.uid,
        });
        store.listenToCollection(`users/${user.uid}/lessons`, {
          context: this,
          withIds: true,
          then(data) {
            this.setState({
              lessons: data,
            });
          },
        });
      } else {
        return null;
      }
    });
  }

  renderLessonList() {
    const lessons = this.state.lessons;
    switch (this.state.lessons) {
      case lessons:
        const dataSource = [];
        for (let i in lessons) {
          dataSource.push({
            key: lessons[i].id,
            lessonTitle: lessons[i].lessonTitle,
            day: lessons[i].day,
            month: lessons[i].month,
            year: lessons[i].year,
          });
        }
        const columns = [
          {
            title: "Name",
            dataIndex: "lessonTitle",
            key: "lessonTitle",
            //Render button and find record for cell
            render: (text, record) => (
              <button style={{ backgroundColor: "transparent", border: "0px" }}>
                <Link
                  to={{
                    pathname: `/lessonplan/${record.key}`,
                    state: this.state.currentUserUID,
                  }}
                >
                  {text}
                </Link>
              </button>
            ),
          },
          {
            title: "Day",
            dataIndex: "day",
            key: "day",
          },
          {
            title: "Month",
            dataIndex: "month",
            key: "month",
          },
          {
            title: "Year",
            dataIndex: "year",
            key: "year",
          },
        ];
        return (
          <div>
            <Table dataSource={dataSource} columns={columns} />
          </div>
        );

      default:
        return null;
    }
  }

  lessonAdd = () => {
    this.setState({
      visible: false,
    });
    const user = firebase.auth().currentUser;

    //Date variables
    const nowDate = new Date();
    const locale = "en-us";
    const month = nowDate.toLocaleString(locale, { month: "long" });
    const date =
      nowDate.getDate() +
      "/" +
      (nowDate.getMonth() + 1) +
      "/" +
      nowDate.getFullYear();
    const fullDate =
      month + " " + nowDate.getDate() + ", " + nowDate.getFullYear();
    let data = {
      author_id: user.uid,
      lessonTitle: this.state.lessonTitle,
      date: fullDate,
      shortDate: date,
      year: nowDate.getFullYear(),
      month: month,
      day: nowDate.getDate(),
    };

    //API call
    store
      .addToCollection(`users/${user.uid}/lessons`, data)
      .then(newLocation => {
        this.setState({
          show: false,
        });
      })
      .then(() => <Link to="/lessonplanner" />)
      .catch(err => {
        //handle error
      });
    //available immediately, you don't have to wait for the Promise to resolve
    //var generatedKey = immediatelyAvailableReference.key;
  };

  render() {
    return (
      <div>
        {this.renderLessonList(this.state.lessons)}
        {/*Add a lesson plan*/}
        <Button type="primary" onClick={() => this.setState({ visible: true })}>
          Add a lesson plan
        </Button>
        <Modal
          title="Create Lesson Plan"
          visible={this.state.visible}
          onCancel={() => this.setState({ visible: false })}
          footer={[
            <Button
              key="back"
              onClick={() => this.setState({ visible: false })}
            >
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={this.lessonAdd}>
              Create
            </Button>,
          ]}
        >
          <Input
            placeholder="Input title for new lesson plan"
            onChange={e => this.setState({ lessonTitle: e.target.value })}
            onPressEnter={this.lessonAdd}
          />
        </Modal>
      </div>
    );
  }
}

export default AddLessonPlan;
