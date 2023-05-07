import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { SCREEN } from "../../constants";
import useWorkflowContext from "../../hooks/useWorkflowContext";

const Container = styled.div`
  position: relative;
  margin: 20px;
  font-weight: 700;
  font-size: 20px;
  line-height: 130%;
  color: #0b0d17;
  overflow: auto;

  span {
    font-weight: 700;
    font-size: 20px;
    line-height: 130%;
    color: #0b0d17;
    overflow: initial;
  }

  @media (min-width: ${SCREEN.TABLET}) {
    position: fixed;
    top: 25px;
    left: 76px;
    z-index: 1220;
    margin: 0px;
    overflow: initial;

    span {
      white-space: nowrap;
    }
  }
`;
const InputWrapper = styled.div`
  position: relative;
  @media (min-width: ${SCREEN.TABLET}) {
    &:hover:after,
    &:focus-within:after {
      content: "";
      display: block;
      width: 12px;
      height: 12px;
      position: absolute;
      right: 1px;
      background-image: url(/images/icons/pencil.svg);
      background-position: center center;
      background-repeat: no-repeat;
      top: 7px;
    }
  }
`;
const Input = styled.input`
  font-family: Roboto;
  font-weight: 700;
  font-size: 20px;
  line-height: 130%;
  color: #0b0d17;
  padding: 0;
  margin: 0;
  border: none;
  background: none;
  width: 100%;
  position: relative;
  z-index: 1;

  &:focus,
  &:hover {
    border-bottom: 1px dashed #898989;
    outline: none;
  }
`;

type Props = {};

const WorkflowName = (props: Props) => {
  const { workflow, updateWorkflow } = useWorkflowContext();
  const [width, setWidth] = useState(0);
  const titleEl = useRef<HTMLSpanElement>(null);
  const inputEl = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateWorkflow({
      title: e.target.value,
    });
  };

  const handleFocus = () => {
    if (inputEl.current) {
      inputEl.current.select();
    }
  };

  const handleBlur = () => {
    if (!workflow.title) {
      updateWorkflow({
        title: "Name your workflow",
      });
    }
  };

  useEffect(() => {
    if (titleEl.current) {
      setWidth(titleEl.current.offsetWidth + 22);
    }
  }, [workflow.title]);

  console.log(`workflow`,workflow)
  
  return (
    <Container>
      <InputWrapper>
        <span
          style={{ opacity: 0, position: "absolute", zIndex: 0 }}
          ref={titleEl}
        >
          {workflow.title}
        </span>
        <Input
          type="text"
          value={workflow.title || ""}
          onChange={handleChange}
          style={{ width }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          ref={inputEl}
        />
      </InputWrapper>
    </Container>
  );
};

export default WorkflowName;
