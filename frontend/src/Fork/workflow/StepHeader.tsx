import React, { useState } from "react";
import styled from "styled-components";
import _ from "lodash";
import { IconButton, Menu } from "grindery-ui";
import { ICONS } from "../../constants";
// import useWorkflowContext from "../../hooks/useWorkflowContext";
// import useWorkflowStepContext from "../../hooks/useWorkflowStepContext";
// import { Workflow } from "../../types/Workflow";
import Trash from "../../components/icons/Trash";
import ArrowDown from "../../components/icons/ArrowDown";
import ArrowUp from "../../components/icons/ArrowUp";

const Container = styled.div`
  padding: 20px 32px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 16px;
`;

const Icon = styled.div`
  width: 56px;
  height: 56px;
  background: #f4f5f7;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  min-width: 56px;

  & img {
    display: block;
    width: 24px;
    min-width: 24px;
    height: 24px;
  }
`;

const AppIcon = styled.div`
  width: 56px;
  height: 56px;
  background: #ffffff;
  border-radius: 50%;
  border: 1px solid #706e6e;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  min-width: 56px;

  & img {
    display: block;
    width: 32px;
    min-width: 32px;
    height: 32px;
  }
`;

const Title = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  color: #898989;
  margin: 0;
  padding: 0;
`;

const Description = styled.p`
  font-weight: 700;
  font-size: 16px;
  line-height: 120%;
  color: #0b0d17;
  margin: 0;
  padding: 0;
`;

const ChangeButton = styled.button`
  background: #ffffff;
  border: 1px solid #0b0d17;
  border-radius: 5px;
  padding: 12px 24px;
  box-shadow: none;
  font-weight: 700;
  font-size: 16px;
  line-height: 150%;
  text-align: center;
  color: #0b0d17;
  margin-left: auto;
  cursor: pointer;
  box-sizing: border-box;

  &:hover {
    box-shadow: 0px 4px 8px rgba(106, 71, 147, 0.1);
  }
`;

const MenuButtonWrapper = styled.div`
  & img {
    width: 20px;
    height: 20px;
    display: block;
  }
`;

const MenuItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 8px;
`;

type Props = {};

const StepHeader = (props: Props) => {
  // const {
  //   type,
  //   step,
  //   setActiveRow,
  //   connector,
  //   operation,
  //   operationIsConfigured,
  //   operationIsAuthenticated,
  //   setConnector,
  //   setOperationIsTested,
  // } = useWorkflowStepContext();
  // const { activeStep, setActiveStep, updateWorkflow, workflow, setWorkflow } =
  //   useWorkflowContext();
  const type = 'trigger'
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // const index = step - 2;

  // const menuItems: any[] = [];

  // const operationIsTested =
  //   type === "trigger"
  //     ? workflow.system?.trigger?.tested
  //     : workflow.system?.actions?.[index]?.tested;

  // const handleHeaderClick = () => {
  //   if (activeStep !== step) {
  //     setActiveStep(step);
  //   }
  // };

  // const handleChangeClick = () => {
  //   if (type === "trigger") {
  //     updateWorkflow({
  //       "trigger.connector": "",
  //       "trigger.input": {},
  //       "trigger.operation": "",
  //       "trigger.credentials": undefined,
  //       "trigger.authentication": undefined,
  //       "trigger.authenticationKey": undefined,
  //     });
  //   } else {
  //     updateWorkflow({
  //       ["actions[" + index + "].connector"]: "",
  //       ["actions[" + index + "].input"]: {},
  //       ["actions[" + index + "].operation"]: "",
  //       ["actions[" + index + "].credentials"]: undefined,
  //       ["actions[" + index + "].authentication"]: undefined,
  //       ["actions[" + index + "].authenticationKey"]: undefined,
  //     });
  //   }
  //   setActiveRow(0);
  //   setConnector(null);
  //   setOperationIsTested(false);
  // };

  // const handleMenuClose = () => {
  //   setAnchorEl(null);
  // };

  // const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   event.stopPropagation();
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleRemove = () => {
  //   setWorkflow((_workflow: Workflow) => {
  //     const newWf = _.cloneDeep(_workflow);
  //     newWf.actions.splice(index, 1);
  //     newWf.system.actions.splice(index, 1);
  //     return newWf;
  //   });
  // };

  // const arraymove = (arr: any[], fromIndex: number, toIndex: number) => {
  //   var element = arr[fromIndex];
  //   arr.splice(fromIndex, 1);
  //   arr.splice(toIndex, 0, element);
  // };

  // const handleMoveDown = () => {
  //   setWorkflow((_workflow: Workflow) => {
  //     const newWf = _.cloneDeep(_workflow);
  //     arraymove(newWf.actions, index, index + 1);
  //     arraymove(newWf.system.actions, index, index + 1);
  //     return newWf;
  //   });
  // };

  // const handleMoveUp = () => {
  //   setWorkflow((_workflow: Workflow) => {
  //     const newWf = _.cloneDeep(_workflow);
  //     arraymove(newWf.actions, index, index - 1);
  //     arraymove(newWf.system.actions, index, index - 1);
  //     return newWf;
  //   });
  // };

  // if (workflow.actions.length > 1 && index > 0) {
  //   menuItems.push({
  //     key: "moveUp",
  //     onClick: handleMoveUp,
  //     Component: (
  //       <MenuItem>
  //         <ArrowUp />
  //         <span>Move step up</span>
  //       </MenuItem>
  //     ),
  //   });
  // }

  // if (workflow.actions.length > 1 && index < workflow.actions.length - 1) {
  //   menuItems.push({
  //     key: "moveDown",
  //     label: "",
  //     onClick: handleMoveDown,
  //     Component: (
  //       <MenuItem>
  //         <ArrowDown />
  //         <span>Move step down</span>
  //       </MenuItem>
  //     ),
  //   });
  // }

  // if (index > 0 || workflow.actions.length > 1) {
  //   menuItems.push({
  //     key: "remove",
  //     onClick: handleRemove,
  //     Component: (
  //       <MenuItem>
  //         <Trash />
  //         <span>Remove step</span>
  //       </MenuItem>
  //     ),
  //   });
  // }

  return (
    <Container
      // style={
      //   { cursor: activeStep === step ? "default" : "pointer" }
      // }
    // onClick={handleHeaderClick}
    >
      <Icon>
        <img
          src={ICONS.TRIGGER_ICON}
          alt=""
        />
      </Icon>

      <div>
        <Title>{type === "trigger" ? "Trigger" : "Action"}</Title>
        <Description 
        // style={{ fontSize: connector ? "20px" : "16px" }}
        >
          When this occurs...
        </Description>
      </div>
      <ChangeButton 
      // onClick={handleChangeClick}
      >Change</ChangeButton>
      {/* {type !== "trigger" && menuItems.length > 0 && (
        <div style={{ marginLeft: connector ? "0" : "auto" }}>
          <MenuButtonWrapper>
            <IconButton onClick={handleMenuOpen} icon={ICONS.DOTS_HORIZONTAL} />
          </MenuButtonWrapper>
          <Menu
            anchorEl={anchorEl}
            onClose={handleMenuClose}
            closeOnClick
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            items={menuItems}
          />
        </div>
      )} */}
    </Container>
  );
};

export default StepHeader;
