import React, { createContext, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import NexusClient from "grindery-nexus-client";
import { isLocalOrStaging } from "../constants";
import { defaultFunc } from "../helpers/utils";
import useAppContext from "../hooks/useAppContext";
import useWorkflowContext from "../hooks/useWorkflowContext";
import { Action, Connector, Field, Trigger } from "../types/Connector";

type WorkflowStepContextProps = {
  type: "trigger" | "action";
  index: number;
  step: number;
  activeRow: number;
  username: string;
  connector: null | Connector;
  operation: Trigger | Action | undefined | null;
  operationIsConfigured: boolean;
  operationIsAuthenticated: boolean;
  operationAuthenticationIsRequired: boolean;
  inputError: string;
  errors: any;
  operationIsTested: boolean | string;
  savedCredentials: any[];
  setConnector: (connector: Connector | null) => void;
  setActiveRow: (row: number) => void;
  setUsername: (name: string) => void;
  getConnector: (key: string) => void;
  setInputError: (a: string) => void;
  setErrors: (a: any) => void;
  setOperationIsTested: (a: boolean | string) => void;
  setSavedCredentials: React.Dispatch<React.SetStateAction<any[]>>;
};

type WorkflowStepContextProviderProps = {
  children: React.ReactNode;
  type: "trigger" | "action";
  index: number;
  step: number;
  setOutputFields: React.Dispatch<React.SetStateAction<any[]>>;
};

export const WorkflowStepContext = createContext<WorkflowStepContextProps>({
  type: "trigger",
  index: 0,
  step: 1,
  activeRow: 0,
  username: "",
  connector: null,
  operation: undefined,
  operationIsConfigured: false,
  operationIsAuthenticated: false,
  operationAuthenticationIsRequired: false,
  inputError: "",
  errors: false,
  operationIsTested: false,
  savedCredentials: [],
  setConnector: defaultFunc,
  setActiveRow: defaultFunc,
  setUsername: defaultFunc,
  getConnector: defaultFunc,
  setInputError: defaultFunc,
  setErrors: defaultFunc,
  setOperationIsTested: defaultFunc,
  setSavedCredentials: defaultFunc,
});

export const WorkflowStepContextProvider = ({
  children,
  type,
  index,
  step,
  setOutputFields,
}: WorkflowStepContextProviderProps) => {
  let { key } = useParams();
  const { client, access_token } = useAppContext();
  const { workflow, updateWorkflow } = useWorkflowContext();
  const [activeRow, setActiveRow] = useState(0);
  const [username, setUsername] = useState("");
  const [connector, setConnector] = useState<null | Connector>(null);
  const [inputError, setInputError] = useState("");
  const [errors, setErrors] = useState<any>(false);
  const [operation, setOperation] = useState<
    null | undefined | Trigger | Action
  >(null);
  const [operationIsTested, setOperationIsTested] = useState<boolean | string>(
    key ? "skipped" : false
  );
  const [savedCredentials, setSavedCredentials] = useState<any[]>([]);

  const nexus = new NexusClient();
  nexus.authenticate(access_token || "");

  const workflowInput =
    type === "trigger" ? workflow.trigger.input : workflow.actions[index].input;

  const requiredFields = [
    ...((operation &&
      operation.operation &&
      operation.operation.inputFields &&
      operation.operation.inputFields
        .filter((field: Field) => field && field.required)
        .map((field: Field) => field.key)) ||
      []),
    ...((operation &&
      operation.inputFields &&
      operation.inputFields
        .filter((field: Field) => field && field.required)
        .map((field: Field) => field.key)) ||
      []),
  ];

  const operationIsConfigured = Boolean(
    requiredFields.filter(
      (field: string) =>
        workflowInput &&
        typeof workflowInput[field] !== "undefined" &&
        workflowInput[field] !== "" &&
        workflowInput[field] !== null
    ).length === requiredFields.length &&
    (operation &&
      operation.operation &&
      operation.operation.type === "blockchain:event"
      ? workflowInput._grinderyChain && workflowInput._grinderyContractAddress
      : true) &&
    !inputError &&
    typeof errors === "boolean"
  );

  const operationIsAuthenticated = Boolean(
    (connector && !connector.authentication) ||
    (type === "trigger"
      ? workflow.trigger?.authentication && connector?.authentication
      : workflow.actions[index]?.authentication && connector?.authentication)
  );

  const operationAuthenticationIsRequired = Boolean(
    connector && connector.authentication
  );

  const passOutputFields = useCallback(() => {
    setOutputFields((outputFields: any[]) => {
      const workflowOutput = [...outputFields];
      workflowOutput[step - 1] = {
        connector,
        operation: {
          ...operation?.operation,
          type: type,
        },
        step: step,
        index: step - 2,
      };
      return workflowOutput;
    });
  }, [operation]);

  const getConnectoAction = (actionName: string) => {
    let action
    if (actionName === 'erc1155') {
      action = {
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
            },
            "operation": {
              "type": "blockchain:event",
              "signature": "event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved)",
              "inputFields": [
                {
                  "key": "_owner",
                  "label": "Owner",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false
                },
                {
                  "key": "_operator",
                  "label": "Operator",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false
                },
                {
                  "key": "_approved",
                  "label": "Approved",
                  "type": "boolean",
                  "placeholder": "",
                  "list": false
                }
              ],
              "outputFields": [
                {
                  "key": "_owner",
                  "label": "Owner",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false
                },
                {
                  "key": "_operator",
                  "label": "Operator",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false
                },
                {
                  "key": "_approved",
                  "label": "Approved",
                  "type": "boolean",
                  "placeholder": "",
                  "list": false
                }
              ],
              "sample": {}
            }
          },
          {
            "key": "CreateERC1155_v1Trigger",
            "name": "Create ERC 1155 v 1",
            "display": {
              "label": "Create ERC 1155 v 1",
              "description": "Create ERC 1155 v 1"
            },
            "operation": {
              "type": "blockchain:event",
              "signature": "event CreateERC1155_v1(address indexed creator, string name, string symbol)",
              "inputFields": [
                {
                  "key": "creator",
                  "label": "Creator",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false
                },
                {
                  "key": "name",
                  "label": "Name",
                  "type": "string",
                  "placeholder": "",
                  "list": false
                },
                {
                  "key": "symbol",
                  "label": "Symbol",
                  "type": "string",
                  "placeholder": "",
                  "list": false
                }
              ],
              "outputFields": [
                {
                  "key": "creator",
                  "label": "Creator",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false
                },
                {
                  "key": "name",
                  "label": "Name",
                  "type": "string",
                  "placeholder": "",
                  "list": false
                },
                {
                  "key": "symbol",
                  "label": "Symbol",
                  "type": "string",
                  "placeholder": "",
                  "list": false
                }
              ],
              "sample": {}
            }
          },
          {
            "key": "OwnershipTransferredTrigger",
            "name": "Ownership Transferred",
            "display": {
              "label": "Ownership Transferred",
              "description": "Ownership Transferred"
            },
            "operation": {
              "type": "blockchain:event",
              "signature": "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
              "inputFields": [
                {
                  "key": "previousOwner",
                  "label": "Previous Owner",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false
                },
                {
                  "key": "newOwner",
                  "label": "New Owner",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false
                }
              ],
              "outputFields": [
                {
                  "key": "previousOwner",
                  "label": "Previous Owner",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false
                },
                {
                  "key": "newOwner",
                  "label": "New Owner",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false
                }
              ],
              "sample": {}
            }
          },
          {
            "key": "SecondarySaleFeesTrigger",
            "name": "Secondary Sale Fees",
            "display": {
              "label": "Secondary Sale Fees",
              "description": "Secondary Sale Fees"
            },
            "operation": {
              "type": "blockchain:event",
              "signature": "event SecondarySaleFees(uint256 tokenId, address[] recipients, uint256[] bps)",
              "inputFields": [
                {
                  "key": "tokenId",
                  "label": "Token Id",
                  "type": "string",
                  "placeholder": "",
                  "list": false
                },
                {
                  "key": "recipients",
                  "label": "Recipients",
                  "type": "address",
                  "placeholder": "",
                  "list": true
                },
                {
                  "key": "bps",
                  "label": "Bps",
                  "type": "string",
                  "placeholder": "",
                  "list": true
                }
              ],
              "outputFields": [
                {
                  "key": "tokenId",
                  "label": "Token Id",
                  "type": "string",
                  "placeholder": "",
                  "list": false
                },
                {
                  "key": "recipients",
                  "label": "Recipients",
                  "type": "address",
                  "placeholder": "",
                  "list": true
                },
                {
                  "key": "bps",
                  "label": "Bps",
                  "type": "string",
                  "placeholder": "",
                  "list": true
                }
              ],
              "sample": {}
            }
          },
          {
            "key": "SignerAddedTrigger",
            "name": "Signer Added",
            "display": {
              "label": "Signer Added",
              "description": "Signer Added"
            },
            "operation": {
              "type": "blockchain:event",
              "signature": "event SignerAdded(address indexed account)",
              "inputFields": [
                {
                  "key": "account",
                  "label": "Account",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false
                }
              ],
              "outputFields": [
                {
                  "key": "account",
                  "label": "Account",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false
                }
              ],
              "sample": {}
            }
          },
          {
            "key": "SignerRemovedTrigger",
            "name": "Signer Removed",
            "display": {
              "label": "Signer Removed",
              "description": "Signer Removed"
            },
            "operation": {
              "type": "blockchain:event",
              "signature": "event SignerRemoved(address indexed account)",
              "inputFields": [
                {
                  "key": "account",
                  "label": "Account",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false
                }
              ],
              "outputFields": [
                {
                  "key": "account",
                  "label": "Account",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false
                }
              ],
              "sample": {}
            }
          },
          {
            "key": "TransferBatchTrigger",
            "name": "Transfer Batch",
            "display": {
              "label": "Transfer Batch",
              "description": "Transfer Batch"
            },
            "operation": {
              "type": "blockchain:event",
              "signature": "event TransferBatch(address indexed _operator, address indexed _from, address indexed _to, uint256[] _ids, uint256[] _values)",
              "inputFields": [
                {
                  "key": "_operator",
                  "label": "Operator",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false
                },
                {
                  "key": "_from",
                  "label": "From",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false
                },
                {
                  "key": "_to",
                  "label": "To",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false
                },
                {
                  "key": "_ids",
                  "label": "Ids",
                  "type": "string",
                  "placeholder": "",
                  "list": true
                },
                {
                  "key": "_values",
                  "label": "Values",
                  "type": "string",
                  "placeholder": "",
                  "list": true
                }
              ],
              "outputFields": [
                {
                  "key": "_operator",
                  "label": "Operator",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false
                },
                {
                  "key": "_from",
                  "label": "From",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false
                },
                {
                  "key": "_to",
                  "label": "To",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false
                },
                {
                  "key": "_ids",
                  "label": "Ids",
                  "type": "string",
                  "placeholder": "",
                  "list": true
                },
                {
                  "key": "_values",
                  "label": "Values",
                  "type": "string",
                  "placeholder": "",
                  "list": true
                }
              ],
              "sample": {}
            }
          },
          {
            "key": "TransferSingleTrigger",
            "name": "Transfer Single",
            "display": {
              "label": "Transfer Single",
              "description": "Transfer Single"
            },
            "operation": {
              "type": "blockchain:event",
              "signature": "event TransferSingle(address indexed _operator, address indexed _from, address indexed _to, uint256 _id, uint256 _value)",
              "inputFields": [
                {
                  "key": "_operator",
                  "label": "Operator",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false
                },
                {
                  "key": "_from",
                  "label": "From",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false
                },
                {
                  "key": "_to",
                  "label": "To",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false
                },
                {
                  "key": "_id",
                  "label": "Id",
                  "type": "string",
                  "placeholder": "",
                  "list": false
                },
                {
                  "key": "_value",
                  "label": "Value",
                  "type": "string",
                  "placeholder": "",
                  "list": false
                }
              ],
              "outputFields": [
                {
                  "key": "_operator",
                  "label": "Operator",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false
                },
                {
                  "key": "_from",
                  "label": "From",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false
                },
                {
                  "key": "_to",
                  "label": "To",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false
                },
                {
                  "key": "_id",
                  "label": "Id",
                  "type": "string",
                  "placeholder": "",
                  "list": false
                },
                {
                  "key": "_value",
                  "label": "Value",
                  "type": "string",
                  "placeholder": "",
                  "list": false
                }
              ],
              "sample": {}
            }
          },
          {
            "key": "URITrigger",
            "name": "URI",
            "display": {
              "label": "URI",
              "description": "URI"
            },
            "operation": {
              "type": "blockchain:event",
              "signature": "event URI(string _value, uint256 indexed _id)",
              "inputFields": [
                {
                  "key": "_value",
                  "label": "Value",
                  "type": "string",
                  "placeholder": "",
                  "list": false
                },
                {
                  "key": "_id",
                  "label": "Id",
                  "type": "string",
                  "placeholder": "",
                  "list": false
                }
              ],
              "outputFields": [
                {
                  "key": "_value",
                  "label": "Value",
                  "type": "string",
                  "placeholder": "",
                  "list": false
                },
                {
                  "key": "_id",
                  "label": "Id",
                  "type": "string",
                  "placeholder": "",
                  "list": false
                }
              ],
              "sample": {}
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
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function addSigner(address account)",
              "inputFields": [
                {
                  "key": "account",
                  "label": "Account",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false,
                  "required": true
                }
              ],
              "outputFields": [],
              "sample": {}
            }
          },
          {
            "key": "balanceOfAction",
            "name": "Balance Of (View function)",
            "display": {
              "label": "Balance Of (View function)",
              "description": "Balance Of (View function)"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function balanceOf(address _owner, uint256 _id) view returns uint256",
              "inputFields": [
                {
                  "key": "_owner",
                  "label": "Owner",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false,
                  "required": true
                },
                {
                  "key": "_id",
                  "label": "Id",
                  "type": "string",
                  "placeholder": "",
                  "list": false,
                  "required": true
                }
              ],
              "outputFields": [
                {
                  "key": "returnValue",
                  "label": "Return value of Balance Of",
                  "type": "string"
                }
              ],
              "sample": {}
            }
          },
          {
            "key": "balanceOfBatchAction",
            "name": "Balance Of Batch (View function)",
            "display": {
              "label": "Balance Of Batch (View function)",
              "description": "Balance Of Batch (View function)"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function balanceOfBatch(address[] _owners, uint256[] _ids) view returns uint256[]",
              "inputFields": [
                {
                  "key": "_owners",
                  "label": "Owners",
                  "type": "address",
                  "placeholder": "",
                  "list": true,
                  "required": true
                },
                {
                  "key": "_ids",
                  "label": "Ids",
                  "type": "string",
                  "placeholder": "",
                  "list": true,
                  "required": true
                }
              ],
              "outputFields": [
                {
                  "key": "returnValue",
                  "label": "Return value of Balance Of Batch",
                  "type": "string"
                }
              ],
              "sample": {}
            }
          },
          {
            "key": "burnAction",
            "name": "Burn",
            "display": {
              "label": "Burn",
              "description": "Burn"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function burn(address _owner, uint256 _id, uint256 _value)",
              "inputFields": [
                {
                  "key": "_owner",
                  "label": "Owner",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false,
                  "required": true
                },
                {
                  "key": "_id",
                  "label": "Id",
                  "type": "string",
                  "placeholder": "",
                  "list": false,
                  "required": true
                },
                {
                  "key": "_value",
                  "label": "Value",
                  "type": "string",
                  "placeholder": "",
                  "list": false,
                  "required": true
                }
              ],
              "outputFields": [],
              "sample": {}
            }
          },
          {
            "key": "contractURIAction",
            "name": "Contract URI (View function)",
            "display": {
              "label": "Contract URI (View function)",
              "description": "Contract URI (View function)"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function contractURI() view returns string",
              "inputFields": [],
              "outputFields": [
                {
                  "key": "returnValue",
                  "label": "Return value of Contract URI",
                  "type": "string"
                }
              ],
              "sample": {}
            }
          },
          {
            "key": "creatorsAction",
            "name": "Creators (View function)",
            "display": {
              "label": "Creators (View function)",
              "description": "Creators (View function)"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function creators(uint256 param0) view returns address",
              "inputFields": [
                {
                  "key": "param0",
                  "label": "Param 0",
                  "type": "string",
                  "placeholder": "",
                  "list": false,
                  "required": true
                }
              ],
              "outputFields": [
                {
                  "key": "returnValue",
                  "label": "Return value of Creators",
                  "type": "address"
                }
              ],
              "sample": {}
            }
          },
          {
            "key": "feesAction",
            "name": "Fees (View function)",
            "display": {
              "label": "Fees (View function)",
              "description": "Fees (View function)"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function fees(uint256 param0, uint256 param1) view returns address, uint256",
              "inputFields": [
                {
                  "key": "param0",
                  "label": "Param 0",
                  "type": "string",
                  "placeholder": "",
                  "list": false,
                  "required": true
                },
                {
                  "key": "param1",
                  "label": "Param 1",
                  "type": "string",
                  "placeholder": "",
                  "list": false,
                  "required": true
                }
              ],
              "outputFields": [],
              "sample": {}
            }
          },
          {
            "key": "getFeeBpsAction",
            "name": "Get Fee Bps (View function)",
            "display": {
              "label": "Get Fee Bps (View function)",
              "description": "Get Fee Bps (View function)"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function getFeeBps(uint256 id) view returns uint256[]",
              "inputFields": [
                {
                  "key": "id",
                  "label": "Id",
                  "type": "string",
                  "placeholder": "",
                  "list": false,
                  "required": true
                }
              ],
              "outputFields": [
                {
                  "key": "returnValue",
                  "label": "Return value of Get Fee Bps",
                  "type": "string"
                }
              ],
              "sample": {}
            }
          },
          {
            "key": "getFeeRecipientsAction",
            "name": "Get Fee Recipients (View function)",
            "display": {
              "label": "Get Fee Recipients (View function)",
              "description": "Get Fee Recipients (View function)"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function getFeeRecipients(uint256 id) view returns address[]",
              "inputFields": [
                {
                  "key": "id",
                  "label": "Id",
                  "type": "string",
                  "placeholder": "",
                  "list": false,
                  "required": true
                }
              ],
              "outputFields": [
                {
                  "key": "returnValue",
                  "label": "Return value of Get Fee Recipients",
                  "type": "address"
                }
              ],
              "sample": {}
            }
          },
          {
            "key": "isApprovedForAllAction",
            "name": "Is Approved For All (View function)",
            "display": {
              "label": "Is Approved For All (View function)",
              "description": "Is Approved For All (View function)"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function isApprovedForAll(address _owner, address _operator) view returns bool",
              "inputFields": [
                {
                  "key": "_owner",
                  "label": "Owner",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false,
                  "required": true
                },
                {
                  "key": "_operator",
                  "label": "Operator",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false,
                  "required": true
                }
              ],
              "outputFields": [
                {
                  "key": "returnValue",
                  "label": "Return value of Is Approved For All",
                  "type": "boolean"
                }
              ],
              "sample": {}
            }
          },
          {
            "key": "isOwnerAction",
            "name": "Is Owner (View function)",
            "display": {
              "label": "Is Owner (View function)",
              "description": "Is Owner (View function)"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function isOwner() view returns bool",
              "inputFields": [],
              "outputFields": [
                {
                  "key": "returnValue",
                  "label": "Return value of Is Owner",
                  "type": "boolean"
                }
              ],
              "sample": {}
            }
          },
          {
            "key": "isSignerAction",
            "name": "Is Signer (View function)",
            "display": {
              "label": "Is Signer (View function)",
              "description": "Is Signer (View function)"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function isSigner(address account) view returns bool",
              "inputFields": [
                {
                  "key": "account",
                  "label": "Account",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false,
                  "required": true
                }
              ],
              "outputFields": [
                {
                  "key": "returnValue",
                  "label": "Return value of Is Signer",
                  "type": "boolean"
                }
              ],
              "sample": {}
            }
          },
          {
            "key": "mintAction",
            "name": "Mint",
            "display": {
              "label": "Mint",
              "description": "Mint"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function mint(uint256 id, uint8 v, bytes32 r, bytes32 s, tuple[] fees, uint256 supply, string uri)",
              "inputFields": [
                {
                  "key": "id",
                  "label": "Id",
                  "type": "string",
                  "placeholder": "",
                  "list": false,
                  "required": true
                },
                {
                  "key": "v",
                  "label": "V",
                  "type": "number",
                  "placeholder": "",
                  "list": false,
                  "required": true
                },
                {
                  "key": "r",
                  "label": "R",
                  "type": "string",
                  "placeholder": "",
                  "list": false,
                  "required": true
                },
                {
                  "key": "s",
                  "label": "S",
                  "type": "string",
                  "placeholder": "",
                  "list": false,
                  "required": true
                },
                {
                  "key": "fees",
                  "label": "Fees",
                  "type": "string",
                  "placeholder": "",
                  "list": true,
                  "required": true
                },
                {
                  "key": "supply",
                  "label": "Supply",
                  "type": "string",
                  "placeholder": "",
                  "list": false,
                  "required": true
                },
                {
                  "key": "uri",
                  "label": "Uri",
                  "type": "string",
                  "placeholder": "",
                  "list": false,
                  "required": true
                }
              ],
              "outputFields": [],
              "sample": {}
            }
          },
          {
            "key": "nameAction",
            "name": "Name (View function)",
            "display": {
              "label": "Name (View function)",
              "description": "Name (View function)"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function name() view returns string",
              "inputFields": [],
              "outputFields": [
                {
                  "key": "returnValue",
                  "label": "Return value of Name",
                  "type": "string"
                }
              ],
              "sample": {}
            }
          },
          {
            "key": "ownerAction",
            "name": "Owner (View function)",
            "display": {
              "label": "Owner (View function)",
              "description": "Owner (View function)"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function owner() view returns address",
              "inputFields": [],
              "outputFields": [
                {
                  "key": "returnValue",
                  "label": "Return value of Owner",
                  "type": "address"
                }
              ],
              "sample": {}
            }
          },
          {
            "key": "removeSignerAction",
            "name": "Remove Signer",
            "display": {
              "label": "Remove Signer",
              "description": "Remove Signer"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function removeSigner(address account)",
              "inputFields": [
                {
                  "key": "account",
                  "label": "Account",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false,
                  "required": true
                }
              ],
              "outputFields": [],
              "sample": {}
            }
          },
          {
            "key": "renounceOwnershipAction",
            "name": "Renounce Ownership",
            "display": {
              "label": "Renounce Ownership",
              "description": "Renounce Ownership"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function renounceOwnership()",
              "inputFields": [],
              "outputFields": [],
              "sample": {}
            }
          },
          {
            "key": "renounceSignerAction",
            "name": "Renounce Signer",
            "display": {
              "label": "Renounce Signer",
              "description": "Renounce Signer"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function renounceSigner()",
              "inputFields": [],
              "outputFields": [],
              "sample": {}
            }
          },
          {
            "key": "safeBatchTransferFromAction",
            "name": "Safe Batch Transfer From",
            "display": {
              "label": "Safe Batch Transfer From",
              "description": "Safe Batch Transfer From"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function safeBatchTransferFrom(address _from, address _to, uint256[] _ids, uint256[] _values, bytes _data)",
              "inputFields": [
                {
                  "key": "_from",
                  "label": "From",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false,
                  "required": true
                },
                {
                  "key": "_to",
                  "label": "To",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false,
                  "required": true
                },
                {
                  "key": "_ids",
                  "label": "Ids",
                  "type": "string",
                  "placeholder": "",
                  "list": true,
                  "required": true
                },
                {
                  "key": "_values",
                  "label": "Values",
                  "type": "string",
                  "placeholder": "",
                  "list": true,
                  "required": true
                },
                {
                  "key": "_data",
                  "label": "Data",
                  "type": "string",
                  "placeholder": "",
                  "list": false,
                  "required": true
                }
              ],
              "outputFields": [],
              "sample": {}
            }
          },
          {
            "key": "safeTransferFromAction",
            "name": "Safe Transfer From",
            "display": {
              "label": "Safe Transfer From",
              "description": "Safe Transfer From"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function safeTransferFrom(address _from, address _to, uint256 _id, uint256 _value, bytes _data)",
              "inputFields": [
                {
                  "key": "_from",
                  "label": "From",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false,
                  "required": true
                },
                {
                  "key": "_to",
                  "label": "To",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false,
                  "required": true
                },
                {
                  "key": "_id",
                  "label": "Id",
                  "type": "string",
                  "placeholder": "",
                  "list": false,
                  "required": true
                },
                {
                  "key": "_value",
                  "label": "Value",
                  "type": "string",
                  "placeholder": "",
                  "list": false,
                  "required": true
                },
                {
                  "key": "_data",
                  "label": "Data",
                  "type": "string",
                  "placeholder": "",
                  "list": false,
                  "required": true
                }
              ],
              "outputFields": [],
              "sample": {}
            }
          },
          {
            "key": "setApprovalForAllAction",
            "name": "Set Approval For All",
            "display": {
              "label": "Set Approval For All",
              "description": "Set Approval For All"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function setApprovalForAll(address _operator, bool _approved)",
              "inputFields": [
                {
                  "key": "_operator",
                  "label": "Operator",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false,
                  "required": true
                },
                {
                  "key": "_approved",
                  "label": "Approved",
                  "type": "boolean",
                  "placeholder": "",
                  "list": false,
                  "required": true
                }
              ],
              "outputFields": [],
              "sample": {}
            }
          },
          {
            "key": "setContractURIAction",
            "name": "Set Contract URI",
            "display": {
              "label": "Set Contract URI",
              "description": "Set Contract URI"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function setContractURI(string contractURI)",
              "inputFields": [
                {
                  "key": "contractURI",
                  "label": "Contract URI",
                  "type": "string",
                  "placeholder": "",
                  "list": false,
                  "required": true
                }
              ],
              "outputFields": [],
              "sample": {}
            }
          },
          {
            "key": "setTokenURIPrefixAction",
            "name": "Set Token URI Prefix",
            "display": {
              "label": "Set Token URI Prefix",
              "description": "Set Token URI Prefix"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function setTokenURIPrefix(string tokenURIPrefix)",
              "inputFields": [
                {
                  "key": "tokenURIPrefix",
                  "label": "Token URI Prefix",
                  "type": "string",
                  "placeholder": "",
                  "list": false,
                  "required": true
                }
              ],
              "outputFields": [],
              "sample": {}
            }
          },
          {
            "key": "supportsInterfaceAction",
            "name": "Supports Interface (View function)",
            "display": {
              "label": "Supports Interface (View function)",
              "description": "Supports Interface (View function)"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function supportsInterface(bytes4 interfaceId) view returns bool",
              "inputFields": [
                {
                  "key": "interfaceId",
                  "label": "Interface Id",
                  "type": "string",
                  "placeholder": "",
                  "list": false,
                  "required": true
                }
              ],
              "outputFields": [
                {
                  "key": "returnValue",
                  "label": "Return value of Supports Interface",
                  "type": "boolean"
                }
              ],
              "sample": {}
            }
          },
          {
            "key": "symbolAction",
            "name": "Symbol (View function)",
            "display": {
              "label": "Symbol (View function)",
              "description": "Symbol (View function)"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function symbol() view returns string",
              "inputFields": [],
              "outputFields": [
                {
                  "key": "returnValue",
                  "label": "Return value of Symbol",
                  "type": "string"
                }
              ],
              "sample": {}
            }
          },
          {
            "key": "tokenURIPrefixAction",
            "name": "Token URI Prefix (View function)",
            "display": {
              "label": "Token URI Prefix (View function)",
              "description": "Token URI Prefix (View function)"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function tokenURIPrefix() view returns string",
              "inputFields": [],
              "outputFields": [
                {
                  "key": "returnValue",
                  "label": "Return value of Token URI Prefix",
                  "type": "string"
                }
              ],
              "sample": {}
            }
          },
          {
            "key": "transferOwnershipAction",
            "name": "Transfer Ownership",
            "display": {
              "label": "Transfer Ownership",
              "description": "Transfer Ownership"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function transferOwnership(address newOwner)",
              "inputFields": [
                {
                  "key": "newOwner",
                  "label": "New Owner",
                  "type": "address",
                  "placeholder": "Enter a blockchain address",
                  "list": false,
                  "required": true
                }
              ],
              "outputFields": [],
              "sample": {}
            }
          },
          {
            "key": "uriAction",
            "name": "Uri (View function)",
            "display": {
              "label": "Uri (View function)",
              "description": "Uri (View function)"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function uri(uint256 _id) view returns string",
              "inputFields": [
                {
                  "key": "_id",
                  "label": "Id",
                  "type": "string",
                  "placeholder": "",
                  "list": false,
                  "required": true
                }
              ],
              "outputFields": [
                {
                  "key": "returnValue",
                  "label": "Return value of Uri",
                  "type": "string"
                }
              ],
              "sample": {}
            }
          }
        ],
        "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAXlSURBVHgB1VpZSFtZGP5dum/a2nbaTtsrdKF0OmjbB/tQuPalfapxKLSlhUkcBhEG1Hma8WFMQFBEifFB0AfjAqI+mJk+uZKIiIJK4sCg4nbdcNzjvut8J4wlZozem5w70A/E5J57Lv93zv/9y7kh+sIRRCoiPT1duHDhgqarq8tBKiGQVMTx48dTl5eXjVqtNoRUgmoESktLE3d3d7WLi4sh+LOQSlCFAFxGmJycTNr7LkmS+OrVK5FUgCoErFYrW33B/drU1FQqqQDuBJhwV1dXkw4YEjUaTRJxBncCJ0+eNGL1Dxybn59P1ev1AnEEVwKZmZna7e1tjbfxhYWFkO7ubjNxBDcCdrs9JCgo6Eg/7+3tFaOiokTiBG4EWltbf/MUrjdsbm5yEzQXAv8KN1nBFPH9+/dcBM2FwPnz5607OzuK5oyOjhp5CNpvAky4WH2BFGJlZYXpxkh+wi8CLS0tghzhegN2QSMC5Af8IgDhfi9XuN6wtLTkl6B9JmCxWET805OfwAKIjx8/9lnQPhMYHx83I2kRD5w9e9bIIhn5AJ8IMOFChMJR901MTBBKafJWWuwBPQO1t7f7JOgAUgi4jjAwMGD15vtIUtTf3099fX20trZGg4ODLgKnT58mdGcUHBzs9dmhoaHR9fX1NlKAYFIIrGriQcYzw1EmuIxfX1/fN8ZyBMTqWukzZ854JcK6N5Ti0YCTZEJRT1xXVxczMjKS435tbm6OUKAxF3C5jKcunE7nPhfa2NhwuRUjHBAQQMeOHfs8hrlfNTc3rw8NDdlIJhS5UG5u7iAMENhnZmxPTw+h8zp0DnOhw8TOdoLtCIS8d8mJ+8MdDoesXZDtQtnZ2Vr4tDA9Pc1aRtZhEQ9sbW3RzMwM6xVcRKCVkKtXrzJB6+TMl7UDrMfNyMiwwn0EVgIowVE74AlkdpdO7t27F11dXW076n5ZYfTBgwcSfLb41KlTpDaY4C9dulT09u1bWWdJsvNAWVmZHlsdjsqzmIlPDWDlbQ8fPoxua2vTdXZ2ypojm0BJSYk5JiaGamtrtYgq4bdv3/6LOOHEiRPS/fv3YxB9olHbSWj+c1BnyToMk00AvmkKCwsbKCoqKjQajVRRUfENGvgfMSSRj2DJ7cqVK6a7d+9GInx+ev36dWJjY6MdvbMEApKcZ8jOA1VVVX+/ePFiHsnmF1YGv3z5cr6goKDw48ePf2A4FOE1gsV2T3jmgT1cvnzZ9uzZM01DQ0PxnTt3om7evGmBi2qhgfKmpqZfSSYUO3N+fr4Fich18hAYGCgh5MV++PDBgUZdQCy3IONGuN/vGYXg505oKBandbaIiIgQgD1PZGOY77x27VpkeXm5RDKhuJhDGNUhe86xz1gtAQnNnpOTY0bUINQxkVhZFr8lz3nYBScCgAH1Tjhc0AE/T4XvD+4ZzwLD8+fPY5UY75pHPgAGiFhVq/s1nETPnTt3zqTT6QxjY2NhCQkJP83Ozv6AHfgaArXeunUrDvqRsOoiiJjhisI+QwICDChH9KQQPsfDwsLCKhgY63kdYpfgzzFv3rz5Ewe6wtOnT79NS0v7lJSUJICYGZWseMDjpI6OjnDyAX4FdJPJZIdwIw4aA5EilB6GmpoaJ9wuETvGuq7/hEZEIuejR4+i8/LyfHoJoricdgc0wHbAfpBhMFgL49hRIyvOvMb069evG3w1nsGvpj45OVm6ePGi17NOFlYPMx45wIZ8kkN+wO9zobi4uJ9RI1mVzkNUktBLyKo4DwOXkzkkse9Q18vuohgg8mS52fYwcCEAV3JiF2SvJpKXKSUl5XfiAG6n0/Hx8cwg01H3YaekrKwsPXEC1xccCJ16ZGnJ2zhWnlD/6CIjIxW522HgSoC5ErJsrHuj7g40KgaUHTbiCO7vyFBKOFDkGTyv37hxo7GyslJPnKHKa1ZUp0bswufkxLLt8PCwllSAKgSQ3OZRPsTuVa1PnjzR4ZhEoi8N6B0079694/pW8n+H2WxW7YceDP8APjW7724QO2oAAAAASUVORK5CYII=",
        "user": "eip155:1:0x9C4De71cDbF4956c0Ab5c23d04912315865B7aA8"
      }
    }
    else if (actionName === 'aave') {
      action = {
        "key": "aave",
        "name": "AAVE",
        "version": "1.0.0",
        "platformVersion": "1.0.0",
        "type": "web3",
        "triggers": [
          {
            "key": "changeInHealthFactor",
            "name": "Change in Health Factor",
            "display": {
              "label": "Change in Health Factor",
              "description": "Change in Health Factor"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function addSigner(address account)",
              "inputFields": [
                {
                  "key": "healthFactorIsBelow",
                  "label": "Health Factor Is Below*",
                  "type": "string",
                  "placeholder": "0",
                  "list": false,
                  "required": false
                }
              ],
              "outputFields": [],
              "sample": {}
            }
          },
        ],
        "actions": [
          {
            "key": "changeInHealthFactor",
            "name": "Change in Health Factor",
            "display": {
              "label": "Change in Health Factor",
              "description": "Change in Health Factor"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function addSigner(address account)",
              "inputFields": [
                {
                  "key": "healthFactorIsBelow",
                  "label": "Health Factor Is Below*",
                  "type": "string",
                  "placeholder": "0",
                  "list": false,
                  "required": false
                }
              ],
              "outputFields": [],
              "sample": {}
            }
          },
        ],
        "icon": "https://cryptologos.cc/logos/aave-aave-logo.png?v=024",
        "user": "eip155:1:0x9C4De71cDbF4956c0Ab5c23d04912315865B7aA8"
      }
    }
    else if (actionName === 'smartVault') {
      action = {
        "key": "smartVault",
        "name": "Smart Vault",
        "version": "1.0.0",
        "platformVersion": "1.0.0",
        "type": "web3",
        "triggers": [
          {
            "key": "repay",
            "name": "Repay",
            "display": {
              "label": "Repay",
              "description": "Repay"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function addSigner(address account)",
              "inputFields": [
                {
                  "key": "yourCurrentSmartVaultBalance",
                  "label": "Your Current Smart Vault Balance",
                  "type": "string",
                  "placeholder": "Select Your Smart Vault Position",
                  "list": false,
                  "required": false
                },
                {
                  "key": "percentageOfYourDepositeUsedForEachTopUp",
                  "label": "Percentage of your deposit used for each top-up",
                  "type": "string",
                  "placeholder": "Enter the Percentage",
                  "list": false,
                  "required": false
                }
              ],
              "outputFields": [],
              "sample": {}
            }
          },
          {
            "key": "topup",
            "name": "Top-up",
            "display": {
              "label": "topup",
              "description": "Top-up"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function addSigner(address account)",
              "inputFields": [
                {
                  "key": "yourCurrentSmartVaultBalance",
                  "label": "Your Current Smart Vault Balance",
                  "type": "string",
                  "placeholder": "Select Your Smart Vault Position",
                  "list": false,
                  "required": false
                },
                {
                  "key": "percentageOfYourDepositeUsedForEachTopUp",
                  "label": "Percentage of your deposit used for each top-up",
                  "type": "string",
                  "placeholder": "Enter the Percentage",
                  "list": false,
                  "required": false
                }
              ],
              "outputFields": [],
              "sample": {}
            }
          },
        ],
        "actions": [
          {
            "key": "repay",
            "name": "Repay",
            "display": {
              "label": "Repay",
              "description": "Repay"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function addSigner(address account)",
              "inputFields": [
                {
                  "key": "yourCurrentSmartVaultBalance",
                  "label": "Your Current Smart Vault Balance",
                  "type": "string",
                  "placeholder": "Select Your Smart Vault Position",
                  "list": false,
                  "required": false
                },
                {
                  "key": "percentageOfYourDepositeUsedForEachTopUp",
                  "label": "Percentage of your deposit used for each top-up",
                  "type": "string",
                  "placeholder": "Enter the Percentage",
                  "list": false,
                  "required": false
                }
              ],
              "outputFields": [],
              "sample": {}
            }
          },
          {
            "key": "topup",
            "name": "Top-up",
            "display": {
              "label": "topup",
              "description": "Top-up"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function addSigner(address account)",
              "inputFields": [
                {
                  "key": "yourCurrentSmartVaultBalance",
                  "label": "Your Current Smart Vault Balance",
                  "type": "string",
                  "placeholder": "Select Your Smart Vault Position",
                  "list": false,
                  "required": false
                },
                {
                  "key": "percentageOfYourDepositeUsedForEachTopUp",
                  "label": "Percentage of your deposit used for each top-up",
                  "type": "string",
                  "placeholder": "Enter the Percentage",
                  "list": false,
                  "required": false
                }
              ],
              "outputFields": [],
              "sample": {}
            }
          },
        ],
        "icon": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAwADADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwB1FFdv4J0PT9SsLme8tlmZZQi7icAYB7fWuqTsrn5vg8LLFVVSg7M4iivYv+ET0L/oGxfmf8ar3fhPRDaSbdPjRtvDKSCPcc1HtUeu+HcR/Mvx/wAjyWitLV9In0i68twWib/VyY4Yf0PtWbWidzwqtKdKbhNWaCvSfhz/AMgi7/6+P/ZRXm1ek/Dn/kEXf/Xx/wCyioqbHq5F/vi9GXfF+v3GiWsAtVUzTMQHcZCgYzx680nhDxBPrdtcLdKglgYAsgwGBzjj14p/jNI5NCZPsj3MzMBCEQsUb+9x0wKTwYiR6Gsf2N7adWImDoVLt2bnrkVlpyn0fNW/tHl5/dte39feUviLxpFp/wBfH/srV5rXpPxG/wCQRaf9fH/srV5tWtP4T5zPf98fogrt/BGuafpthcwXlysLNKHXcDgjAHb6VxFFVJXVjgweKlhaqqwV2exf8JZoX/QSh/X/AAo/4SzQv+glD+v+FeO0VHskev8A6x1/5F+P+Z2/jbXNO1LT7aCzuVmdZd7bQcAYI7/WuIooq4qyseRjMVLFVXVmrM//2Q==",
        "user": "eip155:1:0x9C4De71cDbF4956c0Ab5c23d04912315865B7aA8"
      }
    }
    else if (actionName === '1inch'){
      action = {
        "key": "1inch",
        "name": "1Inch",
        "version": "1.0.0",
        "platformVersion": "1.0.0",
        "type": "web3",
        "triggers": [
          {
            "key": "priceIsBelow",
            "name": "Price is Below",
            "display": {
              "label": "Price is Below",
              "description": "Price is Below"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function addSigner(address account)",
              "inputFields": [
                {
                  "key": "priceIsBelow",
                  "label": "Price Is Below*",
                  "type": "string",
                  "placeholder": "0",
                  "list": false,
                  "required": false
                }
              ],
              "outputFields": [],
              "sample": {}
            }
          },
        ],
        "actions": [
          {
            "key": "priceIsBelow",
            "name": "Price is Below",
            "display": {
              "label": "Price is Below",
              "description": "Price is Below"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function addSigner(address account)",
              "inputFields": [
                {
                  "key": "priceIsBelow",
                  "label": "Price Is Below*",
                  "type": "string",
                  "placeholder": "0",
                  "list": false,
                  "required": false
                }
              ],
              "outputFields": [],
              "sample": {}
            }
          },
        ],
        "icon": "https://cryptologos.cc/logos/1inch-1inch-logo.png?v=024",
        "user": "eip155:1:0x9C4De71cDbF4956c0Ab5c23d04912315865B7aA8"
      }
    }
    else if (actionName === 'uniswap'){
      action = {
        "key": "uniswap",
        "name": "Uniswap V3",
        "version": "1.0.0",
        "platformVersion": "1.0.0",
        "type": "web3",
        "triggers": [
          {
            "key": "lpOutOfRange",
            "name": "LP out of range ",
            "display": {
              "label": "LP out of range ",
              "description": "LP out of range "
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function addSigner(address account)",
              "inputFields": [
                {
                  "key": "healthFactorIsBelow",
                  "label": "Health Factor is below*",
                  "type": "string",
                  "placeholder": "0",
                  "list": false,
                  "required": false
                }
              ],
              "outputFields": [],
              "sample": {}
            }
          },
        ],
        "actions": [
          {
            "key": "healthFactorIsBelow",
            "name": "Health Factor is below",
            "display": {
              "label": "Health Factor is below",
              "description": "Health Factor is below"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function addSigner(address account)",
              "inputFields": [
                {
                  "key": "healthFactorIsBelow",
                  "label": "Health Factor is below*",
                  "type": "string",
                  "placeholder": "0",
                  "list": false,
                  "required": false
                }
              ],
              "outputFields": [],
              "sample": {}
            }
          },
        ],
        "icon": "https://cryptologos.cc/logos/uniswap-uni-logo.png?v=024",
        "user": "eip155:1:0x9C4De71cDbF4956c0Ab5c23d04912315865B7aA8"
      }
    }
    else if (actionName === 'curve'){
      action = {
        "key": "curve",
        "name": "Curve",
        "version": "1.0.0",
        "platformVersion": "1.0.0",
        "type": "web3",
        "triggers": [
          {
            "key": "poolImbalanceRatio",
            "name": "Pool Imbalance Ratio",
            "display": {
              "label": "Pool Imbalance Ratio",
              "description": "Pool Imbalance Ratio "
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function addSigner(address account)",
              "inputFields": [
                {
                  "key": "ratio",
                  "label": "Ratio*",
                  "type": "string",
                  "placeholder": "0",
                  "list": false,
                  "required": false
                }
              ],
              "outputFields": [],
              "sample": {}
            }
          },
        ],
        "actions": [
          {
            "key": "healthFactorIsBelow",
            "name": "Health Factor is below",
            "display": {
              "label": "Health Factor is below",
              "description": "Health Factor is below"
            },
            "operation": {
              "type": "blockchain:call",
              "signature": "function addSigner(address account)",
              "inputFields": [
                {
                  "key": "healthFactorIsBelow",
                  "label": "Health Factor is below*",
                  "type": "string",
                  "placeholder": "0",
                  "list": false,
                  "required": false
                }
              ],
              "outputFields": [],
              "sample": {}
            }
          },
        ],
        "icon": "https://cryptologos.cc/logos/curve-dao-token-crv-logo.png?v=024",
        "user": "eip155:1:0x9C4De71cDbF4956c0Ab5c23d04912315865B7aA8"
      }
    }
    return action
  }

  // const getConnector = async (key: string) => {
  const getConnector = (key: string) => {
    console.log(`getConnector`,key)
    const res = getConnectoAction(key)
    console.log(res)
    // const res = await client?.getDriver(
    //   key,
    //   isLocalOrStaging ? "staging" : undefined,
    //   false
    // );

    if (res) {
      setConnector(res);
    } else {
      setConnector(null);
      setSavedCredentials([]);
    }
  };

  const listCredentials = async () => {
    const res = await client?.listAuthCredentials(
      connector?.key || "",
      isLocalOrStaging ? "staging" : "production"
    );
    if (res) {
      setSavedCredentials(res);
    } else {
      setSavedCredentials([]);
    }
  };

  useEffect(() => {
    setOperation(
      type === "trigger"
        ? connector?.triggers?.find(
          (trigger) => trigger.key === workflow.trigger.operation
        )
        : connector?.actions?.find(
          (action) => action.key === workflow.actions[index].operation
        )
    );
  }, [connector, type, workflow]);

  useEffect(() => {
    passOutputFields();
  }, [passOutputFields]);

  useEffect(() => {
    if (type === "trigger") {
      updateWorkflow({
        "system.trigger.selected": operation ? true : false,
        "system.trigger.authenticated": operationIsAuthenticated ? true : false,
        "system.trigger.configured": operationIsConfigured ? true : false,
        "system.trigger.tested": true,
      });
    } else {
      updateWorkflow({
        ["system.actions[" + index + "].selected"]: operation ? true : false,
        ["system.actions[" + index + "].authenticated"]:
          operationIsAuthenticated ? true : false,
        ["system.actions[" + index + "].configured"]: operationIsConfigured
          ? true
          : false,
        ["system.actions[" + index + "].tested"]: operationIsTested
          ? true
          : false,
      });
    }
  }, [
    operation,
    operationIsAuthenticated,
    operationIsConfigured,
    operationIsTested,
    key,
  ]);

  useEffect(() => {
    if (operationAuthenticationIsRequired) {
      listCredentials();
    }
  }, [connector?.key, operationAuthenticationIsRequired]);

  return (
    <WorkflowStepContext.Provider
      value={{
        type,
        index,
        step,
        activeRow,
        username,
        connector,
        operation,
        operationIsConfigured,
        operationIsAuthenticated,
        operationAuthenticationIsRequired,
        inputError,
        errors,
        operationIsTested,
        savedCredentials,
        setConnector,
        setActiveRow,
        setUsername,
        getConnector,
        setInputError,
        setErrors,
        setOperationIsTested,
        setSavedCredentials,
      }}
    >
      {children}
    </WorkflowStepContext.Provider>
  );
};

export default WorkflowStepContextProvider;
