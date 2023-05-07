import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Switch, Snackbar } from "grindery-ui";
import useAppContext from "../../hooks/useAppContext";
import useWorkflowContext from "../../hooks/useWorkflowContext";
import { SCREEN } from "../../constants";

const Container = styled.div`
  position: fixed;
  right: 140px;
  top: 18px;
  z-index: 1220;

  @media (min-width: ${SCREEN.TABLET}) {
    right: 180px;
  }

  & .MuiButtonBase-root.MuiSwitch-switchBase.Mui-checked {
    transform: translateX(28px) !important;
  }

  & .MuiSwitch-root {
    width: 65px;
  }

  & .MuiSwitch-track {
    height: 36px;
    border-radius: 18px;

    &:before,
    &:after {
      font-weight: 700 !important;
      font-size: 16px !important;
      top: 7px !important;
    }
  }

  & .MuiSwitch-thumb {
    width: 30px;
    height: 30px;
  }
`;

type Props = {};

const WorkflowState = (props: Props) => {
  const { editWorkflow } = useAppContext();
  const { workflow, updateWorkflow, workflowReadyToSave } =
    useWorkflowContext();
  const [snackbar, setSnackbar] = useState({
    opened: false,
    message: "",
    severity: "suscess",
  });

  const handleStateChange = () => {
    if (workflow.state === "on") {
      const wf = { ...workflow, state: "off" };
      delete wf.signature;
      editWorkflow({
        ...wf,
        signature: JSON.stringify(wf),
      });
      updateWorkflow({
        state: "off",
      });
      setSnackbar({
        opened: true,
        message: "Workflow disabled",
        severity: "success",
      });
    } else {
      if (!workflowReadyToSave) {
        setSnackbar({
          opened: true,
          message: "Please, complete all workflow steps to enable it.",
          severity: "error",
        });
      } else {
        const wf = { ...workflow, state: "on" };
        delete wf.signature;
        editWorkflow({
          ...wf,
          signature: JSON.stringify(wf),
        });
        updateWorkflow({
          state: "on",
        });
        setSnackbar({
          opened: true,
          message: "Workflow enabled",
          severity: "success",
        });
      }
    }
  };

  return (
    <>
      <Container>
        <Switch
          value={workflow.state === "on"}
          onChange={handleStateChange}
          on="On"
          off="Off"
        />
      </Container>
      <Snackbar
        open={snackbar.opened}
        handleClose={() => {
          setSnackbar({
            opened: false,
            message: "",
            severity: snackbar.severity,
          });
        }}
        message={snackbar.message}
        hideCloseButton
        autoHideDuration={2000}
        severity={snackbar.severity}
      />
    </>
  );
};

export default WorkflowState;
