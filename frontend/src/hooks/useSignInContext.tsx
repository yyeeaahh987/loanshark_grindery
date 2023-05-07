import { useContext } from "react";
import { SignInContext } from "../context/SignInContext";

const useSignInContext = () => useContext(SignInContext);

export default useSignInContext;
