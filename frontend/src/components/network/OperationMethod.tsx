import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import { RichInput, Autocomplete } from "grindery-ui";
import Button from "./Button";
import useConnectorContext from "../../hooks/useConnectorContext";

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

const AutocompleteWrapper = styled.div`
  & .MuiOutlinedInput-root {
    box-shadow: none !important;
    border: 1px solid #dcdcdc !important;
  }

  &.has-error .MuiOutlinedInput-root {
    box-shadow: inset 0px 0px 0px 1px #ff5858 !important;
    border: 1px solid #ff5858 !important;
  }
`;

type Props = {};

const OperationMethod = (props: Props) => {
  let { key, type } = useParams();
  const { state, onOperationSettingsSave } = useConnectorContext();
  const [error, setError] = useState({ type: "", text: "" });
  const [currentKey, setCurrentKey] = useState(key);
  const { cds } = state;
  const currentOperation =
    (type && (cds?.[type] || []).find((op: any) => op.key === key)) || null;
  const [operation, setOperation] = useState<any>({
    ...currentOperation,
  });

  const typeOptions =
    type === "triggers"
      ? [
          {
            value: "blockchain:event",
            label: "Blockchain event",
          },
          {
            value: "polling",
            label: "API polling",
          },
        ]
      : [
          {
            value: "blockchain:call",
            label: "Blockchain call",
          },
          {
            value: "api",
            label: "API call",
          },
        ];

  useEffect(() => {
    const _currentOperation = {
      ...((type && (cds?.[type] || []).find((op: any) => op.key === key)) ||
        {}),
    };
    setOperation({
      ..._currentOperation,
    });
    setCurrentKey(key);
  }, [currentOperation, key, type, cds]);

  return (
    <Container>
      <AutocompleteWrapper className={error.type === "type" ? "has-error" : ""}>
        <Autocomplete
          key={`${currentKey}_type`}
          label="Operation Type"
          value={operation.operation?.type || ""}
          onChange={(value: string) => {
            setError({ type: "", text: "" });
            setOperation({
              ...operation,
              operation: {
                ...(operation?.operation || {}),
                type: value,
              },
            });
          }}
          required
          placeholder="Select operation type"
          size="full"
          options={typeOptions}
          error={error.type === "type" ? error.text : ""}
        />
      </AutocompleteWrapper>

      {(operation.operation?.type === "blockchain:call" ||
        operation.operation?.type === "blockchain:event") && (
        <RichInput
          key={`${currentKey}_signature`}
          label="Signature"
          value={
            operation?.operation?.signature
              ? Array.isArray(operation?.operation?.signature)
                ? JSON.stringify(operation?.operation?.signature)
                : operation?.operation?.signature?.toString() || ""
              : ""
          }
          onChange={async (value: string) => {
            setError({ type: "", text: "" });
            let v;
            try {
              v = await JSON.parse(value);
            } catch (err) {
              v = value;
            }
            setOperation({
              ...operation,
              operation: {
                ...(operation?.operation || {}),
                signature: v,
              },
            });
          }}
          tooltip={
            type === "triggers"
              ? "Signature of the event. Format of this field depends on the chain that the CDS is created for. For EVM chains the signature is Solidity event declaration including parameter names (which are mapped to input fields by key) e.g Transfer(address indexed from, address indexed to, uint256 value) for ERC20 Transfer event. Multiple signatures may be specified for EVM chains, but indexed parameters must be exactly the same in all signatures."
              : "Signature of the function including parameter names (which are mapped to input fields by key) e.g function transfer(address to, uint256 value) for ERC20 transfer call."
          }
          options={[]}
          readonly={!!currentOperation?.operation?.signature}
          error={error.type === "signature" ? error.text : ""}
        />
      )}
      {(operation.operation?.type === "api" ||
        operation.operation?.type === "polling") && (
        <>
          <AutocompleteWrapper
            className={error.type === "method" ? "has-error" : ""}
          >
            <Autocomplete
              key={`${currentKey}_method`}
              label="Request Method"
              value={operation.operation?.operation?.method || "GET"}
              onChange={(value: string) => {
                setError({ type: "", text: "" });
                setOperation({
                  ...operation,
                  operation: {
                    ...(operation?.operation || {}),
                    operation: {
                      ...(operation?.operation?.operation || {}),
                      method: value,
                    },
                  },
                });
              }}
              placeholder="Select request method"
              size="full"
              options={[
                {
                  value: "GET",
                  label: "GET",
                },
                {
                  value: "POST",
                  label: "POST",
                },
                {
                  value: "PUT",
                  label: "PUT",
                },
                {
                  value: "PATCH",
                  label: "PATCH",
                },
                {
                  value: "DELETE",
                  label: "DELETE",
                },
              ]}
              error={error.type === "method" ? error.text : ""}
              tooltip="The HTTP method for the request."
            />
          </AutocompleteWrapper>
          <RichInput
            key={`${currentKey}_url`}
            label="Request URL"
            value={operation.operation?.operation?.url || ""}
            onChange={(value: string) => {
              setError({ type: "", text: "" });
              setOperation({
                ...operation,
                operation: {
                  ...(operation?.operation || {}),
                  operation: {
                    ...(operation?.operation?.operation || {}),
                    url: value,
                  },
                },
              });
            }}
            singleLine
            options={[]}
            tooltip="A URL for the request (the querystring will be parsed and merged with params). Keys and values will not be re-encoded."
            error={error.type === "url" ? error.text : ""}
          />
          <RichInput
            key={`${currentKey}_body`}
            label="Request Body"
            value={operation.operation?.operation?.body || ""}
            onChange={(value: string) => {
              setError({ type: "", text: "" });
              setOperation({
                ...operation,
                operation: {
                  ...(operation?.operation || {}),
                  operation: {
                    ...(operation?.operation?.operation || {}),
                    body: value,
                  },
                },
              });
            }}
            options={[]}
            tooltip="Can be nothing, a raw string or JSON (object or array)."
            error={error.type === "body" ? error.text : ""}
          />
          <RichInput
            key={`${currentKey}_params`}
            label="Request Params"
            value={operation.operation?.operation?.params || ""}
            onChange={(value: string) => {
              setError({ type: "", text: "" });
              setOperation({
                ...operation,
                operation: {
                  ...(operation?.operation || {}),
                  operation: {
                    ...(operation?.operation?.operation || {}),
                    params: value,
                  },
                },
              });
            }}
            options={[]}
            tooltip="A mapping of the querystring - will get merged with any query params in the URL. Keys and values will be encoded."
            error={error.type === "params" ? error.text : ""}
          />
          <RichInput
            key={`${currentKey}_headers`}
            label="Request Params"
            value={operation.operation?.operation?.headers || ""}
            onChange={(value: string) => {
              setError({ type: "", text: "" });
              setOperation({
                ...operation,
                operation: {
                  ...(operation?.operation || {}),
                  operation: {
                    ...(operation?.operation?.operation || {}),
                    headers: value,
                  },
                },
              });
            }}
            options={[]}
            tooltip="The HTTP headers for the request."
            error={error.type === "headers" ? error.text : ""}
          />
          <RichInput
            key={`${currentKey}_auth`}
            label="Request Auth"
            value={operation.operation?.operation?.auth || ""}
            onChange={(value: string) => {
              setError({ type: "", text: "" });
              setOperation({
                ...operation,
                operation: {
                  ...(operation?.operation || {}),
                  operation: {
                    ...(operation?.operation?.operation || {}),
                    auth: value,
                  },
                },
              });
            }}
            options={[]}
            tooltip="An object holding the auth parameters for OAuth1 request signing or an array to hold the username and password for Basic Auth."
            error={error.type === "auth" ? error.text : ""}
          />
        </>
      )}

      <ButtonsWrapper>
        <ButtonsRight>
          <Button
            onClick={() => {
              setError({ type: "", text: "" });
              if (!operation.operation?.type) {
                setError({
                  type: "type",
                  text: "Operation type is required",
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

export default OperationMethod;
