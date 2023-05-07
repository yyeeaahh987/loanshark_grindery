export type Workflow = {
  key?: any;
  title: string;
  trigger: Operation;
  actions: Operation[];
  creator: string;
  state?: any;
  source?: string;
  system?: any;
  signature?: string;
};

export type Operation = {
  type: "action" | "trigger" | "recipe";
  connector: string;
  operation: string;
  input: {
    [key: string]: string | number | boolean | (string | number | boolean)[];
  };
  display?: { [key: string]: string };
  authentication?: string;
  authenticationKey?: string;
  credentials?: { [key: string]: string | number | boolean };
};

export type WorkflowExecution = {
  executionId: string;
  startedAt: number;
};

export type WorkflowExecutionLog = {
  workflowKey: string;
  sessionId: string;
  executionId: string;
  startedAt: number;
  endedAt?: number;
  stepIndex?: number;
  input?: any;
  output?: any;
  error?: any;
};
