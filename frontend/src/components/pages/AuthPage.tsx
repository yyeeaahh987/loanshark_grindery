import React, { useEffect } from "react";
import Logo from "../shared/Logo";
import styled from "styled-components";

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 10px;
`;

const Title = styled.h1`
  font-weight: 700;
  font-size: 22px;
  line-height: 150%;
  color: #0b0d17;
  margin: 0;
  padding: 0;
`;

type Props = {};

const AuthPage = (props: Props) => {
  const receiveMessage = (e: { origin: any; data: any }) => {
    if (e.origin === window.location.origin) {
      const { data } = e;
      if (data.gr_close) {
        window.close();
      }
    }
  };

  useEffect(() => {
    if (window && window.opener) {
      window.opener.postMessage(
        { gr_url: window.location.href },
        window.location.origin
      );

      window.addEventListener(
        "message",
        (event) => receiveMessage(event),
        false
      );
    }
  }, []);

  return (
    <>
      <div style={{ padding: "50px 20px 50px", textAlign: "center" }}>
        <LogoWrapper>
          <Logo variant="square" width="40px" />
          <Title>Flow</Title>
        </LogoWrapper>
      </div>
      <div style={{ padding: "0 20px 50px", textAlign: "center" }}>
        Authenticating...
      </div>
    </>
  );
};

export default AuthPage;
