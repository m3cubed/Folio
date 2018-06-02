import React, { Component } from "react";
import { Card } from "antd";

class QuestionCards extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <Card title={`Q${this.props.num}`}>
          <p>Content</p>
        </Card>
      </div>
    );
  }
}

export default QuestionCards;
