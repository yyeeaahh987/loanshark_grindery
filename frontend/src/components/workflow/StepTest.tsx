import React, { useState } from "react";
import styled from "styled-components";
import _ from "lodash";
import { CircularProgress, Alert } from "grindery-ui";
import { ICONS, isLocalOrStaging } from "../../constants";
import useWorkflowContext from "../../hooks/useWorkflowContext";
import useAppContext from "../../hooks/useAppContext";
import { Field } from "../../types/Connector";
import { flattenObject, replaceTokens } from "../../helpers/utils";
import useWorkflowStepContext from "../../hooks/useWorkflowStepContext";
import logoSquare from "../../assets/images/nexus-square.svg";

const Container = styled.div`
  border-top: 1px solid #dcdcdc;
`;

const Header = styled.div`
    padding: 12px 32px; 12px 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: nowrap;
    gap: 16px;
    cursor: pointer;

    & span {
        font-weight: 700;
        font-size: 16px;
        line-height: 120%;
        color: #0B0D17;
    }

    &.active {
      cursor: default;
    }
    &:not(.active):hover {
      background: #F4F5F7;
    }
`;

const OperationStateIcon = styled.img`
  display: block;
  margin-left: auto;
`;

const Content = styled.div`
  padding: 0 32px 20px;
  position: relative;
`;

const Button = styled.button`
  box-shadow: none;
  background: #0b0d17;
  border-radius: 5px;
  border: 1px solid #0b0d17;
  padding: 12px 24px;
  font-weight: 700;
  font-size: 16px;
  line-height: 150%;
  text-align: center;
  color: #ffffff;
  cursor: pointer;

  &:hover:not(:disabled) {
    box-shadow: 0px 4px 8px rgba(106, 71, 147, 0.1);
  }

  &:disabled {
    background: #dcdcdc;
    color: #706e6e;
    border-color: #dcdcdc;
    cursor: not-allowed;
  }

  &.outlined {
    background: transparent;
    color: #0b0d17;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  gap: 20px;
  padding-bottom: 12px;
  position: relative;
  z-index: 2;
`;

const SuccessButtonWrapper = styled.div`
  text-align: center;
  margin-top: 10px;
`;

const TableWrapper = styled.div`
  margin: 0 0 16px;

  & table {
    margin: 0;
    padding: 0;
    border: none;
    width: 100%;

    & tr {
      margin: 0;
      padding: 0;
      border: none;

      & td {
        width: 50%;
        padding: 20px 0;
        border-bottom: 1px solid #dcdcdc;
        box-sizing: border-box;
        word-break: break-word;

        &:first-child {
          width: 40%;
          font-weight: 400;
          font-size: 16px;
          line-height: 150%;
          padding: 20px 10px 20px 0;
          vertical-align: top;
        }

        &:nth-child(2) {
          width: 60%;
          font-weight: 700;
          font-size: 16px;
          line-height: 150%;
          text-align: right;
        }
      }
    }

    & tr:last-child td {
      border-bottom: none;
    }
  }
`;

const RowLabelWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 10px;
`;

const RowIconWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  padding: 4px;

  & img {
    display: block;
    width: 16px;
    height: 16px;
  }
`;

const SuccessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  jsutify-content: center;
  flex-wrap: nowrap;
  gap: 8px;
  padding: 20px 0 12px;
`;

const SuccessIcons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  jsutify-content: center;
  flex-wrap: nowrap;
  gap: 8px;
`;

const SuccessTitle = styled.h3`
  font-weight: 700;
  font-size: 20px;
  line-height: 120%;
  text-align: center;
  color: #0b0d17;
  margin: 8px 0 0;
  padding: 0;
`;

const SuccessDescription = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  text-align: center;
  color: #0b0d17;
  padding: 0;
  margin: 0;
`;

const IconWrapper = styled.div`
  width: 58px;
  height: 58px;
  min-width: 58px;
  border: 1px solid #dcdcdc;
  border-radius: 10px;
  padding: 8px;
  box-sizing: border-box;

  & img {
    width: 40px;
    height: 40px;
    display: block;
  }
`;

const ArrowIcon = styled.img`
  width: 12px;
  height: 12px;
`;

const AlertWrapper = styled.div`
  margin: 0 0 20px;
`;

type Props = {
  outputFields: any[];
};

const StepTest = ({ outputFields }: Props) => {
  const {
    type,
    step,
    activeRow,
    setActiveRow,
    connector,
    operation,
    operationIsConfigured,
    operationIsAuthenticated,
    operationIsTested,
    setOperationIsTested,
    setConnector,
  } = useWorkflowStepContext();
  const { workflow, updateWorkflow, loading, setLoading } =
    useWorkflowContext();
  const { client, access_token } = useAppContext();
  const index = step - 2;
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /*const operationIsTested =
    type === "trigger"
      ? workflow.system?.trigger?.tested
      : workflow.system?.actions?.[index]?.tested;*/

  /*const options = _.flatten([
    ...(outputFields.map((out) => out?.operation?.sample) || []),
  ]);
  if (isLocalOrStaging) {
  console.log("test options", operation);
  }*/

  const context: any = {
    trigger:
      outputFields.find(
        (output) =>
          output &&
          output.operation &&
          output.operation.type &&
          output.operation.type === "trigger"
      )?.operation?.sample || {},
  };

  if (index >= 0) {
    for (let i = 0; i <= index; i++) {
      context["step" + i] =
        outputFields.find(
          (output) =>
            output &&
            output.operation &&
            output.operation.type &&
            output.operation.type === "action" &&
            output.index === i
        )?.operation?.sample || {};
    }
  }

  const values = replaceTokens(
    (type === "action"
      ? workflow.actions[index]?.input
      : workflow.trigger.input) || {},
    context
  );

  const rows =
    operation?.operation?.inputFields?.map((field: Field) => {
      const v = values[field.key];
      return {
        label: field.label || field.key,
        icon: connector?.icon,
        value: Array.isArray(v) ? v.join("\n") : v || "",
      };
    }) ||
    operation?.inputFields?.map((field: Field) => {
      const v = values[field.key];
      return {
        label: field.label || field.key,
        icon: connector?.icon,
        value: Array.isArray(v) ? v.join("\n") : v || "",
      };
    }) ||
    [];

  const testWorkflowTrigger = async () => {
    if (workflow) {
      if (workflow.trigger) {
        setError(null);
        setSuccess(null);
        setLoading(true);

        // set ws connection
        const ws = new WebSocket("wss://orchestrator.grindery.org");

        // authenticate
        const authRequestId = new Date();
        ws.onopen = () => {
          ws.send(
            JSON.stringify({
              jsonrpc: "2.0",
              method: "authenticate",
              params: {
                token: access_token || "",
              },
              id: authRequestId,
            })
          );
        };

        // listen for ws messages
        ws.onmessage = (event) => {
          const res = JSON.parse(event.data);

          // send test request
          if (res && res.result) {
            ws.send(
              JSON.stringify({
                jsonrpc: "2.0",
                method: "testTrigger",
                params: {
                  trigger: {
                    type: "trigger",
                    connector: workflow.trigger.connector || "",
                    operation: workflow.trigger.operation || "",
                    input: workflow.trigger.input || {},
                  },
                  environment: isLocalOrStaging ? "staging" : "production",
                },
                id: new Date(),
              })
            );
          }

          // handle test response
          if (res && res.method && res.method === "notifySignal") {
            const payload = flattenObject(res.params?.payload || {});
            setSuccess("Test trigger detected!");
            setOperationIsTested(true);

            // set output sample
            if (connector) {
              setConnector({
                ...connector,
                triggers: [
                  ...(connector.triggers || []).map((trig) => {
                    if (trig.key === operation?.key && trig.operation) {
                      return {
                        ...trig,
                        operation: {
                          ...trig.operation,
                          outputFields: [
                            ...(trig.operation.outputFields || []),
                            ...Object.keys(payload)
                              .filter(
                                (key) =>
                                  (
                                    trig.operation?.outputFields?.filter(
                                      (out) => out && out.key === key
                                    ) || []
                                  ).length < 1
                              )
                              .map((key) => ({
                                key: key || "",
                                label: key || "",
                                type: "string",
                              })),
                          ],
                          sample: payload || trig.operation.sample || {},
                        },
                      };
                    } else {
                      return trig;
                    }
                  }),
                ],
                actions: [...(connector.actions || [])],
              });
            }

            // Close ws connection
            ws.close();
            setLoading(false);
          }
        };
      }
    }
  };

  const testWorkflowAction = async (index: number) => {
    if (workflow) {
      if (workflow.actions && workflow.actions[index]) {
        setError(null);
        setSuccess(null);
        setLoading(true);
        const res = await client
          ?.testAction(
            workflow.actions[index],
            values,
            isLocalOrStaging ? "staging" : undefined
          )
          .catch((err) => {
            console.error("testAction error:", err.message);
            setError(err.message || null);
            setOperationIsTested(false);
          });

        if (res) {
          // set output sample
          if (connector) {
            setConnector({
              ...connector,
              triggers: [...(connector.triggers || [])],
              actions: [
                ...(connector.actions || []).map((act) => {
                  if (act.key === operation?.key && act.operation) {
                    return {
                      ...act,
                      operation: {
                        ...act.operation,
                        outputFields: [
                          ...(act.operation.outputFields || []),
                          ...Object.keys(res)
                            .filter(
                              (key) =>
                                (
                                  act.operation?.outputFields?.filter(
                                    (out) => out && out.key === key
                                  ) || []
                                ).length < 1
                            )
                            .map((key) => ({
                              key: key || "",
                              label: key || "",
                              type: "string",
                            })),
                        ],
                        sample: res || act.operation.sample || {},
                      },
                    };
                  } else {
                    return act;
                  }
                }),
              ],
            });
          }

          setSuccess("Test action sent!");
          setOperationIsTested(true);
        } else {
          setOperationIsTested(false);
        }
        setLoading(false);
      }
    }
  };

  const renderValue = (value: any) => (
    <>
      {value.split("\n").map((v: any, i: number) => (
        <p key={v + i} style={{ padding: "5px 0", margin: "0px" }}>
          {v}
        </p>
      ))}
    </>
  );

  const handleHeaderClick = () => {
    setActiveRow(3);
  };

  const handleContinueClick = () => {
    if (type === "action") {
      testWorkflowAction(index);
    } else {
      testWorkflowTrigger();
    }
  };

  const handleSkipClick = () => {
    setOperationIsTested("skipped");
    setLoading(false);
  };

  const handleTestClick = () => {
    setOperationIsTested(false);
  };

  return operation && operationIsAuthenticated && operationIsConfigured ? (
    <Container>
      <Header
        onClick={handleHeaderClick}
        className={activeRow === 3 ? "active" : ""}
      >
        {activeRow === 3 ? (
          <img src={ICONS.ANGLE_UP} alt="" />
        ) : (
          <img src={ICONS.ANGLE_DOWN} alt="" />
        )}
        <span>{type === "trigger" ? "Test trigger" : "Test action"}</span>

        <OperationStateIcon
          src={operationIsTested ? ICONS.CHECK_CIRCLE : ICONS.EXCLAMATION}
          alt=""
        />
      </Header>
      {activeRow === 3 && (
        <Content>
          {operationIsTested ? (
            <>
              {operationIsTested === "skipped" ? (
                <>
                  <SuccessWrapper>
                    <SuccessIcons>
                      <IconWrapper>
                        <img src={logoSquare} alt="" />
                      </IconWrapper>
                      <ArrowIcon src={ICONS.ARROW_RIGHT_BLACK} alt="" />
                      <IconWrapper>
                        <img src={connector?.icon} alt="" />
                      </IconWrapper>
                    </SuccessIcons>
                    <SuccessTitle>
                      {type === "trigger"
                        ? "You skipped the trigger test"
                        : "You skipped the action test"}
                    </SuccessTitle>
                    <SuccessDescription>
                      {type === "trigger"
                        ? "If you change your mind, you may test your trigger again later."
                        : "If you change your mind, you may test your action again later."}
                    </SuccessDescription>
                    <SuccessButtonWrapper>
                      <Button disabled={loading} onClick={handleTestClick}>
                        Test {type === "trigger" ? "trigger" : "action"}
                      </Button>
                    </SuccessButtonWrapper>
                  </SuccessWrapper>
                </>
              ) : (
                <SuccessWrapper>
                  <SuccessIcons>
                    <IconWrapper>
                      <img src={logoSquare} alt="" />
                    </IconWrapper>
                    <ArrowIcon src={ICONS.ARROW_RIGHT_BLACK} alt="" />
                    <IconWrapper>
                      <img src={connector?.icon} alt="" />
                    </IconWrapper>
                  </SuccessIcons>
                  <SuccessTitle>
                    {type === "trigger"
                      ? "Trigger event detected!"
                      : "Action success!"}
                  </SuccessTitle>
                  <SuccessDescription>
                    {type === "trigger"
                      ? "Now you can add an action."
                      : "Now you can save this workflow or add another action."}
                  </SuccessDescription>
                </SuccessWrapper>
              )}
            </>
          ) : (
            <>
              <TableWrapper>
                <table>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={`${row.value}_${i}`}>
                        <td>
                          <RowLabelWrapper>
                            {row.icon && (
                              <RowIconWrapper>
                                <img src={row.icon} alt={row.label} />
                              </RowIconWrapper>
                            )}
                            {row.label}
                          </RowLabelWrapper>
                        </td>
                        <td style={{ whiteSpace: "pre-wrap" }}>
                          {renderValue(row.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableWrapper>
              {error && (
                <AlertWrapper>
                  <Alert
                    color="error"
                    elevation={0}
                    icon={
                      <img
                        src={ICONS.ERROR_ALERT}
                        width={20}
                        height={20}
                        alt="error icon"
                      />
                    }
                  >
                    <div style={{ textAlign: "left" }}>{error}</div>
                  </Alert>
                </AlertWrapper>
              )}
              {loading && (
                <>
                  {type === "trigger" && (
                    <div style={{ textAlign: "center", margin: "0 0 20px" }}>
                      Grindery Flow is now waiting for a trigger event...
                    </div>
                  )}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "32px",
                      left: 0,
                      textAlign: "center",
                      color: "#8C30F5",
                      width: "100%",
                    }}
                  >
                    <CircularProgress color="inherit" />
                  </div>
                </>
              )}
              <ButtonWrapper>
                <Button onClick={handleSkipClick} className="outlined">
                  Skip test
                </Button>
                <Button disabled={loading} onClick={handleContinueClick}>
                  {type === "trigger" ? "Test" : "Send test"}
                </Button>
              </ButtonWrapper>
            </>
          )}
        </Content>
      )}
    </Container>
  ) : null;
};

export default StepTest;
