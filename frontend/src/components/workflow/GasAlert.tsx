import React, { useEffect, useState } from "react";
import styled from "styled-components";
import _ from "lodash";
import { Alert } from "grindery-ui";
import { ICONS } from "../../constants";
import GasInput from "./GasInput";
// import { useGrinderyNexus } from "use-grindery-nexus";
import { useGrinderyNexus } from "../../use-grindery-nexus/index";
import useWorkspaceContext from "../../hooks/useWorkspaceContext";
import axios from "axios";

const AlertWrapper = styled.div`
  margin-bottom: 20px;
`;

type Props = {
  gasToken?: string;
  chain?: string;
  gas: string;
  onChange: (e: any) => void;
};

const GasAlert = (props: Props) => {
  const { gasToken, chain, gas, onChange } = props;
  const { token } = useGrinderyNexus();
  const { workspaceToken } = useWorkspaceContext();
  const [droneAddress, setDroneAddress] = useState("");

  const getDroneAddress = async (chainId: string, token: string) => {
    let res;
    try {
      res = await axios.post(
        "https://orchestrator.grindery.org/webhook/web3/callSmartContract/getDroneAddress",
        {
          chain: chainId,
          token: token,
        }
      );
    } catch (err: any) {
      console.error(
        "getDroneAddress error => ",
        err?.response?.data?.message || err?.message || "Unknown error"
      );
      setDroneAddress("");
      return;
    }
    const address = res?.data?.droneAddress || res?.data?.result?.payload?.droneAddress || "";

    setDroneAddress(address);
  };

  useEffect(() => {
    if (chain) {
      // getDroneAddress(chain, workspaceToken || token?.access_token || "");
    }
  }, [chain, token?.access_token, workspaceToken]);

  return (
    <AlertWrapper>
      <Alert
        color="warning"
        elevation={0}
        icon={
          <img src={ICONS.GAS_ALERT} width={20} height={20} alt="gas icon" />
        }
      >
        <>
          <div style={{ textAlign: "left", marginBottom: "4px" }}>
            This action will require you to pay gas. Make sure your account has
            funds. Current balance:{" "}
            <a
              href="#balance"
              style={{
                fontWeight: "bold",
                color: "inherit",
                textDecoration: "underline",
              }}
            >
              0.003 {gasToken}
            </a>
          </div>
          {droneAddress && (
            <p style={{ padding: 0, margin: "4px 0" }}>
              Transaction will be send from this address:{" "}
              <strong>{droneAddress}</strong>.
            </p>
          )}

          <GasInput value={gas} onChange={onChange} suffix={gasToken} />
        </>
      </Alert>
    </AlertWrapper>
  );
};

export default GasAlert;
