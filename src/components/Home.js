import React, { Component } from "react";
import "./Home.css";

class Home extends Component {
  componentDidMount() {
    document.title = "Home";
  }
  render() {
    return (
      <div>
        <img className="Home_Image" src={require("../images/Home.jpg")} />
      </div>
    );
  }
}

export default Home;
