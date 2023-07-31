import React, { useState, createContext, useEffect } from "react";
import _ from "lodash";
import { useNavigate, useParams } from "react-router-dom";
import { Workflow } from "../types/Workflow";
import {
  Action,
  Connector,
  Field,
  SelectedAction,
  SelectedTrigger,
  Trigger,
} from "../types/Connector";
import { defaultFunc } from "../helpers/utils";
import useAppContext from "../hooks/useAppContext";
import { isLocalOrStaging } from "../constants";
import useWorkspaceContext from "../hooks/useWorkspaceContext";
import { saveWorkflowsByDatabase } from '../api/serverApi'
// empty workflow declaration
const blankWorkflow: Workflow = {
  title: "Name your workflow",
  trigger: {
    type: "trigger",
    connector: "",
    operation: "",
    input: {},
  },
  actions: [
    {
      type: "action",
      connector: "",
      operation: "",
      input: {},
    },
  ],
  creator: "",
  state: "off",
  source: isLocalOrStaging
    ? "urn:grindery-staging:nexus"
    : "urn:grindery:nexus",
};

type WorkflowContextProps = {
  connectors: Connector[];
  workflow: Workflow;
  activeStep: number | string;
  loading: boolean;
  error?: string | null;
  success: string | null;
  setActiveStep: (a: any) => void;
  setLoading: (a: boolean) => void;
  setError: (a: string) => void;
  setSuccess: (a: string) => void;
  setWorkflow: (a: any) => void;
  saveWorkflow: (uuid:string, callback?: () => void) => void;
  resetWorkflow: () => void;
  updateWorkflow: (a: any) => void;
  triggers: {
    current?: SelectedTrigger;
    triggerConnector?: Connector;
    triggerConnectorIsSet: boolean;
    triggerAuthenticationIsRequired: boolean;
    triggerIsAuthenticated: boolean;
    triggerIsConfigured: boolean;
    availableTriggers: Trigger[];
    connectorsWithTriggers: Connector[];
  };
  actions: {
    current: (i: number) => SelectedAction | undefined;
    actionConnector: (i: number) => Connector | undefined;
    actionIsSet: (i: number) => boolean;
    actionConnectorIsSet: (i: number) => boolean;
    actionAuthenticationIsRequired: (i: number) => boolean;
    actionIsAuthenticated: (i: number) => boolean;
    actionIsConfigured: (i: number) => boolean;
    availableActions: (i: number) => Action[];
    connectorsWithActions: Connector[];
  };
  workflowReadyToSave: boolean;
};

type WorkflowContextProviderProps = {
  children: React.ReactNode;
};

export const WorkflowContext = createContext<WorkflowContextProps>({
  connectors: [],
  workflow: { ...blankWorkflow },
  activeStep: 1,
  loading: false,
  success: null,
  setActiveStep: defaultFunc,
  setWorkflow: defaultFunc,
  saveWorkflow: defaultFunc,
  resetWorkflow: defaultFunc,
  updateWorkflow: defaultFunc,
  setLoading: defaultFunc,
  setError: defaultFunc,
  setSuccess: defaultFunc,
  triggers: {
    triggerConnectorIsSet: false,
    triggerAuthenticationIsRequired: false,
    triggerIsAuthenticated: false,
    triggerIsConfigured: false,
    availableTriggers: [],
    connectorsWithTriggers: [],
  },
  actions: {
    current: () => undefined,
    actionConnector: () => undefined,
    actionIsSet: () => false,
    actionConnectorIsSet: () => false,
    actionAuthenticationIsRequired: () => false,
    actionIsAuthenticated: () => false,
    actionIsConfigured: () => false,
    availableActions: () => [],
    connectorsWithActions: [],
  },
  workflowReadyToSave: false,
});

export const WorkflowContextProvider = ({
  children,
}: WorkflowContextProviderProps) => {
  let navigate = useNavigate();
  let { key } = useParams();
  const { workspace } = useWorkspaceContext();
  const {
    getWorkflowsList, connectors: availableConnectors, client,
    workflows,
    user,
  } = useAppContext();
  console.log(`availableConnectors`, availableConnectors)

  // loaded nexus connectors CDS
  const [connectors, setConnectors] = useState<Connector[]>(
    availableConnectors || []
  );

  // workflow state
  const [workflow, setWorkflow] = useState<Workflow>({
    title: "Name your workflow",
    trigger: {
      type: "trigger",
      connector: "",
      operation: "",
      input: {},
    },
    actions: [
      {
        type: "action",
        connector: "",
        operation: "",
        input: {},
      },
    ],
    creator: user || "",
    state: "off",
    source: isLocalOrStaging
      ? "urn:grindery-staging:nexus"
      : "urn:grindery:nexus",
  });
  console.log(`workflow`,workflow)

  // is data loading
  const [loading, setLoading] = useState(false);

  // error message
  const [error, setError] = useState<string | null>(null);

  // success message
  const [success, setSuccess] = useState<string | null>(null);

  // active workflow builde step
  const [activeStep, setActiveStep] = useState<string | number>(1);

  // filter connectors that has triggers
  const connectorsWithTriggers = connectors.filter(
    (connector) =>
      connector &&
      ((connector.triggers && connector.triggers.length > 0) ||
        (connector.recipes &&
          connector.recipes.filter((recipe) => recipe && recipe.trigger)
            .length > 0))
  );

  // filter connectors that has actions
  const connectorsWithActions = connectors.filter(
    (connector) =>
      connector &&
      ((connector.actions && connector.actions.length > 0) ||
        (connector.recipes &&
          connector.recipes.filter(
            (recipe) =>
              recipe &&
              recipe.actions &&
              recipe.actions.length > 0 &&
              !recipe.trigger
          ).length > 0))
  );

  // check if trigger connector is selected
  const triggerConnectorIsSet = Boolean(
    workflow && workflow.trigger && workflow.trigger.connector
  );

  // check if action connector is selected
  const actionConnectorIsSet = (index: number) =>
    Boolean(
      workflow &&
      workflow.actions &&
      workflow.actions[index] &&
      workflow.actions[index].connector
    );

  // check if action operation is selected
  const actionIsSet = (index: number) =>
    Boolean(
      workflow &&
      workflow.actions &&
      workflow.actions[index] &&
      workflow.actions[index].operation
    );

  // current workflow's trigger connector key
  const workflowTriggerConnector = workflow.trigger.connector;

  // current workflow's trigger operation key
  const workflowTriggerOperation = workflow.trigger.operation;

  // current workflow's action connector key
  const workflowActionConnector = (index: number) =>
    workflow.actions[index]?.connector;

  // current workflow's action operation key
  const workflowActionOperation = (index: number) =>
    workflow.actions[index]?.operation;

  // current trigger's connector object
  const triggerConnector = connectors.find(
    (connector) =>
      connector && connector.key && connector.key === workflowTriggerConnector
  );

  // current trigger object
  const trigger: SelectedTrigger | undefined =
    triggerConnector?.triggers?.find(
      (connectorTrigger: { key: any }) =>
        connectorTrigger && connectorTrigger.key === workflowTriggerOperation
    ) ||
    triggerConnector?.recipes?.find(
      (connectorRecipe: { key: any }) =>
        connectorRecipe && connectorRecipe.key === workflowTriggerOperation
    );

  // current action's connector object
  const actionConnector = (index: number) =>
    connectors.find(
      (connector) =>
        connector &&
        connector.key &&
        connector.key === workflowActionConnector(index)
    );

  // current action object
  const action: (index: number) => SelectedAction | undefined = (index) =>
    actionConnector(index)?.actions?.find(
      (connectorAction: { key: any }) =>
        connectorAction &&
        connectorAction.key === workflowActionOperation(index)
    ) ||
    actionConnector(index)?.recipes?.find(
      (connectorRecipe: { key: any }) =>
        connectorRecipe &&
        connectorRecipe.key === workflowActionOperation(index)
    );

  // chech if trigger is authenticated (if required)
  const triggerIsAuthenticated = Boolean(
    (triggerConnector && !triggerConnector.authentication) ||
    (workflow.trigger?.credentials && triggerConnector?.authentication)
  );

  const actionIsAuthenticated = (index: number) =>
    Boolean(
      (actionConnector(index) && !actionConnector(index)?.authentication) ||
      (workflow.actions[index]?.credentials &&
        actionConnector(index)?.authentication)
    );

  // list trigger's required field names
  const requiredTriggerFields = [
    ...((trigger &&
      trigger.operation &&
      trigger.operation.inputFields &&
      trigger.operation.inputFields
        .filter((field: Field) => field && field.required)
        .map((field: Field) => field.key)) ||
      []),
    ...((trigger &&
      trigger.inputFields &&
      trigger.inputFields
        .filter((field: Field) => field && field.required)
        .map((field: Field) => field.key)) ||
      []),
  ];

  // check if trigger is configured (all required fields is set)
  const triggerIsConfigured = Boolean(
    requiredTriggerFields.filter(
      (field: string) =>
        workflow &&
        workflow.trigger &&
        workflow.trigger.input &&
        typeof workflow.trigger.input[field] !== "undefined" &&
        workflow.trigger.input[field] !== "" &&
        workflow.trigger.input[field] !== null
    ).length === requiredTriggerFields.length &&
    (trigger &&
      trigger.operation &&
      trigger.operation.type === "blockchain:event"
      ? workflow.trigger.input._grinderyChain &&
      workflow.trigger.input._grinderyContractAddress
      : true)
  );

  // list action's required field names
  const requiredActionFields = (index: number) => {
    return [
      ...((action(index)?.operation?.inputFields || [])
        .filter((field: Field) => field && field.required)
        .map((field: Field) => field.key) || []),
      ...((action(index)?.inputFields || [])
        .filter((field: Field) => field && field.required)
        .map((field: Field) => field.key) || []),
    ];
  };

  // check if action is configured (all required fields is set)
  const actionIsConfigured = (index: number) => {
    return Boolean(
      requiredActionFields(index).filter(
        (field: string) => workflow.actions[index]?.input?.[field]
      ).length === requiredActionFields(index).length &&
      (action(index)?.operation?.type === "blockchain:call"
        ? workflow.actions[index].input._grinderyChain &&
        workflow.actions[index].input._grinderyContractAddress &&
        workflow.actions[index].input._grinderyGasLimit
        : true)
    );
  };

  // current trigger's connector object
  const selectedTriggerConnector = connectorsWithTriggers.find(
    (connector) =>
      connector && connector.key && connector.key === workflow.trigger.connector
  );

  // current action's connector object
  const selectedActionConnector = (index: number) =>
    connectorsWithActions.find(
      (connector) =>
        connector &&
        connector.key &&
        connector.key === workflow.actions[index].connector
    );

  // list available triggers for the selected connector
  const availableTriggers = [
    ...((triggerConnectorIsSet &&
      selectedTriggerConnector &&
      selectedTriggerConnector.triggers) ||
      []),
    ...((triggerConnectorIsSet &&
      selectedTriggerConnector &&
      selectedTriggerConnector.recipes &&
      selectedTriggerConnector.recipes.filter((recipe) => recipe.trigger)) ||
      []),
  ];

  // list available actions for the selected connector
  const availableActions = (index: number) => [
    ...((actionConnectorIsSet(index) &&
      selectedActionConnector(index)?.actions) ||
      []),
    ...((actionConnectorIsSet(index) &&
      selectedActionConnector(index) &&
      selectedActionConnector(index)?.recipes?.filter(
        (recipe) => recipe.actions && !recipe.trigger
      )) ||
      []),
  ];

  // check if trigger authentication is required
  const triggerAuthenticationIsRequired = Boolean(
    triggerConnector && triggerConnector.authentication
  );

  // check if action authentication is required
  const actionAuthenticationIsRequired = (index: number) =>
    Boolean(actionConnector(index) && actionConnector(index)?.authentication);

  const triggers = {
    current: trigger,
    triggerConnector,
    triggerConnectorIsSet,
    triggerAuthenticationIsRequired,
    triggerIsAuthenticated,
    triggerIsConfigured,
    availableTriggers,
    connectorsWithTriggers,
  };

  console.log(triggers)

  const actions = {
    current: action,
    actionConnector,
    actionIsSet,
    actionConnectorIsSet,
    actionAuthenticationIsRequired,
    actionIsAuthenticated,
    actionIsConfigured,
    availableActions,
    connectorsWithActions,
  };

  const workflowReadyToSave =
    workflow?.system?.trigger?.selected &&
    workflow?.system?.trigger?.authenticated &&
    workflow?.system?.trigger?.configured &&
    workflow?.actions.filter(
      (action, i) =>
        workflow.system?.actions[i]?.selected &&
        workflow.system?.actions[i]?.authenticated &&
        workflow.system?.actions[i]?.configured &&
        workflow.system?.actions[i]?.tested
    ).length === workflow.actions.length;

  // update current workflow
  const updateWorkflow = (data: any) => {
    console.log(data)
    console.log(`updateWorkflow`,workflow)
    let newWorkflow = { ...workflow };
    Object.keys(data).forEach((path) => {
      console.log(path)
      _.set(newWorkflow, path, data[path]);
    });
    console.log(`updateWorkflow`,newWorkflow)
    setWorkflow(newWorkflow);
  };

  // reset current workflow
  const resetWorkflow = () => {
    setWorkflow({
      title: "Name your workflow",
      trigger: {
        type: "trigger",
        connector: "",
        operation: "",
        input: {},
      },
      actions: [
        {
          type: "action",
          connector: "",
          operation: "",
          input: {},
        },
      ],
      creator: user || "",
      state: "off",
      source: isLocalOrStaging
        ? "urn:grindery-staging:nexus"
        : "urn:grindery:nexus",
    });
    setActiveStep(1);
  };

  const saveWorkflow = async (uuid:string, callback?: () => void) => {
    console.log(`saveWorkflow`,workflow,uuid)
    if (workflow) {
      const readyWorkflow = {
        ...workflow,
        signature: JSON.stringify(workflow),
      };
      delete readyWorkflow.system;
      if (isLocalOrStaging) {
        console.log("readyWorkflow", readyWorkflow);
      }
      setError(null);
      setSuccess(null);
      setLoading(true);
      console.log("readyWorkflow", readyWorkflow);
      const res = await saveWorkflowsByDatabase(readyWorkflow,uuid)
      if (res) {
        getWorkflowsList();
        console.log(callback)
        if (!callback) {
          resetWorkflow();
          navigate("/workflows");
        } else {
          callback();
        }
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (availableConnectors) {
      setConnectors(availableConnectors);
    }
  }, [availableConnectors]);

  // set user id on success authentication
  useEffect(() => {
    if (user) {
      updateWorkflow({
        creator: user,
      });
    } else {
      updateWorkflow({
        creator: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    console.log(`use effect key`,key)
    if (key) {
      const selectedWorkflow = workflows.find((wf) => wf.key === key);
      if (selectedWorkflow) {
        const wf = _.cloneDeep(selectedWorkflow);
        setWorkflow(wf);
      }
    } else {
      resetWorkflow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (isLocalOrStaging) {
    console.log("connectors", connectors);
    console.log("workflow", workflow);
  }

  return (
    <WorkflowContext.Provider
      value={{
        connectors,
        workflow,
        activeStep,
        loading,
        error,
        success,
        setActiveStep,
        setWorkflow,
        saveWorkflow,
        resetWorkflow,
        updateWorkflow,
        setLoading,
        setError,
        setSuccess,
        triggers,
        actions,
        workflowReadyToSave,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};

export default WorkflowContextProvider;
