import React, { useState } from "react";
import styled from "styled-components";
import moment from "moment";
import _ from "lodash";
import { Tooltip } from "grindery-ui";
import DataBox from "../shared/DataBox";
import { ICONS, SCREEN } from "../../constants";
import useAppContext from "../../hooks/useAppContext";
import { WorkflowExecutionLog } from "../../types/Workflow";

const statusIconMapping: { [key: string]: string } = {
  Executed: ICONS.EXECUTED,
  Error: ICONS.ERROR,
};

const ItemTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 4px;
  min-width: 20px;
  overflow: hidden;

  @media (min-width: ${SCREEN.TABLET}) {
    gap: 8px;
    min-width: 230px;
    max-width: 230px;
  }
`;

const ItemIcon = styled.img`
  width: 12px;
  height: 12px;
  display: block;

  @media (min-width: ${SCREEN.TABLET}) {
    width: 24px;
    height: 24px;
  }
`;

const Title = styled.span`
  font-weight: 400;
  font-size: var(--text-size-history-item-label);
  line-height: 150%;
  color: #0b0d17;
`;

const ItemAppsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 4px;
  margin-left: 0;
  overflow: hidden;
`;

const ItemWorkflowName = styled.div`
  margin-left: 4px;
  font-weight: 400;
  font-size: 12px;
  line-height: 160%;
  color: #000000;
  max-width: calc(100% - 64px);
`;

const ItemAppWrapper = styled.div`
  padding: 4px;
  background: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
`;

const ItemAppIcon = styled.img`
  display: block;
  width: 16px;
  height: 16px;
`;

const ItemDate = styled.div`
  font-weight: 400;
  font-size: var(--text-size-history-date);
  line-height: 150%;
  color: #758796;
  margin-left: 10px;
  min-width: 60px;
  @media (min-width: ${SCREEN.TABLET}) {
    min-width: 110px;
  }
`;

const TitleWrapper = styled.div`
  display: none;

  @media (min-width: ${SCREEN.TABLET}) {
    display: block;
    margin-right: 8px;
    overflow: hidden;
  }
`;

const ItemDetailsToggle = styled.button`
  background: #ffffff;
  border: none;
  border-bottom: 1px dashed #0b0d17;
  cursor: pointer;
  width: auto;
  margin: 0;
  padding: 0;
  font-weight: 700;
  font-size: 14px;
  line-height: 150%;
  color: #0b0d17;
`;

const DetailsWrapper = styled.div`
  margin: 8px 0 0;
`;

const DetailsTitle = styled.h3`
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  color: rgb(54, 54, 54);
  margin: 0 0 4px;
  padding: 0;
`;
const DetailsSubtitle = styled.h4`
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  color: rgb(54, 54, 54);
  margin: 0 0 4px;
  padding: 0;
`;
const DetailsStep = styled.div`
  margin: 10px 0 0;
  padding: 10px 0 0;
  border-top: 1px solid rgb(211, 222, 236);
`;
const DetailsStepTitle = styled.h5`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 8px;
  font-weight: 700;
  font-size: 16px;
  line-height: 150%;
  color: rgb(54, 54, 54);
  margin: 0 0 8px;
  padding: 0;
`;
const DetailsStepApp = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 4px;
`;
const DetailsTimestamp = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  color: rgb(54, 54, 54);
  margin: 0 0 4px;
  padding: 0;
`;
const DetailsData = styled.div`
  margin: 12px 0 0;

  & p {
    font-weight: 700;
    font-size: 15px;
    line-height: 150%;
    color: rgb(54, 54, 54);
    margin: 0 0 4px;
    padding: 0;
  }
`;
const DetailsDataRow = styled.p`
  font-weight: 400 !important;
  font-size: 14px;
  line-height: 150%;
  color: rgb(54, 54, 54);
  margin: 0 0 4px;
  padding: 0;
  word-wrap: break-word;
`;

type Props = {
  item: WorkflowExecutionLog[];
  withDetails?: boolean;
};

export const WorkflowExecutionRow = (props: Props) => {
  const { workflows, connectors } = useAppContext();
  const { item, withDetails } = props;
  const [showError, setShowError] = useState(false);
  const [detailsOpened, setDetailsOpened] = useState(false);
  const executionId = item[0].executionId;
  const workflowKey = item[0].workflowKey;
  const executedAt =
    item[item.length - 1].endedAt || item[item.length - 1].startedAt;
  const status =
    item.filter((log: WorkflowExecutionLog) => log.error).length > 0
      ? "Error"
      : "Executed";
  const workflow = workflows.find((wf) => wf.key === workflowKey);

  const apps: any[] = [
    connectors.find(
      (connector) => connector.key === workflow?.trigger.connector
    ),
    ...(workflow?.actions || []).map((action) =>
      connectors.find((connector) => connector.key === action.connector)
    ),
  ].map((connector) => ({
    name: connector?.name || "",
    icon: connector?.icon || "",
  }));

  let errorText = item
    .filter((log: WorkflowExecutionLog) => log.error)
    .map((log: WorkflowExecutionLog) => log.error)
    .join("; ");

  if (errorText.startsWith("Error: ")) {
    errorText = errorText.replace("Error: ", "");
  }

  if (item.length < 1) {
    return null;
  }

  return (
    <DataBox
      WrapperProps={{
        onMouseEnter: () => setShowError(true),
        onMouseLeave: () => setShowError(false),
      }}
      onClick={() => setDetailsOpened(true)}
      key={executionId}
      size={"large"}
      LeftComponent={
        <ItemTitleWrapper>
          {status === "Error" && errorText ? (
            <Tooltip title={errorText} open={showError}>
              <ItemIcon src={statusIconMapping[status]} alt={status} />
            </Tooltip>
          ) : (
            <ItemIcon src={statusIconMapping[status]} alt={status} />
          )}
          <TitleWrapper>
            <Title>{status}</Title>
          </TitleWrapper>
        </ItemTitleWrapper>
      }
      CenterComponent={
        <ItemAppsWrapper>
          {apps.length > 0 &&
            apps
              .filter((app: any) => app.icon)
              .map((app: any, i2) => (
                <ItemAppWrapper key={executionId + i2} title={app.name}>
                  <ItemAppIcon src={app.icon} alt={app.name} />
                </ItemAppWrapper>
              ))}
          {!withDetails ? (
            <ItemWorkflowName title={workflow?.title}>
              {workflow?.title}
            </ItemWorkflowName>
          ) : (
            <ItemDate>
              {moment(executedAt).format("MMM DD, YYYY HH:mm:ss")}
            </ItemDate>
          )}
        </ItemAppsWrapper>
      }
      RightComponent={
        !withDetails ? (
          <ItemDate>
            {moment(executedAt).format("MMM DD, YYYY HH:mm:ss")}
          </ItemDate>
        ) : (
          <ItemDetailsToggle
            onClick={(e) => {
              e.stopPropagation();
              setDetailsOpened(!detailsOpened);
            }}
          >
            {detailsOpened ? "Hide" : "Show"} details
          </ItemDetailsToggle>
        )
      }
      BottomLeftComponent={
        !detailsOpened ? undefined : (
          <DetailsWrapper>
            <DetailsTitle>
              Execution ID: <em>{item[0].executionId}</em>
            </DetailsTitle>
            <DetailsSubtitle>
              Session ID: <em>{item[0].sessionId}</em>
            </DetailsSubtitle>
            {item.map((row, i) => (
              <DetailsStep key={item[0].executionId + "operations" + i}>
                <DetailsStepTitle>
                  <span>{i === 0 ? "Trigger" : "Action " + i}: </span>
                  <DetailsStepApp>
                    <ItemAppIcon src={apps[i].icon} alt={apps[i].name} />{" "}
                    {apps[i].name}
                  </DetailsStepApp>
                </DetailsStepTitle>
                {row.startedAt && (
                  <DetailsTimestamp>
                    Started at:{" "}
                    <em>
                      {moment(row.startedAt).format("MMM DD, YYYY HH:mm:ss")}
                    </em>
                  </DetailsTimestamp>
                )}
                {row.endedAt && (
                  <DetailsTimestamp>
                    Ended at:{" "}
                    <em>
                      {moment(row.endedAt).format("MMM DD, YYYY HH:mm:ss")}
                    </em>
                  </DetailsTimestamp>
                )}
                {row.error && (
                  <DetailsData>
                    <p>Error:</p>

                    <DetailsDataRow>
                      {row.error.startsWith("Error: ")
                        ? row.error.replace("Error: ", "")
                        : row.error}
                    </DetailsDataRow>
                  </DetailsData>
                )}
                <DetailsData>
                  <p>Input:</p>
                  {Object.keys(row.input || {}).map((k, i2) => (
                    <DetailsDataRow key={item[0].executionId + "input" + i2}>
                      {k}: <em>{JSON.stringify(row.input[k])}</em>
                    </DetailsDataRow>
                  ))}
                </DetailsData>
                <DetailsData>
                  <p>Output:</p>
                  {Object.keys(row.output || {}).map((k, i2) => (
                    <DetailsDataRow key={item[0].executionId + "output" + i2}>
                      {k}: <em>{JSON.stringify(row.output[k])}</em>
                    </DetailsDataRow>
                  ))}
                </DetailsData>
              </DetailsStep>
            ))}
            <ItemDetailsToggle
              style={{ marginTop: "10px", marginBottom: "4px" }}
              onClick={(e) => {
                e.stopPropagation();
                setDetailsOpened(false);
              }}
            >
              Hide details
            </ItemDetailsToggle>
          </DetailsWrapper>
        )
      }
    />
  );
};
