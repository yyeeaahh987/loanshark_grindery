import NexusClient from "grindery-nexus-client";
import React, { useState, createContext, useEffect } from "react";
// import { useGrinderyNexus } from "use-grindery-nexus";
import { useGrinderyNexus } from "../use-grindery-nexus/index";
import { defaultFunc, replaceTokens } from "../helpers/utils";

export type Workspace = {
  key: string;
  title: string;
  about?: string;
  creator: string;
  admins?: string[];
  users?: string[];
  token?: string;
};

type ContextProps = {
  workspace: null | string;
  workspaces: Workspace[];
  createWorkspace: (
    userId: string,
    data: any,
    client: NexusClient | null
  ) => Promise<string>;
  leaveWorkspace: (
    userId: string,
    data: any,
    client: NexusClient | null
  ) => Promise<boolean>;
  setWorkspace: (workspaceId: string) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  isLoaded: boolean;
  deleteWorkspace: (
    userId: string,
    data: any,
    client: NexusClient | null
  ) => Promise<boolean>;
  updateWorkspace: (
    userId: string,
    data: any,
    client: NexusClient | null
  ) => Promise<boolean>;
  isSuccess: string | null;
  setIsSuccess: (value: string | null) => void;
  isWorkspaceSwitching: boolean;
  listWorkspaces: (userId: string, client: NexusClient | null) => void;
  workspaceToken: string;
};

type WorkspaceContextProps = {
  children: React.ReactNode;
};

const defaultWorkspace = {
  key: "personal",
  title: "My workspace",
  about: "",
  creator: "{{user}}",
  admins: ["{{user}}"],
  users: [],
};

const defaultContext = {
  workspace: null,
  workspaces: [defaultWorkspace],
  createWorkspace: async () => {
    return "";
  },
  leaveWorkspace: async () => {
    return true;
  },
  setWorkspace: defaultFunc,
  setWorkspaces: defaultFunc,
  deleteWorkspace: async () => {
    return true;
  },
  updateWorkspace: async () => {
    return true;
  },
  isLoaded: false,
  isSuccess: null,
  setIsSuccess: defaultFunc,
  isWorkspaceSwitching: false,
  listWorkspaces: defaultFunc,
  workspaceToken: "",
};

export const WorkspaceContext = createContext<ContextProps>(defaultContext);

export const WorkspaceContextProvider = ({
  children,
}: WorkspaceContextProps) => {
  // App main context
  const { user, token, address } = useGrinderyNexus();

  // Is workspace switching
  const [client, setClient] = useState<NexusClient | null>(null);

  // Currently active workspace.
  const [workspace, setWorkspace] = useState<null | string>(null);

  // List of workspaces
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  // Is initial list of workspaces loaded
  const [isLoaded, setIsLoaded] = useState(false);

  // Is workspace operation success
  const [isSuccess, setIsSuccess] = useState<string | null>(null);

  // Is workspace switching
  const [isWorkspaceSwitching, setIsWorkspaceSwitching] = useState(false);

  // Workspace token
  const [workspaceToken, setWorkspaceToken] = useState("");

  // Get list of user's workspaces
  const listWorkspaces = async (userId: string, client: NexusClient | null) => {

    const address = userId.replace("eip155:1:", "")
    const tempSpaces = [
      {
        "key": "personal",
        "title": "My workspace",
        "about": "",
        "creator": address,
        "admins": [
          address
        ],
        "users": []
      }
    ]
    setWorkspaces(tempSpaces)
    setIsLoaded(true);


    // console.log(userId,client)
    // const spaces = await client?.listWorkspaces();
    // console.log(spaces)
    // console.log([
    //   replaceTokens(defaultWorkspace, { user: userId }),
    //   ...spaces,
    // ])
    // setWorkspaces([
    //   replaceTokens(defaultWorkspace, { user: userId }),
    //   ...spaces,
    // ]);
    // setIsLoaded(true);
  };

  // Create new workspace
  const createWorkspace = async (
    userId: string,
    data: any,
    client: NexusClient | null
  ) => {
    console.log(`createWorkspace`)
    console.log(data)
    const res = await client?.createWorkspace(data);
    console.log(res)
    if (res) {
      listWorkspaces(userId, client);
      if (res.key) {
        setIsSuccess(`Workspace ${data.title} created successfully.`);
        return res.key;
      }
    }
    return "";
  };


  // Update workspace
  const updateWorkspace = async (
    userId: string,
    data: any,
    client: NexusClient | null
  ) => {
    const ws = await client?.updateWorkspace(data);
    if (ws) {
      listWorkspaces(userId, client);
      setIsSuccess(`Workspace ${data.title} updated successfully.`);
      return true;
    }
    return false;
  };

  // Leave current workspace
  const leaveWorkspace = async (
    userId: string,
    data: any,
    client: NexusClient | null
  ) => {
    const res = await client?.leaveWorkspace(data.workspaceKey);
    if (res && res.left) {
      setIsSuccess(`You successfully left ${data.title} workspace.`);
      listWorkspaces(userId, client);
      return true;
    }
    return false;
  };

  // Delete workspace
  const deleteWorkspace = async (
    userId: string,
    data: any,
    client: NexusClient | null
  ) => {
    const res = await client?.deleteWorkspace(data.workspaceKey);
    if (res) {
      setIsSuccess(`Workspace ${data.title} deleted successfully.`);
      listWorkspaces(userId, client);
      return true;
    }
    return false;
  };

  const initClient = (access_token: string) => {
    console.log(`initClient workspacecontext`,access_token)
    let nexus = new NexusClient();
    nexus.authenticate(access_token);
    console.log(`initclient`,JSON.stringify(nexus))
    let nexusString = JSON.stringify(nexus)
    console.log(`initclient`,address)
    nexusString.replace("eip155:1:0xD8649AaeBc1Bd65714159f3b5626A4699D0eB7eC",`eip155:1:${address}`)
    const newNexus = JSON.parse(JSON.stringify(nexus))
    // console.log(nexus.getUser())
    // let newUser = nexus.getUser();
    // nexus.
    // nexus.getUser();
    // nexus.getUser("")
    // console.log(`nexus`, nexus)
    setClient(newNexus);
  };

  useEffect(() => {
    if (user && token?.access_token) {
      initClient(token?.access_token);
    }
  }, [user, token?.access_token]);

  // Get list of user's workspaces when user and access token is known
  useEffect(() => {
    if (user && client) {
      listWorkspaces(user, client);
    }
  }, [user, client]);

  useEffect(() => {
    if (!workspace && workspaces && workspaces.length > 0) {
      setWorkspace(workspaces[0].key);
    }
    if (workspace && workspaces && workspaces.length > 0) {
      if (!workspaces.find((ws) => ws.key === workspace)) {
        setWorkspace(workspaces[0].key);
      }
    }
  }, [workspaces, workspace]);

  useEffect(() => {
    if (!user) {
      setWorkspace(null);
      setWorkspaces([]);
    }
  }, [user]);

  useEffect(() => {
    if (workspace) {
      setIsWorkspaceSwitching(true);
      setTimeout(() => {
        setIsWorkspaceSwitching(false);
      }, 1000);
    }
  }, [workspace]);

  useEffect(() => {
    if (workspace) {
      if (workspace !== "personal") {
        setWorkspaceToken(
          workspaces.find((ws: Workspace) => ws.key === workspace)?.token || ""
        );
      } else {
        setWorkspaceToken("");
      }
    }
  }, [workspace, workspaces]);

  return (
    <WorkspaceContext.Provider
      value={{
        workspace,
        workspaces,
        createWorkspace,
        leaveWorkspace,
        setWorkspace,
        setWorkspaces,
        isLoaded,
        deleteWorkspace,
        updateWorkspace,
        isSuccess,
        setIsSuccess,
        isWorkspaceSwitching,
        listWorkspaces,
        workspaceToken,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export default WorkspaceContextProvider;
