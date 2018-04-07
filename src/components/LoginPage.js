import React, { Component } from "react";
import firebase from "firebase";
import { base, config } from "./base";
import { Form, Icon, Input, Button, Checkbox } from "antd";
import LoginWithGoogle from "./LoginWithGoogle.js";
import "./LoginPage.css";

const FormItem = Form.Item;

const auth = firebase.auth();

class NormalLoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    console.log(e.value);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator("email", {
              rules: [{ required: true, message: "Please input your email!" }]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="E-mail"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator("password", {
              rules: [
                { required: true, message: "Please input your Password!" }
              ]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="Password"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator("remember", {
              valuePropName: "checked",
              initialValue: true
            })(<Checkbox>Remember me</Checkbox>)}
            <a className="login-form-forgot" href="">
              Forgot password
            </a>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
            Or <a href="">register now!</a>
          </FormItem>
        </Form>
        <LoginWithGoogle />
      </div>
    );
  }
}
const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

class LoginPage extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      logout: "btn disabled"
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    var user = firebase.auth().currentUser;
    if (user) {
      this.setState({
        currentUser: user,
        logout: "btn"
      });
    } else {
      this.setState({
        currentUser: null,
        logout: "btn disabled"
      });
    }
  }

  handleClick = e => {
    e.preventDefault();
    switch (this.state.button) {
      case "Login":
        auth
          .signInWithEmailAndPassword(
            this.refs.email.value,
            this.refs.password.value
          )
          .then(user => {
            console.log(user);
            this.props.setCurrentUser(user);
          })
          .catch(err => console.log(err.message));
        break;
      case "Register":
        auth
          .createUserWithEmailAndPassword(
            this.refs.email.value,
            this.refs.password.value
          )
          .then(console.log("You have registered!"))
          .catch(err => console.log(err.message));
        break;
      case "Logout":
        auth
          .signOut()
          .then(console.log("You have logged out!"))
          .catch(err => console.log(err.message));
        break;
      default:
        null;
    }
    auth.onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        this.setState({
          logout: "btn"
        });
      } else {
        this.setState({
          logout: "btn disabled"
        });
      }
    });
  };

  render() {
    return (
      <div className="Login_Page">
        <div className="Login_Wrapper">
          <span className="Login_Form">
            <WrappedNormalLoginForm />
          </span>
        </div>
      </div>
    );
  }
}

export default LoginPage;
