import React, { useEffect, useReducer } from "react";
import axios from "axios";
import styled from "styled-components";
import { CircularProgress } from "grindery-ui";
import { getCDS } from "../../helpers/cds";
import ConnectorSubmissionProgress from "./ConnectorSubmissionProgress";
import ConnectorSubmissionStep1 from "./ConnectorSubmissionStep1";
import ConnectorSubmissionStep0 from "./ConnectorSubmissionStep0";
import ConnectorSubmissionStep2 from "./ConnectorSubmissionStep2";
import ConnectorSubmissionLoading from "./ConnectorSubmissionLoading";
import { CDS_EDITOR_API_ENDPOINT, isLocalOrStaging } from "../../constants";
import useNetworkContext from "../../hooks/useNetworkContext";
// import { useGrinderyNexus } from "use-grindery-nexus";
import { useGrinderyNexus } from "../../use-grindery-nexus/index";
import useWorkspaceContext from "../../hooks/useWorkspaceContext";
import { useNavigate } from "react-router-dom";

const Container = styled.div``;

type Props = {};

type DataProps = {
  entry: {
    blockchain: string;
    contract: string;
    abi: string;
    name: string;
    description: string;
    icon: string;
    cds: string;
  };
  contributor: {
    username: string;
  };
};

export type StateProps = {
  form: DataProps;
  step: number;
  error: {
    type: string;
    text: string;
  };
  loading: boolean;
};

const ConnectorSubmission = (props: Props) => {
  let navigate = useNavigate();
  const {
    state: { blockchains, contributor },
    refreshConnectors,
  } = useNetworkContext();
  const [state, setState] = useReducer(
    (state: StateProps, newState: Partial<StateProps>) => ({
      ...state,
      ...newState,
    }),
    {
      form: {
        entry: {
          blockchain: "",
          contract: "",
          abi: "",
          name: "",
          description: "",
          icon: "",
          cds: "",
        },
        contributor: {
          username: contributor.username || "",
        },
      },
      step: 0,
      error: {
        type: "",
        text: "",
      },
      loading: false,
    }
  );

  const { token } = useGrinderyNexus();
  const { workspaceToken } = useWorkspaceContext();
  const chains = blockchains.map((chain) => ({
    value: chain.id,
    label: chain.values.name || "",
    icon: chain.values.icon || "",
    id: chain.values.chain_id,
  }));

  const isEVM =
    state.form.entry.blockchain &&
    chains
      .find((chain: any) => chain.value === state.form.entry.blockchain)
      ?.id?.startsWith("eip155");

  const getABI = async (blockchain: string, addressContract: string) => {
    const chain = chains.find((c) => c.value === blockchain);
    if (chain) {
      return axios
        .get(
          CDS_EDITOR_API_ENDPOINT +
            "/abi?address=" +
            addressContract +
            "&blockchain=" +
            chain.id
        )
        .then((response) => response);
    } else {
      return null;
    }
  };

  const validateStep0 = async () => {
    setState({ error: { type: "", text: "" } });
    if (!state.form.entry.blockchain) {
      setState({
        error: {
          type: "blockchain",
          text: "Blockchain field is required",
        },
      });
      return;
    }
    if (!state.form.entry.contract) {
      setState({
        error: {
          type: "contract",
          text: "Smart-contract address field is required",
        },
      });

      return;
    }
    if (isEVM) {
      setState({ loading: true });

      getABI(state.form.entry.blockchain, state.form.entry.contract)
        .then((v) => {
          if (
            v &&
            v.data &&
            v.data.result &&
            v.data.result !== "Invalid Address format" &&
            v.data.result !== "Max rate limit reached"
          ) {
            setState({
              loading: false,
              form: {
                ...state.form,
                entry: {
                  ...state.form.entry,
                  abi: (v && v.data && v.data.result) || "",
                },
              },
              step: 1,
            });
          } else {
            setState({
              loading: false,
              form: { ...state.form, entry: { ...state.form.entry, abi: "" } },
              step: 1,
            });
          }
        })
        .catch((err) => {
          setState({
            loading: false,
            form: { ...state.form, entry: { ...state.form.entry, abi: "" } },
            step: 1,
          });
        });
    } else {
      setState({
        form: {
          ...state.form,
          entry: { ...state.form.entry, abi: JSON.stringify([]) },
        },
        step: 1,
      });
    }
  };

  const validateStep1 = () => {
    setState({ error: { type: "", text: "" } });
    if (!state.form.entry.abi) {
      setState({
        error: {
          type: "abi",
          text: "Smart-contract ABI is required",
        },
      });

      return;
    }
    setState({ step: 2 });
  };

  const validateStep2 = async () => {
    setState({ error: { type: "", text: "" } });
    if (!state.form.contributor.username) {
      setState({
        error: {
          type: "username",
          text: "Username field is required",
        },
      });
      return;
    }
    if (!state.form.entry.name) {
      setState({
        error: {
          type: "name",
          text: "Connector name field is required",
        },
      });
      return;
    }
    if (!state.form.entry.icon) {
      setState({
        error: {
          type: "icon",
          text: "Connector icon field is required",
        },
      });

      return;
    }

    setState({ loading: true });

    let cds: any;

    try {
      cds = await getCDS(
        state.form.entry.abi,
        state.form.entry.name,
        state.form.entry.icon
      );
    } catch (err: any) {
      setState({
        loading: false,
        error: {
          type: "cds",
          text:
            err?.response?.data?.message ||
            err?.message ||
            "ABI is incorrect, Connector JSON wasn't generated. Please, return to the previous step and edit the ABI.",
        },
        form: {
          ...state.form,
          entry: {
            ...state.form.entry,
            cds: "",
          },
        },
      });
      return;
    }
    if (cds) {
      setState({
        loading: false,
        form: {
          ...state.form,
          entry: {
            ...state.form.entry,
            cds: JSON.stringify(cds, null, 2),
          },
        },
      });
    } else {
      setState({
        loading: false,
        error: {
          type: "cds",
          text: "ABI is incorrect, CDS JSON wasn't generated. Please, return to the previous step and edit the ABI.",
        },
        form: {
          ...state.form,
          entry: {
            ...state.form.entry,
            cds: "",
          },
        },
      });
      return;
    }

    setState({ step: 3 });
  };

  const submitCDS = async () => {
    setState({ loading: true, error: { type: "", text: "" } });
    let res;
    try {
      res = await axios.post(
        `${CDS_EDITOR_API_ENDPOINT}/cds`,
        {
          data: state.form,
          environment: isLocalOrStaging ? "staging" : "production",
        },
        {
          headers: {
            Authorization: `Bearer ${workspaceToken || token?.access_token}`,
          },
        }
      );
    } catch (err: any) {
      console.error("err", err);
      setState({
        loading: false,
        error: {
          type: "submit",
          text:
            err?.response?.data?.message ||
            err?.message ||
            "Server error. Please, try again later.",
        },
      });
      return;
    }
    if (res && res.data && res.data.success && res.data.id) {
      // TODO: Reload connectors, redirect to editor
      let refreshRes;
      try {
        refreshRes = await refreshConnectors();
      } catch (err: any) {
        setState({
          loading: false,
          error: {
            type: "submit",
            text:
              err?.response?.data?.message ||
              err?.message ||
              "Server error. Please, try again later.",
          },
        });
      }
      if (refreshRes && refreshRes.success) {
        navigate(`/network/connector/${res.data.id}`);
      } else {
        setState({
          loading: false,
          error: {
            type: "submit",
            text: "Server error. Please, try again later.",
          },
        });
      }
    } else {
      setState({
        loading: false,
        error: {
          type: "submit",
          text: "Server error. Please, try again later.",
        },
      });
    }
  };

  useEffect(() => {
    if (state.step && state.step === 3) {
      submitCDS();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.step]);

  if (isLocalOrStaging) {
    console.log("connector submission state", state);
  }

  return chains && chains.length > 0 ? (
    <Container>
      <ConnectorSubmissionProgress state={state} setState={setState} />
      {state.step === 0 && (
        <ConnectorSubmissionStep0
          state={state}
          setState={setState}
          onSubmit={validateStep0}
        />
      )}
      {state.step === 1 && (
        <ConnectorSubmissionStep1
          state={state}
          setState={setState}
          onSubmit={validateStep1}
        />
      )}
      {state.step === 2 && (
        <ConnectorSubmissionStep2
          state={state}
          setState={setState}
          onSubmit={validateStep2}
        />
      )}
      {state.step === 3 && (
        <ConnectorSubmissionLoading state={state} setState={setState} />
      )}
    </Container>
  ) : (
    <div
      style={{
        textAlign: "center",
        color: "#ffb930",
        width: "100%",
        margin: "120px 0 60px",
      }}
    >
      <CircularProgress color="inherit" />
    </div>
  );
};

export default ConnectorSubmission;
