import React, { createContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import _ from "lodash";
import { useNavigate } from "react-router";
import { isLocalOrStaging } from "../constants";
// import { useGrinderyNexus } from "use-grindery-nexus";
import { useGrinderyNexus } from "../use-grindery-nexus/index";

import useWorkspaceContext from "../hooks/useWorkspaceContext";
import useNetworkContext from "../hooks/useNetworkContext";

export const NOT_ALLOWED = `Published connector can't be updated. You can clone the connector and create a new version.`;

const CDS_EDITOR_API_ENDPOINT =
  "https://nexus-cds-editor-api.herokuapp.com/api";

type StateProps = {
  id: string;
  cds: any;
  connector: any;
  isSaving: boolean;
  isPublishing: boolean;
  confirm: {
    message: string;
    opened: boolean;
    onClose: () => void;
    onConfirm: () => void;
  };
  snackbar: {
    opened: boolean;
    message: string;
    severity: string;
    onClose: () => void;
    duration?: number;
  };
};

type ContextProps = {
  state: StateProps;
  setState: React.Dispatch<Partial<StateProps>>;
  saveConnector: () => void;
  publishConnector: () => void;
  onConnectorSettingsSave: (data: any) => void;
  onOperationSettingsSave: (type: any, operation: any) => void;
  onOperationDelete: (type: any, operationKey: string) => void;
  onInputFieldSave: (
    key: string,
    type: any,
    inputKey: string,
    inputData: any
  ) => void;
  onInputFieldDelete: (key: string, type: any, inputKey: string) => void;
};

type ConnectorContextProps = {
  children: React.ReactNode;
  connector: any;
};

const defaultContext = {
  state: {
    id: "",
    cds: null,
    connector: null,
    isSaving: false,
    isPublishing: false,
    confirm: {
      message: "",
      opened: false,
      onClose: () => {},
      onConfirm: () => {},
    },
    snackbar: {
      opened: false,
      message: "",
      severity: "",
      onClose: () => {},
    },
  },
  setState: () => {},
  saveConnector: () => {},
  publishConnector: () => {},
  onConnectorSettingsSave: () => {},
  onOperationSettingsSave: () => {},
  onOperationDelete: () => {},
  onInputFieldSave: () => {},
  onInputFieldDelete: () => {},
};

export const ConnectorContext = createContext<ContextProps>(defaultContext);

export const ConnectorContextProvider = ({
  children,
  connector,
}: ConnectorContextProps) => {
  const { workspaceToken } = useWorkspaceContext();
  const { token } = useGrinderyNexus();
  const { refreshConnectors } = useNetworkContext();
  let navigate = useNavigate();
  const [count, setCount] = useState(0);
  const cds = JSON.parse(connector?.values?.cds || {});
  const [state, setState] = useReducer(
    (state: StateProps, newState: Partial<StateProps>) => ({
      ...state,
      ...newState,
    }),
    {
      id: cds.key || connector?.id || "",
      cds: cds,
      connector: connector || null,
      isSaving: false,
      isPublishing: false,
      confirm: {
        message: "",
        opened: false,
        onClose: () => {},
        onConfirm: () => {},
      },
      snackbar: {
        opened: false,
        message: "",
        severity: "",
        onClose: () => {},
      },
    }
  );

  const saveConnector = async () => {
    if (state.connector?.values?.status?.name === "Published") {
      setState({
        isSaving: false,
        snackbar: {
          opened: true,
          message: NOT_ALLOWED,
          severity: "error",
          duration: 5000,
          onClose: () => {
            setState({
              snackbar: {
                opened: false,
                message: "",
                severity: "error",
                onClose: () => {},
              },
            });
          },
        },
      });
      return;
    }
    if (count > 0) {
      setState({
        isSaving: true,
      });

      try {
        await axios.patch(
          `${CDS_EDITOR_API_ENDPOINT}/cds`,
          {
            id: state.connector.id,
            cds: JSON.stringify(state.cds),
            environment: isLocalOrStaging ? "staging" : "production",
          },
          {
            headers: {
              Authorization: `Bearer ${workspaceToken || token?.access_token}`,
            },
          }
        );
      } catch (err: any) {
        console.error("saveConnector error => ", err.message);

        setState({
          isSaving: false,
          snackbar: {
            opened: true,
            message: `Saving failed. ${
              err?.response?.data?.message ||
              err?.response?.data?.error ||
              err?.message ||
              "Please, try again later"
            }.`,
            severity: "error",
            duration: 5000,
            onClose: () => {
              setState({
                snackbar: {
                  opened: false,
                  message: "",
                  severity: "error",
                  onClose: () => {},
                },
              });
            },
          },
        });
        return;
      }

      setState({
        isSaving: false,
        snackbar: {
          opened: true,
          message: `Connector saved`,
          severity: "success",
          onClose: () => {
            setState({
              snackbar: {
                opened: false,
                message: "",
                severity: "success",
                onClose: () => {},
              },
            });
          },
        },
      });
      refreshConnectors();
    }
  };

  const publishConnector = async () => {
    if (state.connector?.values?.status?.name === "Published") {
      setState({
        isSaving: false,
        snackbar: {
          opened: true,
          message: NOT_ALLOWED,
          severity: "error",
          duration: 5000,
          onClose: () => {
            setState({
              snackbar: {
                opened: false,
                message: "",
                severity: "error",
                onClose: () => {},
              },
            });
          },
        },
      });
      return;
    }
    setState({
      isPublishing: true,
    });

    try {
      await axios.post(
        `${CDS_EDITOR_API_ENDPOINT}/cds/publish/${state.cds.key.toLowerCase()}`,
        {
          environment: isLocalOrStaging ? "staging" : "production",
        },
        {
          headers: {
            Authorization: `Bearer ${workspaceToken || token?.access_token}`,
          },
        }
      );
    } catch (err: any) {
      console.error("publishConnector error => ", err.message);

      setState({
        isPublishing: false,
        snackbar: {
          opened: true,
          message: `Publishing failed. ${
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            "Please, try again later"
          }.`,
          severity: "error",
          duration: 5000,
          onClose: () => {
            setState({
              snackbar: {
                opened: false,
                message: "",
                severity: "error",
                onClose: () => {},
              },
            });
          },
        },
      });
      return;
    }

    setState({
      connector: {
        ...state.connector,
        values: {
          ...state.connector.values,
          status: {
            ...state.connector.values.status,
            id: "5",
            label: "Published",
            name: "Published",
          },
        },
      },
      isPublishing: false,
      snackbar: {
        opened: true,
        message: `Connector published. It will appear in the workflow builder UI in 2-5 minutes.`,
        severity: "success",
        duration: 6000,
        onClose: () => {
          setState({
            snackbar: {
              opened: false,
              message: "",
              severity: "success",
              onClose: () => {},
            },
          });
        },
      },
    });
  };

  const onConnectorSettingsSave = (data: any) => {
    if (state.connector?.values?.status?.name === "Published") {
      setState({
        isSaving: false,
        snackbar: {
          opened: true,
          message: NOT_ALLOWED,
          severity: "error",
          duration: 5000,
          onClose: () => {
            setState({
              snackbar: {
                opened: false,
                message: "",
                severity: "error",
                onClose: () => {},
              },
            });
          },
        },
      });
      return;
    }
    if (data) {
      setState({
        cds: {
          ...state.cds,
          name: data.name,
          icon: data.icon,
          description: data.description,
        },
        snackbar: {
          opened: true,
          message: `Connector saved`,
          severity: "success",
          onClose: () => {
            setState({
              snackbar: {
                opened: false,
                message: "",
                severity: "success",
                onClose: () => {},
              },
            });
          },
        },
      });
      navigate(`/network/connector/${state.id}`);
    }
  };

  const onOperationSettingsSave = (type: any, operation: any) => {
    if (state.connector?.values?.status?.name === "Published") {
      setState({
        isSaving: false,
        snackbar: {
          opened: true,
          message: NOT_ALLOWED,
          severity: "error",
          duration: 5000,
          onClose: () => {
            setState({
              snackbar: {
                opened: false,
                message: "",
                severity: "error",
                onClose: () => {},
              },
            });
          },
        },
      });
      return;
    }
    if (type) {
      if (operation) {
        const isNewoperation = !(state.cds?.[type] || [])?.find(
          (op: any) => op.key === operation.key
        );
        const operations = isNewoperation
          ? [...(state.cds?.[type] || []), operation]
          : [
              ...((state.cds?.[type] || []).map((op: any) => {
                if (op.key === operation.key) {
                  return operation;
                } else {
                  return op;
                }
              }) || []),
            ];
        setState({
          cds: { ...state.cds, [type]: [...operations] },
          snackbar: {
            opened: true,
            message: `${type === "triggers" ? "Trigger" : "Action"} saved`,
            severity: "success",
            onClose: () => {
              setState({
                snackbar: {
                  opened: false,
                  message: "",
                  severity: "success",
                  onClose: () => {},
                },
              });
            },
          },
        });
        navigate(
          `/network/connector/${state.id}/${type}/${operation.key}/${
            isNewoperation ? "inputFields" : "settings"
          }`
        );
      }
    }
  };

  const onOperationDelete = (type: any, operationKey: string) => {
    if (state.connector?.values?.status?.name === "Published") {
      setState({
        isSaving: false,
        snackbar: {
          opened: true,
          message: NOT_ALLOWED,
          severity: "error",
          duration: 5000,
          onClose: () => {
            setState({
              snackbar: {
                opened: false,
                message: "",
                severity: "error",
                onClose: () => {},
              },
            });
          },
        },
      });
      return;
    }
    setState({
      confirm: {
        message: `Are you sure you want to delete this ${
          type === "triggers" ? "trigger" : "action"
        }?`,
        opened: true,
        onClose: () => {
          setState({
            confirm: {
              opened: false,
              message: "",
              onClose: () => {},
              onConfirm: () => {},
            },
          });
        },
        onConfirm: () => {
          if (type) {
            const newCDS = _.cloneDeep(state.cds);
            const index = (newCDS?.[type] || []).findIndex(
              (op: { key: string }) => op.key === operationKey
            );
            newCDS?.[type]?.splice(index, 1);
            setState({
              cds: newCDS,
            });
          }
        },
      },
    });
  };

  const onInputFieldSave = (
    key: string,
    type: any,
    inputKey: string,
    inputData: any
  ) => {
    if (state.connector?.values?.status?.name === "Published") {
      setState({
        isSaving: false,
        snackbar: {
          opened: true,
          message: NOT_ALLOWED,
          severity: "error",
          duration: 5000,
          onClose: () => {
            setState({
              snackbar: {
                opened: false,
                message: "",
                severity: "error",
                onClose: () => {},
              },
            });
          },
        },
      });
      return;
    }
    navigate(`/network/connector/${state.id}/${type}/${key}/inputFields`);
    if (type) {
      setState({
        cds: {
          ...state.cds,
          [type]: [
            ...((state.cds?.[type] || []).map((op: any) => {
              if (op.key === key) {
                return {
                  ...op,
                  operation: {
                    ...op.operation,
                    inputFields: [
                      ...(op.operation?.inputFields?.map((field: any) => {
                        if (field.key === inputKey) {
                          return {
                            ...field,
                            ...inputData,
                          };
                        } else {
                          return field;
                        }
                      }) || []),
                      ...(inputKey === "__new__" ? [{ ...inputData }] : []),
                    ],
                  },
                };
              } else {
                return op;
              }
            }) || []),
          ],
        },
      });
    }
  };

  const onInputFieldDelete = (key: string, type: any, inputKey: string) => {
    if (state.connector?.values?.status?.name === "Published") {
      setState({
        isSaving: false,
        snackbar: {
          opened: true,
          message: NOT_ALLOWED,
          severity: "error",
          duration: 5000,
          onClose: () => {
            setState({
              snackbar: {
                opened: false,
                message: "",
                severity: "error",
                onClose: () => {},
              },
            });
          },
        },
      });
      return;
    }
    setState({
      confirm: {
        message: "Are you sure you want to delete the input field?",
        opened: true,
        onClose: () => {
          setState({
            confirm: {
              opened: false,
              message: "",
              onClose: () => {},
              onConfirm: () => {},
            },
          });
        },
        onConfirm: () => {
          if (type) {
            setState({
              cds: {
                ...state.cds,
                [type]: [
                  ...((state.cds?.[type] || [])?.map((op: any) => {
                    if (op.key === key) {
                      return {
                        ...op,
                        operation: {
                          ...op.operation,
                          inputFields: [
                            ...(op.operation?.inputFields?.filter(
                              (field: any) => field.key !== inputKey
                            ) || []),
                          ],
                        },
                      };
                    } else {
                      return op;
                    }
                  }) || []),
                ],
              },
            });
          }
        },
      },
    });
  };

  useEffect(() => {
    setCount((count) => count + 1);
    saveConnector();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.cds]);

  if (isLocalOrStaging) {
    console.log("connector state", state);
  }

  return (
    <ConnectorContext.Provider
      value={{
        state,
        setState,
        saveConnector,
        publishConnector,
        onConnectorSettingsSave,
        onOperationSettingsSave,
        onOperationDelete,
        onInputFieldSave,
        onInputFieldDelete,
      }}
    >
      {children}
    </ConnectorContext.Provider>
  );
};

export default ConnectorContextProvider;
