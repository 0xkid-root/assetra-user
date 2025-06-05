// IMP START - Quick Start
import { WEB3AUTH_NETWORK } from "@web3auth/modal";
import { type Web3AuthContextConfig } from "@web3auth/modal/react";
console.log("WEB3AUTH_NETWORK",WEB3AUTH_NETWORK);

// IMP START - Dashboard Registration
const clientId = "BI0orjBmrDL-uiYLcrZ7uwH6jczl6Fatfh4N4GLY0voY5oJ_3U2BN7QAzejT1mmbne5VtR_0_16wM4jDKq7M_UE"; // get from https://dashboard.web3auth.io
// IMP END - Dashboard Registration

// IMP START - Config
const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET
    ,
  }
};
// IMP END - Config

export default web3AuthContextConfig;