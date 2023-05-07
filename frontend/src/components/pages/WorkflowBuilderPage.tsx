import React from "react";
import { CircularProgress } from "grindery-ui";
import useAppContext from "../../hooks/useAppContext";
import { useMatch } from "react-router";
import WorkflowContainer from "../workflow/WorkflowContainer";

type Props = {};

const WorkflowBuilderPage = (props: Props) => {
  const { connectors } = useAppContext();
  console.log(connectors)
  const isMatchingWorkflowNew = useMatch("/workflows/new");
  const isMatchingWorkflowEdit = useMatch("/workflows/edit/:key");
  const matchNewWorfklow = isMatchingWorkflowNew || isMatchingWorkflowEdit;

  if (!connectors || !connectors.length) {
    return (
      <div style={{ marginTop: 40, textAlign: "center", color: "#8C30F5" }}>
        <CircularProgress color="inherit" />
      </div>
    );
  }

  if (!matchNewWorfklow) {
    return null;
  }

  return <WorkflowContainer />;
};

export default WorkflowBuilderPage;
