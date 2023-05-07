import React, { useState, useEffect, createContext, useContext } from 'react';
// @ts-ignore
import Web3Modal from 'web3modal';
// @ts-ignore
import * as ethersLib from 'ethers';
// @ts-ignore
import { encode } from 'universal-base64url';
// @ts-ignore
import * as fcl from '@onflow/fcl';

export const ENGINE_URL = 'https://orchestrator.grindery.org';

declare global {
  interface Window {
    nexus_auth: any;
  }
}

// Flow authentication account proof data type
type AccountProofData = {
  // e.g. "Awesome App (v0.0)" - A human readable string to identify your application during signing
  appIdentifier: string;

  // e.g. "75f8587e5bd5f9dcc9909d0dae1f0ac5814458b2ae129620502cb936fde7120a" - minimum 32-byte random nonce as hex string
  nonce: string;
};

// Flow auth account proof data resolver type
type AccountProofDataResolver = () => Promise<AccountProofData | null>;

// Flow auth config
fcl.config({
  'flow.network': 'mainnet',
  'discovery.wallet': 'https://fcl-discovery.onflow.org/authn',
  'app.detail.title': 'Grindery Nexus',
  'app.detail.icon':
    'https://nexus.grindery.org/static/media/nexus-square.7402bdeb27ab56504250ca409fac38bd.svg',
});

// Authentication token object definition
export type AuthToken = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
};

// Flow user type
type FlowUser = {
  addr: string;
  services?: any[];
};

// Context properties definition
export type GrinderyNexusContextProps = {
  /** User ID. Reference: https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-10.md */
  user: string | null;

  /** Authentication token object */
  token: AuthToken | null;

  /** User wallet address  */
  address: string | null;

  /** User chain id  */
  chain: number | string | null;

  /** Authorization code */
  code: string | null;

  /** Flow user object */
  flowUser: FlowUser;

  /** Ethers provider */
  provider: any;

  /** Ethers */
  ethers: any;

  /** Blockchains name */
  chainName: string | null | number;

  /** Connect user wallet */
  connect: () => void;

  /** Disconnect user wallet */
  disconnect: () => void;

  /** Set User ID  */
  setUser: React.Dispatch<React.SetStateAction<string | null>>;

  /** Set user wallet address  */
  setAddress: React.Dispatch<React.SetStateAction<string | null>>;

  /** Set user chain id  */
  setChain: React.Dispatch<React.SetStateAction<number | string | null>>;

  /** Connect flow user */
  connectFlow: () => void;
};

export type GrinderyNexusContextProviderProps = {
  children: React.ReactNode;

  /** Automatically authenticate user */
  cacheProvider?: boolean;
};

// Default context properties
const defaultContext = {
  user: null,
  address: null,
  chain: null,
  token: null,
  code: null,
  flowUser: { addr: '' },
  provider: null,
  ethers: null,
  chainName: null,
  connect: () => {},
  disconnect: () => {},
  setUser: () => {},
  setAddress: () => {},
  setChain: () => {},
  connectFlow: () => {},
};

/** Grindery Nexus Context */
export const GrinderyNexusContext = createContext<GrinderyNexusContextProps>(
  defaultContext
);

/** Grindery Nexus Context Provider */
export const GrinderyNexusContextProvider = (
  props: GrinderyNexusContextProviderProps
) => {
  const children = props.children;
  const cacheProvider =
    typeof props.cacheProvider !== 'undefined' ? props.cacheProvider : true;

  // Web3Modal instance
  const [web3Modal, setWeb3Modal] = useState<any>(null);

  // Web3Provider library
  const [library, setLibrary] = useState<any>(null);

  // User account
  const [account, setAccount] = useState<string | null>(null);

  // User id
  const [user, setUser] = useState<string | null>(null);

  // User wallet address
  const [address, setAddress] = useState<string | null>(null);

  // User chain id
  const [chain, setChain] = useState<number | string | null>(null);

  // Auth message
  const [message, setMessage] = useState<string | null>('');

  // Authentication token object
  const [token, setToken] = useState<AuthToken | null>(null);

  // Signed authentication message
  const [signature, setSignature] = useState<string | null>('');

  // Flow chain user
  const [flowUser, setFlowUser] = useState<FlowUser>({ addr: '' });

  // Is Flow account resolver called
  const [resolverCalled, setResolverCalled] = useState(false);

  // Chains list
  const [chains, setChains] = useState<any[]>([]);

  const chainName =
    chains.find(c => c.value && c.value === chain)?.label || chain;

  const provider = library;

  const ethers = ethersLib;

  const flowProof =
    flowUser &&
    flowUser.addr &&
    flowUser.services?.find(service => service.type === 'account-proof');

  // Compiled authorization code
  const code = (message && signature &&
      encode(
        JSON.stringify({
          message: message,
          signature: signature,
        })
      )) 
      ||
    (flowProof &&
      flowProof.data &&
      flowProof.data.nonce &&
      flowProof.data.signatures &&
      flowProof.data.signatures.length > 0 &&
      flowProof.data.address &&
      resolverCalled &&
      encode(
        JSON.stringify({
          type: 'flow',
          address: flowProof.data.address,
          nonce: flowProof.data.nonce,
          signatures: flowProof.data.signatures,
        })
      )) ||
    null;

    // const code =    encode(
    //   JSON.stringify({
    //     message: `Signing in on Grindery: eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..9nPWjk06WbxxhcMO.NmpLzgO6gg3F-wbf5ayH98Ji759vXdtaHqexZICKXkbFrjvr4OZPGDZPvufEV2Yo1KK-wzNtKc3CfTMxcHA34azOu6SyjNxD5l4fPM-tXgMGE86HNevVbjyTiSuuFcFdPMkNN3B3Ion39wR9LXLIn5RzQarKzljA4OPWG9g9dHBzu5999Tqh9_SJ7vDQfYV6qGs-QHVFMftDdmcXHmtTLOo1VTY0Eg.XlVCzsZ9isfgIZuMgemYNw`,
    //     signature: signature,
    //   })
    // )
    
  console.log(`message`)
  console.log(JSON.stringify(message))
  console.log(`signature`)
  console.log(JSON.stringify(signature))
  console.log(JSON.stringify(code))
  console.log(`code`,flowProof)

  // Subscribe to changes
  const addListeners = async (web3ModalProvider: any) => {
    // Subscribe to accounts change
    web3ModalProvider.on('accountsChanged', () => {
      window.location.reload();
    });

    // Subscribe to provider disconnection
    web3ModalProvider.on('disconnect', async () => {
      await web3Modal.clearCachedProvider();
      disconnect();
    });

    // Subscribe to chainId change
    web3ModalProvider.on('chainChanged', (chainId: string) => {
      setChain(`eip155:${parseInt(chainId, 16)}`);
    });
  };

  // Connect MetaMask wallet
  const connect = async () => {
    console.log(`connect wallet`)
    const provider = await web3Modal.connect();
    console.log(provider)
    addListeners(provider);
    const ethersProvider = new ethersLib.providers.Web3Provider(
      provider,
      'any'
    );
    console.log(ethersProvider)
    const userAddress = await ethersProvider.getSigner().getAddress();
    const userChain = await ethersProvider.getSigner().getChainId();
    const accounts = await ethersProvider.listAccounts();
    console.log(userAddress)
    console.log(userChain)
    console.log(accounts)
    setLibrary(ethersProvider);
    if (accounts) setAccount(accounts[0]);
    setAddress(userAddress);
    // For EVM wallet always set Ethereum chain
    setChain(`eip155:${userChain}`);
    console.log(`connect wallet done`)
  };

  // Connect with Flow wallet
  const connectFlow = () => {
    console.log(`connectFlow fcl`,fcl)
    fcl.authenticate();
  };

  // Clear user state
  const clearUserState = () => {
    setUser(null);
    setAddress(null);
    setChain(null);
    setAccount(null);
    setMessage(null);
    setToken(null);
    setSignature(null);
    setFlowUser({ addr: '' });
  };

  // Disconnect user
  const disconnect = async () => {
    console.log(`disconnect fcl`,fcl)
    await web3Modal.clearCachedProvider();
    if (flowUser && flowUser.addr) {
      fcl.unauthenticate();
    }
    clearUserState();
    clearAuthSession();
  };

  // Fetch authentication message or access token from the engine API
  const startSession = async (userAddress: string) => {
    console.log(`startSession`,userAddress)
    const tempToken={
      "access_token": "123eyJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJ1cm46Z3JpbmRlcnk6YWNjZXNzLXRva2VuOnYxIiwic3ViIjoiZWlwMTU1OjE6MHhEODY0OUFhZUJjMUJkNjU3MTQxNTlmM2I1NjI2QTQ2OTlEMGVCN2VDIiwiaWF0IjoxNjgyOTI0MzAwLCJpc3MiOiJ1cm46Z3JpbmRlcnk6b3JjaGVzdHJhdG9yIiwiZXhwIjoxNjgyOTI3OTAwfQ.0bGDu1bQ5bOktZs14f5x3XJmJ2NoUrD83AFHV-K2nrCnI3yCzcO9GFLrHvD5Rxb3UMjNw-g4XIByvt0Z6aYNug",
      "token_type": "bearer",
      "expires_in": 3600,
      "refresh_token": "123eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..W1l8zNYGdHg5T3jR.ktZsYtlCCyNpefB4_TOblscNCHaGCgWJYY6qYrPOha7nOH_apzdKpEv6ediNlxxKBzvpKUa6UjL0nOEA2DWYnJW79vgcimjzpAUXF1Lcl6FOHhJ0xyU_fwLXQHYy2sqU07ZwdEf_Z0RQFOsXALhQaF02Rsx7K5Z7xg3Npqv2A5nTf4kEpwDJR7pLWWQXAEa8SxACD7Bx0-Xx43WAkNBeQiSfb5hXtRZ3.mwlmuELLUP6ZIvzBxBa8cQ"
  }
  setToken(tempToken);
  return 


    // const resWithCreds = await fetch(
    //   `${ENGINE_URL}/oauth/session?address=${userAddress}`,
    //   {
    //     method: 'GET',
    //     credentials: 'include',
    //   }
    // );
    // console.log(`resWithCreds`,resWithCreds)
    // if (resWithCreds && resWithCreds.ok) {
    //   console.log(`resWithCreds`,resWithCreds)
    //   let json = await resWithCreds.json();
    //   console.log(json)
    //   // Set access token if exists
    //   if (json.access_token) {
    //     console.log(`resWithCreds`,resWithCreds)
    //     console.log(JSON.stringify(json))
    //     setToken(json);
    //   } else if (json.message) {
    //     // Or set auth message
    //     console.log(`set message`,json.message)
    //     setMessage(json.message);
    //     // setMessage(`Signing in on Grindery: eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..QN7b-UiEDTTtwR5o.v-KeOabufsbZW5A3F_k5iveDTZEMg1uU2yN2XjlRN4FMTh-mZEouQDy4tK4VY8KWLNfrq_-mPNbN-6V10Zf84Tl41T4Q3j2z2Mod2KCj4c8zAzCgpQLUb6poDY_eaYrt0WEdtTaQLQjWY-cGtEzUcrLmThY4JMdkbcAReyE3U19O3UAMoFsj3hyx1wM_l4KmDQJMFzne2oSEdJGjfN4rk_H2FzaWDg.cMqkd1AtbYjMhUnIvs7XIw`);
    //   }
    // } else {
    //   console.error(
    //     'startSessionWithCreds error',
    //     (resWithCreds && resWithCreds.status) || 'Unknown error'
    //   );
    // }
  };

  // Sign authentication message with MetaMask
  const signMessage = async (lib: any, msg: string, userAccount: string) => {
    console.log(lib)
    setSignature(`this is signature 123`);
    return
    //Signing in on Grindery: eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..LgOmJXO9Qcq2bEdU.7vziCQgp74cD8GHSXjN4FPsGa1Q9TZoTJPhO5L3p2lJSGcntNFuRUM_4ZWCVQJt8Dvilhrzc3IrlYOcy7-Ez6_NYEdViYlSteCPlaHlvJGtgmwaoAOaVnZUKoa75gSATqkysEa7tOVMjIEudIEmVN66vOLbLuHTB0uEoVfQ7MxPa15NS2YXvsG20j6k9NM1dytKvNgVsCi7MphHdjBheSJ1zq-ZlcQ.IrM-4CmAfUf7-7INagSB4w
    console.log(msg)
    console.log(userAccount)
    if (!web3Modal) return;
    try {
      const newSignature = await lib.provider.request({
        method: 'personal_sign',
        params: [msg, userAccount],
      });
      console.log(`326`,newSignature)
      setSignature(newSignature);
      // setSignature(`0x5012b9e8e65118c9b3ce18a067b8bcae219e611e9eb5c805a607d4ffca63ee5b200ebe0babdd5724ded39cf13eb49bc76f5f1152161bf0e2c19c78b5bfe592911c`)
    } catch (error) {
      console.error('signMessage error', error);
      clearUserState();
    }
  };

  // Get access token from the engine API
  const getToken = async (code: string) => {
    console.log(`getToken`,code)
    // code= 'eyJtZXNzYWdlIjoiU2lnbmluZyBpbiBvbiBHcmluZGVyeTogZXlKaGJHY2lPaUprYVhJaUxDSmxibU1pT2lKQk1qVTJSME5OSW4wLi5wamtrbE5MTXV3cUlheGlsLnpJeHRVaVhxVU1mNWVPOG1PWHpjTmpPUU51N1hpbm9JamFRS1V3ZnlIbTBKNTh1RTBnNF9keWFhcFUwS3V0cW9EU09tb3N2eGtTeVp4QUpTajRia2FvSl92aUpIRVh2aUtJR01fTDF2X1BFdmtla1pURTlTYWpkUFFaRjlGLVdzRFNqU09KNEhOeUM2MVdNS0Y3YUpOM3JRbEhQQmZQYVpOVUZnNGcwbWxvMFdBVFJHaEM5ZEtBYlBFaHhVWHpNcjJ3X09HOWh0WklhOE9pc1d5UUZkNExVeWwtWmg4QS43RmtlUE1rWUJNajJqd2REdVgwdXZBIiwic2lnbmF0dXJlIjoiMHhhY2JmMmU1Njc1Yjk4ZWFhODIzOWUxZWRmMzU1YjlmOWFlYzMwNTMzYmJlOWJhNDg4ZTJjYTUyNWE4MjE5Yjc3MzA4YmI4YWRkNGFhNDQzMDMyYmJmZDlmNTc3ZjQ3MTU5ZGIyMTY3ZTk4YTVlZGM2OWIxYTE1ZjAzNzJiNDk3ZjFjIn0'
    const tempToken={
        "access_token": "123eyJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJ1cm46Z3JpbmRlcnk6YWNjZXNzLXRva2VuOnYxIiwic3ViIjoiZWlwMTU1OjE6MHhEODY0OUFhZUJjMUJkNjU3MTQxNTlmM2I1NjI2QTQ2OTlEMGVCN2VDIiwiaWF0IjoxNjgyOTI0MzAwLCJpc3MiOiJ1cm46Z3JpbmRlcnk6b3JjaGVzdHJhdG9yIiwiZXhwIjoxNjgyOTI3OTAwfQ.0bGDu1bQ5bOktZs14f5x3XJmJ2NoUrD83AFHV-K2nrCnI3yCzcO9GFLrHvD5Rxb3UMjNw-g4XIByvt0Z6aYNug",
        "token_type": "bearer",
        "expires_in": 3600,
        "refresh_token": "123eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..W1l8zNYGdHg5T3jR.ktZsYtlCCyNpefB4_TOblscNCHaGCgWJYY6qYrPOha7nOH_apzdKpEv6ediNlxxKBzvpKUa6UjL0nOEA2DWYnJW79vgcimjzpAUXF1Lcl6FOHhJ0xyU_fwLXQHYy2sqU07ZwdEf_Z0RQFOsXALhQaF02Rsx7K5Z7xg3Npqv2A5nTf4kEpwDJR7pLWWQXAEa8SxACD7Bx0-Xx43WAkNBeQiSfb5hXtRZ3.mwlmuELLUP6ZIvzBxBa8cQ"
    }
    setToken(tempToken);
    return 



    // const res = await fetch(`${ENGINE_URL}/oauth/token`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     grant_type: 'authorization_code',
    //     code: code,
    //   }),
    // });
    // console.log(res)
    // if (res.ok) {
    //   let result = await res.json();
    //   console.log(result)
    //   console.log(flowProof)
    //   // Set address and chain if Flow user proofed
    //   if (flowProof) {
    //     console.log(flowProof)
    //     setAddress((flowUser && flowUser.addr) || null);
    //     setChain('flow:mainnet');
    //   }
    //   setToken(result);
    // } else {
    //   console.error('getToken error', res.status);
    //   // handle expried nonce for Flow user
    //   if (flowProof) {
    //     try {
    //       await disconnect();
    //     } catch (err) {
    //       //
    //     }
    //     console.log(`getToken fcl`,fcl)
    //     fcl.authenticate();
    //   } else {
    //     clearUserState();
    //     disconnect();
    //   }
    // }
  };

  // Set refresh_token cookie
  const registerAuthSession = async (refresh_token: string) => {
    // const res = await fetch(`${ENGINE_URL}/oauth/session-register`, {
    //   method: 'POST',
    //   credentials: 'include',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     refresh_token: refresh_token,
    //   }),
    // });

    // if (!res.ok) {
    //   console.error('registerAuthSession error', res.status);
    // }
  };

  // Remove refresh_token cookie
  const clearAuthSession = async () => {
    // const res = await fetch(`${ENGINE_URL}/oauth/session-register`, {
    //   method: 'POST',
    //   credentials: 'include',
    // });

    // if (!res.ok) {
    //   console.error('clearAuthSession error', res.status);
    // }
  };

  // Flow auth account proof data resolver
  const accountProofDataResolver: AccountProofDataResolver = async () => {
    setResolverCalled(true);

    const res = await fetch(`${ENGINE_URL}/oauth/flow/session`, {
      method: 'GET',
      credentials: 'include',
    });

    if (res && res.ok) {
      let json = await res.json();

      // Return nonce on success
      if (json.nonce) {
        return {
          appIdentifier: 'Grindery Nexus',
          nonce: json.nonce,
        };
      } else {
        throw new Error('get nonce failed');
      }
    } else {
      console.error(
        'getFlowNonce error',
        (res && res.status) || 'Unknown error'
      );
      throw new Error('get nonce failed');
    }
  };

  const restoreFlowSession = async (address: string) => {
    const res = await fetch(
      `${ENGINE_URL}/oauth/flow/session?address=${address}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    if (res && res.ok) {
      let json = await res.json();

      // Return nonce on success
      if (json.access_token) {
        setToken(json);
        setAddress(address);
        setChain('flow:mainnet');
      } else {
        throw new Error('flow user session failed');
      }
    } else {
      console.error(
        'flow user session failed',
        (res && res.status) || 'Unknown error'
      );
      throw new Error('flow user session failed');
    }
  };

  const getChains = () => {
    fetch('https://cds.grindery.org/chains/evm.json')
      .then(response => response.json())
      .then(data => {
        setChains(data);
      });
  };

  useEffect(() => {
    console.log(`useeffect init app fcl`,fcl)
    fcl.config().put('fcl.accountProof.resolver', accountProofDataResolver);
  }, []);

  // Set web3Modal instance
  useEffect(() => {
    const providerOptions = {};
    const newWeb3Modal = new Web3Modal({
      cacheProvider: cacheProvider,
      network: 'mainnet',
      providerOptions,
    });
    setWeb3Modal(newWeb3Modal);
  }, []);

  // connect automatically and without a popup if user was connected before
  useEffect(() => {
    if (web3Modal && web3Modal.cachedProvider) {
      connect();
    }
  }, [web3Modal]);

  // set user if token and address is known
  useEffect(() => {
    console.log(`use effect token address`)
    if (address && token && token.access_token) {
      setUser(`eip155:1:${address}`);
      if (token.refresh_token) {
        registerAuthSession(token.refresh_token);
      }
    } else {
      setUser(null);
    }
  }, [token, address]);

  // Start session if user address is known
  useEffect(() => {
    console.log(`use effect address, message, signature, token`)
    if (address && !message && !signature && !token) {
      startSession(address);
    }
  }, [address, message, signature, token]);

  // Sign authentication message if message is known
  useEffect(() => {
    if (library && message && account && !signature && !token) {
      signMessage(library, message, account);
    }
  }, [library, message, account, signature, token]);

  // Get authentication token if message is signed
  useEffect(() => {
    if (code && !token) {
      getToken(code);
    }
  }, [code, token]);

  // subscribe to flow user update
  useEffect(() => {
    console.log(`useeffect init subscribe fcl`,fcl)
    fcl.currentUser.subscribe(setFlowUser);
  }, []);

  // Restore Flow user session if user available without resolver
  useEffect(() => {
    if (flowUser && flowUser.addr && !resolverCalled) {
      restoreFlowSession(flowUser.addr);
    }
  }, [flowUser, resolverCalled]);

  useEffect(() => {
    getChains();
  }, []);

  useEffect(() => {
    console.log(`use effect user, address, chain, message, token, flowUser, chainName`)
    window.nexus_auth = {
      user,
      address,
      chain,
      chainName,
      message,
      token,
      flowUser,
    };
  }, [user, address, chain, message, token, flowUser, chainName]);

  return (
    <GrinderyNexusContext.Provider
      value={{
        user,
        address,
        chain,
        token,
        code,
        flowUser,
        provider,
        ethers,
        chainName,
        connect,
        disconnect,
        setUser,
        setAddress,
        setChain,
        connectFlow,
      }}
    >
      {children}
    </GrinderyNexusContext.Provider>
  );
};

/** Grindery Nexus Hook */
export const useGrinderyNexus = () => useContext(GrinderyNexusContext);

export default GrinderyNexusContextProvider;
