import { useContext } from "react";
import { WorkflowStepContext } from "../context/WorkflowStepContext";

const useWorkflowStepContext = () => useContext(WorkflowStepContext);

export default useWorkflowStepContext;
