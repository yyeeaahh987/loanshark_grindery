import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { Snackbar } from "grindery-ui";
import styled from "styled-components";
import useAppContext from "../../hooks/useAppContext";
import useWorkflowContext from "../../hooks/useWorkflowContext";
import { SubscriberInformationModal } from '../../types/SubscriberInformationModal'
import { addSubscriberInformation } from '../../api/noitifcation/noitificationApi'
const Web3 = require('web3');
const web3 = new Web3(window.ethereum);

const Container = styled.div`
  margin: 48px auto 0;
  text-align: center;
`;

const Button = styled.button`
  border: none;
  background: #8c30f5;
  padding: 9.5px 16px;
  font-family: "Roboto";
  font-weight: 700;
  font-size: 14px;
  line-height: 150%;
  text-align: center;
  color: #ffffff;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: none;

  &:hover {
    box-shadow: 0px 4px 8px rgba(106, 71, 147, 0.1);
  }

  &:disabled {
    background: #dcdcdc;
    cursor: not-allowed;
    color: #706e6e;
  }

  &:disabled:hover {
    box-shadow: none;
  }
`;


const btcTokenAddress = '0x9C1DCacB57ADa1E9e2D3a8280B7cfC7EB936186F';
const depositContractAddress = '0xCE7cb549c42Ba8a6654AdE82f3d77D6F7d2BCD78';
const LPtoken = '0x9f2b4EEb926d8de19289E93CBF524b6522397B05';
const FujiOracleAddress = '0x707c7C644a733E71E97C54Ee0F9686468d74b9B4';

const dataHong = require('../../abi/Hong.json');
const lpPoolAbi = require('../../abi/backd/lpPool.json');
const lpTokenAbi = require('../../abi/backd/lpToken.json');
const FujiOracle = require('../../abi/fujidao/FujiOracle.json');
const topupActionAbi = require('../../abi/backd/topupAction.json');

type Props = {};

const WorkflowSave = (props: Props) => {
  const { workflow, saveWorkflow, workflowReadyToSave, updateWorkflow } =
    useWorkflowContext();
  const { editWorkflow } = useAppContext();
  const { key } = useParams();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<Number>(0);
  const [exchangeRate, setExchangeRate] = useState<Number>(0);
  const [snackbar, setSnackbar] = useState({
    opened: false,
    message: "",
    severity: "suscess",
  });

  useEffect(() => {
    (async () => {
      if (localStorage.getItem("isWalletConnected") === "true") {
        //check metamask are connected before
        window.ethereum.enable();
        let validAccount = await window.ethereum.request({ method: "eth_accounts" });
        if (validAccount) {
        }
      }
    })
      ()
  }, [])


  useEffect(() => {
    async function fetchMyAPI() {

      const lpTokenContract = new web3.eth.Contract(dataHong, LPtoken);
      const depositContract = new web3.eth.Contract(lpPoolAbi, depositContractAddress);
      const oracle = new web3.eth.Contract(FujiOracle.abi, FujiOracleAddress);
      window.ethereum.enable();
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      lpTokenContract.methods.balanceOf(accounts[0]).call({}, (error: any, result: any) => {
        setAmount(result);
      })
      depositContract.methods.exchangeRate().call({}, (error: any, result: any) => {
        setExchangeRate(result);
      })
    }
    if (web3) {
      try {
        fetchMyAPI()
      } catch (error) {
        console.log(error);
      }
    }
  }, [web3])

  const handleConfirm = async () => {
    // Implement the deposit functionality here
    console.log("Deposit clicked!");

    console.log(workflow);
    console.log("healthFactorIsBelow" + workflow.trigger?.input.healthFactorIsBelow);
    console.log("percentageOfYourDepositeUsedForEachTopUp" + workflow.actions[0]?.input.percentageOfYourDepositeUsedForEachTopUp);

    const totalAmount = Number(amount);
    const singleTopupAmount = Number(amount) * Number(workflow.actions[0]?.input.percentageOfYourDepositeUsedForEachTopUp) / 100;
    const healthFactorPercentage = workflow.trigger?.input.healthFactorIsBelow;

    window.ethereum.enable();

    const userAccount = await window.ethereum.request({ method: 'eth_requestAccounts' });

    let approveArgs = [
      "0x26B831D2Bf4C41D6C942784aDD61D4414a777a63",
      web3.utils.toBN((Number(totalAmount)).toFixed(0)).toString()
    ];

    let argsRegister = [
      userAccount[0] + "000000000000000000000000",
      "0x66756a6964616f00000000000000000000000000000000000000000000000000",
      web3.utils.toBN(totalAmount),
      [
        web3.utils.toBN(web3.utils.toWei((healthFactorPercentage).toString(), 'ether')).toString(),
        "0",
        "1",
        "0x9c1dcacb57ada1e9e2d3a8280b7cfc7eb936186f",
        "0x9f2b4eeb926d8de19289e93cbf524b6522397b05",
        web3.utils.toBN((singleTopupAmount * 0.9999).toFixed(0)).toString(),
        web3.utils.toBN((totalAmount * 0.9999).toFixed(0)).toString(),
        web3.utils.toBN((totalAmount * 0.9999).toFixed(0)).toString(),
        "0x0000000000000000000000000000000000000000000000000000000000000001"
      ]
    ];


    window.ethereum.enable();

    const lpTokenContract = new web3.eth.Contract(lpTokenAbi, "0x9f2b4eeb926d8de19289e93cbf524b6522397b05");
    const topupActionContract = new web3.eth.Contract(topupActionAbi, "0x26B831D2Bf4C41D6C942784aDD61D4414a777a63");

    await lpTokenContract.methods.approve(...approveArgs).send({ from: userAccount[0] })
      .on("error", (error: any, receipt: any) => {
        console.error(error);
      }).then(async (receipt: any) => {
        await topupActionContract.methods.register(...argsRegister).send({ from: userAccount[0], value: 1000000000000 })
          .on("error", (error: any, receipt: any) => {
            console.error(error);
          }).then(async (receipt: any) => {
            lpTokenContract.methods.balanceOf(userAccount[0]).call({}, (error: any, result: any) => {

            })
          });

      });
  };


  const handleClick = async () => {

    console.log(`workflowsave: `, key)
    if (key) {
      setLoading(true);
      const wf = { ...workflow };
      delete wf.signature;
      delete wf.system;

      editWorkflow(
        {
          ...wf,
          state: wf.state === "on" && workflowReadyToSave ? "on" : "off",
          signature: JSON.stringify(wf),
        },
        false,
        () => {
          setSnackbar({
            opened: true,
            message: "Workflow updated",
            severity: "success",
          });
          setLoading(false);
        }
      );
      console.log(`workflowsave: `, wf)
      updateWorkflow({
        state: wf.state === "on" && workflowReadyToSave ? "on" : "off",
      });
    } else {
      saveWorkflow();
    }

    //additional workflow to db
    console.log(workflow)
    let alertRelated = workflow.actions.filter((item) => (['telegram', 'email', 'discord'].indexOf(item.connector) !== -1))
    if (alertRelated.length > 0) {
      //additional workflow to db
      let requestBody: SubscriberInformationModal = {
        address: '',
        status: '',
        condition: [],
        notification: {
          telegram: {
            status: '',
            chatId: '',
            username: '',
          },
          email: {
            status: '',
            toList: '',
            ccList: '',
          },
          discord: {
            status: '',
            chatId: '',
          },
        }
      }
      for (let i = 0; i < workflow.actions.length; i++) {
        switch (workflow.actions[i].connector) {
          case "telegram":
            if ((requestBody?.notification?.telegram ?? null) !== null) {
              Object.assign(requestBody.notification.telegram, {
                status: 'on',
                chatId: '',
                username: '',
              })
            }
            break;
          case "email":
            if ((requestBody?.notification?.telegram ?? null) !== null) {
              Object.assign(requestBody.notification.email, {
                status: 'on',
                toList: workflow.actions[i].input.toList,
                ccList: '',
              })
            }
            break;
          case "discord":
            // requestBody = {
            //   ...requestBody,
            //   notification: {
            //     discord: {
            //       status: '',
            //       chatId: '',
            //     },
            //   }
            // }
            break;
          default:
        }
      }
      //update db
      let respond = addSubscriberInformation(requestBody)
      console.log(respond)
    }
    await handleConfirm();
  };

  return (
    <Container>
      <Button style={{
        borderRadius: "20px",
        border: "1px solid rgb(71, 145, 255)",
        backgroundColor: "rgba(71,145,255, 1)",
        padding: "10px 100px 10px 100px"
      }}
        disabled={loading} onClick={handleClick}>
        Save workflow
      </Button>
      <Snackbar
        open={snackbar.opened}
        handleClose={() => {
          setSnackbar({
            opened: false,
            message: "",
            severity: snackbar.severity,
          });
        }}
        message={snackbar.message}
        hideCloseButton
        autoHideDuration={2000}
        severity={snackbar.severity}
      />
    </Container>
  );
};

export default WorkflowSave;
