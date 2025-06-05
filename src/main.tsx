import { StrictMode } from 'react';
import ReactDOM from "react-dom/client";

import { createRoot } from 'react-dom/client';
import { Web3AuthProvider } from "@web3auth/modal/react";
import web3AuthContextConfig from "../src/constant/web3authContext.tsx";
import App from './App.tsx';
import './index.css';


import { WagmiProvider } from "@web3auth/modal/react/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


const queryClient = new QueryClient();


ReactDOM.createRoot(document.getElementById('root')!).render(
<Web3AuthProvider config={web3AuthContextConfig}>
  {/* // IMP END - Setup Web3Auth Provider */}
    {/* // IMP START - Setup Wagmi Provider */}
    <QueryClientProvider client={queryClient}>
      <WagmiProvider>
        <App />
      </WagmiProvider>
    </QueryClientProvider>
  {/* // IMP END - Setup Wagmi Provider */}
  {/* // IMP START - Setup Web3Auth Provider */}
  </Web3AuthProvider>
);
