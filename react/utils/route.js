import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import NewProjectDialog from "../newProject/NewProjectDialog";
import Editor from "../editor/Editor";

const Routing = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <NewProjectDialog />
        </Route>
        <Route exact path="/project/:id" component={Editor} />
      </Switch>
    </Router>
  );
};

export default Routing;
