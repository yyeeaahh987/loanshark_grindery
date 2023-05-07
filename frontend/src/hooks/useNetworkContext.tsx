import { useContext } from "react";
import { NetworkContext } from "../context/NetworkContext";

const useNetworkContext = () => useContext(NetworkContext);

export default useNetworkContext;
