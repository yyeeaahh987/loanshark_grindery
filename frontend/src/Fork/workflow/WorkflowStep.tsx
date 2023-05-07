import React, { useState } from "react";
import styled from "styled-components";
// import useWorkflowContext from "../../hooks/useWorkflowContext";
// import StepHeader from "./StepHeader";
// import StepsDivider from "./StepsDivider";
// import AddActionButton from "./AddActionButton";
// import StepApp from "./StepApp";
// import StepOperation from "./StepOperation";
// import StepAuthentication from "./StepAuthentication";
// import StepInput from "./StepInput";
// import useWorkflowStepContext from "../../hooks/useWorkflowStepContext";
// import StepTest from "./StepTest";


import AddActionButton from '../../Fork/workflow/AddActionButton'
import StepApp from '../../Fork/workflow/StepApp'
import StepHeader from '../../Fork/workflow/StepHeader'




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

const WorkflowStep = (props:any) => {
  // const { type, step, operation, operationIsAuthenticated } = useWorkflowStepContext();
  const { type, activeStep,step } = props
    console.log(props)
  // const { activeStep } = useWorkflowContext();

  return (
    <>
      {/* {type === "action" ? <StepsDivider height={16} /> : null} */}
      <Container
        // style={{
        //   boxShadow:
        //     activeStep === step
        //       ? "0px 10px 40px -3px rgba(0, 0, 0, 0.04)"
        //       : "none",
        // }}
      >
        <Containerinner>
          <StepHeader />
          <StepApp
          step={step}
          ></StepApp>
          {/* {activeStep === step && (
            <>
              <StepOperation />
              {operation && <StepAuthentication />}

              {operation && operationIsAuthenticated && (
                <StepInput outputFields={outputFields} />
              )}
              <StepTest outputFields={outputFields} />
            </>
          )} */}
        </Containerinner>
      </Container>
      <AddActionButton 
      // prevStep={step} 
      prevStep={1} 
      />
    </>
  );
};

export default WorkflowStep;
