import React from "react";
import logo from "../../assets/images/nexus-logo.svg";
import logoHorizontal from "../../assets/images/nexus-logo-horizontal.svg";
import logoSquare from "../../assets/images/nexus-square.svg";
import loansharkSmall from "../../assets/images/loanshark-small.png";
import { useNavigate } from "react-router-dom";

type Props = {
  variant?: "horizontal" | "square";
  width?: string;
};

const Logo = (props: Props) => {
  const { variant, width } = props;
  let navigate = useNavigate();

  const returnSrc = () => {
    return loansharkSmall 
    // switch (variant) {
    //   case "horizontal":
    //     return logoHorizontal;
    //   case "square":
    //     return logoSquare;
    //   default:
    //     return logo;
    // }
  };

  return (
    <div>
      <img
        src={returnSrc()}
        alt="Grindery Flow logo"
        style={{
          display: "block",
          margin: "0 auto",
          cursor: "pointer",
          // width: width || "auto",
          width:"28px",
          height:"28px",
        }}
        onClick={() => {
          navigate("/");
        }}
      />
    </div>
  );
};

export default Logo;
