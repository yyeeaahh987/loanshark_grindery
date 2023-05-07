import React from "react";
import _ from "lodash";
import styled from "styled-components";
import { Autocomplete, RichInput } from "grindery-ui";
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
  margin: 32px 0 0;
  text-align: center;
`;

type Props = {
  state: StateProps;
  setState: React.Dispatch<Partial<StateProps>>;
  onSubmit: () => void;
};

const ConnectorSubmissionStep0 = (props: Props) => {
  const { state, setState, onSubmit } = props;
  const {
    state: { blockchains },
  } = useNetworkContext();
  const chains = _.orderBy(
    blockchains.map((chain) => ({
      value: chain.id,
      label: chain.values.name || "",
      icon: chain.values.icon || "",
      id: chain.values.chain_id,
    })),
    [(chain: any) => chain.label?.toLowerCase()],
    ["asc"]
  );

  return (
    <Container>
      <Title>Let's get started</Title>
      <Autocomplete
        options={chains}
        label="Blockchain"
        value={state.form.entry.blockchain}
        placeholder={"Select blockchain"}
        onChange={(value: string) => {
          setState({
            error: { type: "", text: "" },
            form: {
              ...state.form,
              entry: { ...state.form.entry, blockchain: value },
            },
          });
        }}
        error={state.error.type === "blockchain" ? state.error.text : ""}
      ></Autocomplete>

      <RichInput
        label="Smart-Contract Address"
        placeholder="0x..."
        onChange={(value: string) => {
          setState({
            error: { type: "", text: "" },
            form: {
              ...state.form,
              entry: { ...state.form.entry, contract: value },
            },
          });
        }}
        value={state.form.entry.contract}
        options={[]}
        singleLine
        error={state.error.type === "contract" ? state.error.text : ""}
      />

      <ButtonWrapper>
        <Button onClick={onSubmit}>Continue</Button>
      </ButtonWrapper>
    </Container>
  );
};

export default ConnectorSubmissionStep0;
