import React from "react";
import styled from "styled-components";
import { IconButton, Tabs, Button } from "grindery-ui";
import { useMatch, useNavigate } from "react-router-dom";
import { ICONS, RIGHTBAR_TABS, SCREEN } from "../../constants";
import useAppContext from "../../hooks/useAppContext";
import useWindowSize from "../../hooks/useWindowSize";
import useWorkspaceContext from "../../hooks/useWorkspaceContext";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  background: #fdfbff;
  box-shadow: inset 0px -2px 20px rgba(0, 0, 0, 0.08);
  min-height: calc(100vh - 67px);
  height: calc(100vh - 67px);
  max-height: calc(100vh - 67px);
  position: fixed;
  top: 75px;
  overflow-y: auto;
  overflow-x: hidden;

  @media (min-width: ${SCREEN.TABLET}) {
    transition: all 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
  }

  & .MuiTabs-root {
    background: transparent !important;
  }

  & .MuiTab-root {
    max-width: 60px !important;
    width: 60px !important;
    min-width: 60px !important;
    height: 60px !important;
    min-height: 60px !important;
    text-align: center !important;
    z-index: 2;

    & p {
      display: none;
    }

    @media (min-width: ${SCREEN.TABLET}) {
      width: 210px !important;
      max-width: 210px !important;
      text-align: left !important;
      justify-content: flex-start !important;
      padding: 18px;

      p {
        display: block;
        margin: 0;
        padding: 0;
        font-weight: 400;
        font-size: 16px;
        line-height: 150%;
        color: #0b0d17;
        margin-left: 36px;
        text-transform: initial;
      }
    }
  }

  & .MuiTabs-indicator {
    right: auto !important;
    left: 0 !important;
    width: 60px;
    background: #ffffff !important;
    z-index: 1;

    @media (min-width: ${SCREEN.TABLET}) {
      width: 210px;
    }

    &:after {
      content: "";
      display: block;
      posotion: absolute;
      left: 0;
      top: 0;
      width: 3px;
      background: #0b0d17;
      border-radius: 3px;
      height: 100%;
    }
  }
`;

const ButtonWrapper = styled.div`
  margin: 10px 16px 0px;

  & .MuiButton-startIcon > img {
    background: none;
    border: none;
    padding: 0;
  }

  & .MuiButton-root {
    padding: 10px 15px;
    white-space: nowrap;
  }
`;

const IconButtonWrapper = styled.div`
  margin: 20px 12px;
  text-align: right;

  & .MuiIconButton-root,
  & .MuiIconButton-root:hover {
    background: #8c30f5;
    border: 1px solid #ffffff;
    border-radius: 5px;
  }

  & .MuiIconButton-root img {
    width: 16px !important;
    height: 16px !important;
  }
`;

type Props = {};

const SidebarTabs = (props: Props) => {
  const { user, appOpened, setAppOpened } = useAppContext();
  const { size, width } = useWindowSize();
  const { workspace } = useWorkspaceContext();
  let navigate = useNavigate();
  const isMatchingWorkflowNew = useMatch("/workflows/new");
  const isMatchingWorkflowEdit = useMatch("/workflows/edit/:key");
  const matchNewWorfklow = isMatchingWorkflowNew || isMatchingWorkflowEdit;
  let path =
    RIGHTBAR_TABS.findIndex((tab) => {
      return tab.path === window.location.pathname;
    }) >= 0
      ? RIGHTBAR_TABS.findIndex((tab) => {
          return tab.path === window.location.pathname;
        })
      : false;

  return (user && !matchNewWorfklow) || size === "phone" ? (
    <Wrapper
      style={{
        maxWidth:
          size === "desktop" && appOpened
            ? "210px"
            : width >= parseInt(SCREEN.TABLET.replace("px", "")) &&
              width < parseInt(SCREEN.TABLET_XL.replace("px", ""))
            ? "0px"
            : "60px",
      }}
    >
      {user && size === "desktop" && appOpened && (
        <ButtonWrapper>
          <Button
            value="Create workflow"
            onClick={() => {
              navigate("/workflows/new", { replace: true });
            }}
            icon={ICONS.PLUS_WHITE}
            color="primary"
          />
        </ButtonWrapper>
      )}
      {user && size === "desktop" && !appOpened && (
        <IconButtonWrapper>
          <IconButton
            color=""
            icon={ICONS.PLUS_WHITE}
            onClick={() => {
              navigate("/workflows/new", { replace: true });
            }}
          />
        </IconButtonWrapper>
      )}
      <Tabs
        value={path}
        onChange={(index: number) => {
          if (user) {
            navigate(RIGHTBAR_TABS[index].path, { replace: true });
            if (
              width >= parseInt(SCREEN.TABLET.replace("px", "")) &&
              width < parseInt(SCREEN.TABLET_XL.replace("px", ""))
            ) {
              setAppOpened(false);
            }
          }
        }}
        options={RIGHTBAR_TABS.filter(
          (tab) => !tab.access || tab.access === workspace
        ).map((tab) => (
          <>
            <img
              src={tab.icon}
              alt={tab.name}
              style={{ opacity: path !== tab.id ? "0.2" : 1 }}
            />
            <p>{tab.label}</p>
          </>
        ))}
        orientation="vertical"
        activeIndicatorColor="#0B0D17"
        activeColor="#000000"
        type="icon"
        tabColor="#000000"
      />
    </Wrapper>
  ) : null;
};

export default SidebarTabs;
