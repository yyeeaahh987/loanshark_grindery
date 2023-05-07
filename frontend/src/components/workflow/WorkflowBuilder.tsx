import React, { useState } from "react";
import styled from "styled-components";
import useWorkflowContext from "../../hooks/useWorkflowContext";
import { SCREEN } from "../../constants";
import WorkflowStep from "./WorkflowStep";
import WorkflowStepContextProvider from "../../context/WorkflowStepContext";
import WorkflowName from "./WorkflowName";
import WorkflowSave from "./WorkflowSave";
import WorkflowState from "./WorkflowState";

const Wrapper = styled.div`
  max-width: 816px;
  padding: 32px 20px 42px;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  jsutify-content: flex-start;
  flex-wrap: nowrap;
  margin: 0 auto;
  padding: 0 16px 16px;

  @media (min-width: ${SCREEN.TABLET}) {
    padding: 0 0 16px;
    margin: 40px auto 0;
  }
  @media (min-width: ${SCREEN.DESKTOP}) {
    margin: 40px auto 0;
  }
  @media (min-width: ${SCREEN.DESKTOP_XL}) {
    padding: 0 0 16px;
    margin: 40px auto 0;
  }
`;

type Props = {};

const WorkflowBuilder = (props: Props) => {
  const { workflow } = useWorkflowContext();
  console.log(`workflow`,workflow)
  // workflow steps output
  const [outputFields, setOutputFields] = useState<any[]>([]);

  return (
    <>
      {/* top bar haed */}
      <WorkflowName />
      {/* top bar on/off */}
      <WorkflowState />
      {/* middle form */}
      <Wrapper>
        <WorkflowStepContextProvider
          type="trigger"
          index={0}
          step={1}
          setOutputFields={setOutputFields}
        >
          <WorkflowStep outputFields={outputFields} />
        </WorkflowStepContextProvider>
        {workflow.actions.map((action, index) => (
          <WorkflowStepContextProvider
            key={`${action.connector}_${index}`}
            type="action"
            index={index}
            step={index + 2}
            setOutputFields={setOutputFields}
          >
            <WorkflowStep outputFields={outputFields} />
          </WorkflowStepContextProvider>
        ))}
        <WorkflowSave />
      </Wrapper>
    </>
  );
};

export default WorkflowBuilder;
