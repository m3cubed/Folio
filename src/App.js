import React from "react";
import "./App.css";
import { MainLayout, LessonPlanLayout } from "./components/Layout";
import { Switch, Route } from "react-router-dom";
import "antd/dist/antd.css";

const App = () => (
  <div>
    <Switch>
      <Route exact path="/lessonplan/:id" component={LessonPlanLayout} />
      <Route component={MainLayout} />
    </Switch>
  </div>
);
export default App;
