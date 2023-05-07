import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import { RichInput } from "grindery-ui";
import Button from "./Button";
import useConnectorContext from "../../hooks/useConnectorContext";
import CheckBox from "../shared/CheckBox";
import useNetworkContext from "../../hooks/useNetworkContext";

const Container = styled.div`
  margin-top: 20px;

  & [data-slate-editor="true"][contenteditable="false"] {
    cursor: not-allowed;
    opacity: 0.75;
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 20px;
  margin-top: 32px;
`;

const ButtonsRight = styled.div`
  margin-left: auto;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 10px;
  margin-top: 25px;
  margin-bottom: 15px;
`;

const CheckboxLabel = styled.label`
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  color: #0b0d17;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 8px;

  & span {
    font-size: 12px;
    line-height: 150%;
    color: #898989;
  }
`;

type Props = {};

const OperationSettings = (props: Props) => {
  let { key, type } = useParams();
  const { state, onOperationSettingsSave } = useConnectorContext();
  const [error, setError] = useState({ type: "", text: "" });
  const isNewOperation = key === "__new__";
  const [currentKey, setCurrentKey] = useState(key);
  const { cds } = state;
  const {
    state: { blockchains },
  } = useNetworkContext();
  const chains = blockchains.map((chain) => ({
    value: chain.id,
    label: chain.values.name || "",
    id: chain.values.chain_id,
  }));

  const chain =
    chains.find(
      (c: any) => c.value === state.connector?.values?.blockchain?.[0]?.id || ""
    )?.id || "";

  const isEvm = chain.startsWith("eip155:");
  const currentOperation =
    (type && (cds?.[type] || []).find((op: any) => op.key === key)) || null;
  const [operation, setOperation] = useState<any>({
    key: currentOperation?.key || "",
    name: currentOperation?.name || "",
    display: {
      label: currentOperation?.display?.label || "",
      description: currentOperation?.display?.description || "",
      instructions: currentOperation?.display?.instructions || "",
      featured: Boolean(currentOperation?.display?.featured),
    },
    operation: currentOperation?.operation || {
      inputFields: !isEvm
        ? [
            {
              key: "_grinderyChain",
              label: "Blockchain",
              type: "string",
              required: true,
              default: chain,
              computed: true,
            },
          ]
        : [],
    },
  });

  useEffect(() => {
    const _currentOperation = {
      ...((type && (cds?.[type] || []).find((op: any) => op.key === key)) ||
        {}),
    };
    setOperation({
      key: _currentOperation?.key || "",
      name: _currentOperation?.name || "",
      display: {
        label: _currentOperation?.display?.label || "",
        description: _currentOperation?.display?.description || "",
        instructions: _currentOperation?.display?.instructions || "",
        featured: Boolean(_currentOperation?.display?.featured),
      },
      operation: _currentOperation?.operation || {
        inputFields: !isEvm
          ? [
              {
                key: "_grinderyChain",
                label: "Blockchain",
                type: "string",
                required: true,
                default: chain,
                computed: true,
              },
            ]
          : [],
      },
    });
    setCurrentKey(key);
  }, [currentOperation, key, type, cds, isEvm, chain]);

  return (
    <Container>
      <RichInput
        key={`${currentKey}_key`}
        label="Key"
        value={operation.key}
        onChange={(value: string) => {
          setError({ type: "", text: "" });
          setOperation({
            ...operation,
            key: value,
          });
        }}
        singleLine
        required
        tooltip="Enter a unique word or phrase without spaces to reference this operation inside Nexus. Not seen by users. Example: new_ticket."
        options={[]}
        readonly={!isNewOperation}
        error={error.type === "key" ? error.text : ""}
      />
      <RichInput
        key={`${currentKey}_name`}
        label="Name"
        value={operation.name}
        onChange={(value: string) => {
          setError({ type: "", text: "" });
          setOperation({
            ...operation,
            name: value,
            display: {
              ...operation.display,
              label: value,
            },
          });
        }}
        singleLine
        required
        tooltip="Enter a user friendly name for this operation that describes what makes it run. Shown to users inside Nexus. Example: New Ticket."
        options={[]}
        error={error.type === "name" ? error.text : ""}
      />
      <RichInput
        key={`${currentKey}_description`}
        label="Description"
        value={operation.display?.description || ""}
        onChange={(value: string) => {
          setError({ type: "", text: "" });
          setOperation({
            ...operation,
            display: {
              ...operation.display,
              description: value,
            },
          });
        }}
        tooltip="Describe clearly the purpose of this operation in a complete sentence. Example: Triggers when a new support ticket is created."
        options={[]}
        error={error.type === "description" ? error.text : ""}
      />
      <RichInput
        key={`${currentKey}_instructions`}
        label="Instructions"
        value={operation.display?.instructions || ""}
        onChange={(value: string) => {
          setError({ type: "", text: "" });
          setOperation({
            ...operation,
            display: {
              ...operation.display,
              instructions: value,
            },
          });
        }}
        tooltip={`Short instructions for how to use this ${
          type === "triggers" ? "trigger" : "action"
        }`}
        options={[]}
        error={error.type === "instructions" ? error.text : ""}
      />

      <CheckboxWrapper>
        <CheckBox
          isNetwork
          checked={operation.display.featured}
          onChange={() => {
            setError({ type: "", text: "" });
            setOperation({
              ...operation,
              display: {
                ...operation.display,
                featured: !operation.display.featured,
              },
            });
          }}
        />
        <CheckboxLabel
          onClick={() => {
            setError({ type: "", text: "" });
            setOperation({
              ...operation,
              display: {
                ...operation.display,
                featured: !operation.display.featured,
              },
            });
          }}
        >
          Featured{" "}
          <span>
            Featured {type} will be listed higher in the workflow builder UI
            then the rest.
          </span>
        </CheckboxLabel>
      </CheckboxWrapper>

      <ButtonsWrapper>
        <ButtonsRight>
          <Button
            onClick={() => {
              setError({ type: "", text: "" });
              if (!operation.key) {
                setError({
                  type: "key",
                  text: "Key field is required",
                });
                return;
              }
              if (!operation.name) {
                setError({
                  type: "name",
                  text: "Name field is required",
                });
                return;
              }

              onOperationSettingsSave(type, operation);
            }}
          >
            Save
          </Button>
        </ButtonsRight>
      </ButtonsWrapper>
    </Container>
  );
};

export default OperationSettings;
