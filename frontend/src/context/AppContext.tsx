import React, { useState, createContext, useEffect, useCallback } from "react";
import _ from "lodash";
// import { useGrinderyNexus } from "use-grindery-nexus";
import { useGrinderyNexus } from "../use-grindery-nexus/index";
import NexusClient, {
  WorkflowExecution,
  WorkflowExecutionLog,
} from "grindery-nexus-client";
// import NexusClient, {
//   WorkflowExecution,
//   WorkflowExecutionLog,
// } from "../use-grindery-nexus/index";
import { Workflow } from "../types/Workflow";
import { isLocalOrStaging, RIGHTBAR_TABS, SCREEN } from "../constants";
import { Connector } from "../types/Connector";
import { defaultFunc } from "../helpers/utils";
import { useNavigate } from "react-router-dom";
import useWindowSize from "../hooks/useWindowSize";
import { validator } from "../helpers/validator";
import { Operation } from "../types/Workflow";
import useWorkspaceContext from "../hooks/useWorkspaceContext";
import { Chain } from "../types/Chain";
import {
  getWorkflowsListByAddress,
  updateWorkflowByKey,
  deleteWorkflowByKey,
} from '../api/serverApi'

type ContextProps = {
  user: any;
  changeTab: (a: string, b?: string) => void;
  disconnect: any;
  appOpened: boolean;
  setAppOpened: (a: boolean) => void;
  workflows: Workflow[];
  // setWorkflows: (a: Workflow[]) => void;
  setWorkflows: (a: any) => void;
  connectors: Connector[];
  getWorkflowsList: () => void;
  getWorkflowHistory: (
    a: string,
    b: (c: WorkflowExecutionLog[]) => void,
    c?: number
  ) => void;
  getWorkflowExecution: (
    a: string,
    b: (c: WorkflowExecutionLog[]) => void
  ) => void;
  editWorkflow: (
    workflow: Workflow,
    redirect?: boolean,
    callback?: () => void
  ) => void;
  accessAllowed: boolean;
  validator: any;
  verifying: boolean;
  workflowExecutions: WorkflowExecutionLog[][];
  setWorkflowExecutions: React.Dispatch<
    React.SetStateAction<WorkflowExecutionLog[][]>
  >;
  apps: any[];
  handleDevModeChange: (a: boolean) => void;
  handleUpdateWorkflowList: (a: any) => void;
  devMode: boolean;
  deleteWorkflow: (userAccountId: string, key: string) => void;
  client: NexusClient | null;
  access_token: string | undefined;
  moveWorkflowToWorkspace: (
    workflowKey: string,
    workspaceKey: string,
    client: NexusClient | null
  ) => void;
  getConnector: (key: string) => void;
  evmChains: Chain[];
  isOptedIn: boolean;
  chekingOptIn: boolean;
  setIsOptedIn: (a: boolean) => void;
};

type AppContextProps = {
  children: React.ReactNode;
};

export const AppContext = createContext<ContextProps>({
  user: "",
  changeTab: defaultFunc,
  disconnect: defaultFunc,
  appOpened: true,
  setAppOpened: defaultFunc,
  workflows: [],
  setWorkflows: defaultFunc,
  connectors: [],
  getWorkflowsList: defaultFunc,
  getWorkflowHistory: defaultFunc,
  getWorkflowExecution: defaultFunc,
  editWorkflow: defaultFunc,
  accessAllowed: false,
  validator: validator,
  verifying: true,
  workflowExecutions: [],
  setWorkflowExecutions: defaultFunc,
  apps: [],
  handleDevModeChange: defaultFunc,
  handleUpdateWorkflowList: defaultFunc,
  devMode: false,
  deleteWorkflow: defaultFunc,
  client: null,
  access_token: undefined,
  moveWorkflowToWorkspace: defaultFunc,
  getConnector: defaultFunc,
  evmChains: [],
  isOptedIn: false,
  chekingOptIn: true,
  setIsOptedIn: () => { },
});

export const AppContextProvider = ({ children }: AppContextProps) => {
  let navigate = useNavigate();
  const { width } = useWindowSize();

  // current workspace
  const { workspace, workspaceToken } = useWorkspaceContext();

  // Dev mode state
  const cachedDevMode = localStorage.getItem("gr_dev_mode");
  const [devMode, setDevMode] = useState(cachedDevMode === "true");
  const [evmChains, setEvmChains] = useState<Chain[]>([]);

  // Auth hook
  const { user, disconnect, token, address } = useGrinderyNexus();

  const access_token = token?.access_token;

  // app panel opened
  const [appOpened, setAppOpened] = useState<boolean>(
    width >= parseInt(SCREEN.TABLET.replace("px", "")) &&
      width < parseInt(SCREEN.DESKTOP.replace("px", ""))
      ? false
      : true
  );

  // User id
  //const [user, setUser] = useState<any>(null);
  const [accessAllowed, setAccessAllowed] = useState<boolean>(false);

  const [isOptedIn, setIsOptedIn] = useState<boolean>(false);

  const [chekingOptIn, setChekingOptIn] = useState<boolean>(true);

  // user's workflows list
  // const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [workflows, setWorkflows] = useState([]);
  // connectors list
  const [connectors, setConnectors] = useState<Connector[]>([]);

  // verification state
  const [verifying, setVerifying] = useState<boolean>(true);

  // workflows executions
  const [workflowExecutions, setWorkflowExecutions] = useState<
    WorkflowExecutionLog[][]
  >([]);

  // list of apps used in workflows
  const [apps, setApps] = useState<any[]>([]);

  // Nexus API client
  const [client, setClient] = useState<NexusClient | null>(null);
  console.log(client)
  // change current active tab
  const changeTab = (name: string, query = "") => {
    const tab = RIGHTBAR_TABS.find((tab) => tab.name === name);
    navigate(((tab && tab.path) || "/") + (query ? "?" + query : ""));
  };

  const getWorkflowsList = async () => {
    console.log(`getWorkflowsList`,address)
    // console.log(client?.getUser())
    // console.log(client?.getUser()?.address)
    let res = await getWorkflowsListByAddress(address?address:"")
    console.log(`getworkflowslist`, res)
    if (res) {
      setWorkflows(
        _.reverse(
          res
            .map((result: any) => ({
              ...result.workflow,
              key: result.key,
            }))
            .filter((workflow: Workflow) => workflow)
        )
      );
    } else {
      setWorkflows([]);
    }

    // const res = await client
    //   ?.listWorkflows(
    //     workspace && workspace !== "personal" ? workspace : undefined
    //   )
    //   .catch((err) => {
    //     console.error("listWorkflows error:", err.message);
    //   });
    // if (res) {
    //   setWorkflows(
    //     _.reverse(
    //       res
    //         .map((result: any) => ({
    //           ...result.workflow,
    //           key: result.key,
    //         }))
    //         .filter((workflow: Workflow) => workflow)
    //     )
    //   );
    // } else {
    //   setWorkflows([]);
    // }
  };

  const clearWorkflows = () => {
    console.log(`clearWorkflows`)
    setWorkflows([]);
  };

  // here is get all the action list to revise can remove this 
  const getConnectors = async () => {
    console.log(`getConnectors`)
    // console.log(client?.getUser())
    // console.log(client?.getUser()?.address)
    let stagedCdss: string | _.List<any> | null | undefined = [];
    // const cdss = await client?.listDrivers();
    const cdss = [
      {
        "key": "airtable",
        "name": "Airtable",
        "version": "1.0.0",
        "platformVersion": "1",
        "triggers": [
          {
            "key": "newAirtableRow",
            "name": "New Airtable Record",
            "display": {
              "label": "New Airtable Record",
              "description": "",
              "instructions": "",
              "featured": false
            }
          }
        ],
        "actions": [
          {
            "key": "createAirtableRow",
            "name": "Create Airtable Record",
            "display": {
              "label": "Create Airtable Record",
              "description": "",
              "instructions": "",
              "featured": false
            }
          }
        ],
        "icon": "data:image/png;base64,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",
        "type": "web2",
        "user": "eip155:1:0x4245cd11b5a9E54F57bE19B643E564AA4Ee86D1b",
        "workspace": "ws-499e41a8-c813-4d6a-aaa8-4ecf686e5e9d",
        "access": "Public"
      },
      {
        "key": "discord",
        "name": "Discord",
        "version": "1.0.0",
        "platformVersion": "1",
        "actions": [
          {
            "key": "sendChannelMessage",
            "name": "Send Channel Message",
            "display": {
              "label": "Send Channel Message",
              "description": "Post a new message to a specific #channel you choose"
            }
          }
        ],
        "authentication": {
          "type": "oauth2",
          "test": {
            "method": "GET",
            "url": "https://discordapp.com/api/users/@me"
          },
          "defaultDisplayName": "{{ data.guild.name }} - {{ data.username }}#{{ data.discriminator }}",
          "authenticatedRequestTemplate": {
            "headers": {
              "Authorization": "Bearer {{ auth.access_token }}"
            }
          },
          "oauth2Config": {
            "authorizeUrl": "https://discord.com/oauth2/authorize?response_type=code&client_id={{ secrets.client_id|urlencode }}&permissions=2146958591&scope=identify%20guilds.join%20guilds%20bot",
            "getAccessToken": {
              "method": "POST",
              "url": "https://discord.com/api/v10/oauth2/token",
              "headers": {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              "body": "code={{ code|urlencode }}&client_id={{ secrets.client_id|urlencode }}&client_secret={{ secrets.client_secret|urlencode }}&redirect_uri={{ redirect_uri|urlencode }}&grant_type=authorization_code"
            },
            "autoRefresh": true,
            "refreshAccessToken": {
              "method": "POST",
              "url": "https://discord.com/api/v10/oauth2/token",
              "headers": {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              "body": "refresh_token={{ auth.refresh_token|urlencode }}&client_id={{ secrets.client_id|urlencode }}&client_secret={{ secrets.client_secret|urlencode }}&grant_type=refresh_token"
            }
          }
        },
        "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQVSURBVHgB7VldbttGEJ7ZlQynSW3rBKVPUN0g9AmqPrRR+mIZtYC+tTqBpBNYeShQxAkgv9RC+qKeILpBlBOEOQFlJ4ASW9zJLPVHyeRyJRuxAvB70XKHs/xmf2a/XQFkyJAhQ4ZbAGFNlCr+3nYuVyQBPwGQ8/kqOOq2CwMb33LFd2hLnqCitwCi92k06tv6LiO3ysua9IOcqBAikwaXiQPS2La9JZgMNGzaoZwosV8JEEv8VN/OSyhXL3tsOoProNdpFzywhNUIlI8/uMy0Piad2NAAiJok8cewQoETtROyHdBDpS6Y+CFXOUlt8btdCuDs1cudLtw2ACZfZ/INuAcgYuv8+fc14zsmo56rkJfv4D5BwUHnRaGXZBYmXyb/Gu4bKOsmc2IAvKgqYJinXxHuhEssTCNgjPwrI5FLbAAb1PtTOEmjkDQCm9T7IRDwz7j6GwGEOX+zej8EARXLx767XH9zBJAOYVMRk5EW9oFQ3+SlDxsKvdsPr4P9qG5aGIEtKV3YYLDs2tsWshStWwhAhMrSDggUah+9UyoV/MzlM1tfZtIb+wQH/HTE09az9pXwOPq4rEZdsAF/kIQ66PyzoBq75eMLjwVMPcW32TndbUSryn/4PVDiNas4B9I+zTMddNDz50kjK+ge3XuvXhZilSLnay0/XIgn73We7+7H+ukMg3bSRWzlnX//fvA+LM9ISVm0cdYLKYn8mCP9n+isIHGaTQSbBxZQw+uDaXkWgECyCoAXUt9oV5h8slLogRlp9jEEObPi7MM4OYikwzEZUdDeOraQA6DRPm8If5gWZwHw1LBz5gB+qfqJo6UQHyfZJkfRWOg1yJnNahZApBNFXGUaJMiTuHotQyZZIgnur7/78fa8XEV/OdPCPAtVL9/BCkHocyteBTV9ANc7+Hf5/CGRanB96kgiUm14pdp6R/2t+rFIoOpkDnwZXud0Z38hgKfVS5/sp9GcDMHAhvRd+upMeH66U9Dl+SKG9UisS/42vlGu0TXgwbcDb1oQ8I1jpoU4Bw8QKN1jKtrGl1N3Ai0M+ftdbhst2/WmhfkaUKOmlSrkFAIj1QAZ6CxwpJUlrIGxmoUeS4/a8KHa5yvFZti2hZ9CeDZ/joBVoQMj0bDshXYAwbP/TguhtNBiDEEUwx2dJukYx1s+cbYRiB6zGzDht5w2+58eQb/b4jRa8YsqL/V5t5L2QSbbHT7kS+TW/EATezMX3gDou9B0eXvE+bgNt8CT44u/+ArxxPQOIfX5TrUWd0Nnvlo0BWKQxqviSfXiDU/+Ytw3+NtNUyfZ3U7rQAgO+W13VslrYOlAszZunAXCdRU0TXeiU6z0B4deIzgS4ZZ//mK3BXeIpzyV9O/wEUuM1np/dmTIkCFDhpXxBYuKkMLUEll6AAAAAElFTkSuQmCC",
        "type": "web2",
        "user": "eip155:1:0x4245cd11b5a9E54F57bE19B643E564AA4Ee86D1b",
        "workspace": "ws-499e41a8-c813-4d6a-aaa8-4ecf686e5e9d",
        "access": "Public"
      },
      {
        "key": "firebaseCloudMessagingConnector",
        "name": "Firebase Cloud Messaging",
        "version": "1.0.0",
        "platformVersion": "1.0.0",
        "actions": [
          {
            "key": "fcmPushNotification",
            "name": "Send Push Notification",
            "display": {
              "label": "Send Push Notification",
              "description": "Send a push notification",
              "instructions": "",
              "featured": false
            }
          },
          {
            "key": "subscribeDeviceToTopic",
            "name": "Subscribe a Device to Topic",
            "display": {
              "label": "Subscribe a Device to Topic",
              "description": "Subscribe a device to topic",
              "instructions": "",
              "featured": false
            }
          },
          {
            "key": "unsubscribeDeviceFromTopic",
            "name": "Unsubscribe a Device from Topic",
            "display": {
              "label": "Unsubscribe a Device from Topic",
              "description": "Unsubscribe a device from topic",
              "instructions": "",
              "featured": false
            }
          },
          {
            "key": "sendMessageToDevices",
            "name": "Send Message to Topic Subscribers",
            "display": {
              "label": "Send Message to Topic Subscribers",
              "description": "Send message to subscribers of a topic",
              "instructions": "",
              "featured": false
            }
          }
        ],
        "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALxSURBVHgBtZXLaxNBHMd/k3d3E6uk1lartJq22EooRQP2UDwULFoPLRZ8gOKhV/8ATwEvgnpS/AM89FCwiKggWATBnAQvatGCj4O0pq+8N7s7Mz9nNg83bWJWtD8YZmd25/v5zXd/swvQIHBu2o2Jky3wj+FqeEf5Og3LGy9xPhaGHQEYqRjQ9Ai4ipOwIwBOBwE5gLl5Cx9GVTmFzyN+2eC/AJBGABGAamEImTPWXNFzA4p4E/4iSF3tuAAP7i8ANUS2YhfulmXwdl4C/ftTCxrqjpKJt1+sZz9NtIFuXiDRF/fB8Q5GRo9UxaWgWeg01lYeM8NQgesqaD9vi2liiRfSj8BI3sOl6b3OAbm1g1VxQGA6B5bMtNIClOaM3Dg8OTYmxBeAZUcBGYCWjdST8tQFkEKkIi57c0P0HEVRIXgVuQoV0qbOE5YNWoVQyqrL+Q5MfrwizjQElE16InZSLPgAunqA+PWyeDkRhjHnACJKFEqidLPUW2PiAv/Rw+BSJJzbFsgxHXIEwFengsDMbiv7vGjFsrjHC/5YL7hVahMvZ29dmr3y89IUAJlkhwAoKD1PlWyS4oETPeAJc6ixxd64EYRIal9zQCHfLgqwleZQVGTJlsBIBNx76thSGyoQ40BzgIf0I+dEZl+1JdjAFjsEMQCM9jUHcGOIZrmoSge2/BYvjcn2F739JZt00Ew5tqUsXgkaxXjc1RCAcwNBI0/afcOObamFc/MQnP+g2DVrTnLOs1vxRdSwZ5dps2UrYKs4VjtGmde98UMCcnV3EJxMrBppbayYZbOcIq0RqCteHjJkWprPaSvGOXI6kbTfqwEQAhiaer8YeB2+ml3Fs3qOfZTHoJEt4qygmcc3mXU23pLovByaWlrcmkvd/0FVQPwXssO9ZwJ7PHe8ftJvz9jU+ZKWdl1vfbe4QOLAG2n8EVCJ5LOBDtWNM74gXBFSip5nd1dXjAc9174Vm611BKhEZravTfahi5/XpZ1O1vwCT3OtK4J0Is8AAAAASUVORK5CYII=",
        "type": "web2",
        "user": "eip155:1:0x4245cd11b5a9E54F57bE19B643E564AA4Ee86D1b",
        "workspace": "ws-499e41a8-c813-4d6a-aaa8-4ecf686e5e9d",
        "access": "Public"
      },
      {
        "key": "genericWebhook",
        "name": "Webhooks by Nexus",
        "version": "1.0.0",
        "platformVersion": "1",
        "triggers": [
          {
            "key": "inboundWebhook",
            "name": "Catch Hook",
            "display": {
              "label": "Catch hook",
              "description": "Wait for a new POST request to a Nexus URL",
              "instructions": ""
            }
          }
        ],
        "actions": [
          {
            "key": "inboundWebhookAction",
            "name": "Send request",
            "display": {
              "label": "Send request",
              "description": "Send a custom HTTP request"
            }
          }
        ],
        "icon": "data:image/png;base64,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",
        "type": "web2",
        "access": "Public",
        "user": "eip155:1:0x4245cd11b5a9E54F57bE19B643E564AA4Ee86D1b",
        "workspace": "ws-499e41a8-c813-4d6a-aaa8-4ecf686e5e9d"
      },
      {
        "key": "gmailSender",
        "name": "Gmail",
        "version": "1.0.0",
        "platformVersion": "1.0.0",
        "actions": [
          {
            "key": "sendEmailViaGmail",
            "name": "Send Email",
            "display": {
              "label": "Send Email",
              "description": "Compose and send a new message",
              "instructions": "",
              "featured": false
            }
          }
        ],
        "authentication": {
          "type": "oauth2",
          "test": {
            "method": "GET",
            "url": "https://www.googleapis.com/oauth2/v3/userinfo"
          },
          "defaultDisplayName": "{{ data.email }}",
          "authenticatedRequestTemplate": {
            "headers": {
              "Authorization": "Bearer {{ auth.access_token }}"
            }
          },
          "allowedHosts": [
            "www.googleapis.com",
            "gmail.googleapis.com"
          ],
          "oauth2Config": {
            "authorizeUrl": "https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&response_type=code&client_id={{ secrets.client_id|urlencode }}&scope=https://www.googleapis.com/auth/userinfo.email+openid+https://www.googleapis.com/auth/gmail.send&access_type=offline",
            "getAccessToken": {
              "method": "POST",
              "url": "https://oauth2.googleapis.com/token",
              "headers": {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              "body": "code={{ code|urlencode }}&client_id={{ secrets.client_id|urlencode }}&client_secret={{ secrets.client_secret|urlencode }}&redirect_uri={{ redirect_uri|urlencode }}&grant_type=authorization_code"
            },
            "autoRefresh": true,
            "refreshAccessToken": {
              "method": "POST",
              "url": "https://oauth2.googleapis.com/token",
              "headers": {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              "body": "refresh_token={{ auth.refresh_token|urlencode }}&client_id={{ secrets.client_id|urlencode }}&client_secret={{ secrets.client_secret|urlencode }}&grant_type=refresh_token"
            }
          }
        },
        "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIHSURBVHgB7ZNLSFRRGMf/5869iTUxBUWJRFNueiwaqYkiCMuLtIwCXUUULspF06LFtGsRVIsiK5J2tbSFG1FBfG1kxFmMKxeieBFE8IHjAwfHe8/nOTPe8TFzvdcXuPAH95zDOd/3/c/5n3OBI1xgsvkAKFVlF+ssojMmV/4+MAwDuyDdjhAx9bGP0aiqW/9yAr2Xgw0AvVqLS4FR9N7I2A/sgHSHFmGgL2JYtDb1VdPNd0p2nCsuKQax+ik9/HtEvxlwKzxaETo19TDcKIp/31BcUisbxSmRCK9PkjIw8SgUdIqZ1G+Vn/BpCWKoLrAcyAksa36nGkHfijY4WRl+s3VhpjIcEZuIyZhCiQtcy/SqbH49acLLlhc4vTheKLZYfNKyK/Pg7xXTYn5F+2MB1Sx7hXkMmQFE52+LUVv2BEl/KX4+bUbs+jM4YVu2jSUZGlNlqJ27jwl+fP0EkhW1CK13opgOXEJV/JtTftBpQVryefEGutKlm+bzLrn/ak3GMrFjA95JPE9W5BUvKCCRlqVT6jUOuP4LIqb+7LHZu7YlngQkF2Kx1PnOuHwpdYxoLi+AKGlx1IiYt6xteNmpjqOAzbmueIPJ1dAWyxIWV8tLuuP/3fJdBSQlPX2GbZltiZzzkqvCI9Iy0UWwQzydYC8cpICZE2Dgnyjz4vYJoiXxfcQRh4JVjgy4tvLUe0AAAAAASUVORK5CYII=",
        "type": "web2",
        "user": "eip155:1:0x4245cd11b5a9E54F57bE19B643E564AA4Ee86D1b",
        "workspace": "ws-499e41a8-c813-4d6a-aaa8-4ecf686e5e9d",
        "access": "Public"
      },
      {
        "key": "googleSheets",
        "name": "Google Sheets",
        "version": "1.0.0",
        "platformVersion": "1",
        "triggers": [
          {
            "key": "newSpreadsheetRow",
            "name": "New Spreadsheet Row",
            "display": {
              "label": "New Spreadsheet Row",
              "description": "",
              "instructions": "",
              "featured": false
            }
          }
        ],
        "actions": [
          {
            "key": "createSpreadsheetRow",
            "name": "Create Spreadsheet Row",
            "display": {
              "label": "Create Spreadsheet Row",
              "description": "Triggered when a new row is added to the bottom of a spreadsheet.",
              "instructions": "",
              "featured": false
            }
          }
        ],
        "authentication": {
          "type": "oauth2",
          "test": {
            "method": "GET",
            "url": "https://www.googleapis.com/oauth2/v3/userinfo"
          },
          "defaultDisplayName": "{{ data.email }}",
          "authenticatedRequestTemplate": {
            "headers": {
              "Authorization": "Bearer {{ auth.access_token }}"
            }
          },
          "allowedHosts": [
            "www.googleapis.com",
            "sheets.googleapis.com"
          ],
          "oauth2Config": {
            "authorizeUrl": "https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&response_type=code&client_id={{ secrets.client_id|urlencode }}&scope=https://www.googleapis.com/auth/spreadsheets+https://www.googleapis.com/auth/userinfo.email+https://www.googleapis.com/auth/spreadsheets.readonly+https://www.googleapis.com/auth/drive&access_type=offline",
            "getAccessToken": {
              "method": "POST",
              "url": "https://oauth2.googleapis.com/token",
              "headers": {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              "body": "code={{ code|urlencode }}&client_id={{ secrets.client_id|urlencode }}&client_secret={{ secrets.client_secret|urlencode }}&redirect_uri={{ redirect_uri|urlencode }}&grant_type=authorization_code"
            },
            "autoRefresh": true,
            "refreshAccessToken": {
              "method": "POST",
              "url": "https://oauth2.googleapis.com/token",
              "headers": {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              "body": "refresh_token={{ auth.refresh_token|urlencode }}&client_id={{ secrets.client_id|urlencode }}&client_secret={{ secrets.client_secret|urlencode }}&grant_type=refresh_token"
            }
          }
        },
        "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAYCAYAAAAPtVbGAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIPSURBVHgBzZVPSBRRHMe/b/7utmsubYfKpd0pw0y2Q0SBkRGRQUSdOnQsCqJDENWhU3STMOxWQbf+YmlQhCCuf06CKIqIIoguXlRQcEVdd2Z3nm9WHccBnVl3BL/D4/F783vzeb/35c0jsOnE98ddhOo1cFDVoejEZSV+7eXp2xNOuZw1KP/6MOIGYMjHi4qQoYmG/j8xp9wtkCwvCChAFFDAce11Q43H4RayGxkgWZcTH0ZaYtgrSB5EUb6iau1vexqPeApR9exWEKjC+6RE/fD/qD23IA+sGktNISwEEeRl6/CZHGgb6095AklnM+icHoKWSkNXc9ZXJ+25xXlCADHkByftvFZPjBdDPvB+EXsKMSSUyNuCHD05G445pWBwLmmCjC0sCKKzA9B84xVmVxbMscO+g2YsEJ4deIJzv55tfjAoFwbZUO2/11jQlhEU/Ri4+x4Xml6AIwSVoQi+XX/uON8VpL76PnJUh8yt7fmnK0/yfal0wM10d5CGwb9IqYsICH7UHKvCm96frBKgojSCd5ceeAN5VFmLTE6FtF7J0/itvL8lYsDNdHeQlsk+zKtLDCLgjnIRzePdIMyTskAY1UcrvIFcLYuzSjTTk5vR8/lKQpIHlbDF4vNIqxkbIGs8k57Hl9EOFAdhT11/E4qVZ7+V/QVJ3vuYZFv0m11zmoum2hu7HdOU0B92yCoK7aihV9++QAAAAABJRU5ErkJggg==",
        "type": "web2",
        "user": "eip155:1:0x2c0015A367eb73f575e48F9dC46dE0b8e497EAAC",
        "workspace": "ws-499e41a8-c813-4d6a-aaa8-4ecf686e5e9d"
      },
      {
        "key": "hubspot",
        "name": "HubSpot",
        "version": "1.0.0",
        "platformVersion": "1.0.0",
        "type": "web2",
        "triggers": [
          {
            "key": "triggerFromWorkflow",
            "name": "Trigger from a workflow",
            "display": {
              "label": "Trigger from a workflow",
              "description": "Trigger from a HubSpot workflow"
            }
          }
        ],
        "actions": [
          {
            "key": "triggerWorkflow",
            "name": "Trigger a workflow",
            "display": {
              "label": "Trigger a workflow",
              "description": "Trigger a HubSpot workflow"
            }
          }
        ],
        "icon": "data:image/png;base64,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"
      },
      {
        "key": "slack",
        "name": "Slack",
        "version": "1.0.0",
        "platformVersion": "1",
        "actions": [
          {
            "key": "sendChannelMessage",
            "name": "Send Channel Message",
            "display": {
              "label": "Send Channel Message",
              "description": "Post a new message to a specific #channel you choose"
            }
          }
        ],
        "authentication": {
          "type": "oauth2",
          "test": {
            "method": "GET",
            "url": "https://slack.com/api/team.info"
          },
          "defaultDisplayName": "{{ auth.team.name }}",
          "authenticatedRequestTemplate": {
            "headers": {
              "Authorization": "Bearer {{ auth.access_token }}"
            }
          },
          "oauth2Config": {
            "authorizeUrl": "https://slack.com/oauth/v2/authorize?client_id={{ secrets.client_id|urlencode }}&scope=channels:join,channels:read,chat:write,groups:read,im:read,mpim:read,team:read&user_scope=channels:read,channels:write,chat:write,groups:read,im:read,mpim:read,users.profile:read",
            "getAccessToken": {
              "method": "POST",
              "url": "https://slack.com/api/oauth.v2.access",
              "headers": {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              "body": "code={{ code|urlencode }}&client_id={{ secrets.client_id|urlencode }}&client_secret={{ secrets.client_secret|urlencode }}&redirect_uri={{ redirect_uri|urlencode }}&grant_type=authorization_code"
            }
          }
        },
        "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAK+SURBVHgB3VVNTxNhEJ55d9tgjAkciBeCcvGglgZtBEHaJYQDNZR4A3+C/8AQog3xZrz4I4SL2gaByMFWwpcWKgK9mIgmnCQRqokJ7b4zvlvcbpfCNhAv+iSb3U7nnWc+ntkF+NeBtRw65nYNAmwH2J95131+zbIFXo2EQUCnzr5kNvowd2qC0MJuGxJmEFU4BZZs/Mo/2dM0+GD7SIZbm7fH5o+LoXsRCAmDKrRw0uGbQldn2PHRgPrU7VgCAR4ggJTLGdEvJHmeORFBprshJQRcB+K4dRFBGk4IV4tCb390CZR9lTYyD/pBmj+R6TybDU6ORI4K1DY1GpFMPSaKRC46lrXt5SG3L/28zFJuwnFgIGLuLeYfh1mIuGOnOGicVBmslP2IejcGHqWsn+UWEckYeEEpCYE7VHCz6j+JMZefZsn6AM4MWFuAGkA/TnOFYlhlW5Qq+0MgiTMOXwVuzO0GWfAAMLqGz4AmEs+/DzeUhtw2Mxo0JfUzwZLVikDyfgSEiKhoBUCxuB4dK4vBNeSJ4Xv1qiZTEPiVRNMt28/SW01Dhiq6oyjN/KU/fq8Lk/VMUlMtC8PLQBhosqRp1EBXe7HXUFm1/fC5abhVCFxzsoa4HylhksiwvcnEhu/pWr5O07PgAQY2GmPraVcFmsB+PuRYYDFovyZK2SB21aFGUAPM2KluJYIKFdEylAq1g8mq4TGyzsxLyOxJcsZnJuzncgUt2+OpLxeGQqyyVlv7pmV7YnWr+W6VdBvvbKS+TQVDWOTBo4ITyNlz0VyuisDCxa/jVm89+7vzPBCBIvdYzz6EZH3s46qX/4leXKUDSo5qLg+sS23cys6Lq8ZfI2BEa7cKhxgNOC2BAJx1GUyZZAGLDiOTDs5Aj0LNT+an5uErfhADSmWL1uJZtu/T11ppv9ivFLVsDR3+a/wG8kUkIc9A9TMAAAAASUVORK5CYII=",
        "type": "web2",
        "user": "eip155:1:0x4245cd11b5a9E54F57bE19B643E564AA4Ee86D1b",
        "workspace": "ws-499e41a8-c813-4d6a-aaa8-4ecf686e5e9d",
        "access": "Public"
      },
      {
        "key": "tokenPrice",
        "name": "Token Price by Nexus",
        "version": "1.0.0",
        "platformVersion": "1.0.0",
        "actions": [
          {
            "key": "getTokenPriceBySymbol",
            "name": "Get token price by symbol",
            "display": {
              "label": "Get token price by symbol",
              "description": "Get current price for a cryptocurrency by token symbol"
            }
          },
          {
            "key": "getTokenPriceByAddress",
            "name": "Get token price by address",
            "display": {
              "label": "Get token price by address",
              "description": "Get current price for a cryptocurrency token by smart-contract address"
            }
          }
        ],
        "icon": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMC42NTU0IDE4Ljg0MzlDMTEuMTE5MSAxOC41NzUyIDExLjY5MSAxOC41NzQ0IDEyLjE1NTYgMTguODQxN0wyMS41NzUyIDI0LjI2MzFDMjIuMDM5OCAyNC41MzA1IDIyLjMyNjMgMjUuMDI1NCAyMi4zMjcgMjUuNTYxNEwyMi4zMzk3IDM2LjQyOTdDMjIuMzQwNCAzNi45NjU0IDIyLjA1NTMgMzcuNDYwNyAyMS41OTE5IDM3LjcyOTNMMTIuMTg4MiA0My4xNzk0QzExLjcyNDQgNDMuNDQ4MiAxMS4xNTI0IDQzLjQ0OSAxMC42ODc4IDQzLjE4MTZMMS4yNjgyIDM3Ljc2MDNDMC44MDM3OTMgMzcuNDkzIDAuNTE3MjMyIDM2Ljk5ODIgMC41MTY0NDUgMzYuNDYyNEwwLjUwMDQ5IDI1LjU5NDFDMC40OTk3MDMgMjUuMDU4MiAwLjc4NDg0NSAyNC41NjI2IDEuMjQ4NTEgMjQuMjk0TDEwLjY1NTQgMTguODQzOVpNMTEuNDA5OCAyMS44NzM5TDMuNTAxNzQgMjYuNDU1N0wzLjUxNTE2IDM1LjU5MjFMMTEuNDMzNSA0MC4xNDk0TDE5LjMzODcgMzUuNTY3N0wxOS4zMjggMjYuNDMxMUwxMS40MDk4IDIxLjg3MzlaIiBmaWxsPSIjOEMzMEY1Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMC43MDIxNTggMjQuODQwM0MxLjExNzI4IDI0LjEyMzQgMi4wMzQ5NyAyMy44Nzg3IDIuNzUxODggMjQuMjkzOEwxMS40MDcgMjkuMzA1NUwyMC4wNTkgMjQuMjkzOUMyMC43NzU4IDIzLjg3ODcgMjEuNjkzNSAyNC4xMjMyIDIyLjEwODggMjQuODQwMUMyMi41MjQgMjUuNTU2OSAyMi4yNzk1IDI2LjQ3NDcgMjEuNTYyNiAyNi44ODk5TDEyLjE1ODkgMzIuMzM2OEMxMS42OTQgMzIuNjA2MSAxMS4xMjA1IDMyLjYwNjIgMTAuNjU1NSAzMi4zMzY5TDEuMjQ4NiAyNi44OUMwLjUzMTY5MyAyNi40NzQ5IDAuMjg3MDQxIDI1LjU1NzIgMC43MDIxNTggMjQuODQwM1oiIGZpbGw9IiM4QzMwRjUiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMS40MzY1IDI5LjUzODhDMTIuMjY0OSAyOS41Mzg4IDEyLjkzNjUgMzAuMjEwNCAxMi45MzY1IDMxLjAzODhWNDEuODgxNkMxMi45MzY1IDQyLjcxIDEyLjI2NDkgNDMuMzgxNiAxMS40MzY1IDQzLjM4MTZDMTAuNjA4MSA0My4zODE2IDkuOTM2NTIgNDIuNzEgOS45MzY1MiA0MS44ODE2VjMxLjAzODhDOS45MzY1MiAzMC4yMTA0IDEwLjYwODEgMjkuNTM4OCAxMS40MzY1IDI5LjUzODhaIiBmaWxsPSIjOEMzMEY1Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMzUuODE2NCA1LjAxMDk5QzM2LjI4IDQuNzQyNTUgMzYuODUxNSA0Ljc0MTczIDM3LjMxNTkgNS4wMDg4NEw0Ni43MzU1IDEwLjQyN0M0Ny4yMDAzIDEwLjY5NDQgNDcuNDg3IDExLjE4OTQgNDcuNDg3NiAxMS43MjU1TDQ3LjUwMDQgMjIuNTkzOEM0Ny41MDEgMjMuMTI5NSA0Ny4yMTYgMjMuNjI0OCA0Ni43NTI1IDIzLjg5MzRMMzcuMzQ4OSAyOS4zNDM1QzM2Ljg4NTEgMjkuNjEyMyAzNi4zMTMxIDI5LjYxMzIgMzUuODQ4NSAyOS4zNDU4TDI2LjQyODggMjMuOTI0NEMyNS45NjQ0IDIzLjY1NzEgMjUuNjc3OSAyMy4xNjI0IDI1LjY3NzEgMjIuNjI2NUwyNS42NjExIDExLjc1ODJDMjUuNjYwMyAxMS4yMjIyIDI1Ljk0NTYgMTAuNzI2NSAyNi40MDk1IDEwLjQ1NzlMMzUuODE2NCA1LjAxMDk5Wk0zNi41NzA1IDguMDQwOTRMMjguNjYyNCAxMi42MkwyOC42NzU4IDIxLjc1NjJMMzYuNTk0MSAyNi4zMTM1TDQ0LjQ5OTQgMjEuNzMxOEw0NC40ODg3IDEyLjU5NTVMMzYuNTcwNSA4LjA0MDk0WiIgZmlsbD0iIzhDMzBGNSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTI1Ljg2MyAxMS4wMDVDMjYuMjc3OCAxMC4yODc5IDI3LjE5NTMgMTAuMDQyOCAyNy45MTI0IDEwLjQ1NzZMMzYuNTc2OSAxNS40Njk2TDQ1LjIxOTUgMTAuNDU4NEM0NS45MzYyIDEwLjA0MjkgNDYuODU0IDEwLjI4NyA0Ny4yNjk2IDExLjAwMzZDNDcuNjg1MSAxMS43MjAzIDQ3LjQ0MSAxMi42MzgxIDQ2LjcyNDMgMTMuMDUzN0wzNy4zMzAyIDE4LjUwMDZDMzYuODY1NCAxOC43NzAxIDM2LjI5MTkgMTguNzcwNCAzNS44MjY3IDE4LjUwMTRMMjYuNDEwMyAxMy4wNTQ1QzI1LjY5MzIgMTIuNjM5NyAyNS40NDgyIDExLjcyMjEgMjUuODYzIDExLjAwNVoiIGZpbGw9IiM4QzMwRjUiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zNi41NzM1IDE1LjcwMjlDMzcuNDAxOSAxNS43MDE1IDM4LjA3NDcgMTYuMzcxOSAzOC4wNzYyIDE3LjIwMDNMMzguMDk1MyAyOC4wNDMxQzM4LjA5NjggMjguODcxNSAzNy40MjY0IDI5LjU0NDMgMzYuNTk4IDI5LjU0NTdDMzUuNzY5NSAyOS41NDcyIDM1LjA5NjggMjguODc2OCAzNS4wOTUzIDI4LjA0ODRMMzUuMDc2MiAxNy4yMDU2QzM1LjA3NDcgMTYuMzc3MiAzNS43NDUxIDE1LjcwNDQgMzYuNTczNSAxNS43MDI5WiIgZmlsbD0iIzhDMzBGNSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMyLjMwOTQgMTkuNDQ2NUMzMi43MTM4IDIwLjE2OTYgMzIuNDU1NSAyMS4wODM1IDMxLjczMjUgMjEuNDg3OUwyMi41NTAzIDI2LjYyMzRDMjEuODI3MyAyNy4wMjc4IDIwLjkxMzQgMjYuNzY5NSAyMC41MDkgMjYuMDQ2NUMyMC4xMDQ2IDI1LjMyMzUgMjAuMzYyOSAyNC40MDk1IDIxLjA4NTkgMjQuMDA1MUwzMC4yNjgxIDE4Ljg2OTZDMzAuOTkxMSAxOC40NjUyIDMxLjkwNSAxOC43MjM1IDMyLjMwOTQgMTkuNDQ2NVoiIGZpbGw9IiM4QzMwRjUiLz4KPC9zdmc+Cg==",
        "type": "web2",
        "access": "Public",
        "user": "eip155:1:0x4245cd11b5a9E54F57bE19B643E564AA4Ee86D1b",
        "workspace": "ws-499e41a8-c813-4d6a-aaa8-4ecf686e5e9d"
      },
      {
        "key": "zapier",
        "name": "Zapier",
        "version": "1.0.0",
        "platformVersion": "1.0.0",
        "triggers": [
          {
            "key": "waitForZap",
            "name": "Wait for a zap",
            "display": {
              "label": "Wait for a zap",
              "description": "Wait for a zap"
            }
          }
        ],
        "actions": [
          {
            "key": "triggerZap",
            "name": "Trigger a zap",
            "display": {
              "label": "Trigger a zap",
              "description": "Trigger a zap"
            }
          }
        ],
        "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQySURBVHgB7ZtNSFRRFMf/T1pVkBtrl9OmFkm6sl1f4C61TQiBH4WBCwcsgoKyqGwRGEi6a8gviKQINVcVjrVrVhq6icBpFdpmDAxcxOv+35nb3Hkzb1R0YvS+H1zfm/fu1/nfc84dZK4DH+4FlKtLG1w0qmuNKuXY2aRUmYWDYXWdccaRNF865gdlfKsyvA873+ggksri+0qEIf2gTN8o4+8p4/litxpPIsrGQbdB2ZrG8wBlPF1+EDbhoE15wrCjjKcqcVAdu0gpEY4wBM7APuOJl+wpQCtsRe10ZepPDeylhh6wm7P+epSXwXJCAWA5oQCwnFAAWE4oACwnFACWEwoAywkFgOWEAsByQgFgOaEAsJxQAFhOKAAsJxQAlhMKAMsJBUCpUnUaqG1AsSlNAc42Aw/eAbdeAU3dKCalKcB+4zcb+4r7+409KEWmR4FItTL+ADD1FMXEcRvhYrvganlFTXxxbuP1V1NSNsrBCFBxWO4XPmFLUIC85UW36/5ZK1yuVkrdrhOuO/c++92vJelD9/eowXV/fJXCdrGo1NH1P8Rc91K51O1rzjw3+7h92nW/JQqPwzr6XVe1jMMx2X8eO7ceAgcrgZuv5WrClW26Iys71S9eoevQvS/3Ztdn4lv+Dow9DB6HiVHDuuzTP44JdxG+Iwv5uw1OgokJoL89u5ju9lNNYHVFJsbJ6Al0HAWe38jUOx/N7Tv6TOo+vpg96fOdCKQzlrm/WyfjNB8C5tNz0oaaaGEYjgEhFuwBi1+kaM61AMdPyT2N766TTjmB+brstjSKhlMcv2eQxNuMSJ8nxSOqTslqHqnOrc/nVemxvfGMhYiPBLflPK/XFswvGwsB7sVaYQ7OlTM7pfvS3cwtK5/hGn+CpGdpA/ceyK2/z3jGem/WkBd/W+4m6yTX9QUwjY+PSigEvac4VJ1w4GLs4RRreiT/O47NHWITFBYgGpPVJUxOYz25dWrr5Zqck9jUjC4hEHqLGft6DPJ7Jbe+zjEUNHJCFkJDT6uozOSnbROAK2tOjB1HY9l1KIpeZU6Ccc+Jnm0pvPp04ycJyQXMKzpcuIIMDxrpZ2pAPI39ch70At5f6ZX2HLfjGDZLsAD+GDbF0HASiUkxXE9GG8JVyteG0JOY8f2Z+2UPAqHHnKyXhMl+/X3z/Wa+TKUJFoBuN7/Otyy6qw6L4+lMzHYD7fK5okAiZLhwa2Pm5sTZTzwd29xe9djLyfSzlGR0Gk7BdTvuVBT7X9tUbtsCbO9X4UJw4jqEaGzQF57/jPX/EGEIMHCKf2aAu4QOl4WPKBFSPDQVV0FwBnYywxCYgK04GKYAQ5AwsI0k6AHOuHd+7hpsQ47QJr1dwDtLqx7AFtzM+WH/4WkeoeW52gh2J563m4enHX8N7yitnCZtTZ8p3PnH5x3MQpL9kBfyBn8BTUEGOuSP+cEAAAAASUVORK5CYII=",
        "access": "Public",
        "user": "eip155:1:0x4245cd11b5a9E54F57bE19B643E564AA4Ee86D1b",
        "workspace": "ws-499e41a8-c813-4d6a-aaa8-4ecf686e5e9d"
      },
      {
        "key": "erc20",
        "name": "ERC20 Tokens on EVM Chains (1.0.0)",
        "version": "1.0.0",
        "platformVersion": "1.0.0",
        "triggers": [
          {
            "key": "TransferTrigger",
            "name": "Transfer",
            "display": {
              "label": "Transfer",
              "description": "Detect the transfer of an ERC-20 token.",
              "instructions": "",
              "featured": false,
              "hidden": false
            }
          }
        ],
        "actions": [
          {
            "key": "totalSupplyAction",
            "name": "Total Supply",
            "display": {
              "label": "Total Supply",
              "description": "Get the total token supply.",
              "instructions": "",
              "featured": false,
              "hidden": false
            }
          },
          {
            "key": "balanceOfActionERC20",
            "name": "Balance Of",
            "display": {
              "label": "Balance Of",
              "description": "Get an owner's ERC-20 token balance.",
              "instructions": "",
              "featured": false,
              "hidden": false
            }
          },
          {
            "key": "InformationERC20TokenAction",
            "name": "Token Information",
            "display": {
              "label": "Token Information",
              "description": "Get more information about an ERC-20 token.",
              "instructions": "",
              "featured": false,
              "hidden": false
            }
          }
        ],
        "icon": "data:image/png;base64,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",
        "type": "web3",
        "access": "Public",
        "user": "eip155:1:0x2c0015A367eb73f575e48F9dC46dE0b8e497EAAC",
        "workspace": "ws-499e41a8-c813-4d6a-aaa8-4ecf686e5e9d",
        "description": "Triggers when an ERC-20 token transaction occurs on Ethereum, Binance, or any other EVM Chain (connector created by Grindery).",
        "triggersDescription": "Triggers when an ERC-20 token transaction occurs on Ethereum, Binance, or any other EVM Chain (connector created by Grindery).",
        "actionsDescription": "Interact with ERC-20 tokens on EVM Chains.",
        "contributor": "SAPikachu"
      },
      {
        "key": "evmWallet",
        "name": "Native Tokens on EVM Chains (1.0.0)",
        "version": "1.0.0",
        "platformVersion": "1.0.0",
        "triggers": [
          {
            "key": "newTransaction",
            "name": "New Transaction",
            "display": {
              "label": "New Transaction",
              "description": "Detect a new native token transaction.",
              "instructions": "",
              "featured": false,
              "hidden": false
            }
          }
        ],
        "actions": [
          {
            "key": "balanceOfActionNative",
            "name": "Balance Of",
            "display": {
              "label": "Balance Of",
              "description": "Get an owner's native token balance.",
              "instructions": "",
              "featured": false,
              "hidden": false
            }
          }
        ],
        "icon": "data:image/png;base64,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",
        "type": "web3",
        "user": "eip155:1:0x2c0015A367eb73f575e48F9dC46dE0b8e497EAAC",
        "workspace": "ws-499e41a8-c813-4d6a-aaa8-4ecf686e5e9d",
        "access": "Public",
        "description": "Triggers when a native token transaction occurs on Ethereum, Binance, or any other EVM Chain (connector created by Grindery).",
        "triggersDescription": "Triggers when a native token transaction occurs on Ethereum, Binance, or any other EVM Chain (connector created by Grindery).",
        "actionsDescription": "Interact with native tokens on EVM Chains.",
        "contributor": "SAPikachu"
      }
    ]
    if (isLocalOrStaging) {
      stagedCdss = [
        {
          "key": "airtable",
          "name": "Airtable",
          "version": "1.0.0",
          "platformVersion": "1",
          "triggers": [
            {
              "key": "newAirtableRow",
              "name": "New Airtable Record",
              "display": {
                "label": "New Airtable Record",
                "description": "",
                "instructions": "",
                "featured": false
              }
            }
          ],
          "actions": [
            {
              "key": "createAirtableRow",
              "name": "Create Airtable Record",
              "display": {
                "label": "Create Airtable Record",
                "description": "",
                "instructions": "",
                "featured": false
              }
            }
          ],
          "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAYGSURBVHgB7VhpbFRVFD7nvjddaNoqsmkwBWUz1IRABIIpspQUsEEixgA2YIlLNG6//KGJGU1MTIwRl4hIJUUQEgKpodBhU2jZioWUlNUyhaAgochSYNrZ3rt+981QZsowzEw77ZD0S+7cee/ee9757jn3nPMeUS960SkwJQFSkqC9NIRMGkSSNDLoX55OTZQEdCkBuZeyofACKPwm+nxIT0Ov4AWlPbguw9gGnkp+6iJ0CQFZTU9B0hvY8SVQOPs+ci+QTqvRr+ACOkOdRMIEZC3lQNlC8tA7UHwyJGlxCWCsZnLAIsvJTdt4NiQlgLgJyH2UB4Xno72P9ih1Fmw52TH0a+Fmy2GVa/EtjxGyhqZjt0qxYqG1d8kAUxtaBeR/z1PoQGxLogC7PQDHrRQCS3CZHzyQyUfAKkfRf0s2quBJdPXeUyNA7qFxEKF8ey76h6inoGgIHHqiTThhS+FejR2nhBFANHkZiz5Am0hJyhEJg+ELTPthkU9gkeo7t4OQu+kZXB3ErqeW4h2hYXsN6otccl1divaBFjqFoZNB/0s93NGq+rbyCuEuhOji20cTbAa9C5bFuJXTo/ZQSqsNFXQLfTmcaBVPo8OhU9g+ZYo+/nxbn9nOgzfC1u6gXEqnRVj+Ctp4y7W6k4xE+aFTHZ75A92kzUh0YfoN29g6ODcv8xIfGz1t3RmPa5pg+oP95rLnz9bVhMlRMb+GCvBXxX9FKIOSecCZmuHnvyEvf8OFdCJ0aNwhabt51Sgmv/E6SzlZ4lDzlTGzZLPPTU5Pa9Bi1ChYlrHkdbDK+TAyuxBSdXoRpnwLZh3XJQdePVSzfmsgcy39TivZHl7sjdoiR5Dwl5qSFpM0QrI/t1kE1N9bhp9OuW+RR5qBIZx1FrwJ5/xnIZt3znY6PR3IjIH6b+PRc9AGxkUlEN/V70X05SCwjp9FORGCwVtb+mZS5gvQo1Qa5iSOWGuFEFBwm4ZFwoX+NoTlRfK4xrxeM9uWFzU1NIfpUkP9IXom+VAbMY2NapXAbpsIELthyWU4mtvDfNtuF8MmfDyBTWMxFJ6H+f0oKjoQUPCZJp32uOia4bt7OpKJIHaYLH8sbpy1lcluhum3D+WGAauY1sP7t9dMgUhyBa3MiiRTEbJDMGKX7Edu/yJMe1WaMh+SYrRnBAIBTYj+8bXSOQ9qK44sC4f+IqyzDBu+ofh07cmw5espzT+AntNtNMrabwP5JY8O8FAUzkEM2SUzbK2eAmzIa1LADU2ZTnEHh3sRCOKC101nYY17kQiSdQvB2+FnZcXOA5tZnZ4oGL5DPsE+73yoqorEJ+GgnQgE9yGg0AJXasS58MroCZotu/HfGtMaP/uWzmk8/F/o+Mid/hLT6y8BwRlQWlCXgNvuKyhXs9HTmTmUwdGnSitwyTy/ND9iqS0JHRu53VMiPf5fMKGo65QPICZhGUKj0ZnZlCP06BOl8gfRzCZe70Nvkz6QkpT8Yt4NRSIfJB7T0yOMQnGms9Dxw0fcPLS4qW5/go+JG3o8k9VhHpqRRbpXIEK1IhKxyhFOTWpfNdHl8veanAm9mHcGcRG4jcfTMqmPEKeavK5PL7e4KxddanBRDyFuAhrxIcT2L4a/NLlihD08kfUEYiMgydRYVtuYv8yqr3JY9xqqKBUQ9XSp2A633yZNUZQ7d2JhVr3DQSmGiBZAvEaFICsRbz7Pqt9aZ908uoVSEe0EAhUuuVCbbMHn5M+yj2w7Tg8AdKT2/QjjY22CV5Fhfp3T4PiLHhggRT58pKrAOWyWbbizqttjeMIIvuyj2wsLwN+djgdFeQQVvg7Fd0hprsgZlFGdUCLrVqh9VhlfcD2zWJvO+uqGIm5/K0xZAtJSXNwgXfxqIyo/MTPtz0jzUotAYLe9pGm1+CqyskVoGy4VcdQyJTUIsPUWd4GEWC91W9npGeqdmWP6xNljBJSLsCakNORGkaatWVCoVdqZ466tuomA+k4lg+GPVTsjNNt3wuWtODkv85yaYafE0C0E/D69UmNzIT6UNRpe4ydP//Ta85O4jXrRi150Gv8DwAZZLUzQHtUAAAAASUVORK5CYII=",
          "type": "web2",
          "user": "eip155:1:0x4245cd11b5a9E54F57bE19B643E564AA4Ee86D1b",
          "workspace": "ws-499e41a8-c813-4d6a-aaa8-4ecf686e5e9d",
          "access": "Public"
        },
        {
          "key": "discord",
          "name": "Discord",
          "version": "1.0.0",
          "platformVersion": "1",
          "actions": [
            {
              "key": "sendChannelMessage",
              "name": "Send Channel Message",
              "display": {
                "label": "Send Channel Message",
                "description": "Post a new message to a specific #channel you choose"
              }
            }
          ],
          "authentication": {
            "type": "oauth2",
            "test": {
              "method": "GET",
              "url": "https://discordapp.com/api/users/@me"
            },
            "defaultDisplayName": "{{ data.guild.name }} - {{ data.username }}#{{ data.discriminator }}",
            "authenticatedRequestTemplate": {
              "headers": {
                "Authorization": "Bearer {{ auth.access_token }}"
              }
            },
            "oauth2Config": {
              "authorizeUrl": "https://discord.com/oauth2/authorize?response_type=code&client_id={{ secrets.client_id|urlencode }}&permissions=2146958591&scope=identify%20guilds.join%20guilds%20bot",
              "getAccessToken": {
                "method": "POST",
                "url": "https://discord.com/api/v10/oauth2/token",
                "headers": {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                "body": "code={{ code|urlencode }}&client_id={{ secrets.client_id|urlencode }}&client_secret={{ secrets.client_secret|urlencode }}&redirect_uri={{ redirect_uri|urlencode }}&grant_type=authorization_code"
              },
              "autoRefresh": true,
              "refreshAccessToken": {
                "method": "POST",
                "url": "https://discord.com/api/v10/oauth2/token",
                "headers": {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                "body": "refresh_token={{ auth.refresh_token|urlencode }}&client_id={{ secrets.client_id|urlencode }}&client_secret={{ secrets.client_secret|urlencode }}&grant_type=refresh_token"
              }
            }
          },
          "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQVSURBVHgB7VldbttGEJ7ZlQynSW3rBKVPUN0g9AmqPrRR+mIZtYC+tTqBpBNYeShQxAkgv9RC+qKeILpBlBOEOQFlJ4ASW9zJLPVHyeRyJRuxAvB70XKHs/xmf2a/XQFkyJAhQ4ZbAGFNlCr+3nYuVyQBPwGQ8/kqOOq2CwMb33LFd2hLnqCitwCi92k06tv6LiO3ysua9IOcqBAikwaXiQPS2La9JZgMNGzaoZwosV8JEEv8VN/OSyhXL3tsOoProNdpFzywhNUIlI8/uMy0Piad2NAAiJok8cewQoETtROyHdBDpS6Y+CFXOUlt8btdCuDs1cudLtw2ACZfZ/INuAcgYuv8+fc14zsmo56rkJfv4D5BwUHnRaGXZBYmXyb/Gu4bKOsmc2IAvKgqYJinXxHuhEssTCNgjPwrI5FLbAAb1PtTOEmjkDQCm9T7IRDwz7j6GwGEOX+zej8EARXLx767XH9zBJAOYVMRk5EW9oFQ3+SlDxsKvdsPr4P9qG5aGIEtKV3YYLDs2tsWshStWwhAhMrSDggUah+9UyoV/MzlM1tfZtIb+wQH/HTE09az9pXwOPq4rEZdsAF/kIQ66PyzoBq75eMLjwVMPcW32TndbUSryn/4PVDiNas4B9I+zTMddNDz50kjK+ge3XuvXhZilSLnay0/XIgn73We7+7H+ukMg3bSRWzlnX//fvA+LM9ISVm0cdYLKYn8mCP9n+isIHGaTQSbBxZQw+uDaXkWgECyCoAXUt9oV5h8slLogRlp9jEEObPi7MM4OYikwzEZUdDeOraQA6DRPm8If5gWZwHw1LBz5gB+qfqJo6UQHyfZJkfRWOg1yJnNahZApBNFXGUaJMiTuHotQyZZIgnur7/78fa8XEV/OdPCPAtVL9/BCkHocyteBTV9ANc7+Hf5/CGRanB96kgiUm14pdp6R/2t+rFIoOpkDnwZXud0Z38hgKfVS5/sp9GcDMHAhvRd+upMeH66U9Dl+SKG9UisS/42vlGu0TXgwbcDb1oQ8I1jpoU4Bw8QKN1jKtrGl1N3Ai0M+ftdbhst2/WmhfkaUKOmlSrkFAIj1QAZ6CxwpJUlrIGxmoUeS4/a8KHa5yvFZti2hZ9CeDZ/joBVoQMj0bDshXYAwbP/TguhtNBiDEEUwx2dJukYx1s+cbYRiB6zGzDht5w2+58eQb/b4jRa8YsqL/V5t5L2QSbbHT7kS+TW/EATezMX3gDou9B0eXvE+bgNt8CT44u/+ArxxPQOIfX5TrUWd0Nnvlo0BWKQxqviSfXiDU/+Ytw3+NtNUyfZ3U7rQAgO+W13VslrYOlAszZunAXCdRU0TXeiU6z0B4deIzgS4ZZ//mK3BXeIpzyV9O/wEUuM1np/dmTIkCFDhpXxBYuKkMLUEll6AAAAAElFTkSuQmCC",
          "type": "web2",
          "user": "eip155:1:0x4245cd11b5a9E54F57bE19B643E564AA4Ee86D1b",
          "workspace": "ws-499e41a8-c813-4d6a-aaa8-4ecf686e5e9d",
          "access": "Public"
        },
        {
          "key": "firebaseCloudMessagingConnector",
          "name": "Firebase Cloud Messaging",
          "version": "1.0.0",
          "platformVersion": "1.0.0",
          "actions": [
            {
              "key": "fcmPushNotification",
              "name": "Send Push Notification",
              "display": {
                "label": "Send Push Notification",
                "description": "Send a push notification",
                "instructions": "",
                "featured": false
              }
            },
            {
              "key": "subscribeDeviceToTopic",
              "name": "Subscribe a Device to Topic",
              "display": {
                "label": "Subscribe a Device to Topic",
                "description": "Subscribe a device to topic",
                "instructions": "",
                "featured": false
              }
            },
            {
              "key": "unsubscribeDeviceFromTopic",
              "name": "Unsubscribe a Device from Topic",
              "display": {
                "label": "Unsubscribe a Device from Topic",
                "description": "Unsubscribe a device from topic",
                "instructions": "",
                "featured": false
              }
            },
            {
              "key": "sendMessageToDevices",
              "name": "Send Message to Topic Subscribers",
              "display": {
                "label": "Send Message to Topic Subscribers",
                "description": "Send message to subscribers of a topic",
                "instructions": "",
                "featured": false
              }
            }
          ],
          "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALxSURBVHgBtZXLaxNBHMd/k3d3E6uk1lartJq22EooRQP2UDwULFoPLRZ8gOKhV/8ATwEvgnpS/AM89FCwiKggWATBnAQvatGCj4O0pq+8N7s7Mz9nNg83bWJWtD8YZmd25/v5zXd/swvQIHBu2o2Jky3wj+FqeEf5Og3LGy9xPhaGHQEYqRjQ9Ai4ipOwIwBOBwE5gLl5Cx9GVTmFzyN+2eC/AJBGABGAamEImTPWXNFzA4p4E/4iSF3tuAAP7i8ANUS2YhfulmXwdl4C/ftTCxrqjpKJt1+sZz9NtIFuXiDRF/fB8Q5GRo9UxaWgWeg01lYeM8NQgesqaD9vi2liiRfSj8BI3sOl6b3OAbm1g1VxQGA6B5bMtNIClOaM3Dg8OTYmxBeAZUcBGYCWjdST8tQFkEKkIi57c0P0HEVRIXgVuQoV0qbOE5YNWoVQyqrL+Q5MfrwizjQElE16InZSLPgAunqA+PWyeDkRhjHnACJKFEqidLPUW2PiAv/Rw+BSJJzbFsgxHXIEwFengsDMbiv7vGjFsrjHC/5YL7hVahMvZ29dmr3y89IUAJlkhwAoKD1PlWyS4oETPeAJc6ixxd64EYRIal9zQCHfLgqwleZQVGTJlsBIBNx76thSGyoQ40BzgIf0I+dEZl+1JdjAFjsEMQCM9jUHcGOIZrmoSge2/BYvjcn2F739JZt00Ew5tqUsXgkaxXjc1RCAcwNBI0/afcOObamFc/MQnP+g2DVrTnLOs1vxRdSwZ5dps2UrYKs4VjtGmde98UMCcnV3EJxMrBppbayYZbOcIq0RqCteHjJkWprPaSvGOXI6kbTfqwEQAhiaer8YeB2+ml3Fs3qOfZTHoJEt4qygmcc3mXU23pLovByaWlrcmkvd/0FVQPwXssO9ZwJ7PHe8ftJvz9jU+ZKWdl1vfbe4QOLAG2n8EVCJ5LOBDtWNM74gXBFSip5nd1dXjAc9174Vm611BKhEZravTfahi5/XpZ1O1vwCT3OtK4J0Is8AAAAASUVORK5CYII=",
          "type": "web2",
          "user": "eip155:1:0x4245cd11b5a9E54F57bE19B643E564AA4Ee86D1b",
          "workspace": "ws-499e41a8-c813-4d6a-aaa8-4ecf686e5e9d",
          "access": "Public"
        },
        {
          "key": "genericWebhook",
          "name": "Webhooks by Nexus",
          "version": "1.0.0",
          "platformVersion": "1",
          "triggers": [
            {
              "key": "inboundWebhook",
              "name": "Catch Hook",
              "display": {
                "label": "Catch hook",
                "description": "Wait for a new POST request to a Nexus URL",
                "instructions": ""
              }
            }
          ],
          "actions": [
            {
              "key": "inboundWebhookAction",
              "name": "Send request",
              "display": {
                "label": "Send request",
                "description": "Send a custom HTTP request"
              }
            }
          ],
          "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAcKSURBVHgB3VrdThtHFD5n1gYpoZL7BDVSkrZXgSeIkVrgLvgJap4AogLqHeYuClExTxB4gpA7aCuxfQLIVRugwm9QS42qgr1zes7+eXa865/15qL9JIf9mZ0558z5nwD8x4HwibBZu6jMzDyoEWFF7vlvu1fqtVunX7ehQBTOwNbK9SZP+pwvaxlDLkHT4f7PT46gABTGwPa3Vwug1FuWdXW8L7ANWteZkUuYAgoKwM7yzXeg8CKdeGoHv4HnVflmZ+X3TZgCUzOws/xhjZCOzGcE4BLCUvfu4+f7Z0/m5SfXmrAu75JjnYOdVRZATkylQpurv1XLVD6PJU/QYcL3Xp89bg37bnv1qkFaHSBSJXzU6WJvMY+BT7UDTPyuqTakoD6KeMH+KRuworrxqFKm0hvIgdw7EEi/dBvd+5I/fdyM37MbLc3ONVhCz1htKux5jruO55pS3lr+0ERUu9G9qFnLXezABMi9A2XPqUXXyEaaIF6Ym/3sgqVzwMSvgbhUhW9E3eRdNK53P9Pi+BATXJp5MLFB51chhbHhESjXfFXWpQx3SlVTVVruPNuMPo7ueTeewaRkQE4QqcgAwdP61+h6U+IBwsKQT2tbq9e1mAANRhzAKkyI3Awo9GIGlMNBKUQZhhLvQ3uG4VP/2/GDoEEHFACldcyMRjXSCEtI8Ziecc2YyID9tSEnNDnxYhr7kvPuHdc0zNRFlY7VpsWphAY89GMIwB5MiNxu9PuVq5YC3Ahv3f2zx0vRuzChO8hY8mj/7NE6FITcO4CIJ8ZtwjAlmElcwPQcaE1iBBSEqVKJreWbP4104JID0ZIdiIQxVqk1BRTtFhuu3nv905dNKADTGTGSqbMLHLwG1IYDnOvdOU3TLtjfbxS1C1MxEOY9bv8JNbZXrhPRViABi8370HhUyRN10zC1G+3eleqWrtckZfALHAN22lDULkzNgEhXIya8CoIGx/E69jh7F2Zm53ZhShQSyJAwUZCIB3qZktvLLpi7xX5/01a3STE1A6wqDdH96F4I9PP9FATJWzJYBTVFfgx1o1vfXNc4albu7/92s/L07ZWbWzOHcbA3/3JEZSWGDkbXAsF7QVB6yqoXPyPADhPXJk3vhnUwUhnwezqsn7LF4aNEpI2ws3y9yxJtGtONFWUlNiDBOYwNbCP0Dl+dfTVQ7Q2oUFCMzJ0bxItaVNLGmcSL6jjYHSuXkdgAVnE/HFSV4p937sK2mQEGgiLdSIk5yeLQuZcyLqG7WYabSZJlC0G3gg7ZI6zLT6I1DTK5YFd1CRXaWbk+MCXPr0+6d3+t2/rvGy6XiP1JqP2KWycwIbaXb97yxx1ucB1mNbh+YGI582WNwKrxOFbpmAG7SBfiWZ/rqQvnMNxpsbV8dcQJZOyuxfDFJtAg6k3kDkWiXHEtRUQJczNU2uDdqYk9JKVRbHocROcK/zqdgZ1Peq8OJ4/zpeglEaxhyI6pz5IScBPqnMKskwytCxjtTVyEZBEuno+7dw3EHq81J0I96rJjiFoxvNPrXl9LKqr8cM03YvH3RloMDnhuPDM3bM13FjpFqU7k+ZJrUcM32jBnCtdyYzqVeubvAPolYSBZluplRJQwNqzQ5t1YEJ8eukUf3CttEjerJHFTqDvW+LY9B6/aCXaVMpoB3IqZfdiE0Lkwk++wr0Y1nwFWjyqGDHB9amSMfcayYHYYgu+hisG3Yiv2zlXt78n4NxvqecQAeNyGceKvq74KodHaUEATpbhmS8WfC9UXUDiytcDfAWmFqFgWGA/udssnpRnvIMsGwsTNTSxFuMDjw2uWFlqtEoLK4Hz9NTPWiWMEKaxgf8c6PgPSClGzvehhJdJryR65wyBeJrXDYEdT2xmUVK8+jpGPyo14nX4dgZLwBWrNbFz6KhQUG33r5sniNMEvGzm0W1XXJRIfD1lpMzpmoOk7g1EQYdnC6BNPx+Y6KrCHaI33sYXavRyOeo1Xp4+Ozck2V2+r8rd1Ot+2F7LTC2E6qy7Ighx8sI48J2KngmxbqN+Zc2yv/MGdDR1npJIBWLnQ1a1hA5yj0NI4h3B+sEN1HqlP3txo1BrBOVyEIANIZKNWbVvxD+E458+aVAKM/57HmbpPGuowBsRmglgzepwIyHwWpe4DTj69Lei7SpdE5zR1Ak+AT4P0I+lR7JOaTKKS67jk8Xe/9ANiRDg6vj3WEmsAvIiOsjBrcqZkd0gKMQiuGzyFL348fXQ0znA+XuLsUg2cTkbOQvP5Q9r6toBSi3rhrqS6i2xMxzAGpPBwVG9xXOIFJaWbab1TsUH52cTLWDm6tXd3ZG9UCoqeVg3g4x9MRER1yS7uPXp0Ms1pe3DkihuYeaojhONx75+PrbTGwif7zx6TQgTV1eUF6YJEz7pQdtNc9v8K/wKYvXn1+03R8AAAAABJRU5ErkJggg==",
          "type": "web2",
          "access": "Public",
          "user": "eip155:1:0x4245cd11b5a9E54F57bE19B643E564AA4Ee86D1b",
          "workspace": "ws-499e41a8-c813-4d6a-aaa8-4ecf686e5e9d"
        },
        {
          "key": "gmailSender",
          "name": "Gmail",
          "version": "1.0.0",
          "platformVersion": "1.0.0",
          "actions": [
            {
              "key": "sendEmailViaGmail",
              "name": "Send Email",
              "display": {
                "label": "Send Email",
                "description": "Compose and send a new message",
                "instructions": "",
                "featured": false
              }
            }
          ],
          "authentication": {
            "type": "oauth2",
            "test": {
              "method": "GET",
              "url": "https://www.googleapis.com/oauth2/v3/userinfo"
            },
            "defaultDisplayName": "{{ data.email }}",
            "authenticatedRequestTemplate": {
              "headers": {
                "Authorization": "Bearer {{ auth.access_token }}"
              }
            },
            "allowedHosts": [
              "www.googleapis.com",
              "gmail.googleapis.com"
            ],
            "oauth2Config": {
              "authorizeUrl": "https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&response_type=code&client_id={{ secrets.client_id|urlencode }}&scope=https://www.googleapis.com/auth/userinfo.email+openid+https://www.googleapis.com/auth/gmail.send&access_type=offline",
              "getAccessToken": {
                "method": "POST",
                "url": "https://oauth2.googleapis.com/token",
                "headers": {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                "body": "code={{ code|urlencode }}&client_id={{ secrets.client_id|urlencode }}&client_secret={{ secrets.client_secret|urlencode }}&redirect_uri={{ redirect_uri|urlencode }}&grant_type=authorization_code"
              },
              "autoRefresh": true,
              "refreshAccessToken": {
                "method": "POST",
                "url": "https://oauth2.googleapis.com/token",
                "headers": {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                "body": "refresh_token={{ auth.refresh_token|urlencode }}&client_id={{ secrets.client_id|urlencode }}&client_secret={{ secrets.client_secret|urlencode }}&grant_type=refresh_token"
              }
            }
          },
          "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIHSURBVHgB7ZNLSFRRGMf/5869iTUxBUWJRFNueiwaqYkiCMuLtIwCXUUULspF06LFtGsRVIsiK5J2tbSFG1FBfG1kxFmMKxeieBFE8IHjAwfHe8/nOTPe8TFzvdcXuPAH95zDOd/3/c/5n3OBI1xgsvkAKFVlF+ssojMmV/4+MAwDuyDdjhAx9bGP0aiqW/9yAr2Xgw0AvVqLS4FR9N7I2A/sgHSHFmGgL2JYtDb1VdPNd0p2nCsuKQax+ik9/HtEvxlwKzxaETo19TDcKIp/31BcUisbxSmRCK9PkjIw8SgUdIqZ1G+Vn/BpCWKoLrAcyAksa36nGkHfijY4WRl+s3VhpjIcEZuIyZhCiQtcy/SqbH49acLLlhc4vTheKLZYfNKyK/Pg7xXTYn5F+2MB1Sx7hXkMmQFE52+LUVv2BEl/KX4+bUbs+jM4YVu2jSUZGlNlqJ27jwl+fP0EkhW1CK13opgOXEJV/JtTftBpQVryefEGutKlm+bzLrn/ak3GMrFjA95JPE9W5BUvKCCRlqVT6jUOuP4LIqb+7LHZu7YlngQkF2Kx1PnOuHwpdYxoLi+AKGlx1IiYt6xteNmpjqOAzbmueIPJ1dAWyxIWV8tLuuP/3fJdBSQlPX2GbZltiZzzkqvCI9Iy0UWwQzydYC8cpICZE2Dgnyjz4vYJoiXxfcQRh4JVjgy4tvLUe0AAAAAASUVORK5CYII=",
          "type": "web2",
          "user": "eip155:1:0x4245cd11b5a9E54F57bE19B643E564AA4Ee86D1b",
          "workspace": "ws-499e41a8-c813-4d6a-aaa8-4ecf686e5e9d",
          "access": "Public"
        },
        {
          "key": "googleSheets",
          "name": "Google Sheets",
          "version": "1.0.0",
          "platformVersion": "1",
          "triggers": [
            {
              "key": "newSpreadsheetRow",
              "name": "New Spreadsheet Row",
              "display": {
                "label": "New Spreadsheet Row",
                "description": "",
                "instructions": "",
                "featured": false
              }
            }
          ],
          "actions": [
            {
              "key": "createSpreadsheetRow",
              "name": "Create Spreadsheet Row",
              "display": {
                "label": "Create Spreadsheet Row",
                "description": "Triggered when a new row is added to the bottom of a spreadsheet.",
                "instructions": "",
                "featured": false
              }
            }
          ],
          "authentication": {
            "type": "oauth2",
            "test": {
              "method": "GET",
              "url": "https://www.googleapis.com/oauth2/v3/userinfo"
            },
            "defaultDisplayName": "{{ data.email }}",
            "authenticatedRequestTemplate": {
              "headers": {
                "Authorization": "Bearer {{ auth.access_token }}"
              }
            },
            "allowedHosts": [
              "www.googleapis.com",
              "sheets.googleapis.com"
            ],
            "oauth2Config": {
              "authorizeUrl": "https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&response_type=code&client_id={{ secrets.client_id|urlencode }}&scope=https://www.googleapis.com/auth/spreadsheets+https://www.googleapis.com/auth/userinfo.email+https://www.googleapis.com/auth/spreadsheets.readonly+https://www.googleapis.com/auth/drive&access_type=offline",
              "getAccessToken": {
                "method": "POST",
                "url": "https://oauth2.googleapis.com/token",
                "headers": {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                "body": "code={{ code|urlencode }}&client_id={{ secrets.client_id|urlencode }}&client_secret={{ secrets.client_secret|urlencode }}&redirect_uri={{ redirect_uri|urlencode }}&grant_type=authorization_code"
              },
              "autoRefresh": true,
              "refreshAccessToken": {
                "method": "POST",
                "url": "https://oauth2.googleapis.com/token",
                "headers": {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                "body": "refresh_token={{ auth.refresh_token|urlencode }}&client_id={{ secrets.client_id|urlencode }}&client_secret={{ secrets.client_secret|urlencode }}&grant_type=refresh_token"
              }
            }
          },
          "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAYCAYAAAAPtVbGAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIPSURBVHgBzZVPSBRRHMe/b/7utmsubYfKpd0pw0y2Q0SBkRGRQUSdOnQsCqJDENWhU3STMOxWQbf+YmlQhCCuf06CKIqIIoguXlRQcEVdd2Z3nm9WHccBnVl3BL/D4/F783vzeb/35c0jsOnE98ddhOo1cFDVoejEZSV+7eXp2xNOuZw1KP/6MOIGYMjHi4qQoYmG/j8xp9wtkCwvCChAFFDAce11Q43H4RayGxkgWZcTH0ZaYtgrSB5EUb6iau1vexqPeApR9exWEKjC+6RE/fD/qD23IA+sGktNISwEEeRl6/CZHGgb6095AklnM+icHoKWSkNXc9ZXJ+25xXlCADHkByftvFZPjBdDPvB+EXsKMSSUyNuCHD05G445pWBwLmmCjC0sCKKzA9B84xVmVxbMscO+g2YsEJ4deIJzv55tfjAoFwbZUO2/11jQlhEU/Ri4+x4Xml6AIwSVoQi+XX/uON8VpL76PnJUh8yt7fmnK0/yfal0wM10d5CGwb9IqYsICH7UHKvCm96frBKgojSCd5ceeAN5VFmLTE6FtF7J0/itvL8lYsDNdHeQlsk+zKtLDCLgjnIRzePdIMyTskAY1UcrvIFcLYuzSjTTk5vR8/lKQpIHlbDF4vNIqxkbIGs8k57Hl9EOFAdhT11/E4qVZ7+V/QVJ3vuYZFv0m11zmoum2hu7HdOU0B92yCoK7aihV9++QAAAAABJRU5ErkJggg==",
          "type": "web2",
          "user": "eip155:1:0x2c0015A367eb73f575e48F9dC46dE0b8e497EAAC",
          "workspace": "ws-499e41a8-c813-4d6a-aaa8-4ecf686e5e9d"
        },
        {
          "key": "hubspot",
          "name": "HubSpot",
          "version": "1.0.0",
          "platformVersion": "1.0.0",
          "type": "web2",
          "triggers": [
            {
              "key": "triggerFromWorkflow",
              "name": "Trigger from a workflow",
              "display": {
                "label": "Trigger from a workflow",
                "description": "Trigger from a HubSpot workflow"
              }
            }
          ],
          "actions": [
            {
              "key": "triggerWorkflow",
              "name": "Trigger a workflow",
              "display": {
                "label": "Trigger a workflow",
                "description": "Trigger a HubSpot workflow"
              }
            }
          ],
          "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAMAAAAL34HQAAAAAXNSR0IArs4c6QAAAiJQTFRF//////7+//39//z8//z7//v7//v6//r5//n4//n3//j3//j2//f1//b0//bz//Xz//Xy//Tx//Pw//Lv//Hu//Dt//Ds/+/s/+/r/+7q/+3o/+zo/+zn/+vm/+rl/+rk/+ji/+fh/+Xf/+Te/+Td/+Pd/+Pc/+Lb/+Ha/+HZ/+DY/9/X/97W/97V/93V/93U/9vS/9nQ/9jP/9jO/9fN/9bM/9XL/9XK/9TK/9TJ/9PI/9LH/9HG/9DF/8/D/87C/83B/8u//8q9/8m8/8m7/8i7/8e5/8a4/8W3/8W2/8S2/8S1/8O0/8Kz/8Gy/8Cx/7+w/7+v/76u/72t/72s/7ys/7yr/7ur/7qp/7mo/7mn/7in/7im/7el/7ak/7Wj/7Si/7Sh/7Oh/7Og/7Kf/7Ge/7Cd/7Cc/6+c/6+b/66a/62Z/62Y/6yX/6uW/6mU/6iT/6eS/6eR/6aQ/6WP/6SO/6SN/6ON/6OM/6KL/6GK/6GJ/6CJ/6CI/5+H/56G/52F/5yE/5yD/5uD/5uC/5qC/5qB/5mA/5h//5d+/5d9/5Z8/5V7/5V6/5R6/5R5/5N4/5J3/5F2/5B1/5B0/490/49z/45z/45y/41x/4xw/4tv/4tu/4pt/4ls/4lr/4hr/4hq/4dp/4Zo/4Vn/4Rm/4Nl/4Nk/4Jk/4Jj/4Fi/4Bh/4Bg/39g/39f/35e/31d/31c/3xc/3xb/3ta/3pZ8CrREwAABPVJREFUeNrt2v1fU1UYAPDDxQWzETC2CgnUwswQkIrMVkJhSYZEZQYREqZoWCNjQFPwLfMFrQzDBF2+tI1AYAh7/r9+cGzPPXd3O4O753N+OOdH7vOc893u5e45z70MpBxMsRRLsRRLsRRLsRRLsRRLsRRLsRRLsRRLFlag/dUSm2t71wOZWJF9NvZk5LU9lob1sJIlRlVYElYEqxjbviQ89cLx10rt7upDoWywmpl+HBCdecgVy3AcsZ51dx3HsgfFJu7OSeQ0Wc5qZ/wQ++zDOTiny2rWNgOrTmTaiFuXk/ePxSyngVUhMm0fl7TfYpbNwHKKTPsGl1RuMcttYL0sMm05l6QtW8uqNbB2iUxbyGeFrGV9Y2DlfB5NP+1mLinP4pMYXG9wsR3pP/rbXMpmq+/yHUYWe+5auiwvl9FmNSv6ehKXrTdN1vLz+nMYtJoFczuTuNjuhdRZpzQc3ZONMvDoyj21vAJdLZNpkpDqo+xUp/MDjVWb6vaehTlPYi3HUOqkc6WxwEJv9mv5HlRRtKa+UwRiYWcothhXXAlXdcor+WEs6iLJzidYk3C5LkvDgmhrwpXbIw0LYNiRgHkeScOCKfSbt3FCGhYsNKDq/qQ0LIBjqEBsXpKGBdfRz962B9KwIFyHKukL0rAgeiCx69I6pWEBjKLiuH4WH5nsbSiLHXDv7psi7m8FUIei7M+Vv84c3crVQWWH50jbbovvo2LvSakw31GQpEBztP5L2g38IQ81GxYBfE6WfBT0kzYpb2xILL1lvJGZj51BQhbM1DPB4RwnZAF0aIKuoj8oWXC+WNDlGKNkwf1XBF3P3KNkwdJeQVdVlJIF0CTo+oKUNVPE91C2NH/9fXdLDf/voN2gZH3MXdvtK8XOdK+Lu30Rsu7pW9INuKuz0KZr8OaM07EO6s5TN3d00I4Pv0PGipbidb81HB/BV5gWomKdx6r3kgR04YAfqVifokULZ5J9nZvwlUfFqkaLdieNOJ1JE90i1nI+agBMJ4/Bt4kwDesuWrLWJOYDFBOgYV1HS35mEtOPYv6iYZ1BS5q1e39BMWM0rJNoSZ9JzE0Uc4GGNYKW7DOJuYxifqVhXUNLHjSJ+Yn+JN5BS9abxKAmIpugYUVy0S7W5EkCfpgXpGEB3t17057n/GUi1n60aOlisojaTApBq1h+XCB8meaCZ14qVgRX8prf2BHAdaAWpmLpziJbP8KrdOV8DV3RPKUr17VO3UXdn68r9EcJdz4e7nUJX3ybepF7x6OWckN2387tBwsbj/mvjpz48Fl+//g76a66U3BX/S7tZt8nptoQJmX5bWKdpAmgZAmqtBHS/tbP68RUx0m7gcNiqoKzpL3TobiqeGsKVcUkULIGE6rx6GG7CSq3aRYoWYPxGrD4JgAEPEn7zrtuZzDlGlmPJv8DX1zljG3/Ai0OzvS0ZyyjedfCenzkJcZYiUEFAPOnWl6Mf2fuPaOLGU69BtbtjdwjCu5GOXvrku877+DV6VXMvXrWnaLUqjWN1bMqOdUtkIE1oFeV/A1SsN7Ss/wgB4sr7vokYT2lZ30iCYt7MvGVJKw6Peu0JKwT+qeEEUlYSy9g1iGQhAW/oRcNdkSlYcGl+PPpN+dAHhaE9hUxxljlAIBMLACYDYYiANKxsjUUS7EUS7EUS7EUS7EUS7EUS7EUS7EUS7Eoxv9YG2egK+f9lgAAAABJRU5ErkJggg=="
        },
        {
          "key": "slack",
          "name": "Slack",
          "version": "1.0.0",
          "platformVersion": "1",
          "actions": [
            {
              "key": "sendChannelMessage",
              "name": "Send Channel Message",
              "display": {
                "label": "Send Channel Message",
                "description": "Post a new message to a specific #channel you choose"
              }
            }
          ],
          "authentication": {
            "type": "oauth2",
            "test": {
              "method": "GET",
              "url": "https://slack.com/api/team.info"
            },
            "defaultDisplayName": "{{ auth.team.name }}",
            "authenticatedRequestTemplate": {
              "headers": {
                "Authorization": "Bearer {{ auth.access_token }}"
              }
            },
            "oauth2Config": {
              "authorizeUrl": "https://slack.com/oauth/v2/authorize?client_id={{ secrets.client_id|urlencode }}&scope=channels:join,channels:read,chat:write,groups:read,im:read,mpim:read,team:read&user_scope=channels:read,channels:write,chat:write,groups:read,im:read,mpim:read,users.profile:read",
              "getAccessToken": {
                "method": "POST",
                "url": "https://slack.com/api/oauth.v2.access",
                "headers": {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                "body": "code={{ code|urlencode }}&client_id={{ secrets.client_id|urlencode }}&client_secret={{ secrets.client_secret|urlencode }}&redirect_uri={{ redirect_uri|urlencode }}&grant_type=authorization_code"
              }
            }
          },
          "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAK+SURBVHgB3VVNTxNhEJ55d9tgjAkciBeCcvGglgZtBEHaJYQDNZR4A3+C/8AQog3xZrz4I4SL2gaByMFWwpcWKgK9mIgmnCQRqokJ7b4zvlvcbpfCNhAv+iSb3U7nnWc+ntkF+NeBtRw65nYNAmwH2J95131+zbIFXo2EQUCnzr5kNvowd2qC0MJuGxJmEFU4BZZs/Mo/2dM0+GD7SIZbm7fH5o+LoXsRCAmDKrRw0uGbQldn2PHRgPrU7VgCAR4ggJTLGdEvJHmeORFBprshJQRcB+K4dRFBGk4IV4tCb390CZR9lTYyD/pBmj+R6TybDU6ORI4K1DY1GpFMPSaKRC46lrXt5SG3L/28zFJuwnFgIGLuLeYfh1mIuGOnOGicVBmslP2IejcGHqWsn+UWEckYeEEpCYE7VHCz6j+JMZefZsn6AM4MWFuAGkA/TnOFYlhlW5Qq+0MgiTMOXwVuzO0GWfAAMLqGz4AmEs+/DzeUhtw2Mxo0JfUzwZLVikDyfgSEiKhoBUCxuB4dK4vBNeSJ4Xv1qiZTEPiVRNMt28/SW01Dhiq6oyjN/KU/fq8Lk/VMUlMtC8PLQBhosqRp1EBXe7HXUFm1/fC5abhVCFxzsoa4HylhksiwvcnEhu/pWr5O07PgAQY2GmPraVcFmsB+PuRYYDFovyZK2SB21aFGUAPM2KluJYIKFdEylAq1g8mq4TGyzsxLyOxJcsZnJuzncgUt2+OpLxeGQqyyVlv7pmV7YnWr+W6VdBvvbKS+TQVDWOTBo4ITyNlz0VyuisDCxa/jVm89+7vzPBCBIvdYzz6EZH3s46qX/4leXKUDSo5qLg+sS23cys6Lq8ZfI2BEa7cKhxgNOC2BAJx1GUyZZAGLDiOTDs5Aj0LNT+an5uErfhADSmWL1uJZtu/T11ppv9ivFLVsDR3+a/wG8kUkIc9A9TMAAAAASUVORK5CYII=",
          "type": "web2",
          "user": "eip155:1:0x4245cd11b5a9E54F57bE19B643E564AA4Ee86D1b",
          "workspace": "ws-499e41a8-c813-4d6a-aaa8-4ecf686e5e9d",
          "access": "Public"
        },
        {
          "key": "tokenPrice",
          "name": "Token Price by Nexus",
          "version": "1.0.0",
          "platformVersion": "1.0.0",
          "actions": [
            {
              "key": "getTokenPriceBySymbol",
              "name": "Get token price by symbol",
              "display": {
                "label": "Get token price by symbol",
                "description": "Get current price for a cryptocurrency by token symbol"
              }
            },
            {
              "key": "getTokenPriceByAddress",
              "name": "Get token price by address",
              "display": {
                "label": "Get token price by address",
                "description": "Get current price for a cryptocurrency token by smart-contract address"
              }
            }
          ],
          "icon": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMC42NTU0IDE4Ljg0MzlDMTEuMTE5MSAxOC41NzUyIDExLjY5MSAxOC41NzQ0IDEyLjE1NTYgMTguODQxN0wyMS41NzUyIDI0LjI2MzFDMjIuMDM5OCAyNC41MzA1IDIyLjMyNjMgMjUuMDI1NCAyMi4zMjcgMjUuNTYxNEwyMi4zMzk3IDM2LjQyOTdDMjIuMzQwNCAzNi45NjU0IDIyLjA1NTMgMzcuNDYwNyAyMS41OTE5IDM3LjcyOTNMMTIuMTg4MiA0My4xNzk0QzExLjcyNDQgNDMuNDQ4MiAxMS4xNTI0IDQzLjQ0OSAxMC42ODc4IDQzLjE4MTZMMS4yNjgyIDM3Ljc2MDNDMC44MDM3OTMgMzcuNDkzIDAuNTE3MjMyIDM2Ljk5ODIgMC41MTY0NDUgMzYuNDYyNEwwLjUwMDQ5IDI1LjU5NDFDMC40OTk3MDMgMjUuMDU4MiAwLjc4NDg0NSAyNC41NjI2IDEuMjQ4NTEgMjQuMjk0TDEwLjY1NTQgMTguODQzOVpNMTEuNDA5OCAyMS44NzM5TDMuNTAxNzQgMjYuNDU1N0wzLjUxNTE2IDM1LjU5MjFMMTEuNDMzNSA0MC4xNDk0TDE5LjMzODcgMzUuNTY3N0wxOS4zMjggMjYuNDMxMUwxMS40MDk4IDIxLjg3MzlaIiBmaWxsPSIjOEMzMEY1Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMC43MDIxNTggMjQuODQwM0MxLjExNzI4IDI0LjEyMzQgMi4wMzQ5NyAyMy44Nzg3IDIuNzUxODggMjQuMjkzOEwxMS40MDcgMjkuMzA1NUwyMC4wNTkgMjQuMjkzOUMyMC43NzU4IDIzLjg3ODcgMjEuNjkzNSAyNC4xMjMyIDIyLjEwODggMjQuODQwMUMyMi41MjQgMjUuNTU2OSAyMi4yNzk1IDI2LjQ3NDcgMjEuNTYyNiAyNi44ODk5TDEyLjE1ODkgMzIuMzM2OEMxMS42OTQgMzIuNjA2MSAxMS4xMjA1IDMyLjYwNjIgMTAuNjU1NSAzMi4zMzY5TDEuMjQ4NiAyNi44OUMwLjUzMTY5MyAyNi40NzQ5IDAuMjg3MDQxIDI1LjU1NzIgMC43MDIxNTggMjQuODQwM1oiIGZpbGw9IiM4QzMwRjUiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMS40MzY1IDI5LjUzODhDMTIuMjY0OSAyOS41Mzg4IDEyLjkzNjUgMzAuMjEwNCAxMi45MzY1IDMxLjAzODhWNDEuODgxNkMxMi45MzY1IDQyLjcxIDEyLjI2NDkgNDMuMzgxNiAxMS40MzY1IDQzLjM4MTZDMTAuNjA4MSA0My4zODE2IDkuOTM2NTIgNDIuNzEgOS45MzY1MiA0MS44ODE2VjMxLjAzODhDOS45MzY1MiAzMC4yMTA0IDEwLjYwODEgMjkuNTM4OCAxMS40MzY1IDI5LjUzODhaIiBmaWxsPSIjOEMzMEY1Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMzUuODE2NCA1LjAxMDk5QzM2LjI4IDQuNzQyNTUgMzYuODUxNSA0Ljc0MTczIDM3LjMxNTkgNS4wMDg4NEw0Ni43MzU1IDEwLjQyN0M0Ny4yMDAzIDEwLjY5NDQgNDcuNDg3IDExLjE4OTQgNDcuNDg3NiAxMS43MjU1TDQ3LjUwMDQgMjIuNTkzOEM0Ny41MDEgMjMuMTI5NSA0Ny4yMTYgMjMuNjI0OCA0Ni43NTI1IDIzLjg5MzRMMzcuMzQ4OSAyOS4zNDM1QzM2Ljg4NTEgMjkuNjEyMyAzNi4zMTMxIDI5LjYxMzIgMzUuODQ4NSAyOS4zNDU4TDI2LjQyODggMjMuOTI0NEMyNS45NjQ0IDIzLjY1NzEgMjUuNjc3OSAyMy4xNjI0IDI1LjY3NzEgMjIuNjI2NUwyNS42NjExIDExLjc1ODJDMjUuNjYwMyAxMS4yMjIyIDI1Ljk0NTYgMTAuNzI2NSAyNi40MDk1IDEwLjQ1NzlMMzUuODE2NCA1LjAxMDk5Wk0zNi41NzA1IDguMDQwOTRMMjguNjYyNCAxMi42MkwyOC42NzU4IDIxLjc1NjJMMzYuNTk0MSAyNi4zMTM1TDQ0LjQ5OTQgMjEuNzMxOEw0NC40ODg3IDEyLjU5NTVMMzYuNTcwNSA4LjA0MDk0WiIgZmlsbD0iIzhDMzBGNSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTI1Ljg2MyAxMS4wMDVDMjYuMjc3OCAxMC4yODc5IDI3LjE5NTMgMTAuMDQyOCAyNy45MTI0IDEwLjQ1NzZMMzYuNTc2OSAxNS40Njk2TDQ1LjIxOTUgMTAuNDU4NEM0NS45MzYyIDEwLjA0MjkgNDYuODU0IDEwLjI4NyA0Ny4yNjk2IDExLjAwMzZDNDcuNjg1MSAxMS43MjAzIDQ3LjQ0MSAxMi42MzgxIDQ2LjcyNDMgMTMuMDUzN0wzNy4zMzAyIDE4LjUwMDZDMzYuODY1NCAxOC43NzAxIDM2LjI5MTkgMTguNzcwNCAzNS44MjY3IDE4LjUwMTRMMjYuNDEwMyAxMy4wNTQ1QzI1LjY5MzIgMTIuNjM5NyAyNS40NDgyIDExLjcyMjEgMjUuODYzIDExLjAwNVoiIGZpbGw9IiM4QzMwRjUiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zNi41NzM1IDE1LjcwMjlDMzcuNDAxOSAxNS43MDE1IDM4LjA3NDcgMTYuMzcxOSAzOC4wNzYyIDE3LjIwMDNMMzguMDk1MyAyOC4wNDMxQzM4LjA5NjggMjguODcxNSAzNy40MjY0IDI5LjU0NDMgMzYuNTk4IDI5LjU0NTdDMzUuNzY5NSAyOS41NDcyIDM1LjA5NjggMjguODc2OCAzNS4wOTUzIDI4LjA0ODRMMzUuMDc2MiAxNy4yMDU2QzM1LjA3NDcgMTYuMzc3MiAzNS43NDUxIDE1LjcwNDQgMzYuNTczNSAxNS43MDI5WiIgZmlsbD0iIzhDMzBGNSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMyLjMwOTQgMTkuNDQ2NUMzMi43MTM4IDIwLjE2OTYgMzIuNDU1NSAyMS4wODM1IDMxLjczMjUgMjEuNDg3OUwyMi41NTAzIDI2LjYyMzRDMjEuODI3MyAyNy4wMjc4IDIwLjkxMzQgMjYuNzY5NSAyMC41MDkgMjYuMDQ2NUMyMC4xMDQ2IDI1LjMyMzUgMjAuMzYyOSAyNC40MDk1IDIxLjA4NTkgMjQuMDA1MUwzMC4yNjgxIDE4Ljg2OTZDMzAuOTkxMSAxOC40NjUyIDMxLjkwNSAxOC43MjM1IDMyLjMwOTQgMTkuNDQ2NVoiIGZpbGw9IiM4QzMwRjUiLz4KPC9zdmc+Cg==",
          "type": "web2",
          "access": "Public",
          "user": "eip155:1:0x4245cd11b5a9E54F57bE19B643E564AA4Ee86D1b",
          "workspace": "ws-499e41a8-c813-4d6a-aaa8-4ecf686e5e9d"
        },
        {
          "key": "zapier",
          "name": "Zapier",
          "version": "1.0.0",
          "platformVersion": "1.0.0",
          "triggers": [
            {
              "key": "waitForZap",
              "name": "Wait for a zap",
              "display": {
                "label": "Wait for a zap",
                "description": "Wait for a zap"
              }
            }
          ],
          "actions": [
            {
              "key": "triggerZap",
              "name": "Trigger a zap",
              "display": {
                "label": "Trigger a zap",
                "description": "Trigger a zap"
              }
            }
          ],
          "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQySURBVHgB7ZtNSFRRFMf/T1pVkBtrl9OmFkm6sl1f4C61TQiBH4WBCwcsgoKyqGwRGEi6a8gviKQINVcVjrVrVhq6icBpFdpmDAxcxOv+35nb3Hkzb1R0YvS+H1zfm/fu1/nfc84dZK4DH+4FlKtLG1w0qmuNKuXY2aRUmYWDYXWdccaRNF865gdlfKsyvA873+ggksri+0qEIf2gTN8o4+8p4/litxpPIsrGQbdB2ZrG8wBlPF1+EDbhoE15wrCjjKcqcVAdu0gpEY4wBM7APuOJl+wpQCtsRe10ZepPDeylhh6wm7P+epSXwXJCAWA5oQCwnFAAWE4oACwnFACWEwoAywkFgOWEAsByQgFgOaEAsJxQAFhOKAAsJxQAlhMKAMsJBUCpUnUaqG1AsSlNAc42Aw/eAbdeAU3dKCalKcB+4zcb+4r7+409KEWmR4FItTL+ADD1FMXEcRvhYrvganlFTXxxbuP1V1NSNsrBCFBxWO4XPmFLUIC85UW36/5ZK1yuVkrdrhOuO/c++92vJelD9/eowXV/fJXCdrGo1NH1P8Rc91K51O1rzjw3+7h92nW/JQqPwzr6XVe1jMMx2X8eO7ceAgcrgZuv5WrClW26Iys71S9eoevQvS/3Ztdn4lv+Dow9DB6HiVHDuuzTP44JdxG+Iwv5uw1OgokJoL89u5ju9lNNYHVFJsbJ6Al0HAWe38jUOx/N7Tv6TOo+vpg96fOdCKQzlrm/WyfjNB8C5tNz0oaaaGEYjgEhFuwBi1+kaM61AMdPyT2N766TTjmB+brstjSKhlMcv2eQxNuMSJ8nxSOqTslqHqnOrc/nVemxvfGMhYiPBLflPK/XFswvGwsB7sVaYQ7OlTM7pfvS3cwtK5/hGn+CpGdpA/ceyK2/z3jGem/WkBd/W+4m6yTX9QUwjY+PSigEvac4VJ1w4GLs4RRreiT/O47NHWITFBYgGpPVJUxOYz25dWrr5Zqck9jUjC4hEHqLGft6DPJ7Jbe+zjEUNHJCFkJDT6uozOSnbROAK2tOjB1HY9l1KIpeZU6Ccc+Jnm0pvPp04ycJyQXMKzpcuIIMDxrpZ2pAPI39ch70At5f6ZX2HLfjGDZLsAD+GDbF0HASiUkxXE9GG8JVyteG0JOY8f2Z+2UPAqHHnKyXhMl+/X3z/Wa+TKUJFoBuN7/Otyy6qw6L4+lMzHYD7fK5okAiZLhwa2Pm5sTZTzwd29xe9djLyfSzlGR0Gk7BdTvuVBT7X9tUbtsCbO9X4UJw4jqEaGzQF57/jPX/EGEIMHCKf2aAu4QOl4WPKBFSPDQVV0FwBnYywxCYgK04GKYAQ5AwsI0k6AHOuHd+7hpsQ47QJr1dwDtLqx7AFtzM+WH/4WkeoeW52gh2J563m4enHX8N7yitnCZtTZ8p3PnH5x3MQpL9kBfyBn8BTUEGOuSP+cEAAAAASUVORK5CYII=",
          "access": "Public",
          "user": "eip155:1:0x4245cd11b5a9E54F57bE19B643E564AA4Ee86D1b",
          "workspace": "ws-499e41a8-c813-4d6a-aaa8-4ecf686e5e9d"
        },
        {
          "key": "algorand",
          "name": "Algorand",
          "version": "1.0.0",
          "platformVersion": "1.0.0",
          "triggers": [
            {
              "key": "newTransaction",
              "name": "Wallet Transfer",
              "display": {
                "label": "Wallet Transfer",
                "description": "Make a wallet transfer",
                "instructions": "",
                "featured": false
              }
            },
            {
              "key": "TokenTransferTrigger",
              "name": "Token Transfer",
              "display": {
                "label": "Token Transfer",
                "description": "Make a token transfer",
                "instructions": "",
                "featured": false
              }
            }
          ],
          "actions": [
            {
              "key": "InformationAsset",
              "name": "Asset Information",
              "display": {
                "label": "Asset Information",
                "description": "Get details of an asset",
                "instructions": "",
                "featured": false,
                "hidden": false
              }
            },
            {
              "key": "NFTMint",
              "name": "Mint NFT",
              "display": {
                "label": "Mint NFT",
                "description": ""
              }
            }
          ],
          "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAVGSURBVHgB5ZvPTxNBFMdfjWfkHyDUk4mYWC+G1oM1MameNDHWK8TiFVTOAp79AVd/RDgK0ehJPNmTmHgQEkrCqSX8ARL+gXG+u1uy3Z2ZnZ2dnbb4SaZLl31t35s3b9683SlQzjDGivxQ5a3E2zhveD8aHMN0eDsKjju8baMVCoUODRtc6Spvy7y1WXbavH3AZ9Igw3/gKG8LvP1l+dHmbYr5XjUYOFI8Cr7rdd8NwX/ALHOreJQ2b1PkGlietx9scGgzV97A+t/rMvCb5ihPmD/uBp0FygPmT0XDwgddvQo6F/EPRFJymYYLJFFXki46k3RBYM1hUx6U0niCEObP78POazKB+dH+tCCdHQoS5Yv88If8RYsTDg8P6eXLV7HzY2Nj9PTpE8oIFllXRAsrmQHaFF+t5cr09EPa3PweOz8yMkK/f//yjhlpcgPciJ6MBUHmp5ZFcsjHjxtC5cHx8THt7rbIAlXRUOgxQOD6+SQSCkSuH+bnzy2yxALXsWdYRz1glhz3PpTH+FextWXNAFC+xwtOYkC/At/NmzXPzZPY39+zEQcAAuJ5Hg9w7PGAKjlUHqD3dZQHFodBjxeEDeB07KP3Efx0sWgAMNv9wzMA8+ttRXLIvXt14flyuSw8L5slDBkNdKazwYkpcgh6Xhb4VlZe0dzck1iP4/q3b9/xOHAuJvPgwX0y4C5vza4BrpMjMOZl0x4UQeYHLxC5/LNni7FzMzMN/mpkgDu8zZ0Jon+RHIFeFPV+OOWtVMpanwWZmZmHZAjKekXEgBI5Aoq/eCHu/fn5x55CAAbQmfLCMoZUnRpA5vpQol7vDYrXrqm9QCRjQMmZARDFZdPe8+eLsXOTk2oDiGQM8IbAODlAFMAAAt+tW7XY+du3ayRDJmPAOAyQe/anmvZka33VvN9oNMgSozBAkXJEVugAUF4UxPw5/z3J0E2fNSgmFkWzIlvtQfFHjxqpZLrYzApzNYAq38cUJprqdNYINtcFuRpAFvhUUxjS4CRarZa1YQADdCgHVGWuT5/WpTK6vfvt2yZZoAMDHFEOJOX7aWREtFp7ZIEjGOCALCMLYhjzsmlPFfhEscJSIDywPgSgxJs374T/w8pNNu3J1ggw2KVLE0KZpFqiBtswwDZZRFbmguLz8/LeF9GVqdXEWZ8FL/AM0CRLJE17IlDzT5KRLYwsTIfbXlXY1p2gq1fLQrdEgePz541MMhcuXIx5FmIDqsWGdHhl+Hw3D/hKGUkqc2WVES1+YJAMXtDES9cAXygDOmWuKKo1gkimUqkIr81ggDW8eAbgrtCkDPmATpkryvr6RioZ2fLY8K5RJ9C5JxVeIQN0y1xZZTDeJybi0yGCqEFavNT9I2yAZTLwgjRlriwyQFQsNbh7DB2b3TcnBgjulaXyAoy/NGUukLY0FkZWBUqZD6yFH5SIrgZTeYFs5aYqWaUtjYVBRihKi1MEwg75Op7QY4DAC5ZIA5Myl4lMGCgvSotTLI+Xoo/JxOoB/AJYqEkKTMtcaWVEyNJijeUxIv9q9ORZycXTpHhWAEvRcnnSa1Fk9+lUMrLSmAgEwno9/h0F9SOf8OwblAY8T8NOD2YPUTN/28uws0hZ4B+wyoaX1ST9dB+WRjxwdg/REjs86CX+Zq2qcPDU9RoND2s6yqeGe8IiG3yWKU+YPzv8n1tmQkbA0xVtNjj8YP3YQsf8TYxt1j/c9brCCPCGZeZ+4yTikdMHO5UEhsjbIwZPcRHM3zy9yuxtnoaHVSkHtBKhLDA/OJWChs1XeJ+0fR6363DDppn39vl/d+T7hVjZv6kAAAAASUVORK5CYII=",
          "type": "web3",
          "description": "",
          "user": "eip155:1:0x4245cd11b5a9E54F57bE19B643E564AA4Ee86D1b",
          "workspace": "ws-499e41a8-c813-4d6a-aaa8-4ecf686e5e9d",
          "access": "Public"
        },
        {
          "key": "astroDao",
          "name": "Astro DAO",
          "version": "1.0.0",
          "platformVersion": "1.0.0",
          "triggers": [
            {
              "key": "NewProposalTrigger",
              "name": "New Proposal",
              "display": {
                "label": "New Proposal",
                "description": "Create a new proposal",
                "instructions": "",
                "featured": false
              }
            }
          ],
          "icon": "data:image/x-icon;base64,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",
          "type": "web3",
          "user": "eip155:1:0x4245cd11b5a9E54F57bE19B643E564AA4Ee86D1b",
          "workspace": "ws-499e41a8-c813-4d6a-aaa8-4ecf686e5e9d",
          "access": "Public"
        },
        {
          "key": "chainlink",
          "name": "Chainlink Oracle",
          "version": "1.0.0",
          "platformVersion": "1",
          "actions": [
            {
              "key": "clkPriceFeedAction",
              "name": "Get Chainlink Price Feed",
              "display": {
                "label": "Get Chainlink Price Feed",
                "description": "Get Chainlink Price Feed",
                "instructions": "",
                "featured": false
              }
            }
          ],
          "icon": "data:image/png;base64,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",
          "type": "web3",
          "access": "Public",
          "user": "eip155:1:0x4245cd11b5a9E54F57bE19B643E564AA4Ee86D1b",
          "workspace": "ws-499e41a8-c813-4d6a-aaa8-4ecf686e5e9d",
          "description": ""
        },
        {
          "key": "doraFactory",
          "name": "Dora Factory",
          "version": "1.0.0",
          "platformVersion": "1.0.0",
          "type": "web3",
          "actions": [
            {
              "key": "createProposal",
              "name": "Create proposal",
              "display": {
                "label": "Create proposal",
                "description": "Create proposal"
              }
            }
          ],
          "icon": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDE4MCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHN0eWxlPnBhdGh7ZmlsbDojZmY3NjFjfUBtZWRpYSAocHJlZmVycy1jb2xvci1zY2hlbWU6ZGFyayl7cGF0aHtmaWxsOiNmZmE0MWN9fTwvc3R5bGU+PHBhdGggZD0iTTEwNi40NTIgNTIuNDE2YzAgOC4zNS03LjM2NiAxNS4xMi0xNi40NTIgMTUuMTItOS4wODYgMC0xNi40NTItNi43Ny0xNi40NTItMTUuMTIgMC04LjM1MiA3LjM2Ni0xNS4xMjIgMTYuNDUyLTE1LjEyMiA5LjA4NiAwIDE2LjQ1MiA2Ljc3IDE2LjQ1MiAxNS4xMjJaTTEyMC4xNjIgMTA3LjYwOGMwIDExLjY5MS0xMy41MDQgMTIuMDk4LTMwLjE2MiAxMi4wOThzLTMwLjE2Mi0uNDA3LTMwLjE2Mi0xMi4wOThjMC0xMS42OTIgNy41NC0zMC45OTggMzAuMTYyLTMwLjk5OHMzMC4xNjIgMTkuMzA2IDMwLjE2MiAzMC45OThaTTQ2LjEyOCA4OS40NjNjOS4wODYgMCAxNi40NTItNi43NyAxNi40NTItMTUuMTIxIDAtOC4zNTItNy4zNjYtMTUuMTIyLTE2LjQ1Mi0xNS4xMjItOS4wODcgMC0xNi40NTMgNi43Ny0xNi40NTMgMTUuMTIxIDAgOC4zNTIgNy4zNjYgMTUuMTIyIDE2LjQ1MyAxNS4xMjJaTTE1MC4zMjQgNzQuMzQxYzAgOC4zNTItNy4zNjUgMTUuMTIyLTE2LjQ1MiAxNS4xMjItOS4wODYgMC0xNi40NTItNi43Ny0xNi40NTItMTUuMTIxIDAtOC4zNTIgNy4zNjYtMTUuMTIyIDE2LjQ1Mi0xNS4xMjIgOS4wODcgMCAxNi40NTIgNi43NyAxNi40NTIgMTUuMTIxWiIvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNOTAgMTY4Ljg4MmM0OC42MDEgMCA4OC0zNS4zNDMgODgtNzguOTQgMC0yNC41OTItMTIuNTM1LTQ2LjU1Ny0zMi4xODUtNjEuMDM1QzEzMC45MyAxNy43NiAxMTEuMzk0IDExIDkwIDExcy00MC45MyA2Ljc2MS01NS44MTUgMTcuOTA3QzE0LjUzNSA0My4zODUgMiA2NS4zNSAyIDg5Ljk0MWMwIDQzLjU5OCAzOS4zOTkgNzguOTQxIDg4IDc4Ljk0MVptMC0xNy40N2M0NS4zODIgMCA4MS4yNDUtMzEuMTgxIDgxLjI0NS02OC41ODkgMC0zNy40MDctMzUuODYzLTY4LjU4OC04MS4yNDUtNjguNTg4LTQ1LjM4MyAwLTgxLjI0NSAzMS4xOC04MS4yNDUgNjguNTg4IDAgMzcuNDA4IDM1Ljg2MiA2OC41ODkgODEuMjQ1IDY4LjU4OVoiLz48L3N2Zz4="
        },
        {
          "key": "ensChain",
          "name": "ENSCHAIN",
          "version": "1.0.0",
          "platformVersion": "1.0.0",
          "type": "web3",
          "actions": [
            {
              "key": "lookup",
              "name": "Address Lookup",
              "display": {
                "label": "Address Lookup",
                "description": "Address Lookup "
              }
            },
            {
              "key": "priceFeed",
              "name": "Price Feed",
              "display": {
                "label": "Price Feed",
                "description": "Get Latest Price Feed"
              }
            }
          ],
          "icon": "data:image/png;base64,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",
          "user": "eip155:1:0x9C4De71cDbF4956c0Ab5c23d04912315865B7aA8"
        },
        {
          "key": "erc1155",
          "name": "ERC1155",
          "version": "1.0.0",
          "platformVersion": "1.0.0",
          "type": "web3",
          "triggers": [
            {
              "key": "ApprovalForAllTrigger",
              "name": "Approval For All",
              "display": {
                "label": "Approval For All",
                "description": "Approval For All"
              }
            },
            {
              "key": "CreateERC1155_v1Trigger",
              "name": "Create ERC 1155 v 1",
              "display": {
                "label": "Create ERC 1155 v 1",
                "description": "Create ERC 1155 v 1"
              }
            },
            {
              "key": "OwnershipTransferredTrigger",
              "name": "Ownership Transferred",
              "display": {
                "label": "Ownership Transferred",
                "description": "Ownership Transferred"
              }
            },
            {
              "key": "SecondarySaleFeesTrigger",
              "name": "Secondary Sale Fees",
              "display": {
                "label": "Secondary Sale Fees",
                "description": "Secondary Sale Fees"
              }
            },
            {
              "key": "SignerAddedTrigger",
              "name": "Signer Added",
              "display": {
                "label": "Signer Added",
                "description": "Signer Added"
              }
            },
            {
              "key": "SignerRemovedTrigger",
              "name": "Signer Removed",
              "display": {
                "label": "Signer Removed",
                "description": "Signer Removed"
              }
            },
            {
              "key": "TransferBatchTrigger",
              "name": "Transfer Batch",
              "display": {
                "label": "Transfer Batch",
                "description": "Transfer Batch"
              }
            },
            {
              "key": "TransferSingleTrigger",
              "name": "Transfer Single",
              "display": {
                "label": "Transfer Single",
                "description": "Transfer Single"
              }
            },
            {
              "key": "URITrigger",
              "name": "URI",
              "display": {
                "label": "URI",
                "description": "URI"
              }
            }
          ],
          "actions": [
            {
              "key": "addSignerAction",
              "name": "Add Signer",
              "display": {
                "label": "Add Signer",
                "description": "Add Signer"
              }
            },
            {
              "key": "balanceOfAction",
              "name": "Balance Of (View function)",
              "display": {
                "label": "Balance Of (View function)",
                "description": "Balance Of (View function)"
              }
            },
            {
              "key": "balanceOfBatchAction",
              "name": "Balance Of Batch (View function)",
              "display": {
                "label": "Balance Of Batch (View function)",
                "description": "Balance Of Batch (View function)"
              }
            },
            {
              "key": "burnAction",
              "name": "Burn",
              "display": {
                "label": "Burn",
                "description": "Burn"
              }
            },
            {
              "key": "contractURIAction",
              "name": "Contract URI (View function)",
              "display": {
                "label": "Contract URI (View function)",
                "description": "Contract URI (View function)"
              }
            },
            {
              "key": "creatorsAction",
              "name": "Creators (View function)",
              "display": {
                "label": "Creators (View function)",
                "description": "Creators (View function)"
              }
            },
            {
              "key": "feesAction",
              "name": "Fees (View function)",
              "display": {
                "label": "Fees (View function)",
                "description": "Fees (View function)"
              }
            },
            {
              "key": "getFeeBpsAction",
              "name": "Get Fee Bps (View function)",
              "display": {
                "label": "Get Fee Bps (View function)",
                "description": "Get Fee Bps (View function)"
              }
            },
            {
              "key": "getFeeRecipientsAction",
              "name": "Get Fee Recipients (View function)",
              "display": {
                "label": "Get Fee Recipients (View function)",
                "description": "Get Fee Recipients (View function)"
              }
            },
            {
              "key": "isApprovedForAllAction",
              "name": "Is Approved For All (View function)",
              "display": {
                "label": "Is Approved For All (View function)",
                "description": "Is Approved For All (View function)"
              }
            },
            {
              "key": "isOwnerAction",
              "name": "Is Owner (View function)",
              "display": {
                "label": "Is Owner (View function)",
                "description": "Is Owner (View function)"
              }
            },
            {
              "key": "isSignerAction",
              "name": "Is Signer (View function)",
              "display": {
                "label": "Is Signer (View function)",
                "description": "Is Signer (View function)"
              }
            },
            {
              "key": "mintAction",
              "name": "Mint",
              "display": {
                "label": "Mint",
                "description": "Mint"
              }
            },
            {
              "key": "nameAction",
              "name": "Name (View function)",
              "display": {
                "label": "Name (View function)",
                "description": "Name (View function)"
              }
            },
            {
              "key": "ownerAction",
              "name": "Owner (View function)",
              "display": {
                "label": "Owner (View function)",
                "description": "Owner (View function)"
              }
            },
            {
              "key": "removeSignerAction",
              "name": "Remove Signer",
              "display": {
                "label": "Remove Signer",
                "description": "Remove Signer"
              }
            },
            {
              "key": "renounceOwnershipAction",
              "name": "Renounce Ownership",
              "display": {
                "label": "Renounce Ownership",
                "description": "Renounce Ownership"
              }
            },
            {
              "key": "renounceSignerAction",
              "name": "Renounce Signer",
              "display": {
                "label": "Renounce Signer",
                "description": "Renounce Signer"
              }
            },
            {
              "key": "safeBatchTransferFromAction",
              "name": "Safe Batch Transfer From",
              "display": {
                "label": "Safe Batch Transfer From",
                "description": "Safe Batch Transfer From"
              }
            },
            {
              "key": "safeTransferFromAction",
              "name": "Safe Transfer From",
              "display": {
                "label": "Safe Transfer From",
                "description": "Safe Transfer From"
              }
            },
            {
              "key": "setApprovalForAllAction",
              "name": "Set Approval For All",
              "display": {
                "label": "Set Approval For All",
                "description": "Set Approval For All"
              }
            },
            {
              "key": "setContractURIAction",
              "name": "Set Contract URI",
              "display": {
                "label": "Set Contract URI",
                "description": "Set Contract URI"
              }
            },
            {
              "key": "setTokenURIPrefixAction",
              "name": "Set Token URI Prefix",
              "display": {
                "label": "Set Token URI Prefix",
                "description": "Set Token URI Prefix"
              }
            },
            {
              "key": "supportsInterfaceAction",
              "name": "Supports Interface (View function)",
              "display": {
                "label": "Supports Interface (View function)",
                "description": "Supports Interface (View function)"
              }
            },
            {
              "key": "symbolAction",
              "name": "Symbol (View function)",
              "display": {
                "label": "Symbol (View function)",
                "description": "Symbol (View function)"
              }
            },
            {
              "key": "tokenURIPrefixAction",
              "name": "Token URI Prefix (View function)",
              "display": {
                "label": "Token URI Prefix (View function)",
                "description": "Token URI Prefix (View function)"
              }
            },
            {
              "key": "transferOwnershipAction",
              "name": "Transfer Ownership",
              "display": {
                "label": "Transfer Ownership",
                "description": "Transfer Ownership"
              }
            },
            {
              "key": "uriAction",
              "name": "Uri (View function)",
              "display": {
                "label": "Uri (View function)",
                "description": "Uri (View function)"
              }
            }
          ],
          "icon": "data:image/png;base64,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",
          "user": "eip155:1:0x9C4De71cDbF4956c0Ab5c23d04912315865B7aA8"
        },
        {
          "key": "erc20",
          "name": "Tokens on EVM Chains",
          "version": "1.0.0",
          "platformVersion": "1.0.0",
          "triggers": [
            {
              "key": "TransferTrigger",
              "name": "Transfer",
              "display": {
                "label": "Transfer",
                "description": "Transfer a specific amount of tokens",
                "instructions": "",
                "featured": false,
                "hidden": false
              }
            }
          ],
          "actions": [
            {
              "key": "balanceOfActionERC20",
              "name": "Balance Of",
              "display": {
                "label": "Balance Of",
                "description": "Get owner's token balance",
                "instructions": "",
                "featured": false,
                "hidden": false
              }
            },
            {
              "key": "mintAction",
              "name": "Mint",
              "display": {
                "label": "Mint",
                "description": "Mint tokens and assign them to an account",
                "instructions": "",
                "featured": false,
                "hidden": false
              }
            },
            {
              "key": "burnAction",
              "name": "Burn",
              "display": {
                "label": "Burn",
                "description": "Burn tokens from an account",
                "instructions": "",
                "featured": false,
                "hidden": false
              }
            },
            {
              "key": "InformationERC20TokenAction",
              "name": "Token Information",
              "display": {
                "label": "Token Information",
                "description": "Get details of an ERC20 token",
                "instructions": "",
                "featured": false,
                "hidden": false
              }
            }
          ],
          "icon": "data:image/png;base64,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",
          "type": "web3",
          "access": "Public",
          "user": "eip155:1:0x4245cd11b5a9E54F57bE19B643E564AA4Ee86D1b",
          "workspace": "ws-499e41a8-c813-4d6a-aaa8-4ecf686e5e9d",
          "description": ""
        },
        {
          "key": "evmGenericAbi",
          "name": "Custom Smart Contract (EVM)",
          "version": "1.0.0",
          "platformVersion": "1",
          "triggers": [
            {
              "key": "genericAbiTrigger",
              "name": "Listen For Smart Contract Event",
              "display": {
                "label": "Listen For Smart Contract Event",
                "description": "Listen For Smart Contract Event",
                "instructions": "",
                "featured": false
              }
            }
          ],
          "actions": [
            {
              "key": "genericAbiAction",
              "name": "Call Custom Smart Contract Function",
              "display": {
                "label": "Call Custom Smart Contract Function",
                "description": "Call Custom Smart Contract Function",
                "instructions": "",
                "featured": false
              }
            }
          ],
          "icon": "data:image/png;base64,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",
          "type": "web3",
          "access": "Public",
          "user": "eip155:1:0x4245cd11b5a9E54F57bE19B643E564AA4Ee86D1b",
          "workspace": "ws-499e41a8-c813-4d6a-aaa8-4ecf686e5e9d",
          "description": ""
        },
        {
          "key": "evmWallet",
          "name": "EVM Wallet",
          "version": "1.0.0",
          "platformVersion": "1.0.0",
          "triggers": [
            {
              "key": "newTransaction",
              "name": "New Transaction",
              "display": {
                "label": "New Transaction",
                "description": "Triggers when a new transaction occurs",
                "instructions": "",
                "featured": false
              }
            }
          ],
          "actions": [
            {
              "key": "balanceOfActionNative",
              "name": "Balance Of",
              "display": {
                "label": "Balance Of",
                "description": "Balance Of",
                "instructions": "",
                "featured": false
              }
            }
          ],
          "icon": "data:image/png;base64,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",
          "type": "web3",
          "user": "eip155:1:0x4245cd11b5a9E54F57bE19B643E564AA4Ee86D1b",
          "workspace": "ws-499e41a8-c813-4d6a-aaa8-4ecf686e5e9d",
          "access": "Public"
        },
        {
          "key": "flow",
          "name": "Flow",
          "version": "1.0.0",
          "platformVersion": "1.0.0",
          "triggers": [
            {
              "key": "TokenTransferTrigger",
              "name": "Token Transfer",
              "display": {
                "label": "Token Transfer",
                "description": "Tranfer a token",
                "instructions": "",
                "featured": false
              }
            },
            {
              "key": "NFTTransferTrigger",
              "name": "NFT Transfer",
              "display": {
                "label": "NFT Transfer",
                "description": "Transfer an NFT",
                "instructions": "",
                "featured": false
              }
            },
            {
              "key": "NFTMintingTrigger",
              "name": "NFT Minting",
              "display": {
                "label": "NFT Minting",
                "description": "Mint an NFT",
                "instructions": "",
                "featured": false
              }
            }
          ],
          "actions": [
            {
              "key": "transferFlowToken",
              "name": "Transfer Flow Token",
              "display": {
                "label": "Transfer Flow Token",
                "description": "Transfer Flow Token"
              }
            }
          ],
          "authentication": {
            "type": "oauth2",
            "test": {
              "method": "POST",
              "url": "http://grindery-nexus-orchestrator:3000/webhook/web3/callSmartContract/echo?_grinderyEnvironment=staging",
              "headers": {
                "Content-Type": "application/json"
              },
              "body": "{\"address\":\"{{ auth.address }}\"}"
            },
            "defaultDisplayName": "{{ auth.address }}",
            "authenticatedRequestTemplate": {
              "headers": {
                "Content-Type": "application/json"
              },
              "body": "{\"address\":\"{{ auth.address }}\"}"
            },
            "allowedHosts": [
              "grindery-nexus-orchestrator:3000"
            ],
            "oauth2Config": {
              "authorizeUrl": "https://microsites.grindery.org/grindery-nexus-connector-web3-microsite/?path=flow&_grinderyEnvironment=staging",
              "getAccessToken": {
                "method": "POST",
                "url": "http://grindery-nexus-orchestrator:3000/webhook/web3/callSmartContract/flowCreateAccountComplete?_grinderyEnvironment=staging",
                "headers": {
                  "Content-Type": "application/json"
                },
                "body": "{\"code\":\"{{ code }}\"}"
              }
            }
          },
          "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAvCAYAAABzJ5OsAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAT/SURBVHgBzZpNbBtFFMf/u3aTpfnwVoKkl7RGQhUiLQmHShUC1b0lhIikF0CqRDgQ0vZgiipAvTQFKbRSpRYkSgWHphItzaUKKojccKGqkAJqTCgH4GCSS6Ac1qEG09Re3pvYwXZ2dr2bsZOftNrJzOzmzex78+a9sQYFPGiYsZCGbltHlwZ0w4YJDdFiuw1YVJ+iAl/XczZm/sxaCawRDQERAofwHAk2RC8x4Z8UPZuw7+G9O0vWDALgW/iC0MepGIM6ErkcTvj9GlULv9Uwo3YIF6BW6DLoS4zrNIiFrJWqpn+omk7tD5hxEvwKjfRR1BBhLzoGNjcY6b+Xsp6q5Cl8e5N5ht46Si82UB9M+l8DTZsMZJay1906ugrf1mReoBeNYB3QNMSaGowoDeAzWR+p8AXBh7COsBq5DcBReFaV9ZrxSsQAJCq0arVh4ySjOYsa0WpGEIm0uvaZ/21+VR05wME//rImS+vKhOflMB/CrYBOR0rH9m145dAIep/tE2Uvdnd20QDmKqstLYcnSpfRcGkrCX5cteBvnxrD8OGDUIBJs3+G7oPFihXh2zabA6oN9OqX1/Dk009BGRoGtjabsYW7y55YX6nXEIdCeMaVCl7AtsXWRCCE5/0KFLr95w+8qEpVnIjx7HNBCK+H8BIUMnyoZoIL8vnliRY6r9n0R+DNcTm8mnQ+vkvafvObG+JyI22lXdsLKj4aFipTEjislc5dO6VtE59cRnzkMBRgPrTJ7NY5AoJCdrrM+kfnzkMVehixsK1h71o0xsljOjgYAffr2N6xqj6dXsSih6pUwiFnOIjKsMDD5DF5KaxcDk+PnRQe0onp20lHD8s2sL+3H36gCY+ywUb9PNTT/wze//CcGMA6E9X9bAeOHnsT459e2giCC/RqO/KMHz32FjYQ0aqFf+fku9hgpHSRCPKA3X01W9l6o1G4d0tE7S647Q4X02lcIefD96Bw8DFx6TJ8kgjTzCfh4ahkjmd+bg77e/rFvQgbtcw2JEFGUJI67Wtc8yOtkYi4nLj59Y0ywetKnnReCyFQnlDg4Jo7ttXHNvL3kdA5KuEsrqwT67JMn3sqYlIuuwUgClUmxcnZ5S0xcJFu0kjqxx9mHYWKkDqxy5/6/Avan6TR29cndWBe22A/cHaZ7yJv09JoZOEav2ro7e+Ttj6yY4cw6kZDnhE8PXYKt2dnoQJKxg7evZ+1VrSWEk1fwSUUnP4pGVif2ah3P9YFRSR+z1j7uFAagJ9we+LlFw4gKPFXlQQggjxwpFheEb6QTkjIHmK9DxIF8TOq9J3z93cy/5+i+M6YsepcnbrmqUKsKjzjCg01RRmzfaUZs7JEKxtBc4PxLxV7ZG/gZfPjD84Llx7hKIquoqFy2/fT34n2N+Kv49eff4EqaEKPLPxTfuzjGAG2N5tn6RtVnYQqeuC17G/cYHsktR5dVS97gDZs49SoNJ8TBPZBCxlryKlNerhA+fBJSuw/7LXjrCVugjOuxzo8gOZGYwsV96DOCFXJWK+59fE8UMvcy06REadpmdpTj0M13mfR+n2QBPc84KjqKJO+wLctIWOCciVbaqxGCXL9vZWrigzf+aa2Fsrj58VKFIM6EoUVJeHnocDJMk4z520MUTCzN0jiqvBjiosk9KRfoYsoyQ3zQOwcqROlDu3lgUTLvDQF+VTPMcMMfbUkB0BBBS7lP15/tJ6iE8HwAAAAAElFTkSuQmCC",
          "type": "web3",
          "description": "",
          "user": "eip155:1:0x4245cd11b5a9E54F57bE19B643E564AA4Ee86D1b",
          "workspace": "ws-499e41a8-c813-4d6a-aaa8-4ecf686e5e9d",
          "access": "Public"
        },
        {
          "key": "juicebox",
          "name": "Juicebox",
          "version": "1.0.0",
          "platformVersion": "1.0.0",
          "type": "web3",
          "triggers": [
            {
              "key": "newContribution",
              "name": "New Contribution",
              "display": {
                "label": "New Contribution",
                "description": "New Contribution"
              }
            }
          ],
          "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAL4SURBVHgBxVdBTxpBFH7YHuhJTHrgBia9w63e0PRQb/gLQNO7qL0r+gOU9NBokwp4b5TeaNLo9lwj3CRpI9xq0kS4cWgyfd8Ls1lXZhlkDV8y2WFnZ973vjfz5hEhIkVTxAxNGaESSKXT9Pvmhi6vrii/ukqxWMxqngqrfT8/V/+UUn/v7uTJZNRxuaySyWTQvPAIwDBIoM8KuITQAoiEY5zlF0P7pdK995nFRXVcqbgkJiYALzi2D96vb2yIkezKyljzIpqFCdhI7AVls1l5drtdabwgtdttajab8szn87IJX87NybgtnnErmga3d3bo4+Eh/bm9pXanQ61Wi77V61Sr1Whrc5O+8hPG4vG47Hrg9cICRSIR6g2IjoJRAXj4k48TFtKeOhcX0ocqGE9w6/BvGFovFOikWnWJz/I3r+bnR5IwKgA5X0Sj9GZpiX44DvX7fQkBpOZ4i9e9Xo9a19eUY+/h+dvlZYrynDqrhP6no6ORBJ4HDUJ2ebKXaLWzM/Eci4Ig+jkmlMlk6N3amvQRFhCFMjYwEsDifkD6z+WyqIJwOIP3MArjAMJCSglhGxhTMWLo9+LL6akbZy9g7D1vyjSrAuOO45AtjAT8eXz/4EBUgefDABI4GXwEJFS2CNwDegNhV2Pj4Tf6Xni9heFxjAcSgALa4Hax6L7LDc47sLe7S5MiMATSOLPBK0jfbDTcceyPvQGxSTAyBFssvQb2wC++7wGJdwgYqyDB+QZOKpWxYx0KAZx1kd4y9ja5wBgCfwqF/FAAGc+78Oxgr/hhW47NBBHwZkOdXqssv5/YkxHwAvIjBfuRGJKyx4GRAK5hvTi81IWHH+lUauh8fZE9moCEIJGQPuL8oVR68A1uRJMCeu6jCSDpwABij/4w7wueHOGFzqK2MBagKK35BpT6Hk8UnqhyUWDy5eSW3PgO36PoxPhloyHfkkWRO7Io1dBqoPjAnsBvDTdF802IlI1w2dYD1gSGwXtMu5ZFaKgEwsDU/x3/B4oyJBfnDg9WAAAAAElFTkSuQmCC"
        },
        {
          "key": "molochOnXDai",
          "name": "MolochDAO",
          "version": "1.0.0",
          "platformVersion": "1.0.0",
          "triggers": [
            {
              "key": "SummonCompleteTrigger",
              "name": "Summon Complete",
              "display": {
                "label": "Summon Complete",
                "description": "Summon Complete"
              }
            },
            {
              "key": "SubmitProposalTrigger",
              "name": "Submit Proposal",
              "display": {
                "label": "Submit Proposal",
                "description": "Submit Proposal"
              }
            },
            {
              "key": "SponsorProposalTrigger",
              "name": "Sponsor Proposal",
              "display": {
                "label": "Sponsor Proposal",
                "description": "Sponsor Proposal"
              }
            },
            {
              "key": "SubmitVoteTrigger",
              "name": "Submit Vote",
              "display": {
                "label": "Submit Vote",
                "description": "Submit Vote"
              }
            },
            {
              "key": "ProcessProposalTrigger",
              "name": "Process Proposal",
              "display": {
                "label": "Process Proposal",
                "description": "Process a proposal",
                "instructions": "Process a proposal",
                "featured": false
              }
            },
            {
              "key": "ProcessWhitelistProposalTrigger",
              "name": "Process Whitelist Proposal",
              "display": {
                "label": "Process Whitelist Proposal",
                "description": "Process a whitelist proposal",
                "instructions": "Process a whitelist proposal",
                "featured": false
              }
            },
            {
              "key": "ProcessGuildKickProposalTrigger",
              "name": "Process Guild Kick Proposal",
              "display": {
                "label": "Process Guild Kick Proposal",
                "description": "Process Guild Kick Proposal"
              }
            },
            {
              "key": "RagequitTrigger",
              "name": "RageQuit",
              "display": {
                "label": "RageQuit",
                "description": "RageQuit",
                "instructions": "RageQuit",
                "featured": false
              }
            },
            {
              "key": "TokensCollectedTrigger",
              "name": "Tokens Collected",
              "display": {
                "label": "Tokens Collected",
                "description": "Tokens Collected"
              }
            },
            {
              "key": "CancelProposalTrigger",
              "name": "Cancel Proposal",
              "display": {
                "label": "Cancel Proposal",
                "description": "Cancel Proposal"
              }
            },
            {
              "key": "UpdateDelegateKeyTrigger",
              "name": "Update Delegate Key",
              "display": {
                "label": "Update Delegate Key",
                "description": "Update Delegate Key"
              }
            },
            {
              "key": "WithdrawTrigger",
              "name": "Withdraw",
              "display": {
                "label": "Withdraw",
                "description": "Withdraw"
              }
            }
          ],
          "actions": [
            {
              "key": "proposalsAction",
              "name": "Proposals (View Function)",
              "display": {
                "label": "Proposals (View Function)",
                "description": "Proposals (View Function)",
                "instructions": "Proposals (View Function)",
                "featured": false
              }
            },
            {
              "key": "processingRewardAction",
              "name": "Processing Reward (View Function)",
              "display": {
                "label": "Processing Reward (View Function)",
                "description": "Processing Reward (View Function)",
                "instructions": "Processing Reward (View Function)",
                "featured": false
              }
            },
            {
              "key": "getMemberProposalVoteAction",
              "name": "Get Member Proposal Vote (View Function)",
              "display": {
                "label": "Get Member Proposal Vote (View Function)",
                "description": "Get Member Proposal Vote (View Function)",
                "instructions": "Get Member Proposal Vote (View Function)",
                "featured": false
              }
            },
            {
              "key": "getCurrentPeriodAction",
              "name": "Get Current Period (View Function)",
              "display": {
                "label": "Get Current Period (View Function)",
                "description": "Get Current Period (View Function)",
                "instructions": "Get Current Period (View Function)",
                "featured": false
              }
            },
            {
              "key": "membersAction",
              "name": "Members (View Function)",
              "display": {
                "label": "Members (View Function)",
                "description": "Members (View Function)",
                "instructions": "Members (View Function)",
                "featured": false
              }
            },
            {
              "key": "withdrawBalanceAction",
              "name": "Withdraw Balance",
              "display": {
                "label": "Withdraw Balance",
                "description": "Withdraw Balance"
              }
            },
            {
              "key": "submitGuildKickProposalAction",
              "name": "Submit Guild Kick Proposal",
              "display": {
                "label": "Submit Guild Kick Proposal",
                "description": "Submit Guild Kick Proposal"
              }
            },
            {
              "key": "ragequitAction",
              "name": "RageQuit",
              "display": {
                "label": "RageQuit",
                "description": "RageQuit",
                "instructions": "RageQuit",
                "featured": false
              }
            },
            {
              "key": "approvedTokensAction",
              "name": "Approved Tokens (View Function)",
              "display": {
                "label": "Approved Tokens (View Function)",
                "description": "Approved Tokens (View Function)",
                "instructions": "Approved Tokens (View Function)",
                "featured": false
              }
            },
            {
              "key": "updateDelegateKeyAction",
              "name": "Update Delegate Key",
              "display": {
                "label": "Update Delegate Key",
                "description": "Update Delegate Key"
              }
            },
            {
              "key": "TOTALAction",
              "name": "TOTAL (View Function)",
              "display": {
                "label": "TOTAL (View Function)",
                "description": "TOTAL (View Function)",
                "instructions": "TOTAL (View Function)",
                "featured": false
              }
            },
            {
              "key": "processWhitelistProposalAction",
              "name": "Process Whitelist proposal",
              "display": {
                "label": "Process Whitelist proposal",
                "description": "Process a whitelist proposal",
                "instructions": "Process a whitelist proposal",
                "featured": false
              }
            },
            {
              "key": "totalSharesAction",
              "name": "Total Shares (View Function)",
              "display": {
                "label": "Total Shares (View Function)",
                "description": "Total Shares (View Function)",
                "instructions": "Total Shares (View Function)",
                "featured": false
              }
            },
            {
              "key": "proposalQueueAction",
              "name": "Proposal Queue (View Function)",
              "display": {
                "label": "Proposal Queue (View Function)",
                "description": "Proposal Queue (View Function)",
                "instructions": "Proposal Queue (View Function)",
                "featured": false
              }
            },
            {
              "key": "proposedToKickAction",
              "name": "Proposed To Kick (View Function)",
              "display": {
                "label": "Proposed To Kick (View Function)",
                "description": "Proposed To Kick (View Function)",
                "instructions": "Proposed To Kick (View Function)",
                "featured": false
              }
            },
            {
              "key": "memberAddressByDelegateKeyAction",
              "name": "Member Address By Delegate Key (View Function)",
              "display": {
                "label": "Member Address By Delegate Key (View Function)",
                "description": "Member Address By Delegate Key (View Function)",
                "instructions": "Member Address By Delegate Key (View Function)",
                "featured": false
              }
            },
            {
              "key": "withdrawBalancesAction",
              "name": "Withdraw Balances",
              "display": {
                "label": "Withdraw Balances",
                "description": "Withdraw Balances"
              }
            },
            {
              "key": "userTokenBalancesAction",
              "name": "User Token Balances (View Function)",
              "display": {
                "label": "User Token Balances (View Function)",
                "description": "User Token Balances (View Function)",
                "instructions": "User Token Balances (View Function)",
                "featured": false
              }
            },
            {
              "key": "submitProposalAction",
              "name": "Submit Proposal",
              "display": {
                "label": "Submit Proposal",
                "description": "Submit a proposal",
                "instructions": "Submit a proposal",
                "featured": false
              }
            },
            {
              "key": "collectTokensAction",
              "name": "Collect Tokens",
              "display": {
                "label": "Collect Tokens",
                "description": "Collect Tokens"
              }
            },
            {
              "key": "totalLootAction",
              "name": "Total Loot (View Function)",
              "display": {
                "label": "Total Loot (View Function)",
                "description": "Total Loot (View Function)",
                "instructions": "Total Loot (View Function)",
                "featured": false
              }
            },
            {
              "key": "gracePeriodLengthAction",
              "name": "Grace Period Length (View Function)",
              "display": {
                "label": "Grace Period Length (View Function)",
                "description": "Grace Period Length (View Function)",
                "instructions": "Grace Period Length (View Function)",
                "featured": false
              }
            },
            {
              "key": "getUserTokenBalanceAction",
              "name": "Get User Token Balance (View Function)",
              "display": {
                "label": "Get User Token Balance (View Function)",
                "description": "Get User Token Balance (View Function)",
                "instructions": "Get User Token Balance (View Function)",
                "featured": false
              }
            },
            {
              "key": "tokenWhitelistAction",
              "name": "Token Whitelist (View Function)",
              "display": {
                "label": "Token Whitelist (View Function)",
                "description": "Token Whitelist (View Function)",
                "instructions": "Token Whitelist (View Function)",
                "featured": false
              }
            },
            {
              "key": "getTokenCountAction",
              "name": "Get Token Count (View Function)",
              "display": {
                "label": "Get Token Count (View Function)",
                "description": "Get Token Count (View Function)",
                "instructions": "Get Token Count (View Function)",
                "featured": false
              }
            },
            {
              "key": "getProposalQueueLengthAction",
              "name": "Get Proposal Queue Length (View Function)",
              "display": {
                "label": "Get Proposal Queue Length (View Function)",
                "description": "Get Proposal Queue Length (View Function)",
                "instructions": "Get Proposal Queue Length (View Function)",
                "featured": false
              }
            },
            {
              "key": "summoningTimeAction",
              "name": "Summoning Time (View Function)",
              "display": {
                "label": "Summoning Time (View Function)",
                "description": "Summoning Time (View Function)",
                "instructions": "Summoning Time (View Function)",
                "featured": false
              }
            },
            {
              "key": "votingPeriodLengthAction",
              "name": "Voting Period Length (View Function)",
              "display": {
                "label": "Voting Period Length (View Function)",
                "description": "Voting Period Length (View Function)",
                "instructions": "Voting Period Length (View Function)",
                "featured": false
              }
            },
            {
              "key": "proposalDepositAction",
              "name": "Proposal Deposit (View Function)",
              "display": {
                "label": "Proposal Deposit (View Function)",
                "description": "Proposal Deposit (View Function)",
                "instructions": "Proposal Deposit (View Function)",
                "featured": false
              }
            },
            {
              "key": "hasVotingPeriodExpiredAction",
              "name": "Has Voting Period Expired (View Function)",
              "display": {
                "label": "Has Voting Period Expired (View Function)",
                "description": "Has Voting Period Expired (View Function)",
                "instructions": "Has Voting Period Expired (View Function)",
                "featured": false
              }
            },
            {
              "key": "sponsorProposalAction",
              "name": "Sponsor Proposal",
              "display": {
                "label": "Sponsor Proposal",
                "description": "Sponsor Proposal"
              }
            },
            {
              "key": "submitVoteAction",
              "name": "Submit Vote",
              "display": {
                "label": "Submit Vote",
                "description": "Submit Vote"
              }
            },
            {
              "key": "totalGuildBankTokensAction",
              "name": "Total Guild Bank Tokens (View Function)",
              "display": {
                "label": "Total Guild Bank Tokens (View Function)",
                "description": "Total Guild Bank Tokens (View Function)",
                "instructions": "Total Guild Bank Tokens (View Function)",
                "featured": false
              }
            },
            {
              "key": "canRagequitAction",
              "name": "Can RageQuit (View Function)",
              "display": {
                "label": "Can RageQuit (View Function)",
                "description": "Can RageQuit (View Function)",
                "instructions": "Can RageQuit (View Function)",
                "featured": false
              }
            },
            {
              "key": "initAction",
              "name": "Init",
              "display": {
                "label": "Init",
                "description": "Init"
              }
            },
            {
              "key": "dilutionBoundAction",
              "name": "Dilution Bound (View Function)",
              "display": {
                "label": "Dilution Bound (View Function)",
                "description": "Dilution Bound (View Function)",
                "instructions": "Dilution Bound (View Function)",
                "featured": false
              }
            },
            {
              "key": "getProposalFlagsAction",
              "name": "Get Proposal Flags (View Function)",
              "display": {
                "label": "Get Proposal Flags (View Function)",
                "description": "Get Proposal Flags (View Function)",
                "instructions": "Get Proposal Flags (View Function)",
                "featured": false
              }
            },
            {
              "key": "memberListAction",
              "name": "Member List (View Function)",
              "display": {
                "label": "Member List (View Function)",
                "description": "Member List (View Function)",
                "instructions": "Member List (View Function)",
                "featured": false
              }
            },
            {
              "key": "periodDurationAction",
              "name": "Period Duration (View Function)",
              "display": {
                "label": "Period Duration (View Function)",
                "description": "Period Duration (View Function)",
                "instructions": "Period Duration (View Function)",
                "featured": false
              }
            },
            {
              "key": "depositTokenAction",
              "name": "Deposit Token (View Function)",
              "display": {
                "label": "Deposit Token (View Function)",
                "description": "Deposit Token (View Function)",
                "instructions": "Deposit Token (View Function)",
                "featured": false
              }
            },
            {
              "key": "proposalCountAction",
              "name": "Proposal Count (View Function)",
              "display": {
                "label": "Proposal Count (View Function)",
                "description": "Proposal Count (View Function)",
                "instructions": "Proposal Count (View Function)",
                "featured": false
              }
            },
            {
              "key": "ragekickAction",
              "name": "RageKick",
              "display": {
                "label": "RageKick",
                "description": "RageKick",
                "instructions": "RageKick",
                "featured": false
              }
            },
            {
              "key": "cancelProposalAction",
              "name": "Cancel Proposal",
              "display": {
                "label": "Cancel Proposal",
                "description": "Cancel a proposal",
                "instructions": "Cancel a proposal",
                "featured": false
              }
            },
            {
              "key": "proposedToWhitelistAction",
              "name": "Proposed To Whitelist (View Function)",
              "display": {
                "label": "Proposed To Whitelist (View Function)",
                "description": "Proposed To Whitelist (View Function)",
                "instructions": "Proposed To Whitelist (View Function)",
                "featured": false
              }
            },
            {
              "key": "processGuildKickProposalAction",
              "name": "Process Guild Kick Proposal",
              "display": {
                "label": "Process Guild Kick Proposal",
                "description": "Process Guild Kick Proposal"
              }
            },
            {
              "key": "processProposalAction",
              "name": "Process Proposal",
              "display": {
                "label": "Process Proposal",
                "description": "Process a proposal",
                "instructions": "Process a proposal",
                "featured": false
              }
            },
            {
              "key": "ESCROWAction",
              "name": "ESCROW (View Function)",
              "display": {
                "label": "ESCROW (View Function)",
                "description": "ESCROW (View Function)",
                "instructions": "ESCROW (View Function)",
                "featured": false
              }
            },
            {
              "key": "GUILDAction",
              "name": "GUILD (View Function)",
              "display": {
                "label": "GUILD (View Function)",
                "description": "GUILD (View Function)",
                "instructions": "GUILD (View Function)",
                "featured": false
              }
            },
            {
              "key": "submitWhitelistProposalAction",
              "name": "Submit Whitelist Proposal",
              "display": {
                "label": "Submit Whitelist Proposal",
                "description": "Submit Whitelist Proposal"
              }
            }
          ],
          "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAYCAYAAAAPtVbGAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAPYSURBVHgBpVVNaF1FFD7zf99LatLEgC1dxJa48IFUzE6EJ4KooAmVuHCTgiCIP3FbsFDBnaB0LVRdCK5EXApaNy4KpaWLdtekpbS7NqU0NHn35/Q799173+S9V9KfgXPvzJmZ880555szRHu3LuRnr/QG/psQFnFKX9TQo79Mz9DWaqNOa9ZKlcZjcdrU/XXIKj1Bm4ecrQ0ZGE+MHQEQ8QBpGcNqoPu32r8nwEZs6LNkAkbUWBAxfjJpxyC1V48Emh4G8AjThk94Cv9xIBZe3nSBX7Ajnq5X9kbaj/FCCdOb3nOhHL/t3FiQeYQx05Y/B9CYnP0wLky7FkkePg0t3tGOF+14EPEww/x563lu1JuC+swkXYGcihHBGkoQ6PcUPpCtcs9o67FYUrSAfwtitY6nsZmWYpClZgZGFYzeyzLaynJiZjpGZgRgv9L0UQilgSvYc7vIS3qo0nbTVqnKTXd3mEwT3w7ClCvLm8bzhyBAvO5EkvCF1iT/M7GPj/nQsE0oPRwyOcjRGtbgdLmEgPvhuZyl9LvRNJXndAYn/diFUr9iA32d5nT0wTbptEe6Wi/fFH23O2zzVOWjuVw0lNz34U0Pyd0Gy1LIHzbwbTBqR4ne8pfwcnhPeUEHbDvVQEqymYsGvmMMTuwQZE3vGkWv4qr8BK+W4NFfmFvEeNVY8tCtGEdH9CBv23lByWBcunm8j26bWjQDal4C9wuy/JtxzY1HOPmWb3FQ/cupof8b84Uy/L9vc1LpA/Yn/dzIqdfEk2slOk4ouUhwsnsAfz1PadkquoJxTeAWenPIz/6IQOfg1Tvw9I30AeXQwzhl2LCTN1G5RBXFNidxodrwRle3XfIjZeUgbvtbhw7xK7PPo7wb/sYl3IJ+YW6OPzhwkPfBE1eeHHtVv1pPiq7vyR0BEE/uQn69n/VK3xzi7MD7DMGSMUJDN7a26IvpaTo8M0Xfpdt0YGaWTrYn6HqeyV0tPd1B32tFeHcoxc4UHqP9SVHrUsNzW55GYhogL2L8FbxUQ7VJ1nyPCgy7pRfB6HJNdE+Kmr41u/6DnJYZ8QDhAkNy6kEYMX5NdvHu0iLjTsE4vUE+szIHeC1Rarhm1Ok633FrSr3kwtUMwum+DcnYt+QE9DHzosftKj2i1BNFj5aETam+wZed51mMP5EHCqArKCPzqLoLlVE5iFH6sR6tGOiseBKa+Cp+KQReROk/DIBuq80LwTcvoqzDnZEcPNbzG7fjoOaGr4Cm8O+gKB7xjjsI03OV3ipdwAuh6ho9bfOGlsGOX9C9SIOciNF16M9MW9vdy8ZD70rmn2OilNoAAAAASUVORK5CYII=",
          "type": "web3",
          "user": "eip155:1:0x4245cd11b5a9E54F57bE19B643E564AA4Ee86D1b",
          "workspace": "ws-499e41a8-c813-4d6a-aaa8-4ecf686e5e9d",
          "access": "Public"
        },
        {
          "key": "multis",
          "name": "multis",
          "version": "1.0.0",
          "platformVersion": "1.0.0",
          "type": "web3",
          "triggers": [
            {
              "key": "newDeposit",
              "name": "New Deposit",
              "display": {
                "label": "New Deposit",
                "description": "New Deposit"
              }
            }
          ],
          "actions": [
            {
              "key": "requestWithdrawal",
              "name": "Request withdrawal",
              "display": {
                "label": "Request withdrawal",
                "description": "Request withdrawal"
              }
            }
          ],
          "icon": "data:image/png;base64,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"
        },
        {
          "key": "near",
          "name": "NEAR Protocol",
          "version": "1.0.0",
          "platformVersion": "1.0.0",
          "triggers": [
            {
              "key": "newTransaction",
              "name": "Wallet Transfer",
              "display": {
                "label": "Wallet Transfer",
                "description": "",
                "instructions": "",
                "featured": false
              }
            },
            {
              "key": "TokenTransferTrigger",
              "name": "Token Transfer",
              "display": {
                "label": "Token Transfer",
                "description": "Transfer a token",
                "instructions": "",
                "featured": false
              }
            },
            {
              "key": "NFTTransferTrigger",
              "name": "NFT Transfer",
              "display": {
                "label": "NFT Transfer",
                "description": "Transfer an NFT",
                "instructions": "",
                "featured": false
              }
            }
          ],
          "actions": [
            {
              "key": "NFTMint",
              "name": "Mint NFT",
              "display": {
                "label": "Mint NFT",
                "description": ""
              }
            }
          ],
          "icon": "data:image/png;base64,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",
          "type": "web3",
          "description": "",
          "user": "eip155:1:0x4245cd11b5a9E54F57bE19B643E564AA4Ee86D1b",
          "workspace": "ws-499e41a8-c813-4d6a-aaa8-4ecf686e5e9d",
          "access": "Public"
        },
        {
          "key": "nftmint",
          "name": "EVM Mint-721",
          "version": "1.0.0",
          "platformVersion": "1.0.0",
          "type": "web3",
          "actions": [
            {
              "key": "evmMint",
              "name": "EVM Mint",
              "display": {
                "label": "EVM Mint",
                "description": "EVM Mint"
              }
            }
          ],
          "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAL4SURBVHgBxVdBTxpBFH7YHuhJTHrgBia9w63e0PRQb/gLQNO7qL0r+gOU9NBokwp4b5TeaNLo9lwj3CRpI9xq0kS4cWgyfd8Ls1lXZhlkDV8y2WFnZ973vjfz5hEhIkVTxAxNGaESSKXT9Pvmhi6vrii/ukqxWMxqngqrfT8/V/+UUn/v7uTJZNRxuaySyWTQvPAIwDBIoM8KuITQAoiEY5zlF0P7pdK995nFRXVcqbgkJiYALzi2D96vb2yIkezKyljzIpqFCdhI7AVls1l5drtdabwgtdttajab8szn87IJX87NybgtnnErmga3d3bo4+Eh/bm9pXanQ61Wi77V61Sr1Whrc5O+8hPG4vG47Hrg9cICRSIR6g2IjoJRAXj4k48TFtKeOhcX0ocqGE9w6/BvGFovFOikWnWJz/I3r+bnR5IwKgA5X0Sj9GZpiX44DvX7fQkBpOZ4i9e9Xo9a19eUY+/h+dvlZYrynDqrhP6no6ORBJ4HDUJ2ebKXaLWzM/Eci4Ig+jkmlMlk6N3amvQRFhCFMjYwEsDifkD6z+WyqIJwOIP3MArjAMJCSglhGxhTMWLo9+LL6akbZy9g7D1vyjSrAuOO45AtjAT8eXz/4EBUgefDABI4GXwEJFS2CNwDegNhV2Pj4Tf6Xni9heFxjAcSgALa4Hax6L7LDc47sLe7S5MiMATSOLPBK0jfbDTcceyPvQGxSTAyBFssvQb2wC++7wGJdwgYqyDB+QZOKpWxYx0KAZx1kd4y9ja5wBgCfwqF/FAAGc+78Oxgr/hhW47NBBHwZkOdXqssv5/YkxHwAvIjBfuRGJKyx4GRAK5hvTi81IWHH+lUauh8fZE9moCEIJGQPuL8oVR68A1uRJMCeu6jCSDpwABij/4w7wueHOGFzqK2MBagKK35BpT6Hk8UnqhyUWDy5eSW3PgO36PoxPhloyHfkkWRO7Io1dBqoPjAnsBvDTdF802IlI1w2dYD1gSGwXtMu5ZFaKgEwsDU/x3/B4oyJBfnDg9WAAAAAElFTkSuQmCC",
          "description": "",
          "user": "eip155:1:0x4245cd11b5a9E54F57bE19B643E564AA4Ee86D1b",
          "workspace": "ws-499e41a8-c813-4d6a-aaa8-4ecf686e5e9d",
          "access": "Public"
        },
        {
          "key": "nftmints",
          "name": "EVM Mint-1155",
          "version": "1.0.0",
          "platformVersion": "1.0.0",
          "type": "web3",
          "actions": [
            {
              "key": "evmMint",
              "name": "EVM Mint",
              "display": {
                "label": "EVM Mint",
                "description": "EVM Mint"
              }
            }
          ],
          "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAL4SURBVHgBxVdBTxpBFH7YHuhJTHrgBia9w63e0PRQb/gLQNO7qL0r+gOU9NBokwp4b5TeaNLo9lwj3CRpI9xq0kS4cWgyfd8Ls1lXZhlkDV8y2WFnZ973vjfz5hEhIkVTxAxNGaESSKXT9Pvmhi6vrii/ukqxWMxqngqrfT8/V/+UUn/v7uTJZNRxuaySyWTQvPAIwDBIoM8KuITQAoiEY5zlF0P7pdK995nFRXVcqbgkJiYALzi2D96vb2yIkezKyljzIpqFCdhI7AVls1l5drtdabwgtdttajab8szn87IJX87NybgtnnErmga3d3bo4+Eh/bm9pXanQ61Wi77V61Sr1Whrc5O+8hPG4vG47Hrg9cICRSIR6g2IjoJRAXj4k48TFtKeOhcX0ocqGE9w6/BvGFovFOikWnWJz/I3r+bnR5IwKgA5X0Sj9GZpiX44DvX7fQkBpOZ4i9e9Xo9a19eUY+/h+dvlZYrynDqrhP6no6ORBJ4HDUJ2ebKXaLWzM/Eci4Ig+jkmlMlk6N3amvQRFhCFMjYwEsDifkD6z+WyqIJwOIP3MArjAMJCSglhGxhTMWLo9+LL6akbZy9g7D1vyjSrAuOO45AtjAT8eXz/4EBUgefDABI4GXwEJFS2CNwDegNhV2Pj4Tf6Xni9heFxjAcSgALa4Hax6L7LDc47sLe7S5MiMATSOLPBK0jfbDTcceyPvQGxSTAyBFssvQb2wC++7wGJdwgYqyDB+QZOKpWxYx0KAZx1kd4y9ja5wBgCfwqF/FAAGc+78Oxgr/hhW47NBBHwZkOdXqssv5/YkxHwAvIjBfuRGJKyx4GRAK5hvTi81IWHH+lUauh8fZE9moCEIJGQPuL8oVR68A1uRJMCeu6jCSDpwABij/4w7wueHOGFzqK2MBagKK35BpT6Hk8UnqhyUWDy5eSW3PgO36PoxPhloyHfkkWRO7Io1dBqoPjAnsBvDTdF802IlI1w2dYD1gSGwXtMu5ZFaKgEwsDU/x3/B4oyJBfnDg9WAAAAAElFTkSuQmCC",
          "description": "",
          "user": "eip155:1:0x4245cd11b5a9E54F57bE19B643E564AA4Ee86D1b",
          "workspace": "ws-499e41a8-c813-4d6a-aaa8-4ecf686e5e9d",
          "access": "Public"
        },
        {
          "key": "parcel",
          "name": "Parcel",
          "version": "1.0.0",
          "platformVersion": "1.0.0",
          "type": "web3",
          "triggers": [
            {
              "key": "newDeposit",
              "name": "New Deposit",
              "display": {
                "label": "New Deposit",
                "description": "New Deposit"
              }
            }
          ],
          "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAAAAAB3tzPbAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAANnSURBVHja7ZxRcdxAEEQF4SAcBEM4CIZwEMwgyyBmkDCIGQhCxOAgGILylYpjS7M9sztSb1X3/+re+5DvtrvK06QoiqIoiqIoiqIoiqIoiqIoiqJ8zO1+G5r/27quvy5j86/r78vY/OMa/OUf1eAf/5gGH/lHNPiffzyDz/yjGXzlH8tgi38kg23+cQz2+Ecx2Ocfw8DiH8HA5uc3qPGzG9T5uQ0QfmYDjJ/XAOVnNcD5OQ08/IwGPn4+Ay8/m4Gfn8vA4J9HMDD4y1T4DUz+id+gwk9vUOUnNwD4qQ0gfmIDkJ/WAOYnNXDwUxq4+AkNnPx0Bm5+MoMAP5VBiJ/IIMhPYxDmJzFo4KcwaOInMGjkP93A4P8OPuL1TAOrf3h/gh5xWU7sKuz+BDIw+bMNav0PYFDhzzWo91dVgyp/pgHSv1UMAP48A6w/NA0g/iwDtP80DED+HAO8v901gPkzDDz9846Bg7+/ga8/3zRw8fc28Pb/GwZO/r4G/v3ii4Gbv6dBZH/5ZBDg72dg8L8+MAOLP33DMX//XyEDiz99w6ncXxADmz/5hlO9f9UNavypBsD9sWZQ5080gO6/tgHCn2YA3t8tg9uCPSPFAO4fDIP1xA3H0Z9EDNI3HFf/4zdI33Cc/ZXXIH3DcfdvPoP0DSfQH3oM0jecUP+JG6RvOMH+FjVI33Du0f4ZMwhvOGh5PM3h/hwxiG8476jAW7z/rxu0bDiowHPDflEzaNlwfsAvcWnYX2yDlg1ncfwZKuHPnqantf01LI38W09A+c3+Adxwtj5/cX4Vlwz+BoPF/WOoZPCHDZbAz9GSwR80WEIXgpLBHzJYgleyksEfMFjCl+KSwe82WBpqiZLB7zSYm4qh6+3an99hcH0+6h9rOPtz2GDi5KczCOwXVAah/YXIwOJHNxxWfnTD4eWf6A3q/T+3AbJfMBtg+wuvwQXcX1gNUH5WA5yf08DDz2jg4+cz8PKzGfj5uQwi/EwGMX4egyg/jUGYn8TgHuc3DeajBH427ReGwVECpW1/2TV4HPYOP1r49w1eDnuJtwnKYedzDMqB5zMMyqHn+xuUg8/3NiiHn+9rUE4439OgnHK+n0E56Xwvg3La+Q4G8/po+f68vrWdVxRFURRFURRFURRFURRFURRFUU7IH69VdYjG9yRtAAAAAElFTkSuQmCC"
        },
        {
          "key": "safe",
          "name": "Safe",
          "version": "2.0.0",
          "platformVersion": "1.0.0",
          "triggers": [
            {
              "key": "safeTransactionExecutedTransferNative",
              "name": "Transaction executed - Transfer native token",
              "display": {
                "label": "Transaction executed - Transfer native token",
                "description": "",
                "instructions": "",
                "featured": false
              },
              "authentication": "none"
            },
            {
              "key": "safeTransactionExecutedTransferERC20",
              "name": "Transaction executed - Transfer ERC20 token",
              "display": {
                "label": "Transaction executed - Transfer ERC20 token",
                "description": "",
                "instructions": "",
                "featured": false
              },
              "authentication": "none"
            },
            {
              "key": "safeTransactionExecutedAddOwner",
              "name": "Transaction executed - Add owner",
              "display": {
                "label": "Transaction executed - Add owner",
                "description": "",
                "instructions": "",
                "featured": false
              },
              "authentication": "none"
            },
            {
              "key": "safeTransactionExecutedRemoveOwner",
              "name": "Transaction executed - Remove owner",
              "display": {
                "label": "Transaction executed - Remove owner",
                "description": "",
                "instructions": "",
                "featured": false
              },
              "authentication": "none"
            },
            {
              "key": "safeTransactionExecutedThresholdChanged",
              "name": "Transaction executed - Threshold changed",
              "display": {
                "label": "Transaction executed - Threshold changed",
                "description": "",
                "instructions": "",
                "featured": false
              },
              "authentication": "none"
            },
            {
              "key": "safeTransactionExecutedOther",
              "name": "Transaction executed - Other",
              "display": {
                "label": "Transaction executed - Other",
                "description": "",
                "instructions": "",
                "featured": false
              },
              "authentication": "none"
            },
            {
              "key": "safeDepositReceivedNative",
              "name": "Deposit received - Native token",
              "display": {
                "label": "Deposit received - Native token",
                "description": "",
                "instructions": "",
                "featured": false
              },
              "authentication": "none"
            },
            {
              "key": "safeDepositReceivedERC20",
              "name": "Deposit received - ERC20 token",
              "display": {
                "label": "Deposit received - ERC20 token",
                "description": "",
                "instructions": "",
                "featured": false
              },
              "authentication": "none"
            },
            {
              "key": "safeTransactionRejected",
              "name": "Transaction rejected",
              "display": {
                "label": "Transaction rejected",
                "description": "",
                "instructions": "",
                "featured": false
              },
              "authentication": "none"
            },
            {
              "key": "safeTransactionProposed",
              "name": "Transaction created",
              "display": {
                "label": "Transaction created",
                "description": "",
                "instructions": "",
                "featured": false
              },
              "authentication": "none"
            },
            {
              "key": "safeTransactionNewConfirmation",
              "name": "New confirmation on transaction",
              "display": {
                "label": "New confirmation on transaction",
                "description": "",
                "instructions": "",
                "featured": false
              },
              "authentication": "none"
            },
            {
              "key": "safeTransactionRejectionProposed",
              "name": "Transaction rejection proposed",
              "display": {
                "label": "Transaction rejection proposed",
                "description": "",
                "instructions": "",
                "featured": false
              },
              "authentication": "none"
            },
            {
              "key": "safeTransactionRejectionNewConfirmation",
              "name": "New confirmation on rejection",
              "display": {
                "label": "New confirmation on rejection",
                "description": "",
                "instructions": "",
                "featured": false
              },
              "authentication": "none"
            }
          ],
          "actions": [
            {
              "key": "gnosisSafeSimpleTransfer",
              "name": "Transfer to Address",
              "display": {
                "label": "Transfer to Address",
                "description": "Transfer a native token to address",
                "instructions": "Use this to transfer a native token (e.g. ETH) to address",
                "featured": false
              }
            },
            {
              "key": "gnosisSafeSimpleTransferToken",
              "name": "Transfer Token to Address",
              "display": {
                "label": "Transfer Token to Address",
                "description": "Transfer an ERC-20 token to address",
                "instructions": "Use this to transfer an ERC-20 token (e.g. USDC) to address",
                "featured": false
              }
            }
          ],
          "authentication": {
            "type": "oauth2",
            "test": {
              "method": "POST",
              "url": "http://grindery-nexus-orchestrator:3000/webhook/web3/callSmartContract/echo?_grinderyEnvironment=staging",
              "headers": {
                "Content-Type": "application/json"
              },
              "body": "{\"address\":\"{{ auth.safe }}\"}"
            },
            "defaultDisplayName": "[{{ auth.chainName }}] {{ auth.safe }}",
            "authenticatedRequestTemplate": {
              "headers": {
                "Content-Type": "application/json"
              },
              "body": "{\"safe\":\"{{ auth.safe }}\",\"owner\":\"{{ auth.owner }}\",\"chainId\":\"{{ auth.chainId }}\"}"
            },
            "allowedHosts": [
              "grindery-nexus-orchestrator:3000"
            ],
            "oauth2Config": {
              "authorizeUrl": "https://microsites.grindery.org/grindery-nexus-connector-web3-microsite/?path=safe&_grinderyEnvironment=staging",
              "getAccessToken": {
                "method": "POST",
                "url": "http://grindery-nexus-orchestrator:3000/webhook/web3/callSmartContract/clientModeOAuthComplete?_grinderyEnvironment=staging",
                "headers": {
                  "Content-Type": "application/json"
                },
                "body": "{\"code\":\"{{ code }}\"}"
              }
            }
          },
          "icon": "data:image/png;base64,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",
          "type": "web3",
          "user": "eip155:1:0x4245cd11b5a9E54F57bE19B643E564AA4Ee86D1b",
          "workspace": "ws-499e41a8-c813-4d6a-aaa8-4ecf686e5e9d",
          "access": "Public"
        },
        {
          "key": "snapshot",
          "name": "Snapshot",
          "version": "1.0.0",
          "platformVersion": "1.0.0",
          "type": "web3",
          "triggers": [
            {
              "key": "newProposal",
              "name": "New proposal",
              "display": {
                "label": "New proposal",
                "description": "New proposal"
              }
            }
          ],
          "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAABGdBTUEAALGPC/xhBQAAAddQTFRFAAAA//////+A//9V/79A/8wz/9VV/7ZJ/79A/8Y5/7Mz/7lG/79A/7E7/7Y3/69A/7g5/7Mz/7Y9/646/7E3/7U1/7E7/7A1/606/684/601/68z/7E5/6w3/7E0/6wz/7A3/7Az/7E3/681/7E0/60z/7E2/680/7Az/642/7A1/600/601/641/60z/642/681/601/640/641/6w0/642/640/602/641/600/681/680/641/681/601/640/641/600/6wz/640/64z/640/6wz/60z/6w0/600/64z/6wz/600/60z/60z/6w1/600/60z/601/640/60z/64z/601/640/6wz/640/6w0/600/60z/6wz/600/600/60z/6wz/600/600/6w0/60z/600/600/6w0/60z/6w0/600/600/600/60z/6wz/60z/600/6wz/600/6w0/600/60z/6wz/600/60z/6w0/6wz/6wz/60z/6w0/600/6wz/600/6w0/60z/60z/600/60z/6w0/600/60z/60z/6w0/60z/60z/6w0/600/6wz/6wz/60z/6w0/6w0/60z/6wz/6wz/600/6w0/6wz/60z/6wzf3h4DgAAAJx0Uk5TAAECAwQFBgcICQoLDA0OEBIUFRYXGBodHyAiIyQlJygqLS4wMTI0Njc5Ojs+P0FCQ0RFSEpMT1FSVFZZW1xgYmVnaWtucXJzdXZ3eHp8fX5/goOEhoeIiouNjpOVmpyen6ChoqOlqKutr7CxsrW4ub7BwsTFxsfIyszP0tXW2Nnb3d7f4OPl5+jp6+3u7/Hy8/T19vf4+fr7/P3+u3zSywAAAtRJREFUeNrtmWdbU0EQRi8l2AFRUayIBXvH2BU79oYoErtgQQQsKGAXxGhQDEIg82N9bGQ23tw8u8zOfNnzB863u2fe63kOh8PhcDgsUFAX7Tsh6C9uBwDYJ+af9/qXH1qk/Kuiv/3QKOTfMfjHDxtl/DXJv/42EX1+BP6xRsJf2DLmfyThn9015ocVAv6lvSl/s4C/aiDlTy7h9x8YSfmhiV2fW4/0MFrO7Z98D/vhNrd/5nPFn1jA7C9/r/jhKrN/fUz1D83h9e8ZVv3QwOs/l6aHwVLW+LqT7od61vhq+88/MIM/vhQuCMQXpr9YIL4wZwTiC/O5UCC+MMcF4gvzaYpAfGEOCcQXpncif3wp7BeIL8yHApb4ugyZ2CsQX5g3+fzxpbBLIL4w3bn88aWwXSC+MJ051v1nIYgqgfjCdAjEl8ImgfjCtFv2r4wG+20PMr7xhYnfysrF+eb+Y0kgoN/0Zs8QX/pESOPLgLuk8WWA0WOVKb4MqCWNL20S1aTxpc3XzeNevsZFTwVtfOnSabJZBMWXJg+nEseXJg15Bv5lMSr96GGj708Hlf972OwDHCfy91UavkCPafzdZaYv8GKST3BrkXkDTFq3NRsns/mvh+x20oMsftt71fJg/dBu26EeHCpf1tr2rw70v11o/VBrDfI/K7Hu3xDkb2IYq54E+OvsH8reFur40uUFbXxpE6aNL21yukjjS5+dpPGlT94ryvgyGasyxNcRpq089M5/Iwgz+b1q/38VlVz+CT1+/pdlXH7vIHV86V5sH338N0Jsfq/Gx3+aT+9NiwrEF+aUQHxhimIC8YU5n+5/WsLqn/5NIL4wlwTiCzMrLhBfmCsC8aWspj/440shIhBfmLkJ/vhSuCkQX5hFI/zxpdAoEF+YiiR/fCncF4gv30GGMb4UmgXiSzmGhvnjSyXGH18qR9njK51t12pLPYfD4XA4LPATzeXU6LXsNl4AAAAASUVORK5CYII="
        },
        {
          "key": "superfluid",
          "name": "Superfluid",
          "version": "1.0.0",
          "platformVersion": "1.0.0",
          "type": "web3",
          "triggers": [
            {
              "key": "FlowUpdatedTrigger",
              "name": "Incoming stream",
              "display": {
                "label": "Incoming stream",
                "description": "Incoming stream"
              }
            }
          ],
          "actions": [
            {
              "key": "createFlowAction",
              "name": "Create a new stream",
              "display": {
                "label": "Create a new stream",
                "description": "Create a new stream"
              }
            }
          ],
          "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAACXBIWXMAAAsSAAALEgHS3X78AAAB6ElEQVRIie3Vz6qqQBzAcaNNCxs1Tc1Rm3yHoE1QIi61sseJFvkOFXHNV4mobbugpEX05yVOqReKE3HNe05dWxy437Xjh58zjFj45rD/wM/4REEQfHyvIAieA3zfD8Nwt9vpul6r1VRVrcekqmq1Wl0sFrdVTwCe5/E8T5IkTdO5mGiazmaz0+k0DMPz+fwcsNlsSqWSIAiSJIkxSZLEcdxsNnsRKBaLPM9DCIWYIIT5fP51oBSZ4A/snwDP81iWBQBQFEVeIgiCYZh740UguBy7w+FgWZZhGM1ms9FomKZpWValUuE47ma8CDzsun48HuM4LklSMkBw1+l0CsPQcZwkgbdPkCTg+/45UhgBXNclCAIhJF2SZZnn+fl8/txV8bArMBwOMQwjSTJ7CQCQyWQmk8nXE7iu2+l0bNvu9Xq2bXe73cFgcL/menaXy2W/33cc59dno9HoeDzeHogFNE1LpVIEQeA4DgBIp9Plcvl6cqK38Zc9AFqtFsMwCCFZlhFCLMtqmhYFgiCIbtW3/gemaRIEIYqiIAiiKOZyuXq9nuQEbwcMwwAAQAgLhQKEkKKoWq2WJNBut1mWVRQFIaQoCs/zuq4nCez3+9Vq5X22Xq+32+0Lr44Fkg37+8V5K0kg2bAfD/wGXfYRQJG3wfYAAAAASUVORK5CYII="
        },
        {
          "key": "syndicate",
          "name": "Syndicate",
          "version": "1.0.0",
          "platformVersion": "1.0.0",
          "type": "web3",
          "triggers": [
            {
              "key": "newEvent",
              "name": "New Deposit",
              "display": {
                "label": "New Deposit",
                "description": "New Deposit",
                "instructions": "",
                "featured": false,
                "hidden": false
              }
            },
            {
              "key": "newEvent",
              "name": "New Member",
              "display": {
                "label": "New Member",
                "description": "New Member",
                "instructions": "",
                "featured": false,
                "hidden": false
              }
            }
          ],
          "actions": [
            {
              "key": "InformationInvestmentClub",
              "name": "Information Investment Club",
              "display": {
                "label": "Information Investment Club",
                "description": "Get details of an investment club",
                "instructions": "",
                "featured": false,
                "hidden": false
              }
            },
            {
              "key": "getBalanceOf",
              "name": "getBalanceOf",
              "display": {
                "label": "Balance of",
                "description": "Get balance of a holder within an investment club",
                "instructions": "",
                "featured": false,
                "hidden": false
              }
            }
          ],
          "icon": "data:image/png;base64,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"
        },
        {
          "key": "xmtp",
          "name": "XMTP",
          "version": "1.0.0",
          "platformVersion": "1.0.0",
          "type": "web3",
          "triggers": [
            {
              "key": "newMessage",
              "name": "New Message",
              "display": {
                "label": "New Message",
                "description": "New Message"
              }
            }
          ],
          "icon": "data:image/png;base64,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"
        }
      ]
      // stagedCdss = await client?.listDrivers("staging");
    }

    setConnectors(
      _.orderBy(
        stagedCdss.length > 0 ? stagedCdss : cdss,

        [(cds) => cds.name.toLowerCase()],
        ["asc"]
      )
    );


    // let stagedCdss = [];
    // const cdss = await client?.listDrivers();
    // if (isLocalOrStaging) {
    //   stagedCdss = await client?.listDrivers("staging");
    // }

    // setConnectors(
    //   _.orderBy(
    //     stagedCdss.length > 0 ? stagedCdss : cdss,

    //     [(cds) => cds.name.toLowerCase()],
    //     ["asc"]
    //   )
    // );
  };

  const getConnector = async (key: string) => {
    const connector = await client?.getDriver(
      key,
      isLocalOrStaging ? "staging" : undefined
    );
    if (connector) {
      setConnectors(
        _.orderBy(
          [...connectors.map((c) => (c.key === key ? connector : c))],
          [(cds) => cds.name.toLowerCase()],
          ["asc"]
        )
      );
    }
  };

  const getWorkflowExecution = useCallback(
    async (
      executionId: string,
      callback: (newItems: WorkflowExecutionLog[]) => void
    ) => {
      const res = await client
        ?.getWorkflowExecutionLog(executionId)
        .catch((err) => {
          console.error("getWorkflowExecutionLog error:", err.message);
        });

      if (res) {
        callback(res);
      }
    },
    [client]
  );

  const getWorkflowHistory = useCallback(
    async (
      workflowKey: string,
      callback: (newItems: WorkflowExecutionLog[]) => void,
      limit?: number
    ) => {
      //const res = await getWorkflowExecutions(workflowKey);
      const executions = await client
        ?.getWorkflowExecutions(workflowKey, undefined, undefined, limit)
        .catch((err) => {
          console.error("getWorkflowExecutions error:", err.message);
        });

      if (executions) {
        executions.forEach((execution: WorkflowExecution) => {
          getWorkflowExecution(execution.executionId, callback);
        });
      }
    },
    [getWorkflowExecution, client]
  );

  const editWorkflow = async (
    workflow: Workflow,
    redirect?: boolean,
    callback?: () => void
  ) => {
    const res = await updateWorkflowByKey(workflow)
    console.log(res)
    if (res) {
      await getWorkflowsList();
    }
    if (redirect) {
      navigate("/workflows");
    } else {
      if (callback) {
        callback();
      }
    }

    // const res = await client
    //   ?.updateWorkflow(workflow.key, workflow)
    //   .catch((err) => {
    //     console.error("updateWorkflow error:", err.message);
    //   });

    // if (res) {
    //   await getWorkflowsList();
    // }
    // if (redirect) {
    //   navigate("/workflows");
    // } else {
    //   if (callback) {
    //     callback();
    //   }
    // }
  };

  const verifyUser = async () => {
    setAccessAllowed(true);
    setIsOptedIn(true);

    // origin code
    // setVerifying(true);
    // const res = await client?.isUserHasEmail().catch((err) => {
    //   console.error("isUserHasEmail error:", err.message);
    //   setAccessAllowed(false);
    // });
    // if (res) {
    //   setAccessAllowed(true);
    //   const optinRes = await client?.isAllowedUser().catch((err) => {
    //     console.error("isAllowedUser error:", err.message);
    //     setIsOptedIn(false);
    //   });
    //   if (optinRes) {
    //     setIsOptedIn(true);
    //   } else {
    //     setIsOptedIn(false);
    //   }
    // } else {
    //   setAccessAllowed(false);
    // }
    // setChekingOptIn(false);
    // setVerifying(false);
  };

  const addExecutions = useCallback((newItems: WorkflowExecutionLog[]) => {
    setWorkflowExecutions((items) => [...items, newItems]);
  }, []);

  const getApps = (workflowsList: Workflow[], connectorsList: Connector[]) => {
    if (workflowsList && workflowsList.length > 0) {
      const usedConnectorsKeys = _.uniq(
        _.flatten(
          workflowsList.map((workflow: Workflow) => [
            workflow.trigger.connector,
            ...workflow.actions.map((action: Operation) => action.connector),
          ])
        )
      );
      const usedApps = _.orderBy(
        usedConnectorsKeys.map((connectorKey: string) => {
          const connectorObject = connectorsList.find(
            (connector: Connector) => connector.key === connectorKey
          );
          return {
            ...connectorObject,
            workflows: workflowsList.filter(
              (workflow: Workflow) =>
                workflow.trigger.connector === connectorKey ||
                workflow.actions.filter(
                  (action: Operation) => action.connector === connectorKey
                ).length > 0
            ).length,
          };
        }),
        ["workflows", "name"],
        ["desc"]
      );
      setApps(usedApps);
    } else {
      setApps([]);
    }
  };

  const handleUpdateWorkflowList = (workflowLists: any) => {
    console.log(`handleUpdateWorkflowList`)
    setWorkflows(workflowLists)
  }

  const handleDevModeChange = (e: boolean) => {
    localStorage.setItem("gr_dev_mode", e.toString());
    setDevMode(e);
  };

  const deleteWorkflow = async (userAccountId: string, key: string) => {
    const deletWorkflowByKeyRespond = await deleteWorkflowByKey(key)
    console.log(deletWorkflowByKeyRespond)
    if(deletWorkflowByKeyRespond){
      getWorkflowsList();
    }
    // const res = await client?.deleteWorkflow(key).catch((err) => {
    //   console.error("deleteWorkflow error:", err.message);
    // });
    // if (res) {
    //   getWorkflowsList();
    // }
  };

  const initClient = (accessToken: string) => {
    console.log(`initclient`, accessToken)
    const nexus = new NexusClient();
    nexus.authenticate(accessToken);
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

  const moveWorkflowToWorkspace = async (
    workflowKey: string,
    workspaceKey: string,
    client: NexusClient | null
  ) => {
    const res = await client?.moveWorkflowToWorkspace(
      workflowKey,
      workspaceKey
    );
    if (res) {
      getWorkflowsList();
    }
  };

  const getChains = async (nexusClient: NexusClient) => {
    console.log(`getChains`,nexusClient)
    let res;
    try {
      res = await nexusClient.listChains(
        "evm",
        isLocalOrStaging ? "staging" : "production"
      );
    } catch (err) {
      console.error("getChains error: ", err);
      setEvmChains([]);
      return;
    }
    setEvmChains(res);
  };

  useEffect(() => {
    if (client) {
      getChains(client);
    }
  }, [client]);

  useEffect(() => {
    setWorkflowExecutions([]);
  }, [workspace]);

  useEffect(() => {
    console.log(`use effect user && accessAllowed && client && workspace`, user, accessAllowed, client, workspace)
    if (user && accessAllowed && client && workspace) {
      getConnectors();
      getWorkflowsList();
    } else {
      clearWorkflows();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, accessAllowed, client, workspace]);

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
      //navigate("/workflows");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token?.access_token]);

  useEffect(() => {
    if (
      width >= parseInt(SCREEN.TABLET_XL.replace("px", "")) &&
      width < parseInt(SCREEN.DESKTOP.replace("px", "")) &&
      appOpened
    ) {
      setAppOpened(false);
    }
    if (width < parseInt(SCREEN.TABLET.replace("px", "")) && !appOpened) {
      setAppOpened(true);
    }
  }, [width, appOpened]);

  useEffect(() => {
    getApps(workflows, connectors);
  }, [workflows, connectors]);

  useEffect(() => {
    if (workspaceToken) {
      initClient(workspaceToken);
    } else {
      if (token?.access_token) {
        initClient(token?.access_token);
      }
    }
  }, [workspaceToken, token]);

  console.log(`user change`, user)
  return (
    <AppContext.Provider
      value={{
        user,
        changeTab,
        disconnect,
        appOpened,
        setAppOpened,
        workflows,
        setWorkflows,
        connectors,
        getWorkflowsList,
        getWorkflowHistory,
        getWorkflowExecution,
        editWorkflow,
        accessAllowed,
        validator,
        verifying,
        workflowExecutions,
        setWorkflowExecutions,
        apps,
        devMode,
        handleDevModeChange,
        handleUpdateWorkflowList,
        deleteWorkflow,
        client,
        access_token,
        moveWorkflowToWorkspace,
        getConnector,
        evmChains,
        isOptedIn,
        chekingOptIn,
        setIsOptedIn,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
