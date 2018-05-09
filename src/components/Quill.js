import React from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css"; // ES6
import "react-quill/dist/quill.bubble.css";
import "./Quill.css";

class QuillEditor extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.default) {
      prevState.editorHtml = nextProps.default;
    }
    if (nextProps.id) {
      prevState = Object.assign(
        { gridID: nextProps.id, [`${nextProps.id}Html`]: "" },
        prevState,
      );
    }
    if (nextProps.agendaKey) {
      prevState = Object.assign({ agendaKey: nextProps.agendaKey }, prevState);
    }
    return prevState;
  }
  constructor(props) {
    super(props);
    this.state = { editorHtml: "" };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(html) {
    this.setState({ editorHtml: html });
    if (this.props.backToModal) {
      this.props.backToModal(JSON.stringify(html));
    }
    if (this.props.modalContent) {
      this.props.modalContent(JSON.stringify(html), this.state.gridID, "Text");
    }
    if (this.props.agendaContent) {
      this.props.agendaContent(
        JSON.stringify(html),
        this.state.gridID,
        this.state.agendaKey,
      );
    }
  }

  render() {
    return (
      <div className="Quill_Wrapper">
        <ReactQuill
          className="React_Quill"
          theme={this.props.theme}
          onChange={this.handleChange}
          value={this.state.editorHtml}
          modules={QuillEditor.modules}
          formats={QuillEditor.formats}
          placeholder="Type here to get started"
        />
      </div>
    );
  }
}

/* 
     * Quill modules to attach to editor
     * See https://quilljs.com/docs/modules/ for complete options
     */
QuillEditor.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["clean", "formula"],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};
/* 
     * Quill editor formats
     * See https://quilljs.com/docs/formats/
     */
QuillEditor.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "formula",
];

export default QuillEditor;
