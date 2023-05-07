import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from "@mui/material";

import styled from "styled-components";
import { Grid } from '@mui/material'
import { IconButton, AppsMenu, Text } from "grindery-ui";
import useAppContext from "../../hooks/useAppContext";
import Logo from "./Logo";
import { GRINDERY_APPS, ICONS, SCREEN } from "../../constants";
import useWindowSize from "../../hooks/useWindowSize";
import { useMatch, useNavigate } from "react-router-dom";
import UserMenu from "./UserMenu";
import WorkspaceSelector from "./WorkspaceSelector";
// import { useGrinderyNexus } from "use-grindery-nexus";
import { useGrinderyNexus } from "../../use-grindery-nexus/index";

import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';

import lpTokenAbi from '../../abi/backd/lpToken.json';
import topupActionAbi from '../../abi/backd/topupAction.json';
import vaultBtcAbi from '../../abi/backd/vaultBtc.json';
import gasBankAbi from '../../abi/backd/gasBank.json';

const Web3 = require('web3');
const web3 = new Web3(window.ethereum); 

const dataHong = require('../../abi/Hong.json');
const lpPoolAbi = require('../../abi/backd/lpPool.json');
const FujiOracle = require('../../abi/fujidao/FujiOracle.json');

const Wrapper = styled.div`
  border-bottom: 1px solid #dcdcdc;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 10px;
  position: fixed;
  background: #ffffff;
  width: 435px;
  max-width: 100vw;
  box-sizing: border-box;
  z-index: 1201;
  @media (min-width: ${SCREEN.TABLET}) {
    width: 100%;
    top: 0;
    max-width: 100%;
  }
`;

const UserWrapper = styled.div`
  margin-left: 0;
  order: 4;
  @media (min-width: ${SCREEN.TABLET}) {
    order: 4;
  }
`;

const CloseButtonWrapper = styled.div`
  & .MuiIconButton-root img {
    width: 16px !important;
    height: 16px !important;
  }

  @media (min-width: ${SCREEN.TABLET}) {
    margin-left: 0;
    margin-right: 8px;
    order: 1;
  }
`;

const LogoWrapper = styled.div`
  order: 1;
  @media (min-width: ${SCREEN.TABLET}) {
    order: 2;
  }
`;

const CompanyNameWrapper = styled.div`
  display: none;
  @media (min-width: ${SCREEN.TABLET}) {
    display: block;
    order: 3;
    font-weight: 700;
    font-size: 16px;
    line-height: 110%;
    color: #0b0d17;
    cursor: pointer;
  }
`;

const BackWrapper = styled.div`
  & img {
    width: 16px;
    height: 16px;
  }
`;

const WorkspaceSelectorWrapper = styled.div`
  order: 2;
  margin-left: 5px;
  @media (min-width: ${SCREEN.TABLET}) {
    order: 3;
    margin-left: 20px;
  }
`;

const AppsMenuWrapper = styled.div`
  margin-left: auto;
  order: 3;

  @media (max-width: ${SCREEN.TABLET}) {
    & .apps-menu__dropdown {
      min-width: 220px;
      max-width: 220px;
    }
  }

  @media (min-width: ${SCREEN.TABLET}) {
    order: 3;
  }
`;

const ConnectWrapper = styled.div`
  display: none;
  @media (min-width: ${SCREEN.TABLET}) {
    order: 4;
    display: block;

    & button {
      background: #0b0d17;
      border-radius: 5px;
      box-shadow: none;
      font-weight: 700;
      font-size: 16px;
      line-height: 150%;
      color: #ffffff;
      padding: 8px 24px;
      cursor: pointer;
      border: none;

      &:hover {
        box-shadow: 0px 4px 8px rgba(106, 71, 147, 0.1);
      }
    }
  }
`;

type Props = {};

const btcTokenAddress = '0x9C1DCacB57ADa1E9e2D3a8280B7cfC7EB936186F';
const depositContractAddress = '0xCE7cb549c42Ba8a6654AdE82f3d77D6F7d2BCD78';
const LPtoken = '0x9f2b4EEb926d8de19289E93CBF524b6522397B05';
const FujiOracleAddress = '0x707c7C644a733E71E97C54Ee0F9686468d74b9B4';


const WBTC = '0x9C1DCacB57ADa1E9e2D3a8280B7cfC7EB936186F';
const USDT = '0x02823f9B469960Bb3b1de0B3746D4b95B7E35543';

const AppHeader = (props: Props) => {
  const { connect } = useGrinderyNexus();
  const { user, setAppOpened, appOpened } = useAppContext();
  console.log(`app context:`,user)
  const { size, width } = useWindowSize();
  let navigate = useNavigate();
  const [amount, setAmount] = useState<number>(0);
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  console.log(exchangeRate)
  const [priceOfBtc, setPriceOfBtc] = useState<number>(0);
  const isMatchingWorkflowNew = useMatch("/workflows/new");
  const isMatchingWorkflowEdit = useMatch("/workflows/edit/:key");
  const matchNewWorfklow = isMatchingWorkflowNew || isMatchingWorkflowEdit;
  const handleClose = () => {
    setAppOpened(!appOpened);
  };

  const handleBack = () => {
    navigate("/workflows");
  };

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [value, setValue] = useState(0);

  const handleOpen = () => {
    setOpen(true);
  };

  const handlePromptClose = () => {
    setOpen(false);
  };

  const handlePromptClose2 = () => {
    setOpen2(false);
  };

  const handlePromptClose3 = () => {
    setOpen3(false);
  };

  const handleDeposit = () => {
    setOpen(false);
    setOpen2(true);
  };

  const handleWithdraw = () => {
    setOpen(false);
    setOpen3(true);
  };


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };

  const handleConfirm = async () => {
    // Implement the deposit functionality here
    console.log("Deposit clicked!");

    window.ethereum.enable();

    const userAccount = await window.ethereum.request({ method: 'eth_requestAccounts' });

    let approveArgs = [
      depositContractAddress,
      web3.utils.toBN((Number(value) * 100000000).toFixed(0)).toString()
    ];

    let args = [
      web3.utils.toBN((Number(value) * 100000000).toFixed(0)).toString(),
    ];

    window.ethereum.enable();

    const btcTokenContract = new web3.eth.Contract(dataHong, btcTokenAddress);
    const lpTokenContract = new web3.eth.Contract(dataHong, LPtoken);
    const depositContract = new web3.eth.Contract(lpPoolAbi, depositContractAddress);

    await btcTokenContract.methods.totalSupply().call({}, (error: any, result: any) => {
      console.log(result);
    });

    await btcTokenContract.methods.approve(...approveArgs).send({ from: userAccount[0] })
      .on("error", (error: any, receipt: any) => {
        console.error(error);
        setOpen2(false);
      }).then(async (receipt: any) => {
        await depositContract.methods.deposit(...args).send({ from: userAccount[0] })
          .on("error", (error: any, receipt: any) => {
            console.error(error);
            setOpen2(false);
          }).then(async (receipt: any) => {
            lpTokenContract.methods.balanceOf(userAccount[0]).call({}, (error: any, result: any) => {
              setAmount(result);
              setOpen2(false);
            })
          });

      });
  };

  const handleConfirm2 = async () => {
    // Implement the deposit functionality here
    console.log("Deposit clicked!");

    window.ethereum.enable();

    const userAccount = await window.ethereum.request({ method: 'eth_requestAccounts' });

    let args = [
      web3.utils.toBN((Number(value) * 100000000 / web3.utils.fromWei((exchangeRate).toString(), 'ether')).toFixed(0)).toString(),
    ];

    window.ethereum.enable();

    const btcTokenContract = new web3.eth.Contract(dataHong, btcTokenAddress);
    const lpTokenContract = new web3.eth.Contract(dataHong, LPtoken);
    const depositContract = new web3.eth.Contract(lpPoolAbi, depositContractAddress);

    await btcTokenContract.methods.totalSupply().call({}, (error: any, result: any) => {
      console.log(result);
    });

    await depositContract.methods.redeem(...args).send({ from: userAccount[0] })
      .on("error", (error: any, receipt: any) => {
        console.error(error);
        setOpen3(false);
      }).then(async (receipt: any) => {
        lpTokenContract.methods.balanceOf(userAccount[0]).call({}, (error: any, result: any) => {
          setAmount(result);
          setOpen3(false);
        })
      });

  };

  useEffect(() => {
    (async () => {
        //check metamask are connected before
        window.ethereum.enable();
        let validAccount = await window.ethereum.request({ method: "eth_accounts" });
        if (validAccount) {
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
      console.log(accounts)
      lpTokenContract.methods.balanceOf(accounts[0]).call({}, (error: any, result: any) => {
        console.log(`balanceOf`,result)
        setAmount(result);
      })
      depositContract.methods.exchangeRate().call({}, (error: any, result: any) => {
        setExchangeRate(result?result:0);
      })

      let argsPriceOfBtc = [USDT, WBTC, 2]
      oracle.methods.getPriceOf(...argsPriceOfBtc).call({}, (error: any, result: any) => {
        setPriceOfBtc(result / 100);
      });

    }
    if (web3) {
      try {
        fetchMyAPI()
      } catch (error) {

        console.log(error);
      }
    }
  }, [web3])

  return (
    <Wrapper>
      <Dialog open={open} onClose={handlePromptClose}>
        <DialogTitle>Please select one of the following options:</DialogTitle>
        <DialogActions>
          <Button sx={{ color: "black" }} onClick={handleDeposit}>Deposit BTC</Button>
          <Button sx={{ color: "black" }} onClick={handleWithdraw}>Withdraw BTC</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={open2} onClose={handlePromptClose2}>
        <DialogTitle>Enter amount of BTC:</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            type="number"
            value={value}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "black" }} onClick={handleConfirm}>Deposit BTC</Button>
          <Button sx={{ color: "black" }} onClick={handlePromptClose2}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={open3} onClose={handlePromptClose3}>
        <DialogTitle>Enter amount of BTC:</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            type="number"
            value={value}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "black" }} onClick={handleConfirm2}>Withdraw BTC</Button>
          <Button sx={{ color: "black" }} onClick={handlePromptClose3}>Close</Button>
        </DialogActions>
      </Dialog>
      {user && matchNewWorfklow && (
        <BackWrapper>
          <IconButton icon={ICONS.BACK} onClick={handleBack} color="" />

        </BackWrapper>
      )}

      {!matchNewWorfklow ? (
        <>
          <LogoWrapper>
            <Logo variant="square" />
          </LogoWrapper>
          <CompanyNameWrapper
            onClick={() => {
              navigate("/");
            }}
          >
            Loanshark
          </CompanyNameWrapper>
        </>
      ) : (
        <></>
      )}

      {/* {user && !matchNewWorfklow && (
        <WorkspaceSelectorWrapper>
          <WorkspaceSelector />
        </WorkspaceSelectorWrapper>
      )} */}
      {!matchNewWorfklow && (
        <AppsMenuWrapper>
          {/* <AppsMenu apps={GRINDERY_APPS} /> */}
        </AppsMenuWrapper>
      )}

      {!user && "ethereum" in window && (
        <ConnectWrapper>
          <button
            onClick={() => {
              console.log(`connect wallet on click`)
              connect();
            }}
          >
            Connect wallet
          </button>
        </ConnectWrapper>
      )}

      {/* {(user && ((exchangeRate?exchangeRate:0) >0)) && ( */}
      {user && (
        <UserWrapper style={{ marginLeft: matchNewWorfklow ? "auto" : 0 }}>
          <div>
            <Grid container>
              <Grid item>
                <ConnectWrapper>
                  <button onClick={handleOpen}>
                    <Text variant="persistent" value={
                      "Vault Balance: "
                      + Number(Number(Number(amount) / 100000000 * web3.utils.fromWei((exchangeRate).toString(), 'ether')).toFixed(2)).toLocaleString() + " BTC ($"
                      + Number(Number(Number(amount) / 100000000 * web3.utils.fromWei((exchangeRate).toString(), 'ether') * Number(priceOfBtc)).toFixed(2)).toLocaleString()
                      + ")"
                    } />
                  </button>
                </ConnectWrapper>
              </Grid>
              <Grid item style={{ marginLeft: "100px" }}>
                <UserMenu />
              </Grid>
            </Grid>
            {/* <span>123</span>
            <span></span> */}
          </div>
          {/* <UserMenu /> */}
        </UserWrapper>
      )}

      {user &&
        (!matchNewWorfklow || size === "phone") &&
        ((width >= parseInt(SCREEN.TABLET.replace("px", "")) &&
          width < parseInt(SCREEN.TABLET_XL.replace("px", ""))) ||
          width >= parseInt(SCREEN.DESKTOP.replace("px", ""))) && (
          <CloseButtonWrapper style={{ marginLeft: !user ? "auto" : "0px" }}>
            {size === "desktop" && !appOpened ? (
              <IconButton icon={ICONS.MENU} onClick={handleClose} color="" />
            ) : size === "desktop" ? (
              <IconButton
                icon={ICONS.COLLAPSE}
                onClick={handleClose}
                color=""
              />
            ) : (
              <IconButton icon={ICONS.CLOSE} onClick={handleClose} color="" />
            )}
          </CloseButtonWrapper>
        )}
    </Wrapper>
  );
};

export default AppHeader;
