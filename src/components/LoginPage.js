import React, { Component } from "react";
import firebase from "firebase";
import { Redirect } from "react-router-dom";
import { Form, Icon, Input, Button, Checkbox } from "antd";
import LoginWithGoogle from "./LoginWithGoogle.js";
import "./LoginPage.css";

const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        firebase
          .auth()
          .signInWithEmailAndPassword(values.email, values.password)
          .then(data => {
            console.log(data);
          })
          .catch(err => {
            console.log(err);
          });
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
              rules: [{ required: true, message: "Please input your email!" }],
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="E-mail"
              />,
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator("password", {
              rules: [
                { required: true, message: "Please input your Password!" },
              ],
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="Password"
              />,
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator("remember", {
              valuePropName: "checked",
              initialValue: true,
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
      redirectUser: false,
    };
  }

  handleRedirect = () => {
    this.setState({
      redirectUser: true,
    });
  };

  render() {
    if (this.redirectUser) {
      return <Redirect to="/LessonPlanList" />;
    }
    return (
      <div className="Login_Page">
        <div className="Login_Wrapper">
          <span className="Login_Form">
            <WrappedNormalLoginForm />
          </span>
        </div>
        <hr />
        <div style={{ textAlign: "center" }}>
          <LoginWithGoogle redirect={this.handleRedirect.bind(this)} />
        </div>
      </div>
    );
  }
}

export default LoginPage;
