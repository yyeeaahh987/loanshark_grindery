import React from "react";
import { ICONS } from "../../constants";

type Props = {
  checked: boolean;
  onChange: (a: boolean) => void;
  style?: any;
  isNetwork?: boolean;
};

const CheckBox = (props: Props) => {
  const { checked, onChange, style, isNetwork } = props;
  return (
    <div
      onClick={() => {
        onChange(!checked);
      }}
      style={{ cursor: "pointer", ...style }}
    >
      <img
        src={
          checked
            ? isNetwork
              ? ICONS.NETWORK_CHECKBOX_CHECKED
              : ICONS.CHECKBOX_CHECKED
            : isNetwork
            ? ICONS.NETWORK_CHECKBOX_EMPTY
            : ICONS.CHECKBOX_EMPTY
        }
        alt={checked ? "filled checkbox icon" : "empty checkbox icon"}
        style={{ display: "block" }}
      />
    </div>
  );
};

export default CheckBox;
