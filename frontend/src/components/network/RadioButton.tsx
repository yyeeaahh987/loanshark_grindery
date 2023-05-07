import React from "react";
import styled from "styled-components";
import { ICONS } from "../../constants";

const Container = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 15px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #f4f5f7;
  }

  &.selected {
    background: #fff1d6 !important;
  }

  & label {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 150%;
    color: #0b0d17;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: nowrap;
    gap: 10px;
    cursor: pointer;

    & span {
      font-size: 12px;
      line-height: 150%;
      color: #898989;
    }
  }

  &.disabled {
    cursor: not-allowed !important;

    & * {
      cursor: not-allowed !important;
    }
    opacity: 0.5;
  }
`;

type Props = {
  selected: boolean;
  onChange: () => void;
  label?: string;
  description?: string;
  disabled?: boolean;
};

const RadioButton = (props: Props) => {
  const { label, selected, onChange, description, disabled } = props;
  return (
    <Container
      className={disabled ? "disabled" : selected ? "selected" : ""}
      onClick={disabled ? () => {} : onChange}
    >
      <img
        src={ICONS.NETWORK_RADIO_EMPTY}
        alt=""
        style={{ display: selected ? "none" : "block" }}
      />
      <img
        src={ICONS.NETWORK_RADIO_SELECTED}
        alt=""
        style={{ display: selected ? "block" : "none" }}
      />
      {label && (
        <label>
          {label}{" "}
          {!!description && (
            <span dangerouslySetInnerHTML={{ __html: description }} />
          )}
        </label>
      )}
    </Container>
  );
};

export default RadioButton;
