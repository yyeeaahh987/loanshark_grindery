import React from "react";
import { useLocation, useNavigate } from "react-router";
import styled from "styled-components";
import { ICONS } from "../../constants";
import useAppContext from "../../hooks/useAppContext";
import UserMenu from "../shared/UserMenu";
import WorkspaceSelector from "../shared/WorkspaceSelector";

const Container = styled.div`
  padding: 1.5px 25px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 16px;
  background: #0b0d17;
  position: fixed;
  z-index: 1210;
  top: 0;
  width: 100%;
  box-sizing: border-box;
`;

const LeftWrapper = styled.div`
  margin-right: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 16px;
  padding: 0;
`;

const RightWrapper = styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: nowrap;
  gap: 16px;
  padding: 0;
`;

const Logo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 10px;
  cursor: pointer;
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 20px;
  line-height: 100%;
  letter-spacing: 0.02em;
  color: #ffffff;
`;

const Subtitle = styled.div`
  font-weight: 400;
  font-size: 20px;
  line-height: 100%;
  color: #e48b05;
`;

const LinksMenu = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: nowrap;
  gap: 8px;
`;

const Link = styled.p`
  margin: 0;
  padding: 24px 10px;
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  color: #ffffff;
  cursor: pointer;

  &.active {
    position: relative;
    font-weight: 700;

    &:after {
      content: "";
      display: block;
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 100%;
      height: 4px;
      background: #ffffff;
    }
  }
`;

type Props = {};

const NetworkHeader = (props: Props) => {
  let navigate = useNavigate();
  let location = useLocation();
  const { user } = useAppContext();
  return (
    <Container>
      <LeftWrapper>
        <Logo
          onClick={() => {
            navigate("/network");
          }}
        >
          <img
            src={ICONS.GRINDERY_DEV_LOGO}
            alt="Grindery developer network logo"
          />
          <div>
            <Title>Nexus</Title>
            <Subtitle>Developer Network</Subtitle>
          </div>
        </Logo>
        {user && <WorkspaceSelector mode="dark" />}
      </LeftWrapper>
      <RightWrapper>
        <LinksMenu>
          <Link
            onClick={() => {
              navigate("/network");
            }}
            className={location.pathname === "/network" ? "active" : ""}
          >
            My Connectors
          </Link>
          <Link
            onClick={() => {
              window.open(
                "https://docs.google.com/document/d/1B31HsmSiqpo_ig6MEeI3tcatvZSB0sxJ7FvpnQW6i_o/edit",
                "_blank"
              );
            }}
          >
            Documentation
          </Link>
        </LinksMenu>
        {user && <UserMenu mode="dark" />}
      </RightWrapper>
    </Container>
  );
};

export default NetworkHeader;
