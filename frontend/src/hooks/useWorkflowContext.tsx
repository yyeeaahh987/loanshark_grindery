import { useContext } from "react";
import { WorkflowContext } from "../context/WorkflowContext";

const useWorkflowContext = () => useContext(WorkflowContext);

export default useWorkflowContext;
