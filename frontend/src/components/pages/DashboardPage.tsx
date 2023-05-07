import React from "react";
import styled from "styled-components";
import { Text, IconButton } from "grindery-ui";
import DataBox from "../shared/DataBox";
import { ICONS, SCREEN } from "../../constants";
import useAppContext from "../../hooks/useAppContext";
import { useNavigate } from "react-router-dom";
import { WorkflowExecutionLog } from "../../types/Workflow";

const Wrapper = styled.div`
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 15px;

  @media (min-width: ${SCREEN.TABLET}) {
    padding: 40px;
    margin: 40px 20px 0;
    border: 1px solid #dcdcdc;
    flex-direction: row;
    flex-wrap: wrap;

    & > div {
      width: 100%;
      max-width: calc(100% / 2 - 7.5px);
      box-sizing: border-box;
    }
  }

  @media (min-width: ${SCREEN.DESKTOP}) {
    margin: 20px 20px 0;
  }

  @media (min-width: ${SCREEN.DESKTOP_XL}) {
    padding: 60px 106px;
    margin: 40px 20px 0;
  }
`;

const Title = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 8px;
`;

const TitleText = styled.div`
  font-size: var(--text-size-dashboard-label);
  font-weight: 400;
  line-height: 150%;
  color: var(--color-black);
`;

const Icon = styled.img`
  width: 20px;
`;

const NotificationText = styled.p`
  font-weight: 700;
  font-size: 16px;
  line-height: 150%;
  color: #8c30f5;
  padding: 0;
  margin: 0;
`;

const CountsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 20px;
`;

const CountWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 3px;
`;

const IconButtonWrapper = styled.div`
  & .MuiIconButton-root img {
    width: 12px !important;
    height: 12px !important;
  }
`;

const IconButtonsGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: nowrap;
  gap: 4px;
`;

type Props = {};

const DashboardPage = (props: Props) => {
  let navigate = useNavigate();
  const { workflows, changeTab, workflowExecutions, apps } = useAppContext();

  const errorExecutionsNum = workflowExecutions.filter(
    (item: WorkflowExecutionLog[]) =>
      item.filter((log: WorkflowExecutionLog) => log.error).length > 0
  ).length;
  const successExecutionsNum = workflowExecutions.filter(
    (item: WorkflowExecutionLog[]) =>
      item.filter((log: WorkflowExecutionLog) => log.error).length < 1
  ).length;

  return (
    <Wrapper>
      <DataBox
        size="large"
        LeftComponent={
          <Title>
            <Icon src={ICONS.BELL} alt="notifications icon" />
            <TitleText>Notifications</TitleText>
          </Title>
        }
        BottomRightComponent={
          <NotificationText>Wallet balance low!</NotificationText>
        }
      />
      <DataBox
        size="large"
        LeftComponent={
          <Title>
            <Icon src={ICONS.WALLET} alt="wallet icon" />
            <TitleText>Aggregated Balance</TitleText>
          </Title>
        }
        RightComponent={
          <IconButtonsGroup>
            <IconButtonWrapper>
              <IconButton color="" icon={ICONS.CREATE_ALERT} />
            </IconButtonWrapper>
            <IconButtonWrapper>
              <IconButton color="" icon={ICONS.CREATE_DEPOSIT} />
            </IconButtonWrapper>
            <IconButtonWrapper>
              <IconButton color="" icon={ICONS.CREATE_WITHDRAW} />
            </IconButtonWrapper>
          </IconButtonsGroup>
        }
        BottomRightComponent={<Text value="$20.40" variant="h3" />}
      />
      <DataBox
        size="large"
        LeftComponent={
          <Title
            onClick={() => {
              changeTab("WORKFLOWS");
            }}
            style={{ cursor: "pointer" }}
          >
            <Icon src={ICONS.WORKFLOWS} alt="Workflows icon" />
            <TitleText>Workflows</TitleText>
          </Title>
        }
        RightComponent={
          <IconButtonWrapper>
            <IconButton
              color=""
              icon={ICONS.PLUS_SMALL}
              onClick={() => {
                navigate("/workflows/new", { replace: true });
              }}
            />
          </IconButtonWrapper>
        }
        BottomRightComponent={
          <div
            onClick={() => {
              changeTab("WORKFLOWS");
            }}
            style={{ cursor: "pointer", marginRight: 4 }}
          >
            <Text value={workflows.length.toString()} variant="h3" />
          </div>
        }
      />
      <DataBox
        size="large"
        LeftComponent={
          <Title
            onClick={() => {
              changeTab("APPS");
            }}
            style={{ cursor: "pointer" }}
          >
            <Icon src={ICONS.APPS} alt="(d)Apps icon" />
            <TitleText>(d)Apps</TitleText>
          </Title>
        }
        RightComponent={
          <IconButtonWrapper>
            <IconButton
              color=""
              onClick={() => {
                changeTab("APPS");
              }}
              icon={ICONS.ARROW_RIGHT}
            />
          </IconButtonWrapper>
        }
        BottomRightComponent={
          <CountsWrapper>
            <CountWrapper
              onClick={() => {
                changeTab("APPS");
              }}
              style={{ cursor: "pointer" }}
            >
              <Text value={apps.length.toString()} variant="h3" />
              <div style={{ marginBottom: 2 }}>
                <Text value="(d)Apps" variant="caption" />
              </div>
            </CountWrapper>
          </CountsWrapper>
        }
      />
      <DataBox
        size="large"
        LeftComponent={
          <Title
            onClick={() => {
              changeTab("HISTORY");
            }}
            style={{ cursor: "pointer" }}
          >
            <Icon src={ICONS.HISTORY} alt="History icon" />
            <TitleText>History</TitleText>
          </Title>
        }
        RightComponent={
          <IconButtonWrapper>
            <IconButton
              color=""
              onClick={() => {
                changeTab("HISTORY");
              }}
              icon={ICONS.ARROW_RIGHT}
            />
          </IconButtonWrapper>
        }
        BottomRightComponent={
          <CountsWrapper>
            <CountWrapper
              onClick={() => {
                changeTab("HISTORY", "tab=2");
              }}
              style={{ cursor: "pointer" }}
            >
              <Text value={errorExecutionsNum.toString()} variant="h3" />
              <div style={{ marginBottom: 2 }}>
                <Text value="Errors" variant="caption" />
              </div>
            </CountWrapper>
            <CountWrapper
              onClick={() => {
                changeTab("HISTORY", "tab=1");
              }}
              style={{ cursor: "pointer" }}
            >
              <Text value={successExecutionsNum.toString()} variant="h3" />
              <div style={{ marginBottom: 2 }}>
                <Text value="Executed" variant="caption" />
              </div>
            </CountWrapper>
          </CountsWrapper>
        }
      />
    </Wrapper>
  );
};

export default DashboardPage;
