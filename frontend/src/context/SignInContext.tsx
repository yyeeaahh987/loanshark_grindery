import React, { useState, createContext, useEffect } from "react";
// import { useGrinderyNexus } from "use-grindery-nexus";
import { useGrinderyNexus } from "../use-grindery-nexus/index";
import NexusClient from "grindery-nexus-client";
import { Workspace } from "./WorkspaceContext";
import axios from "axios";

type ContextProps = {
  user: any;
  accessAllowed: boolean;
  verifying: boolean;
  client: NexusClient | null;
  isOptedIn: boolean;
  chekingOptIn: boolean;
  workspaces: Workspace[];
  workspace: Workspace | null;
  authCode: string;
  authCodeLoading: boolean;
  workspaceSelected: boolean;
  setIsOptedIn: (a: boolean) => void;
  setWorkspace: (a: Workspace | null) => void;
  getAuthCode: () => void;
  setWorkspaceSelected: (a: boolean) => void;
};

type SignInContextProps = {
  children: React.ReactNode;
};

export const SignInContext = createContext<ContextProps>({
  user: "",
  accessAllowed: false,
  verifying: true,
  client: null,
  isOptedIn: false,
  chekingOptIn: true,
  workspaces: [],
  workspace: null,
  authCode: "",
  authCodeLoading: false,
  workspaceSelected: false,
  setIsOptedIn: () => {},
  setWorkspace: () => {},
  getAuthCode: () => {},
  setWorkspaceSelected: () => {},
});

export const SignInContextProvider = ({ children }: SignInContextProps) => {
  console.log(`SignInContextProvider`)
  const { user, token } = useGrinderyNexus();

  const [accessAllowed, setAccessAllowed] = useState<boolean>(false);
  const [isOptedIn, setIsOptedIn] = useState<boolean>(false);

  // verification state
  const [verifying, setVerifying] = useState<boolean>(true);

  const [chekingOptIn, setChekingOptIn] = useState<boolean>(true);

  // Selected workspace
  const [workspace, setWorkspace] = useState<Workspace | null>(null);

  // List of workspaces
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  const [workspaceSelected, setWorkspaceSelected] = useState(false);

  const [workspacesLoaded, setWorkspacesLoaded] = useState(false);

  // Nexus API client
  const [client, setClient] = useState<NexusClient | null>(null);

  // Auth code
  const [authCode, setAuthCode] = useState<string>("");

  // Auth code
  const [authCodeLoading, setAuthCodeLoading] = useState<boolean>(false);

  const verifyUser = async () => {
    setVerifying(true);
    const res = await client?.isUserHasEmail().catch((err) => {
      console.error("isUserHasEmail error:", err.message);
      setAccessAllowed(false);
    });
    if (res) {
      setAccessAllowed(true);
      const optinRes = await client?.isAllowedUser().catch((err) => {
        console.error("isAllowedUser error:", err.message);
        setIsOptedIn(false);
      });
      if (optinRes) {
        setIsOptedIn(true);
      } else {
        setIsOptedIn(false);
      }
      setChekingOptIn(false);
    } else {
      setAccessAllowed(false);
    }
    setVerifying(false);
    listWorkspaces();
  };

  const initClient = (accessToken: string) => {
    const nexus = new NexusClient();
    console.log(`initClient signincontext`,nexus)
    nexus.authenticate(accessToken);
    setClient(nexus);
  };

  // Get list of user's workspaces
  const listWorkspaces = async () => {
    const spaces = await client?.listWorkspaces();
    setWorkspaces([
      { key: "personal", title: "My workspace" },
      ...(spaces || []),
    ]);
    setWorkspacesLoaded(true);
  };

  const getAuthCode = async () => {
    setAuthCodeLoading(true);
    const res = await axios
      .post(
        `https://orchestrator.grindery.org/oauth/get-login-code`,
        {},
        {
          headers: {
            Authorization: `Bearer ${
              workspace?.token || token?.access_token || ""
            }`,
          },
        }
      )
      .catch((error) => {
        console.log("getAuthCode error: ", error.message);
      });
    if (res?.data?.code) {
      setAuthCode(res.data.code);
    }
    setAuthCodeLoading(false);
  };

  useEffect(() => {
    if (user && client) {
      verifyUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, client]);

  // verify user on success authentication
  useEffect(() => {
    if (user && token?.access_token) {
      initClient(token?.access_token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token?.access_token]);

  useEffect(() => {
    if (workspacesLoaded && workspaces.length === 1) {
      setWorkspace(workspaces[0]);
      setWorkspaceSelected(true);
    }
  }, [workspacesLoaded, workspaces]);

  useEffect(() => {
    if (workspaceSelected && workspacesLoaded) {
      getAuthCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceSelected, workspacesLoaded]);

  return (
    <SignInContext.Provider
      value={{
        user,
        accessAllowed,
        verifying,
        client,
        isOptedIn,
        chekingOptIn,
        workspaces,
        workspace,
        authCode,
        authCodeLoading,
        workspaceSelected,
        setIsOptedIn,
        setWorkspace,
        getAuthCode,
        setWorkspaceSelected,
      }}
    >
      {children}
    </SignInContext.Provider>
  );
};

export default SignInContextProvider;
