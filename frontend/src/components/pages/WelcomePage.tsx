import React from "react";
import styled from "styled-components";
import ConnectButton from "../shared/ConnectButton";
import { SCREEN } from "../../constants";

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
  padding: 0 90px;
  margin: 0 0 15px;
  @media (min-width: ${SCREEN.TABLET}) {
    padding: 0;
    margin: 0 auto 15px;
  }
`;

const Img = styled.img`
  margin: 0 auto 15px;
  width: 335px;
  max-width: 100%;
  height: 322px;
  @media (min-width: ${SCREEN.TABLET}) {
    width: 100%;
    max-width: 300px;
    height: 100%;
  }
  max-height: 300px;
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

const Disclaimer = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 150%;
  text-align: center;
  color: #0b0d17;
  opacity: 0.5;
  max-width: 500px;
  margin: 0 auto;
`;

type Props = {};

const WelcomePage = (props: Props) => {
  return (
    <Container>
      <Wrapper>
        <Img src="/images/favicon.png" alt="Welcome" />
        <Title>Welcome to Loanshark Automation Toolbox</Title>
        <Desc>
          A no-code toolbox for building on-chain and off-chain automation.
        </Desc>
        <ConnectButton />
      </Wrapper>
    </Container>
  );
};

export default WelcomePage;
