import React from "react";
import Main from "./Main.js";
import NavbarHeader from "./Navbar";
import { Route, Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import LessonPlanner from "./LessonPlanner";
import "./Layout.css";

const { Header, Content, Footer } = Layout;

class MainLayout extends React.Component {
  constructor() {
    super();
    this.state = {
      user: "",
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
  render() {
    return (
      <div>
        <Layout className="Lesson_Plan_Page">
          <Menu theme="dark" mode="horizontal" className="Lesson_Page_TopMenu">
            <Menu.Item key="back">
              <Link to="/LessonPlanList">
                <i className="fas fa-arrow-left fa-2x" />
              </Link>
            </Menu.Item>
          </Menu>
          <Route exact path="/lessonplan/:id" component={LessonPlanner} />
          <Footer className="Lesson_Plan_Footer">
            Folio-Planner ©2018 Created by Michael Ma
          </Footer>
        </Layout>
      </div>
    );
  }
}

export { MainLayout, LessonPlanLayout };
