import React from "react";
import WorkflowContextProvider from "../../context/WorkflowContext";
import useAppContext from "../../hooks/useAppContext";
import WorkflowBuilder from "./WorkflowBuilder";

type Props = {};

const WorkflowContainer = (props: Props) => {
  console.log(`WorkflowContainer`)
  const { accessAllowed } = useAppContext();
  return accessAllowed ? (
    <WorkflowContextProvider>
      <WorkflowBuilder />
    </WorkflowContextProvider>
  ) : null;
};

export default WorkflowContainer;
