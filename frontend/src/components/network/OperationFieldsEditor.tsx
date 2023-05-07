import React, { useState } from "react";
import styled from "styled-components";
import { Tooltip, IconButton } from "grindery-ui";
import { Navigate, Route, Routes, useParams } from "react-router";
import OperationInputFields from "./OperationInputFields";
import OperationInputFieldForm from "./OperationInputFieldForm";
import OperationFormPreview from "./OperationFormPreview";

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-itmes: flex-start;
  justify-content: flex-start;
  flew-wrap: nowrap;
  gap: 20px;
`;

const Editor = styled.div`
  width: 100%;
  max-width: calc(50% - 10px);
  margin-top: 20px;

  &.full {
    max-width: 100%;
  }

  & h3 {
    font-weight: 700;
    font-size: 22px;
    line-height: 150%;
    color: #141416;
    margin: 10px 0 15px;
    padding: 0;
  }
`;

const Preview = styled.div`
  width: 100%;
  max-width: calc(50% - 10px);
`;

const PreviewToggle = styled.div`
  position: absolute;
  top: 20px;
  right: 0px;
`;

type Props = {};

const OperationFieldsEditor = (props: Props) => {
  let { id, type, key } = useParams();
  const [showPreview, setShowPreview] = useState(true);

  return (
    <Container>
      <Editor className={!showPreview ? "full" : ""}>
        <h3>Form Editor</h3>
        <Routes>
          <Route path="/" element={<OperationInputFields />}></Route>
          <Route path=":inputKey" element={<OperationInputFieldForm />} />
          <Route
            path="*"
            element={
              <Navigate
                to={`/network/connector/${id}/${type}/${key}/inputFields`}
                replace
              />
            }
          ></Route>
        </Routes>
      </Editor>
      {showPreview && (
        <Preview>
          <OperationFormPreview />
        </Preview>
      )}
      <PreviewToggle>
        <Tooltip title={showPreview ? "Hide preview" : "Show preview"}>
          <div>
            <IconButton
              onClick={() => {
                setShowPreview(!showPreview);
              }}
              icon={showPreview ? "cancel" : "visibility"}
              type="text"
              color="#0B0D17"
            />
          </div>
        </Tooltip>
      </PreviewToggle>
    </Container>
  );
};

export default OperationFieldsEditor;
