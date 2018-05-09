import React from "react";
import { Button, Modal, Tabs } from "antd";
import CourseSelector from "./CourseSelector.js";
import ProgressAgenda from "./ProgressAgenda.js";
import CheckList from "./CheckList.js";
import QuillEditor from "./Quill.js";

const TabPane = Tabs.TabPane;
class GridModal extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      gridID: nextProps.gridID,
      visible: nextProps.showModal,
      rawData: nextProps.rawData,
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
          maskClosable={false}
          destroyOnClose={true}
          onCancel={() => {
            this.props.toggleModal();
            this.setState({ visible: false });
          }}
          footer={[
            <Button
              key="back"
              onClick={() => {
                this.props.toggleModal();
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
            defaultActiveKey={this.state.modalKey}
            onChange={key => {
              this.setState({
                modalKey: key,
              });
            }}
          >
            <TabPane tab="Curriculum" key="Curriculum">
              <CourseSelector
                defaultData={this.state.rawData[this.state.gridID].data}
                backToModal={this.modalContentToState.bind(this)}
              />
            </TabPane>
            <TabPane tab="Insert Text" key="Text">
              <QuillEditor
                backToModal={this.modalContentToState.bind(this)}
                theme={"snow"}
                id={this.state.gridID}
              />
            </TabPane>
            <TabPane tab="Check List" key="Checklist">
              <CheckList
                defaultData={this.state.rawData[this.state.gridID].data}
                backToModal={this.modalContentToState.bind(this)}
              />
            </TabPane>
            <TabPane tab="Agenda" key="Agenda">
              <ProgressAgenda
                defaultData={this.state.rawData[this.state.gridID].data}
                backToModal={this.modalContentToState.bind(this)}
              />
            </TabPane>
          </Tabs>
        </Modal>
      </div>
    );
  }
}

export default GridModal;
