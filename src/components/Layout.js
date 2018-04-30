import React from "react";
import Main from "./Main.js";
import NavbarHeader from "./Navbar";
import { Route, Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import LessonPlanner from "./LessonPlanner";
import "./Layout.css";
import firebase from "firebase";

const { Header, Content, Footer } = Layout;

class MainLayout extends React.Component {
  constructor() {
    super();
    this.state = {
      user: "",
      isOwner: "none",
    };
  }

  handleUser = user => {
    this.setState({
      user: user,
    });
  };

  render() {
    return (
      <div>
        <Layout className="layout">
          <Header>
            <NavbarHeader
              user={() => {
                this.handleUser.bind(this);
              }}
            />
          </Header>
          <Content style={{ padding: "0 50px" }}>
            <div style={{ background: "#fff", padding: 24, minHeight: 680 }}>
              <Main />
            </div>
          </Content>
          <Footer>Folio ©2018 Created by Michael Ma</Footer>
        </Layout>
      </div>
    );
  }
}

class LessonPlanLayout extends React.Component {
  constructor() {
    super();
    this.state = {
      isOwner: "auto",
    };
  }

  /*componentDidMount() {
    console.log(this.props.match.params.id);
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ userUID: user.uid });
    });
  }*/

  render() {
    return (
      <div>
        <Layout
          className="Lesson_Plan_Page"
          style={{ pointerEvents: this.state.isOwner }}
        >
          <Header className="Lesson_Page_TopMenu">
            <Menu theme="dark" mode="horizontal" style={{ lineHeight: "64px" }}>
              <Menu.Item key="back">
                <Link to="/LessonPlanList">
                  <i className="fas fa-arrow-left fa-2x" />
                </Link>
              </Menu.Item>
            </Menu>
          </Header>
          <Content className="Lesson_Plan_Content">
            <Route exact path="/lessonplan/:id" component={LessonPlanner} />
          </Content>
          <Footer className="Lesson_Plan_Footer">
            Folio-Planner ©2018 Created by Michael Ma
          </Footer>
        </Layout>
      </div>
    );
  }
}

export { MainLayout, LessonPlanLayout };
