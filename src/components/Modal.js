import React from "react";

import { Button, Modal, Tabs } from "antd";
import CourseSelector from "./CourseSelector.js";

import TextDraft from "./TextDraft";
import CheckList from "./CheckList.js";

const TabPane = Tabs.TabPane;
class GridModal extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      gridID: nextProps.gridID,
      visible: nextProps.showModal,
    };
  }
  constructor(props) {
    super(props);
    this.state = {
      gridID: "",
      visible: false,
      modalKey: "Curriculum",
    };
  }

  backToGrid = () => {
    console.log(this.state.modalContent);
    this.props.handleGridData(
      this.state.modalContent,
      this.props.gridID,
      this.state.modalKey,
    );
    this.props.toggleModal();
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
        <Modal
          title="Pick Your Poison"
          visible={this.state.visible}
          width="1200px"
          onCancel={() => {
            this.props.toggleModal();
            this.setState({ visible: false });
          }}
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
