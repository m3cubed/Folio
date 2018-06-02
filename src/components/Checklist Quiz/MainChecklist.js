import React, { Component } from "react";
import {
  SortableContainer,
  SortableElement,
  arrayMove,
} from "react-sortable-hoc";
import QuestionCards from "./QuestionCards";

const SortableItem = SortableElement(({ value }) => (
  <li style={{ listStyleType: "none" }}>{value}</li>
));

const SortableList = SortableContainer(({ items }) => {
  return (
    <ul style={{ listStyleType: "none" }}>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </ul>
  );
});

class MainChecklist extends Component {
  componentDidMount() {
    const items = [];
    for (let i = 1; i < 6; i++) {
      items.push(<QuestionCards num={i} />);
    }
    this.setState({
      items: items,
    });
  }

  constructor(props) {
    super(props);
    this.state = { items: [] };
  }
  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({ items: arrayMove(this.state.items, oldIndex, newIndex) });
  };
  render() {
    console.log(this.state.items);
    return <SortableList items={this.state.items} onSortEnd={this.onSortEnd} />;
  }
}

export default MainChecklist;
