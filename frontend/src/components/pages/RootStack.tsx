import React from "react";
import styled from "styled-components";
import { Drawer, Snackbar, CircularProgress } from "grindery-ui";
import { Route, Routes, Navigate, useMatch } from "react-router-dom";
import { SCREEN } from "../../constants";
import useAppContext from "../../hooks/useAppContext";
import AppHeader from "../shared/AppHeader";
import SidebarTabs from "../shared/SidebarTabs";
import useWindowSize from "../../hooks/useWindowSize";
import AppsPage from "./AppsPage";
//import DashboardPage from "./DashboardPage";
import HistoryPage from "./HistoryPage";
//import NotificationsPage from "./NotificationsPage";
import SettingsPage from "./SettingsPage";
//import TransactionsPage from "./TransactionsPage";
import WelcomePage from "./WelcomePage";
import WorkflowsPage from "./WorkflowsPage";
import WorkflowBuilderPage from "./WorkflowBuilderPage";
import CreateWorkflowPage from "./CreateWorkflowPage";
import Button from "../shared/Button";
import WorkspaceCreatePage from "./WorkspaceCreatePage";
import WorkspaceEditPage from "./WorkspaceEditPage";
import useWorkspaceContext from "../../hooks/useWorkspaceContext";
import NotificationsContextProvider from "../../context/NotificationsContext";
import NotificationsModal from "../shared/NotificationsModal";
import CreateNexusNotificationPage from "./CreateNexusNotificationPage";
import WorkflowHistoryPage from "./WorkflowHistoryPage";
import WorkflowHistoryLogPage from "./WorkflowHistoryLogPage";
import WorkflowsTemplatePage from "./WorkflowsTemplatePage"

// import ForkPageMain from '../pages/ForkPage/ForkPageMain'

const DrawerWrapper = styled.div`
  @media (min-width: ${SCREEN.TABLET}) {
    .MuiPaper-root {
      transform: none !important;
      visibility: visible !important;
    }
  }
`;

const BarWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  width: 435px;
  max-width: 100vw;

  @media (min-width: ${SCREEN.TABLET}) {
    width: 100%;
    max-width: 100%;
  }
`;

const TabsWrapper = styled.div`
  width: 100%;
  max-width: 60px;
  @media (min-width: ${SCREEN.TABLET}) {
    max-width: 210px;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 375px;
  padding-top: 75px;
  min-height: calc(100vh - 100px);
  @media (min-width: ${SCREEN.TABLET}) {
    max-width: 728px;
    margin-left: auto;
    margin-right: auto;
    min-height: calc(100vh - 105px);
    padding-bottom: 40px;
    box-sizing: border-box;
  }
  @media (min-width: ${SCREEN.TABLET_XL}) {
    max-width: 872px;
  }
  @media (min-width: ${SCREEN.DESKTOP}) {
    max-width: 936px;
  }
  @media (min-width: ${SCREEN.DESKTOP_XL}) {
    max-width: 1068px;
  }
`;

const OpenButtonWrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 40px;
  @media (min-width: ${SCREEN.TABLET}) {
    right: auto;
    left: 18px;
    top: 18px;
  }
`;

type Props = {};

const RootStack = (props: Props) => {
  const {
    workflows,
    user,
    appOpened,
    setAppOpened,
    isOptedIn,
    chekingOptIn,
    setIsOptedIn,
    accessAllowed,
  } = useAppContext();
  const { isSuccess, setIsSuccess, isWorkspaceSwitching } =
    useWorkspaceContext();
  const { size, width } = useWindowSize();
  const isMatchingWorkflowNew = useMatch("/workflows/new");
  const isMatchingWorkflowEdit = useMatch("/workflows/edit/:key");
  const matchNewWorfklow = isMatchingWorkflowNew || isMatchingWorkflowEdit;

  const renderContent = () => {
    if (!user) {
      return <WelcomePage />;
    }

    return (
      <NotificationsContextProvider>
        {/* <NotificationsModal /> */}
        {isWorkspaceSwitching ? (
          <div style={{ textAlign: "center", margin: "50px auto" }}>
            <CircularProgress />
          </div>
        ) : (
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/workflows" replace />}
            ></Route>
            {/*<Route path="/dashboard" element={<DashboardPage />}></Route>*/}
            <Route
              path="/workflows"
              element={
                !workflows || workflows.length < 1 ? (
                  <CreateWorkflowPage />
                ) : (
                  <WorkflowsPage />
                )
              }
            ></Route>
            <Route
              path="/workflows/create"
              element={<CreateWorkflowPage />}
            ></Route>
            <Route
              path="/workflows/new"
              element={<WorkflowBuilderPage />}
              key={1}
            ></Route>
            <Route
              path="/workflows/edit/:key"
              element={<WorkflowBuilderPage />}
              key={2}
            ></Route>
            <Route
              path="/workflows/history/:key"
              element={<WorkflowHistoryPage />}
              key={3}
            ></Route>
            <Route path="/workflows/template" element={<WorkflowsTemplatePage />} />
            <Route path="/connectors" element={<AppsPage />}></Route>
            <Route path="/history" element={<HistoryPage />}></Route>
            <Route path="/settings" element={<SettingsPage />}></Route>
            <Route path="/workspaces/new" element={<WorkspaceCreatePage />} />
            <Route path="/workspaces/manage" element={<WorkspaceEditPage />} />
            <Route
              path="/notifications/send"
              element={<CreateNexusNotificationPage />}
            />
            <Route
              path="*"
              element={<Navigate to="/workflows" replace />}
            ></Route>
          </Routes>
        )}
      </NotificationsContextProvider>
    );
  };

  const handleOpen = () => {
    setAppOpened(!appOpened);
  };

  return (
    <>
      {size === "phone" && (
        <OpenButtonWrapper>
          <Button value="Open app" onClick={handleOpen} />
        </OpenButtonWrapper>
      )}
      <DrawerWrapper>
        <Drawer
          open={appOpened}
          anchor={size === "desktop" ? "left" : "right"}
          variant="persistent"
        >
          {size === "phone" && <AppHeader />}
          <BarWrapper>
            {size === "phone" && (
              <ContentWrapper style={{ maxWidth: !user ? "435px" : "375px" }}>
                {renderContent()}
              </ContentWrapper>
            )}
            {user && !isMatchingWorkflowNew && !isMatchingWorkflowEdit && (
              <TabsWrapper
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
                <SidebarTabs />
              </TabsWrapper>
            )}
          </BarWrapper>
        </Drawer>
      </DrawerWrapper>

      {size === "desktop" && (
        <>
          <AppHeader />
          {/* <pre>{JSON.stringify(appOpened, null, 2)}</pre> */}
          <div
            style={{
              marginLeft:
                user && !matchNewWorfklow
                  ? appOpened
                    ? width >= parseInt(SCREEN.TABLET.replace("px", "")) &&
                      width < parseInt(SCREEN.TABLET_XL.replace("px", ""))
                      ? "0px"
                      : "210px"
                    : width >= parseInt(SCREEN.TABLET.replace("px", "")) &&
                      width < parseInt(SCREEN.TABLET_XL.replace("px", ""))
                      ? "0px"
                      : "60px"
                  : "0px",
              transition: "all 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
            }}
          >
            <ContentWrapper>{renderContent()}</ContentWrapper>

          </div>
        </>
      )}
      <Snackbar
        open={Boolean(isSuccess)}
        handleClose={() => {
          setIsSuccess(null);
        }}
        message={isSuccess || ""}
        hideCloseButton
        autoHideDuration={5000}
        severity="success"
      />
      {size === "desktop" && (
        <Snackbar
          open={accessAllowed && !chekingOptIn && !isOptedIn}
          handleClose={(event: any, reason: any) => {
            if (reason === "clickaway") {
              return;
            }
            setIsOptedIn(true);
          }}
          message="We've sent you a confirmation email. Please check your email and confirm to activate your account."
          severity="warning"
          autoHideDuration={null}
        />
      )}

    </>
  );
};

export default RootStack;
