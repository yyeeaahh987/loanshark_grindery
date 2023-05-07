import React from "react";
import styled from "styled-components";
import { CircularProgress } from "grindery-ui";
import { StateProps } from "./ConnectorSubmission";
import Button from "./Button";

const Container = styled.div`
  max-width: 816px;
  margin: 0 auto;
  padding: 64px 106px;
  background: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 16px;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-weight: 700;
  font-size: 32px;
  line-height: 120%;
  text-align: center;
  color: #0b0d17;
  margin: 0 0 32px;
  padding: 0;
`;

const ButtonWrapper = styled.div`
  margin: 12px 0 0;
  text-align: center;
`;

const Error = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  text-align: center;
  color: rgb(255, 88, 88);
  margin: 0 0 20px;
  padding: 0;
`;

type Props = {
  state: StateProps;
  setState: React.Dispatch<Partial<StateProps>>;
};

const ConnectorSubmissionLoading = (props: Props) => {
  const { state, setState } = props;

  return (
    <Container>
      <Title>
        {!state.error.type ? "Saving..." : "Connector creation failed"}
      </Title>
      {!state.error.type && (
        <div
          style={{
            textAlign: "center",
            color: "#ffb930",
            width: "100%",
            margin: "0 0 32px",
          }}
        >
          <CircularProgress color="inherit" />
        </div>
      )}

      {state.error.type === "submit" && <Error>{state.error.text}</Error>}
      {state.error.type === "submit" && (
        <ButtonWrapper>
          <Button
            style={{
              background: "#FFFFFF",
              border: "1px solid #0B0D17",
              color: "#0B0D17",
            }}
            onClick={() => {
              setState({ step: state.step - 1 });
            }}
          >
            Back
          </Button>
        </ButtonWrapper>
      )}
    </Container>
  );
};

export default ConnectorSubmissionLoading;
