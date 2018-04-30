import React, { Component } from "react";
import { List, Button, Icon, Input, Form, InputNumber } from "antd";
const { TextArea } = Input;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class ProgressAgenda extends Component {
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  constructor(props) {
    super(props);
    this.state = {
      agenda: {},
      agendaListNum: 0,
      itemNumber: 0,
      formMinutes: 10,
      formDescription: "",
    };
  }

  renderAgenda = () => {
    if (Object.keys(this.state.agenda) !== 0) {
      const listItems = [];
      const keys = Object.keys(this.state.agenda);
      for (let i = 0; i < keys.length; i++) {
        console.log(this.state.agenda[keys[i]].time);
        listItems.push(
          <List.Item
            key={i}
            actions={[
              <a id={keys[i]} onClick={this.handleRemove}>
                Remove
              </a>,
            ]}
          >
            <List.Item.Meta
              title={this.state.agenda[keys[i]].time}
              description={this.state.agenda[keys[i]].description}
            />
          </List.Item>,
        );
      }
      const list = <List key={this.state.agendaList}>{listItems}</List>;
      this.setState({
        agendaList: list,
      });
    } else {
      this.setState({
        agendaList: "",
      });
    }
  };

  handleRemove = e => {
    delete this.state.agenda[e.target.id];
    this.renderAgenda();
    this.props.backToModal(this.state.agenda);
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.setState(
        {
          agenda: Object.assign(
            { [`item${this.state.itemNumber}`]: values },
            this.state.agenda,
          ),
        },
        function() {
          this.renderAgenda();
          this.props.backToModal(this.state.agenda);
        },
      );
    });
    this.setState({
      itemNumber: this.state.itemNumber + 1,
      formMinutes: 10,
      formDescription: "",
    });
  };

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched,
    } = this.props.form;
    const timeError = isFieldTouched("time") && getFieldError("time");
    const descriptionError =
      isFieldTouched("description") && getFieldError("description");
    return (
      <div>
        <Form layout="vertical" onSubmit={this.handleSubmit}>
          <Form.Item
            validateStatus={timeError ? "error" : ""}
            help={timeError || ""}
          >
            {getFieldDecorator("time", {
              rules: [
                { required: true, message: "You must enter a description!" },
              ],
              initialValue: "10",
            })(<InputNumber min={0} />)}
            {" min"}
          </Form.Item>

          <Form.Item
            validateStatus={descriptionError ? "error" : ""}
            help={descriptionError || ""}
          >
            {getFieldDecorator("description", {
              rules: [{ required: true, message: "You must enter a time!" }],
            })(<TextArea placeholder="Type here to write your agenda item" />)}
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
          >
            Submit to agenda
          </Button>
        </Form>
        <hr />
        {this.state.agendaList}
      </div>
    );
  }
}

export default Form.create()(ProgressAgenda);
