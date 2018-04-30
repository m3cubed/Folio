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
        return (
          <Menu.SubMenu
            title={this.state.currentUserEmail}
            style={{ float: "right" }}
          >
            <Menu.Item key="signout">Sign-out</Menu.Item>
          </Menu.SubMenu>
        );

      case false:
        return (
          <Menu.Item style={{ float: "right" }}>
            <Link to="/login">Login</Link>
          </Menu.Item>
        );

      default:
        return null;
    }
  };

  componentWillMount() {
    this.removeAuthListener = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          currentUser: user,
          currentUserEmail: user.email,
          authenticated: true,
        });
        this.props.user(user);
      } else {
        const login = <Link to="/login">Login</Link>;
        this.setState({
          currentUserEmail: login,
          authenticated: false,
        });
      }
    });
  }
  componentWillUnmount() {
    this.removeAuthListener();
  }

  render() {
    const isAdmin = [];
    if (this.state.currentUserEmail === "mike.ma0426@gmail.com") {
      isAdmin.push(
        <Menu.Item key="home" href="/">
          <Link to="/testpage">Test Page</Link>
        </Menu.Item>,
      );
    }
    return (
      <div>
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ lineHeight: "64px" }}
          onClick={e => {
            switch (e.key) {
              case "signout":
                firebase.auth().signOut();
                break;
              default:
                return null;
            }
          }}
        >
          <Menu.Item>
            <Link to="/">Home</Link>
          </Menu.Item>
          {this.userOrNot(this.state.authenticated)}
          {isAdmin}

          <Menu.Item key="LessonPlanList">
            <Link to="/LessonPlanList">Lesson Plans</Link>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}
export default NavbarHeader;
