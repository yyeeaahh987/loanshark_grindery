import React, { createContext, useEffect, useReducer } from "react";
import NexusClient from "grindery-nexus-client";
import { isLocalOrStaging } from "../constants";
import { checkBrowser, requestPermission } from "../helpers/firebase";
import useAppContext from "../hooks/useAppContext";
import { Operation } from "../types/Workflow";
import useWorkspaceContext from "../hooks/useWorkspaceContext";

type StateProps = {
  notificationsToken: string;
  browserIsSupported: boolean;
  sending: boolean;
  error: string;
  success: string;
};

type ContextProps = {
  state: StateProps;
  requestNotificationsPermission: () => void;
  isUserUnSubscribed: (userId: string) => boolean;
  isUserSubscribed: (userId: string) => boolean;
  sendNotification: (title?: string, body?: string, url?: string) => void;
  dismissNotifications: (userId: string) => void;
};

type NotificationsContextProps = {
  children: React.ReactNode;
};

const defaultContext = {
  state: {
    notificationsToken: "",
    browserIsSupported: false,
    sending: false,
    error: "",
    success: "",
  },
  requestNotificationsPermission: () => {},
  isUserUnSubscribed: () => false,
  isUserSubscribed: () => false,
  sendNotification: () => {},
  dismissNotifications: () => {},
};

export const NotificationsContext = createContext<ContextProps>(defaultContext);

export const NotificationsContextProvider = ({
  children,
}: NotificationsContextProps) => {
  const { user, client } = useAppContext();
  const { workspace } = useWorkspaceContext();
  const [state, setState] = useReducer(
    (state: StateProps, newState: Partial<StateProps>) => ({
      ...state,
      ...newState,
    }),
    {
      notificationsToken: "",
      browserIsSupported: false,
      sending: false,
      error: "",
      success: "",
    }
  );

  const isUserUnSubscribed = (userID: string) =>
    Boolean(
      localStorage.getItem(
        `gr_nexus_updates_canceled_${
          isLocalOrStaging ? "staging_" : "production_"
        }${userID}`
      )
    );
  const isUserSubscribed = (userID: string) =>
    Boolean(
      localStorage.getItem(
        `gr_nexus_updates_${
          isLocalOrStaging ? "staging_" : "production_"
        }${userID}`
      )
    );

  const subscribeUserAction: Operation = {
    type: "action",
    connector: "firebaseCloudMessagingConnector",
    operation: "subscribeDeviceToTopic",
    input: {
      topic: isLocalOrStaging
        ? "grindery-nexus-updates-staging"
        : "grindery-nexus-updates",
      tokens: [""],
    },
  };

  const sendNotificationsAction: Operation = {
    type: "action",
    connector: "firebaseCloudMessagingConnector",
    operation: "sendMessageToDevices",
    input: {
      topic: isLocalOrStaging
        ? "grindery-nexus-updates-staging"
        : "grindery-nexus-updates",
    },
  };

  const requestNotificationsPermission = () => {
    requestPermission(
      (notificationsToken: string) => {
        setState({
          notificationsToken,
        });
      },
      (browserIsSupported: boolean) => {
        setState({
          browserIsSupported,
        });
      }
    );
  };

  const dismissNotifications = async (userID: string) => {
    localStorage.setItem(
      `gr_nexus_updates_canceled_${
        isLocalOrStaging ? "staging_" : "production_"
      }${userID}`,
      "yes"
    );
    try {
      await client?.saveNotificationsState("Not Allowed");
    } catch (err) {
      console.error("saveNotificationsState error", err);
    }
  };

  const subscribeUserToUpdates = async (
    userID: string,
    notificationToken: string,
    client: NexusClient
  ) => {
    const isUnSubscribed = isUserUnSubscribed(userID);
    const isSubscribed = isUserSubscribed(userID);
    if (userID && notificationToken && !isUnSubscribed && !isSubscribed) {
      try {
        await client.testAction(
          subscribeUserAction,
          {
            topic: subscribeUserAction.input.topic,
            tokens: [notificationToken],
          },
          isLocalOrStaging ? "staging" : "production"
        );
        localStorage.setItem(
          `gr_nexus_updates_${
            isLocalOrStaging ? "staging_" : "production_"
          }${userID}`,
          "yes"
        );
      } catch (err) {
        let error = "";
        if (typeof err === "string") {
          error = err;
        } else if (err instanceof Error) {
          error = err.message;
        }
        console.error("subscribeUserToUpdates error:", error);
      }

      try {
        await client?.saveNotificationsState("Allowed", notificationToken);
      } catch (err) {
        console.error("saveNotificationsState error", err);
      }
    }
  };

  const sendNotification = async (
    title?: string,
    body?: string,
    url?: string
  ) => {
    if (!workspace || workspace !== "ws-98833cd6-7f21-425b-b01c-c534e1c53875") {
      setState({
        error:
          "Only members of admin workspace can send notifications. Please, switch the workspace.",
      });
      return;
    }
    setState({
      sending: true,
    });

    try {
      await client?.testAction(
        sendNotificationsAction,
        {
          title: title || "Demo notification",
          body: body || "Browser notification successfully received!",
          data: JSON.stringify({ url }),
          topic: sendNotificationsAction.input.topic,
        },
        isLocalOrStaging ? "staging" : "production"
      );
    } catch (err: any) {
      console.error("testNotification error:", err.message);
      setState({
        error:
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Unknown error. Please, try again later.",
      });
      return;
    }
    setState({
      sending: false,
      error: "",
      success: "Notification sent",
    });
    setTimeout(() => {
      setState({
        success: "",
      });
    }, 5000);
  };

  useEffect(() => {
    checkBrowser((browserIsSupported: boolean) => {
      setState({
        browserIsSupported,
      });
    });
  }, []);

  useEffect(() => {
    if (user && client && state.notificationsToken) {
      subscribeUserToUpdates(user, state.notificationsToken, client);
    }
  }, [state.notificationsToken, user, client]);

  return (
    <NotificationsContext.Provider
      value={{
        state,
        requestNotificationsPermission,
        isUserUnSubscribed,
        isUserSubscribed,
        sendNotification,
        dismissNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsContextProvider;
