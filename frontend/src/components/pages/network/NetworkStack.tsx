import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "./DashboardPage";
import CreateConnectorPage from "./CreateConnectorPage";
import WelcomePage from "../WelcomePage";
import useAppContext from "../../../hooks/useAppContext";
import { NetworkContextProvider } from "../../../context/NetworkContext";
import ConnectorEditPage from "./ConnectorEditPage";
import NetworkHeader from "../../network/NetworkHeader";
import CloneConnectorPage from "./CloneConnectorPage";
import ContributorContainer from "../../network/ContributorContainer";

type Props = {};

const DevStack = (props: Props) => {
  const { user } = useAppContext();
  return (
    <>
      {!user ? (
        <div style={{ padding: "40px 20px" }}>
          <WelcomePage />
        </div>
      ) : (
        <NetworkContextProvider>
          <NetworkHeader />
          <ContributorContainer>
            <Routes>
              <Route path="/" element={<DashboardPage />}></Route>
              <Route
                path="/connector"
                element={<Navigate to="/network" replace />}
              ></Route>
              <Route
                path="/connector/__new__"
                element={<CreateConnectorPage />}
              ></Route>
              <Route
                path="/clone/:key"
                element={<CloneConnectorPage />}
              ></Route>
              <Route
                path="/connector/:id"
                element={<ConnectorEditPage />}
              ></Route>
              <Route
                path="/connector/:id/*"
                element={<ConnectorEditPage />}
              ></Route>
              <Route
                path="*"
                element={<Navigate to="/network" replace />}
              ></Route>
            </Routes>
          </ContributorContainer>
        </NetworkContextProvider>
      )}
    </>
  );
};

export default DevStack;
