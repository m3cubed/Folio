import React, { Component } from "react";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "./TextDraft.css";

class TextDraft extends Component {
  constructor(props) {
    super(props);
    const html = "";
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      this.state = {
        editorState
      };
    }
  }

  onEditorStateChange = editorState => {
    this.setState({
      editorState
    });
    this.props.backToModal(convertToRaw(editorState.getCurrentContent()));
  };

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          wrapperClassName="draft-wrapper"
          editorClassName="draft-editor"
          toolbarClassName="draft-toolbar"
          onEditorStateChange={this.onEditorStateChange}
        />
        {/*<textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
    />*/}
      </div>
    );
  }
}

export default TextDraft;
