import React from "react";
import styled from "styled-components";
import useNetworkContext from "../../hooks/useNetworkContext";
import { StateProps } from "./ConnectorSubmission";

const Container = styled.div`
  max-width: 816px;
  margin: 0 auto;
  padding: 60px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 16px;
`;

const Step = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 8px;
`;

const StepIcon = styled.div`
  min-width: 24px;
  height: 24px;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;

  & span {
    font-weight: 400;
    font-size: 14px;
    line-height: 150%;
    text-align: center;
    color: inherit;
  }
`;

const StepName = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  color: #ffffff;
  margin: 0;
  padding: 0;
`;

const StepDivider = styled.div`
  height: 1px;
  background: #dcdcdc;
  width: 20px;
`;

type Props = {
  state: StateProps;
  setState: React.Dispatch<Partial<StateProps>>;
};

const ConnectorSubmissionProgress = (props: Props) => {
  const { state, setState } = props;
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

  const steps: any[] = isEVM
    ? ["Smart-Contract", "ABI", "Details"]
    : ["Smart-Contract", "Details"];

  return (
    <Container>
      {steps.map((step: any, i: number) => (
        <>
          <Step
            onClick={() => {
              if (state.step > i) {
                setState({ step: i });
              }
            }}
            style={{ cursor: state.step > i ? "pointer" : "default" }}
          >
            <StepIcon
              style={{
                background: state.step >= i ? "#FFB930" : "#706E6E",
                color: state.step < i ? "#ffffff" : "#0B0D17",
              }}
            >
              {(isEVM && state.step > i) || (!isEVM && state.step - 1 > i) ? (
                <svg
                  width="13"
                  height="11"
                  viewBox="0 0 13 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.3945 0.546875L4.20312 7.73828L1.57812 5.08594C1.44141 4.97656 1.22266 4.97656 1.11328 5.08594L0.320312 5.87891C0.210938 5.98828 0.210938 6.20703 0.320312 6.34375L3.98438 9.98047C4.12109 10.1172 4.3125 10.1172 4.44922 9.98047L12.6523 1.77734C12.7617 1.66797 12.7617 1.44922 12.6523 1.3125L11.8594 0.546875C11.75 0.410156 11.5312 0.410156 11.3945 0.546875Z"
                    fill="#0B0D17"
                  />
                </svg>
              ) : (
                <span>{i + 1}</span>
              )}
            </StepIcon>
            <StepName>{step}</StepName>
          </Step>
          {i + 1 < steps.length && <StepDivider />}
        </>
      ))}
    </Container>
  );
};

export default ConnectorSubmissionProgress;
