import React, { Component } from "react";
import { store } from "../../base";
import { Collapse, Checkbox, Row, Col } from "antd";

const Panel = Collapse.Panel;

class CheckList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      globalList: "",
      activeKey: this.props.collapseKey,
    };
  }
  componentWillMount() {
    store
      .get(`/Checklist/Ontario`, {
        context: this,
      })
      .then(data => {
        console.log(data);
        this.setState({
          globalList: data,
        });
      });
  }

  handleData = data => {
    this.props.backToModal(data);
  };

  render() {
    return (
      <div>
        <RenderList
          globalList={this.state.globalList}
          sendData={this.handleData.bind(this)}
        />
      </div>
    );
  }
}

class RenderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {},
    };
  }
  render() {
    const globalList = this.props.globalList;
    const keys = Object.keys(globalList);
    const renderList = [];
    for (let i = 0; i < keys.length; i++) {
      const checkBox = [];
      const items = globalList[keys[i]];
      for (let j = 0; j < items.length; j++) {
        checkBox.push(
          <Col span={12} key={j}>
            <Checkbox value={items[j]} key={items[j]}>
              {items[j]}
            </Checkbox>
          </Col>,
        );
      }

      renderList.push(
        <Panel header={keys[i]} key={keys[i]}>
          <Checkbox.Group
            key={keys[i]}
            onChange={values => {
              const newValue = Object.defineProperty(
                this.state.values,
                `${this.state.activeKey}`,
                {
                  value: values,
                  writable: true,
                  enumerable: true,
                  configurable: true,
                },
              );
              this.setState(
                {
                  values: newValue,
                },
                function() {
                  this.props.sendData(newValue);
                },
              );
            }}
          >
            <Row type="flex">{checkBox}</Row>
          </Checkbox.Group>
        </Panel>,
      );
    }
    return (
      <Collapse
        onChange={key => {
          this.setState({ activeKey: key });
        }}
        accordion
      >
        {renderList}
      </Collapse>
    );
  }
}

export default CheckList;
