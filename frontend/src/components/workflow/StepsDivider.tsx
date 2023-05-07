import React from "react";

type Props = {
  height?: number;
};

const StepsDivider = (props: Props) => {
  const { height } = props;
  return (
    <div
      style={{
        width: "1px",
        height: height ? height + "px" : "32px",
        background: "#DCDCDC",
      }}
    ></div>
  );
};

export default StepsDivider;
