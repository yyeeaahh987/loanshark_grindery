import { useContext } from "react";
import { WorkspaceContext } from "../context/WorkspaceContext";

const useWorkspaceContext = () => useContext(WorkspaceContext);

export default useWorkspaceContext;
