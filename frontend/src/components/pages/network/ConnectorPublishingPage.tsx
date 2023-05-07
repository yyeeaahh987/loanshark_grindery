import React from "react";
import styled from "styled-components";
import { Dialog, CircularProgress } from "grindery-ui";
import Button from "../../network/Button";
import useConnectorContext from "../../../hooks/useConnectorContext";
import RadioButton from "../../network/RadioButton";
import useWorkspaceContext from "../../../hooks/useWorkspaceContext";
import { useNavigate } from "react-router";

const Title = styled.h3`
  font-weight: 700;
  font-size: 32px;
  line-height: 120%;
  color: #0b0d17;
  padding: 0;
  margin: 0 0 20px;
`;

const Card = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 20px;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  padding: 15px 20px;
  margin-bottom: 20px;
`;

const CardContent = styled.div`
  width: 100%;
`;

const CardTitle = styled.h5`
  font-weight: 500;
  font-size: 20px;
  line-height: 150%;
  margin: 0;
  padding: 0;
  color: #0b0d17;
`;

const CardDescription = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  margin: 10px 0 0;
  padding: 0;
  color: #898989;
`;

const RadioWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 4px;
  margin-top: 10px;
  margin-bottom: 5px;
`;

const ConnectorDetails = styled.div`
  margin-top: 10px;

  & p {
    margin: 0 0 8px;
    padding: 0;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: none;

  & tbody tr {
    border-bottom: 1px solid #dcdcdc;

    & td {
      padding: 10px;
    }

    & td:first-child {
      width: 30%;
      padding-left: 0;
      font-size: 14px;
    }

    &:last-child {
      border-bottom: none;
    }
  }
`;

const PublishingText = styled.p`
  margin: 0 0 20px;
  padding: 0;
  text-align: center;
`;

const NotValidMessage = styled.p`
  font-size: 16px;
  margin: 20px 0;
  text-align: left;
  color: #ff5858;

  & span {
    color: inherit;
    text-decoration: underline;
    cursor: pointer;
  }
`;

type Props = {};

const ConnectorPublishingPage = (props: Props) => {
  const { state, setState, publishConnector } = useConnectorContext();
  let navigate = useNavigate();
  const { connector, cds } = state;
  const { workspaces, workspace } = useWorkspaceContext();
  const { id } = state;
  const isValid = cds && cds.name && cds.key && cds.icon;
  const hasTriggers = cds.triggers && cds.triggers.length > 0;
  const hasActions = cds.actions && cds.actions.length > 0;

  return id ? (
    <div>
      <Title>Publishing</Title>
      <div>
        <Card>
          <CardContent>
            <CardTitle>Connector Access</CardTitle>
            <CardDescription>
              Who will be able to use your connector in Nexus?
            </CardDescription>
            <RadioWrapper>
              <RadioButton
                label="Private"
                selected={cds?.access === "Private"}
                onChange={() => {
                  setState({
                    cds: {
                      ...state.cds,
                      access: "Private",
                    },
                  });
                }}
                description="Only you will be able to use Connector"
              />

              {workspace !== "personal" && (
                <RadioButton
                  label="Workspace"
                  selected={cds?.access === "Workspace"}
                  onChange={() => {
                    setState({
                      cds: {
                        ...state.cds,
                        access: "Workspace",
                      },
                    });
                  }}
                  description={`Connector will be available for all members of <strong>${
                    workspaces?.find((ws: any) => ws.key === workspace)
                      ?.title || ""
                  }</strong> workspace`}
                />
              )}

              <RadioButton
                label="Public"
                selected={!cds?.access || cds?.access === "Public"}
                onChange={() => {
                  setState({
                    cds: {
                      ...state.cds,
                      access: "Public",
                    },
                  });
                }}
                description="Connector will be available for all Nexus users"
              />
            </RadioWrapper>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <CardTitle>Connector Summary</CardTitle>
            <CardDescription>
              Review Connector details before publishing.
            </CardDescription>
            <ConnectorDetails>
              <Table>
                <tbody>
                  <tr>
                    <td>Name</td>
                    <td>{cds.name}</td>
                  </tr>
                  <tr>
                    <td>Description</td>
                    <td>{cds.description || ""}</td>
                  </tr>
                  <tr>
                    <td>Access</td>
                    <td>{cds?.access || "Public"}</td>
                  </tr>
                  {state.connector?.values?.contract_address && (
                    <tr>
                      <td>Smart-contract address</td>
                      <td>{state.connector?.values?.contract_address}</td>
                    </tr>
                  )}
                  <tr>
                    <td>Number of triggers</td>
                    <td>{(cds.triggers || []).length}</td>
                  </tr>
                  <tr>
                    <td>Number of actions</td>
                    <td>{(cds.actions || []).length}</td>
                  </tr>
                </tbody>
              </Table>
            </ConnectorDetails>
          </CardContent>
        </Card>
        {!isValid ? (
          <NotValidMessage>
            Please, configure connector before publishing.{" "}
            <span
              onClick={() => {
                navigate(`/network/connector/${id}/settings`);
              }}
            >
              Settings
            </span>{" "}
            is a good place to start.
          </NotValidMessage>
        ) : (
          <>
            {!hasTriggers && !hasActions && (
              <NotValidMessage>
                Please, add at least one{" "}
                <span
                  onClick={() => {
                    navigate(`/network/connector/${id}`);
                  }}
                >
                  trigger or action
                </span>{" "}
                before publishing.
              </NotValidMessage>
            )}
          </>
        )}
        <Button
          onClick={() => {
            publishConnector();
          }}
          disabled={
            !isValid ||
            (!hasTriggers && !hasActions) ||
            state.isPublishing ||
            connector?.values?.status?.name === "Published"
          }
        >
          {connector?.values?.status?.name === "Published"
            ? "Published"
            : "Publish Connector"}
        </Button>

        <Dialog open={state.isPublishing} onClose={() => {}} maxWidth={"350px"}>
          <div
            style={{
              textAlign: "center",
              color: "#ffb930",
              width: "100%",
              margin: "40px 0",
            }}
          >
            <CircularProgress color="inherit" />
          </div>
          <PublishingText>Publishing...</PublishingText>
        </Dialog>
      </div>
    </div>
  ) : (
    <div
      style={{
        textAlign: "center",
        color: "#ffb930",
        width: "100%",
        margin: "40px 0",
      }}
    >
      <CircularProgress color="inherit" />
    </div>
  );
};

export default ConnectorPublishingPage;
