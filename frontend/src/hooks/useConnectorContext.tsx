import { useContext } from "react";
import { ConnectorContext } from "../context/ConnectorContext";

const useConnectorContext = () => useContext(ConnectorContext);

export default useConnectorContext;
