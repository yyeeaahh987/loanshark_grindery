import React from "react";
import styled from "styled-components";
import { RichInput } from "grindery-ui";
import { StateProps } from "./ConnectorSubmission";
import Button from "./Button";
import IconField from "./IconField";
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

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
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
  onSubmit: () => void;
};

const ConnectorSubmissionStep2 = (props: Props) => {
  const { state, setState, onSubmit } = props;
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
  return (
    <Container>
      <Title>Provide details about Connector and yourself</Title>

      <RichInput
        label="Connector Name"
        placeholder="My Connector"
        onChange={(value: string) => {
          setState({
            error: { type: "", text: "" },
            form: {
              ...state.form,
              entry: { ...state.form.entry, name: value },
            },
          });
        }}
        value={state.form.entry.name}
        options={[]}
        singleLine
        required
        error={state.error.type === "name" ? state.error.text : ""}
      />

      <RichInput
        label="Connector Description"
        placeholder="Short description for your Connector"
        onChange={(value: string) => {
          setState({
            error: { type: "", text: "" },
            form: {
              ...state.form,
              entry: { ...state.form.entry, description: value },
            },
          });
        }}
        value={state.form.entry.description}
        options={[]}
        error={state.error.type === "description" ? state.error.text : ""}
      />

      <IconField
        label="Connector Icon"
        onChange={(value: string) => {
          setState({
            error: { type: "", text: "" },
            form: {
              ...state.form,
              entry: { ...state.form.entry, icon: value },
            },
          });
        }}
        value={state.form.entry.icon}
        error={state.error.type === "icon" ? state.error.text : ""}
        tooltip="Recommended icon size 24x24px. Allowed formats: PNG or SVG. Must be on transparent background."
        required
      />

      {state.error.type === "cds" && <Error>{state.error.text}</Error>}
      <ButtonsWrapper>
        <ButtonWrapper>
          <Button
            style={{
              background: "#FFFFFF",
              border: "1px solid #0B0D17",
              color: "#0B0D17",
            }}
            onClick={() => {
              setState({ step: isEVM ? state.step - 1 : state.step - 2 });
            }}
          >
            Back
          </Button>
        </ButtonWrapper>
        <ButtonWrapper>
          <Button onClick={onSubmit}>Continue</Button>
        </ButtonWrapper>
      </ButtonsWrapper>
    </Container>
  );
};

export default ConnectorSubmissionStep2;
