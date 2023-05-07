import React from "react";
import styled from "styled-components";
import { Dialog } from "grindery-ui";
import Button from "./Button";

const Message = styled.h5`
  font-weight: 500;
  font-size: 20px;
  line-height: 150%;
  margin: 0;
  padding: 10px 20px 25px;
  color: #0b0d17;
  text-align: center;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 20px;

  & button {
    padding: 8px 24px;
    font-size: 14px;
  }
`;

type Props = {
  state: {
    message: string;
    opened: boolean;
    onClose: () => void;
    onConfirm: () => void;
  };
};

const Confirm = (props: Props) => {
  const { state } = props;

  const { opened, onClose, onConfirm, message } = state;

  return (
    <Dialog open={opened} onClose={onClose} maxWidth={"375px"}>
      <Message>{message}</Message>
      <Buttons>
        <Button
          style={{
            padding: "7px 24px",
            background: "none",
            border: "1px solid #0b0d17",
          }}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Confirm
        </Button>
      </Buttons>
    </Dialog>
  );
};

export default Confirm;
