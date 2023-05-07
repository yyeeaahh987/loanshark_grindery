import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ICONS, SCREEN } from "../../constants";
import Button from "../shared/Button";

const Container = styled.div`
  @media (min-width: ${SCREEN.TABLET}) {
    padding: 60px 106px;
    margin: 40px 20px 0;
  }
`;

const Wrapper = styled.div`
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  flex-wrap: nowrap;
  min-height: calc(100vh - 150px);
  @media (min-width: ${SCREEN.TABLET}) {
    padding: 40px 0;
    margin: 0;
    height: calc(100vh - 280px);
    max-height: calc(100vh - 350px);
    min-height: auto;
  }
`;

const Title = styled.p`
  font-weight: 700;
  font-size: 25px;
  line-height: 120%;
  text-align: center;
  color: rgba(0, 0, 0, 0.87);
  padding: 0 50px;
  margin: 0 0 15px;
  @media (min-width: ${SCREEN.TABLET}) {
    padding: 0;
    max-width: 576px;
    margin: 0 auto 15px;
  }
`;

const Img = styled.img`
  margin: 0 auto 15px;
  width: 100%;
  max-width: 335px;
  height: 322px;
  @media (min-width: ${SCREEN.TABLET}) {
    width: 100%;
    max-width: 500px;
    height: 100%;
    max-height: 547px;
  }
`;

const Desc = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  text-align: center;
  color: #0b0d17;
  padding: 0;
  margin: 0 0 5px;
  @media (min-width: ${SCREEN.TABLET}) {
    max-width: 576px;
    margin: 0 auto 5px;
  }
`;

type Props = {};

const CreateWorkflowPage = (props: Props) => {
  let navigate = useNavigate();
  return (
    <Container>
      <Wrapper>
        <Title>Create your first workflow</Title>
        <Img src="/images/create-workflow.svg" alt="Create workflow" />
        <Desc>
          Create workflows to connect a Web2 to a Web3 App or viceversa.
        </Desc>
        <Button
          value="Create workflow"
          onClick={() => {
            navigate("/workflows/new", { replace: true });
          }}
          icon={ICONS.PLUS_WHITE}
          hideIconBorder
        />
      </Wrapper>
    </Container>
  );
};

export default CreateWorkflowPage;
