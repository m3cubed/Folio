import React from "react";
import { DragSource } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import { Link } from "react-router-dom";

const lessonSource = {
  beginDrag(props) {
    return { id: props.id };
  },
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

class LessonFiles extends React.Component {
  render() {
    const { connectDragSource, isDragging, id, uid, text } = this.props;
    return connectDragSource(
      <div>
        <Link
          to={{
            pathname: `/lessonplan/${id}`,
            state: uid,
          }}
        >
          <button
            style={{
              backgroundColor: "transparent",
              border: "0px",
              width: "100%",
              height: "57px",
              textAlign: "left",
            }}
          >
            <i className="fas fa-file" />
            {`  ${text}`}
          </button>
        </Link>
      </div>,
    );
  }
}

export default DragSource(ItemTypes.LESSONS, lessonSource, collect)(
  LessonFiles,
);
