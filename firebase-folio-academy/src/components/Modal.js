import React from "react";
import firebase from "@firebase/app";
import { Button, Modal, Tabs, List } from "antd";
import CourseSelector from "./CourseSelector.js";
import { auth, base, app, store } from "./base";
import TextDraft from "./TextDraft";
import CheckList from "./CheckList.js";

const TabPane = Tabs.TabPane;
class GridModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gridID: this.props.gridID,
      visible: false,
      modalKey: "Curriculum",
    };
  }

  componentDidMount() {
    const user = firebase.auth().currentUser;
    this.setState({
      user: user,
    });
  }

  backToGrid = () => {
    console.log(this.state.modalContent);
    this.props.handleGridData(
      this.state.modalContent,
      this.props.gridID,
      this.state.modalKey,
    );
    this.setState({
      visible: false,
    });
  };

  modalContentToState = content => {
    this.setState({
      modalContent: content,
    });
  };

  render() {
    return (
      <div className="Modal_Base">
        <button
          className="Grid_Button"
          onClick={() => {
            this.setState({ visible: true });
          }}
        >
          <i className="fas fa-plus-circle fa-2x" />
          <br />
          Content
        </button>

        <Modal
          title="Pick Your Poison"
          visible={this.state.visible}
          width="1200px"
          onCancel={() => this.setState({ visible: false })}
          footer={[
            <Button
              key="back"
              onClick={() => {
                this.setState({ visible: false });
              }}
            >
              Return
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={this.backToGrid.bind(this)}
            >
              Submit
            </Button>,
          ]}
        >
          <Tabs
            defaultActiveKey="Curriculum"
            onChange={key => {
              this.setState({
                modalKey: key,
              });
            }}
          >
            <TabPane tab="Curriculum" key="Curriculum">
              <CourseSelector
                backToModal={this.modalContentToState.bind(this)}
              />
            </TabPane>
            <TabPane tab="Insert Text" key="Text">
              <TextDraft />
            </TabPane>
            <TabPane tab="Check List" key="Checklist">
              <CheckList backToModal={this.modalContentToState.bind(this)} />
            </TabPane>
          </Tabs>
        </Modal>
      </div>
    );
  }
}

export default GridModal;
