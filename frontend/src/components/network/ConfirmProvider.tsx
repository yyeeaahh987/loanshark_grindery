import React from "react";
import useConnectorContext from "../../hooks/useConnectorContext";
import Confirm from "./Confirm";

type Props = {
  children: React.ReactNode;
};

const ConfirmProvider = (props: Props) => {
  const { children } = props;
  const {
    state: { confirm },
  } = useConnectorContext();

  return (
    <>
      {children}
      <Confirm state={confirm} />
    </>
  );
};

export default ConfirmProvider;
