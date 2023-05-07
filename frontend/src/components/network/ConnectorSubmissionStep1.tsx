import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { RichInput, CircularProgress } from "grindery-ui";
import { StateProps } from "./ConnectorSubmission";
import Button from "./Button";
import useNetworkContext from "../../hooks/useNetworkContext";

const Container = styled.div`
  max-width: 816px;
  margin: 0 auto;
  padding: 64px 106px;
  background: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 16px;
  box-sizing: border-box;
`;

const Icon = styled.div`
  text-align: center;
  margin: 0 0 16px;
`;

const Title = styled.h1`
  font-weight: 700;
  font-size: 32px;
  line-height: 120%;
  text-align: center;
  color: #0b0d17;
  margin: 0 0 16px;
  padding: 0;
`;

const Description = styled.p`
  font-weight: 400;
  font-size: 20px;
  line-height: 130%;
  text-align: center;
  color: #444444;
  margin: 0 0 32px;
  padding: 0;
`;

const ButtonWrapper = styled.div`
  margin: 32px 0 8px;
  text-align: center;
`;

const EditAbiWrapper = styled.div`
  & p {
    font-weight: 400;
    font-size: 16px;
    line-height: 150%;
    text-align: center;
    color: #444444;
    padding: 0;
    margin: 0 0 8px;
  }

  & h5 {
    font-weight: 400;
    font-size: 16px;
    line-height: 150%;
    text-align: center;
    text-decoration: underline;
    color: #0b0d17;
    margin: 0;
    padding: 0;
    cursor: pointer;
  }
`;

const MaxHeightInput = styled.div`
  & .rich-input-box {
    max-height: 150px;
    overflow: auto;
  }
  & .rich-input div[data-slate-editor="true"] {
    overflow: auto !important;
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
`;

type Props = {
  state: StateProps;
  setState: React.Dispatch<Partial<StateProps>>;
  onSubmit: () => void;
};

const ConnectorSubmissionStep1 = (props: Props) => {
  const { state, setState, onSubmit } = props;
  const [isEditing, setIsEditing] = useState(false);
  const {
    state: { blockchains },
  } = useNetworkContext();
  const chains = blockchains.map((chain) => ({
    value: chain.id,
    label: chain.values.name || "",
    icon: chain.values.icon || "",
    id: chain.values.chain_id,
  }));
  const isEVM =
    state.form.entry.blockchain &&
    chains
      .find((chain: any) => chain.value === state.form.entry.blockchain)
      ?.id?.startsWith("eip155");

  useEffect(() => {
    if (!isEVM) {
      setState({
        step: 2,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEVM]);

  return isEVM ? (
    <Container>
      {state.loading ? (
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
      ) : (
        <>
          {state.form.entry.abi && !isEditing ? (
            <>
              <Icon>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="24" cy="24" r="24" fill="#00B674" />
                  <path
                    d="M19.8001 33.4251C19.4657 33.4253 19.1346 33.3595 18.8258 33.2314C18.5169 33.1034 18.2363 32.9157 18.0001 32.6791L12.5581 27.2391C12.2769 26.9578 12.1189 26.5764 12.1189 26.1786C12.1189 25.7809 12.2769 25.3994 12.5581 25.1181C12.8394 24.8369 13.2208 24.679 13.6186 24.679C14.0163 24.679 14.3978 24.8369 14.6791 25.1181L19.8001 30.2391L33.3481 16.6911C33.6294 16.4099 34.0108 16.252 34.4086 16.252C34.8063 16.252 35.1878 16.4099 35.4691 16.6911C35.7503 16.9724 35.9083 17.3539 35.9083 17.7516C35.9083 18.1494 35.7503 18.5308 35.4691 18.8121L21.6001 32.6791C21.3638 32.9157 21.0833 33.1034 20.7744 33.2314C20.4655 33.3595 20.1344 33.4253 19.8001 33.4251Z"
                    fill="white"
                  />
                </svg>
              </Icon>
              <Title>Good News!</Title>
              <Description>
                We were able to find the public smart contract ABI
              </Description>

              <ButtonWrapper>
                <Button onClick={onSubmit}>Continue</Button>
              </ButtonWrapper>
              <EditAbiWrapper>
                <p>or</p>
                <h5
                  onClick={() => {
                    setIsEditing(true);
                  }}
                >
                  review and edit the ABI
                </h5>
              </EditAbiWrapper>
            </>
          ) : (
            <>
              <Title>Please provide the ABI of your smart contract</Title>
              <Description>
                We were unable to look it up automatically.
              </Description>

              <MaxHeightInput>
                <RichInput
                  label="Smart-Contract ABI"
                  placeholder="Paste ABI json here"
                  onChange={(value: string) => {
                    setIsEditing(true);
                    setState({
                      form: {
                        ...state.form,
                        entry: {
                          ...state.form.entry,
                          abi: value,
                        },
                      },
                      error: { type: "", text: "" },
                    });
                  }}
                  value={state.form.entry.abi}
                  options={[]}
                  error={state.error.type === "abi" ? state.error.text : ""}
                />
              </MaxHeightInput>
              <ButtonsWrapper>
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
                <ButtonWrapper>
                  <Button onClick={onSubmit}>Continue</Button>
                </ButtonWrapper>
              </ButtonsWrapper>
            </>
          )}
        </>
      )}
    </Container>
  ) : null;
};

export default ConnectorSubmissionStep1;
