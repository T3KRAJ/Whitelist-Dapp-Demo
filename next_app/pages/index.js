import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../constants";

const index = () => {
  const [isLoading, setLoading] = useState(false);
  const [whiteListedUsersCount, setWhiteListedUserCount] = useState(0);
  const [userIswhiteListed, setUserIswhiteListed] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  const web3ModelRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModelRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const { chainId } = await web3Provider.getNetwork();

    if (chainId !== 4) {
      window.alert("Change the network to Rinkeby");
      throw new Error("Change network to Rinkeby");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    
    return web3Provider;
  };

  /**
   * addAddressToWhitelist: Adds the current connected address to the whitelist
   */
  const addAddressToWhiteList = async () => {
    const signer = await getProviderOrSigner(true);

    const whitelistContract = new Contract(
      WHITELIST_CONTRACT_ADDRESS,
      abi,
      signer
    );
    try {
      const tx = await whitelistContract.addUserToWhiteList();
      setLoading(true);
      await tx.wait();
      setLoading(false);
      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);
    } catch (err) {
      console.error(err);
    }
  };
  
  /**
   * getNumberOfWhitelisted:  gets the number of whitelisted addresses
   */
  const getNumberOfWhitelisted = async () => {
    try {
      const provider = await getProviderOrSigner();
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );
      const _numberOfWhitelisted =
        await whitelistContract.getWhiteListedUsersCount();
      setWhiteListedUserCount(_numberOfWhitelisted);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * checkIfAddressInWhitelist: Checks if the address is in whitelist
   */
  const checkIfAddressInWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      const address = await signer.getAddress();
      const _joinedWhitelist = await whitelistContract.whiteListedUsers(
        address
      );
      setUserIswhiteListed(_joinedWhitelist);
    } catch (err) {
      console.error(err);
    }
  };

  /*
    connectWallet: Connects the MetaMask wallet
  */
  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);

      checkIfAddressInWhitelist();
      getNumberOfWhitelisted();
    } catch (err) {
      console.error(err);
    }
  };

    const renderButton = () => {
      if (walletConnected) {
        if (userIswhiteListed) {
          return (
            <div className={styles.description}>
              Thanks for joining the Whitelist!
            </div>
          );
        } else if (isLoading) {
          return <button className={styles.button}>Loading...</button>;
        } else {
          return (
            <button onClick={addAddressToWhiteList} className={styles.button}>
              Join the Whitelist
            </button>
          );
        }
      } else {
        return (
          <button onClick={connectWallet} className={styles.button}>
            Connect your wallet
          </button>
        );
      }
    };

  useEffect(() => {
    if (!walletConnected) {
      web3ModelRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>Whitelist Dapp Demo</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to WhiteListing App!</h1>
          <div className={styles.description}>
            Its a demo white  NFT collection for developers in Crypto.
          </div>
          <div className={styles.description}>
            {whiteListedUsersCount} have already joined the Whitelist
          </div>
          {renderButton()}
        </div>
        <div>
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by T3KRAJ
      </footer>
    </div>
  );
};

export default index