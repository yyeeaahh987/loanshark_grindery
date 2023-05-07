import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import styled from "styled-components";
import { SCREEN } from "../../constants";
import useAppContext from "../../hooks/useAppContext";
import { WorkflowExecutionLog } from "../../types/Workflow";
import { WorkflowExecutionRow } from "../shared/WorkflowExecutionRow";

const RootWrapper = styled.div`
  max-width: 100%;
  @media (min-width: ${SCREEN.TABLET}) {
    margin: 40px 20px 0;
    border: 1px solid #dcdcdc;
    max-width: auto;
  }
  @media (min-width: ${SCREEN.DESKTOP}) {
    margin: 20px 20px 0;
  }
  @media (min-width: ${SCREEN.DESKTOP_XL}) {
    margin: 40px 20px 0;
  }
`;

const Wrapper = styled.div`
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 20px;

  @media (min-width: ${SCREEN.TABLET}) {
    padding: 40px;
  }

  @media (min-width: ${SCREEN.DESKTOP_XL}) {
    padding: 60px 106px;
  }
`;

const Title = styled.h1`
  font-weight: 700;
  font-size: 24px;
  line-height: 120%;
  color: rgb(54, 54, 54);
  margin: 0 0 8px;
  padding: 0;
`;

const Subtitle = styled.h2`
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  color: rgb(54, 54, 54);
  margin: 0;
  padding: 0;
`;

type Props = {};

const WorkflowHistoryPage = (props: Props) => {
  let navigate = useNavigate();
  let { key } = useParams();
  const { getWorkflowHistory, workflows } = useAppContext();
  const [items, setItems] = useState<WorkflowExecutionLog[][]>([]);

  const getExecutions = useCallback(() => {
    getWorkflowHistory(key || "", (logs) => {
      setItems((_items) => [..._items, logs]);
    });
  }, [getWorkflowHistory]);

  useEffect(() => {
    setItems([]);
    getExecutions();
  }, []);

  return (
    <RootWrapper>
      <Wrapper>
        <div>
          <Title>{workflows.find((wf) => wf.key === key)?.title || ""}</Title>
          <Subtitle>Workflow history</Subtitle>
        </div>
        {items.map((item, i) => (
          <WorkflowExecutionRow
            key={item[0]?.executionId || i}
            item={item}
            withDetails
          />
        ))}
      </Wrapper>
    </RootWrapper>
  );
};

export default WorkflowHistoryPage;
