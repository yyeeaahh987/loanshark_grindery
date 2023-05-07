import React from "react";
import useConnectorContext from "../../hooks/useConnectorContext";
import Snackbar from "./Snackbar";

type Props = {
  children: React.ReactNode;
};

const SnackbarProvider = (props: Props) => {
  const { children } = props;
  const {
    state: { snackbar },
  } = useConnectorContext();

  return (
    <>
      {children}
      <Snackbar state={{ ...snackbar }} />
    </>
  );
};

export default SnackbarProvider;
