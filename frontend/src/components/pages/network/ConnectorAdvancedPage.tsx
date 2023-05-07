import React from "react";
import styled from "styled-components";
import { CircularProgress } from "grindery-ui";
import useConnectorContext from "../../../hooks/useConnectorContext";
import ReactJson from "@silizia/react-json-view";
import { NOT_ALLOWED } from "../../../context/ConnectorContext";

const Container = styled.div`
  & .react-json-view {
    padding: 20px;
  }
`;

const Title = styled.h3`
  font-weight: 700;
  font-size: 32px;
  line-height: 120%;
  color: #0b0d17;
  padding: 0;
  margin: 0 0 20px;
`;

type Props = {};

const ConnectorAdvancedPage = (props: Props) => {
  const { state, setState } = useConnectorContext();
  const { cds } = state;

  const addValue = (value: any) => {
    if (state.connector?.values?.status?.name === "Published") {
      setState({
        isSaving: false,
        snackbar: {
          opened: true,
          message: NOT_ALLOWED,
          severity: "error",
          duration: 5000,
          onClose: () => {
            setState({
              snackbar: {
                opened: false,
                message: "",
                severity: "error",
                onClose: () => {},
              },
            });
          },
        },
      });
      return;
    }
    setState({
      cds: value,
    });
  };

  const editValue = (value: any) => {
    if (state.connector?.values?.status?.name === "Published") {
      setState({
        isSaving: false,
        snackbar: {
          opened: true,
          message: NOT_ALLOWED,
          severity: "error",
          duration: 5000,
          onClose: () => {
            setState({
              snackbar: {
                opened: false,
                message: "",
                severity: "error",
                onClose: () => {},
              },
            });
          },
        },
      });
      return;
    }
    setState({
      cds: value,
    });
  };

  const deleteValue = (value: any) => {
    if (state.connector?.values?.status?.name === "Published") {
      setState({
        isSaving: false,
        snackbar: {
          opened: true,
          message: NOT_ALLOWED,
          severity: "error",
          duration: 5000,
          onClose: () => {
            setState({
              snackbar: {
                opened: false,
                message: "",
                severity: "error",
                onClose: () => {},
              },
            });
          },
        },
      });
      return;
    }
    setState({
      cds: value,
    });
  };

  return cds ? (
    <Container>
      <Title>Edit Connector Source Code</Title>
      <div>
        {cds && (
          <ReactJson
            src={cds}
            onAdd={(add) => addValue(add.updated_src)}
            onEdit={(edit) => editValue(edit.updated_src)}
            onDelete={(edit) => deleteValue(edit.updated_src)}
            theme={"monokai"}
            collapsed={3}
            collapseStringsAfterLength={30}
            displayDataTypes={false}
          />
        )}
      </div>
    </Container>
  ) : (
    <div
      style={{
        textAlign: "center",
        color: "#8C30F5",
        width: "100%",
        margin: "40px 0",
      }}
    >
      <CircularProgress color="inherit" />
    </div>
  );
};

export default ConnectorAdvancedPage;
