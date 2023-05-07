import React, { useState } from "react";
import styled from "styled-components";
import { RichInput, CircularProgress } from "grindery-ui";
import Button from "../../network/Button";
import useConnectorContext from "../../../hooks/useConnectorContext";
import IconField from "../../network/IconField";

const Title = styled.h3`
  font-weight: 700;
  font-size: 32px;
  line-height: 120%;
  color: #0b0d17;
  padding: 0;
  margin: 0 0 20px;
`;

const MaxHeightInput = styled.div`
  & .rich-input-box {
    max-height: 200px;
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
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 20px;
  margin-top: 32px;
`;

const ButtonsRight = styled.div`
  margin-left: auto;
`;

type Props = {};

const ConnectorSettingsPage = (props: Props) => {
  const { state, onConnectorSettingsSave } = useConnectorContext();
  const { cds } = state;
  const [data, setData] = useState({
    name: cds.name || "",
    description: cds.description || "",
    icon: cds.icon || "",
  });
  const [error, setError] = useState({ type: "", text: "" });

  return cds ? (
    <div>
      <Title>Settings</Title>
      <div>
        <RichInput
          options={[]}
          value={data.name}
          onChange={(value: string) => {
            setError({ type: "", text: "" });
            setData({
              ...data,
              name: value,
            });
          }}
          required
          label="Connector Name"
          placeholder="Connector name"
          singleLine
          error={error.type === "name" ? error.text : ""}
        />
        <MaxHeightInput>
          <RichInput
            options={[]}
            value={data.description}
            onChange={(value: string) => {
              setError({ type: "", text: "" });
              setData({
                ...data,
                description: value,
              });
            }}
            label="Connector Description"
            tooltip="A sentence describing your connector in 140 characters or less"
            placeholder=""
            error={error.type === "description" ? error.text : ""}
          />
        </MaxHeightInput>
        <IconField
          label="Connector Icon"
          onChange={(value: string) => {
            setError({ type: "", text: "" });
            setData({
              ...data,
              icon: value,
            });
          }}
          value={data.icon}
          error={error.type === "icon" ? error.text : ""}
          tooltip="Recommended icon size 40x40px. Allowed formats: PNG or SVG. Must be on transparent background."
          required
        />

        <ButtonsWrapper>
          <ButtonsRight>
            <Button
              onClick={() => {
                setError({ type: "", text: "" });
                if (!data.name) {
                  setError({
                    type: "name",
                    text: "Connector Name is required",
                  });
                  return;
                }
                if (!data.icon) {
                  setError({
                    type: "icon",
                    text: "Connector Icon is required",
                  });
                  return;
                }
                onConnectorSettingsSave(data);
              }}
            >
              Save
            </Button>
          </ButtonsRight>
        </ButtonsWrapper>
      </div>
    </div>
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

export default ConnectorSettingsPage;
