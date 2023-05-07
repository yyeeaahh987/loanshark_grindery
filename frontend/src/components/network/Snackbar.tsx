import React from "react";
import { Snackbar as GrinderySnackbar } from "grindery-ui";

type Props = {
  state: {
    opened: boolean;
    message: string;
    severity: string;
    onClose: () => void;
    duration?: number;
  };
};

const Snackbar = (props: Props) => {
  const { state } = props;

  return (
    <GrinderySnackbar
      open={state.opened}
      handleClose={state.onClose}
      message={state.message}
      hideCloseButton
      autoHideDuration={state.duration || null}
      severity={state.severity || "success"}
    />
  );
};

export default Snackbar;
