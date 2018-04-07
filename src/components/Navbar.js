import React, { Component } from "react";
import firebase from "firebase";
import { Link } from "react-router-dom";
import { Menu } from "antd";

class NavbarHeader extends Component {
  constructor() {
    super();

    this.state = {
      userEmail: "",
      currentUser: "Not logged in",
    };
  }

  userOrNot = () => {
    switch (this.state.authenticated) {
      case true:
        return this.state.currentUser;
        break;
      case false:
        return <Link to="/login">Login</Link>;
      default:
        return null;
    }
  };

  componentWillMount() {
    this.removeAuthListener = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          currentUser: user.email,
          authenticated: true,
        });
        this.userOrNot;
      } else {
        const login = <Link to="/login">Login</Link>;
        this.setState({
          currentUser: login,
          authenticated: false,
        });
        this.userOrNot;
      }
    });
  }
  componentWillUnmount() {
    this.removeAuthListener();
  }

  render() {
    return (
      <div>
        <Menu theme="dark" mode="horizontal" style={{ lineHeight: "64px" }}>
          <Menu.Item key="user" selectable="false">
            {this.state.currentUser}
          </Menu.Item>
          <Menu.Item key="home" href="/">
            <Link to="/">Test Page</Link>
          </Menu.Item>

          <Menu.Item key="login">
            <Link to="/login">Login</Link>
          </Menu.Item>

          <Menu.Item key="LessonPlanList">
            <Link to="/LessonPlanList">Lesson Plans</Link>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}
export default NavbarHeader;
