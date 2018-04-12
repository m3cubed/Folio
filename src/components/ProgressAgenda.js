import React, { Component } from "react";
import { List, Button, Icon, Input, Form, InputNumber } from "antd";
const { TextArea } = Input;
class ProgressAgenda extends Component {
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
    Object.defineProperty(this.state.agenda, `item${this.state.itemNumber}`, {
      value: {
        time: this.state.formMinutes,
        description: this.state.formDescription,
      },
      enumerable: true,
      writable: true,
      configurable: true,
    });
    this.setState({
      itemNumber: this.state.itemNumber + 1,
      formMinutes: 10,
      formDescription: "",
    });
    this.renderAgenda();
    this.props.backToModal(this.state.agenda);
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <InputNumber
            defaultValue={10}
            size="large"
            min={0}
            onChange={minutes => {
              this.setState({ formMinutes: minutes });
            }}
          />
          <span style={{ fontSize: "16px" }}> min</span>
          <br />
          Description
          <br />
          <TextArea
            placeholder="Description for the agenda item."
            autosize
            value={this.state.formDescription}
            onChange={e => {
              this.setState({
                formDescription: e.target.value,
              });
            }}
          />
          <input type="submit" value="Add to agenda" />
        </form>
        <hr />
        {this.state.agendaList}
      </div>
    );
  }
}

export default ProgressAgenda;
