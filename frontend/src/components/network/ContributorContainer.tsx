import React from "react";
import styled from "styled-components";
import { CircularProgress } from "grindery-ui";
import { ICONS } from "../../constants";
import useNetworkContext from "../../hooks/useNetworkContext";
import Button from "./Button";
import { getParameterByName } from "../../helpers/utils";

const Container = styled.div`
  min-height: 100vh;
  background: #444444;
  box-sizing: border-box;
  padding: 75px 20px 40px;
`;

const Content = styled.div`
  max-width: 816px;
  margin: 60px auto 0;
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
  margin: 0 0 20px;
  padding: 0;
`;

const Description = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  text-align: center;
  color: #0b0d17;
  margin: 0 0 32px;
  padding: 0;
`;

const Error = styled.p`
  text-align: center;
  width: 100%;
  max-width: 350px;
  margin: 0 auto 32px;
  color: #ff5858;
  padding: 0;
`;

const ButtonsWrapper = styled.div`
  margin: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 10px;

  & button {
    padding: 8px 24px;
  }
`;

const Loading = styled.div`
  text-align: center;
  color: #ffb930;
  width: 100%;
  margin: 0 0 32px;
`;

type Props = {
  children: React.ReactNode;
};

const ContributorContainer = (props: Props) => {
  const { children } = props;
  const { state, connectContributor } = useNetworkContext();
  const { contributor } = state;

  const receiveMessage = (e: any) => {
    if (e.origin === window.location.origin) {
      const { data } = e;

      if (data.gr_url) {
        const codeParam = getParameterByName("code", data.gr_url);
        connectContributor(codeParam || "");
        e.source.postMessage({ gr_close: true }, window.location.origin);
        window.removeEventListener("message", receiveMessage, false);
      }
    }
  };

  const handleConnectClick = () => {
    window.removeEventListener("message", receiveMessage, false);
    const width = 375,
      height = 500,
      left = window.screen.width / 2 - width / 2,
      top = window.screen.height / 2 - height / 2;

    let windowObjectReference = window.open(
      `https://github.com/login/oauth/authorize?redirect_uri=${window.location.origin}/github/auth&client_id=f3b76c11b63047fd459c&scope=read:user`,
      "_blank",
      "status=no, toolbar=no, menubar=no, width=" +
        width +
        ", height=" +
        height +
        ", top=" +
        top +
        ", left=" +
        left
    );
    windowObjectReference?.focus();
    window.addEventListener("message", receiveMessage, false);
  };

  return contributor.loading ? (
    <>
      <div
        style={{
          textAlign: "center",
          color: "#ffb930",
          width: "100%",
          margin: "120px 0 60px",
        }}
      >
        <CircularProgress color="inherit" />
      </div>
    </>
  ) : (
    <>
      {contributor.username ? (
        <>{children}</>
      ) : (
        <Container>
          <Content>
            <Title>Join Nexus Developer Network</Title>
            <Description>
              Connect GitHub account to be able to create and clone Connectors
            </Description>
            {contributor.connecting && (
              <Loading>
                <CircularProgress color="inherit" />
              </Loading>
            )}
            {contributor.error && <Error>{contributor.error}</Error>}
            <ButtonsWrapper>
              <Button
                icon={ICONS.GITHUB_LOGO_LIGHT}
                onClick={handleConnectClick}
              >
                Connect GitHub
              </Button>
            </ButtonsWrapper>
          </Content>
        </Container>
      )}
    </>
  );
};

export default ContributorContainer;
