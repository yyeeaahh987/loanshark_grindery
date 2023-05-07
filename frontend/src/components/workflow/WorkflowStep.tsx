import React, { useState } from "react";
import styled from "styled-components";
import useWorkflowContext from "../../hooks/useWorkflowContext";
import StepHeader from "./StepHeader";
import StepsDivider from "./StepsDivider";
import AddActionButton from "./AddActionButton";
import StepApp from "./StepApp";
import StepOperation from "./StepOperation";
import StepAuthentication from "./StepAuthentication";
import StepInput from "./StepInput";
import useWorkflowStepContext from "../../hooks/useWorkflowStepContext";
import StepTest from "./StepTest";

const Container = styled.div`
  border: 1px solid #dcdcdc;
  border-radius: 16px;
  width: 100%;
  transition: box-shadow 0.3s ease-in-out;

  &:hover {
    box-shadow: 0px 10px 40px -3px rgba(0, 0, 0, 0.04) !important;
  }
`;

const Containerinner = styled.div`
  border-radius: 16px;
`;

type Props = {
  outputFields: any[];
};

const WorkflowStep = ({ outputFields }: Props) => {
  const { type, step, operation, operationIsAuthenticated } = useWorkflowStepContext();
  console.log(type, step, operation, operationIsAuthenticated )
  const { activeStep } = useWorkflowContext();
  console.log(activeStep )

  return (
    <>
      {type === "action" ? <StepsDivider height={16} /> : null}
      {/* <Container
        style={{
          boxShadow:
            activeStep === step
              ? "0px 10px 40px -3px rgba(0, 0, 0, 0.04)"
              : "none",
        }}
      >
        <Containerinner>
          <StepHeader />
          <StepApp />
          {activeStep === step && (
            <>
              <StepOperation />
              {operation && <StepAuthentication />}

              {operation && operationIsAuthenticated && (
                <StepInput outputFields={outputFields} />
              )}
            </>
          )}
        </Containerinner>
      </Container> */}
      <Container
        style={{
          borderRadius: "6px",
          boxShadow: "0px 0px 10px 2px rgba(138,171,170, 0.3)",
          backgroundImage: "linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.797012) 100%)",
        }}
      >
        <Containerinner>
          <StepHeader />
          <StepApp />
          {activeStep === step && (
            <>
              <StepOperation />
              {operation && <StepAuthentication />}

              {operation && operationIsAuthenticated && (
                <StepInput outputFields={outputFields} />
              )}
            </>
          )}
        </Containerinner>
      </Container>
      <AddActionButton prevStep={step} />
    </>
  );
};

export default WorkflowStep;
