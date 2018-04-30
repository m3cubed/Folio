import React from "react";
import { DropTarget } from "react-dnd";
import { ItemTypes } from "./ItemTypes";

const lessonTarget = {
  drop(props, monitor) {},
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  };
}
class Folders extends React.Component {
  render() {
    const { connectDropTarget, isOver, text, id } = this.props;
    return connectDropTarget(
      <button
        style={{
          backgroundColor: "transparent",
          border: "0px",
          width: "100%",
          height: "57px",
          textAlign: "left",
        }}
      >
        <i className="fas fa-folder" />
        {`  ${text}`}
      </button>,
    );
  }
}
export default DropTarget(ItemTypes.LESSONS, lessonTarget, collect)(Folders);
