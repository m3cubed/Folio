import React, { Component } from "react";
import { Button, Icon, Input } from "antd";
const { TextArea } = Input;
class ProgressAgenda extends Component {
  render() {
    return (
      <div>
        <TextArea
          placeholder="Autosize height based on content lines"
          autosize
        />
        <Button type="dashed" onClick={this.add}>
          <Icon type="plus" /> Add field
        </Button>
      </div>
    );
  }
}

export default ProgressAgenda;
