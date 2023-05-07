import React, { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { CircularProgress } from "grindery-ui";
import { isLocalOrStaging } from "../../../constants";
import useAppContext from "../../../hooks/useAppContext";
import useNetworkContext from "../../../hooks/useNetworkContext";
import Button from "../../network/Button";

const Container = styled.div`
  min-height: 100vh;
  background: #444444;
  box-sizing: border-box;
  padding: 75px 20px 40px;
`;

const Content = styled.div`
  max-width: 816px;
  margin: 60px auto 0;
  padding: 64px 106px;
  background: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 16px;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-weight: 700;
  font-size: 32px;
  line-height: 120%;
  text-align: center;
  color: #0b0d17;
  margin: 0 0 32px;
  padding: 0;
`;

const Error = styled.div`
  text-align: center;
  width: 100%;
  max-width: 350px;
  margin: 0 auto 32px;
  color: #ff5858;
  padding: 0;
`;

const ButtonsWrapper = styled.div`
  margin: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 10px;

  & button {
    padding: 8px 24px;
  }
`;

const Loading = styled.div`
  text-align: center;
  color: #ffb930;
  width: 100%;
  margin: 0 0 32px;
`;

type Props = {};

const CloneConnectorPage = (props: Props) => {
  let { key } = useParams();
  let navigate = useNavigate();
  const { client } = useAppContext();
  const { state, cloneConnector } = useNetworkContext();
  let [searchParams] = useSearchParams();
  const name = searchParams.get("name");
  const source = searchParams.get("source");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ type: "", text: "" });

  const initClone = async () => {
    setError({ type: "", text: "" });
    setLoading(true);
    let cds;
    if (source && source === "nexus") {
      try {
        cds = await client?.getDriver(
          key || "",
          isLocalOrStaging ? "staging" : undefined
        );
      } catch (err: any) {
        console.error("getDriver error", err);
        setError({
          type: "submit",
          text:
            err?.response?.data?.error ||
            err?.response?.data?.message ||
            err?.message ||
            "Server error",
        });
        setLoading(false);
        return;
      }
    } else {
      cds = JSON.parse(
        state.connectors.find(
          (connector: any) => JSON.parse(connector?.values?.cds)?.key === key
        )?.values?.cds
      );
    }

    if (!cds) {
      setError({
        type: "submit",
        text: "Connector not found",
      });
      setLoading(false);
      return;
    }

    let clonedKey;

    try {
      clonedKey = await cloneConnector(cds);
    } catch (err: any) {
      setError({
        type: "submit",
        text:
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Server error",
      });
      setLoading(false);
      return;
    }
    setLoading(false);
    navigate(`/network/connector/${clonedKey}`);
  };

  return (
    <Container>
      <Content>
        <Title>Clone {name ? `${name} Connector` : "Connector"}</Title>
        {loading && (
          <Loading>
            <CircularProgress color="inherit" />
          </Loading>
        )}
        {error.type === "submit" && <Error>{error.text}</Error>}
        <ButtonsWrapper>
          <Button
            style={{
              padding: "7px 24px",
              background: "none",
              border: "1px solid #0b0d17",
            }}
            onClick={() => {
              navigate(-1);
            }}
          >
            Cancel
          </Button>
          <Button disabled={loading} onClick={initClone}>
            {error && error.type ? "Try Again" : "Clone"}
          </Button>
        </ButtonsWrapper>
      </Content>
    </Container>
  );
};

export default CloneConnectorPage;
