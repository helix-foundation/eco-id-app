import "@rainbow-me/rainbowkit/styles.css";
import 'react-toastify/dist/ReactToastify.css';

import type { AppProps } from "next/app";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { ToastContainer } from "react-toastify";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import { AccountContext } from "components/LinkedAccountInfo";
import { MintContext } from "components/mint";
import "css/base/utilities.css";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import "../css/base/base.scss";
import "../css/base/font.css";
import "../css/base/normalize.css";
import "../css/base/type.css";
import "../css/base/utilities.css";
import { EcoIDProvider } from "providers/EcoID";
import MobileGate from "components/MobileGate";
import HelpOverlay, { HelpOverlayContext } from "components/HelpOverlay";
import Head from "next/head";
import UIBlock, { UIBlockContext } from "components/UIBlock";
import { GoogleAnalytics } from "nextjs-google-analytics";
import UnsecureGate from "components/UnsecureGate";

const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
    cache: new InMemoryCache(),
});

const { chains, provider } = configureChains(
    [chain[process.env.NEXT_PUBLIC_CHAIN]],
    [
        infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_ID || "9fac2c4055444f7e9aefd509df789922" }),
        alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY || "CjccbhvHOgr96gSq9rbmBIxKaqWBhl7A" }),
        publicProvider(),
    ]
);

const { connectors } = getDefaultWallets({
    appName: "Eco ID",
    chains,
});

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
});

function App({ Component, pageProps }: AppProps) {
    const [username, setUsername] = useState(null);
    const [deadline, setDeadline] = useState(null);
    const [nonce, setNonce] = useState(null);
    const [userid, setUserid] = useState(null);
    const [fee, setFee] = useState<BigNumber>(BigNumber.from(0));
    const [recipient, setRecipient] = useState(null);
    const [app, setApp] = useState(null);
    const [verifier, setVerifier] = useState(null);
    const [verifySig, setVerifySig] = useState(null);

    const [isMinted, setIsMinted] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [shouldShowBlock, setShouldShowBlock] = useState(false);

    const [isMobile, setIsMobile] = useState(null);

    const [shouldShowHelp, setShouldShowHelp] = useState(false);
    const [unsecure, setUnsecure] = useState(true);

    useEffect(() => {
        const isMobileDevice = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        setIsMobile(isMobileDevice);
        
        setUnsecure(window.self !== window.top);
    }, [])

    if (isMobile === null) {
        return <div />
    }

    return (
        unsecure ?
            <UnsecureGate/>
            :
        isMobile ?
            <MobileGate />
            :
            <WagmiConfig client={wagmiClient}>
                <RainbowKitProvider chains={chains}>
                    <ApolloProvider client={client}>
                        <Head>
                            <title>Eco ID</title>
                            <meta name="viewport" content="initial-scale=1.0, width=device-width" />

                            <link rel="alternate icon" type="image/png" href="/favicon.png" />
                            <meta name="description"
                                content="Claim your on-chain Eco ID representing your Discord or Twitter account." />

                            <meta property="og:title" content="Eco ID" />
                            <meta property="og:type" content="website" />
                            <meta property="og:url" content="https://nft.eco.id" />
                            <meta property="og:image" content="/meta_image.png" />

                            <link rel="image_src" href="/meta_image.png" />

                            <meta name="twitter:title" content="Eco ID" />
                            <meta name="twitter:description" content="Claim your on-chain Eco ID representing your Discord or Twitter account." />
                            <meta name="twitter:image" content="/meta_image.png" />
                            <meta name="twitter:card" content="summary_large_image" />

                        </Head>
                        <GoogleAnalytics gaMeasurementId="G-JEWJEZ4H1K" />
                        <EcoIDProvider>
                            <AccountContext.Provider value={{
                                username,
                                deadline,
                                nonce,
                                userid,
                                fee,
                                recipient,
                                app,
                                verifier,
                                verifySig,
                                setUsername,
                                setDeadline,
                                setNonce,
                                setUserid,
                                setFee,
                                setRecipient,
                                setApp,
                                setVerifier,
                                setVerifySig
                            }}>
                                <MintContext.Provider value={{
                                    isMinted,
                                    setIsMinted,
                                    showOverlay,
                                    setShowOverlay
                                }}>
                                    <HelpOverlayContext.Provider value={{
                                        shouldShow: shouldShowHelp,
                                        setShouldShow: setShouldShowHelp
                                    }}>
                                        <UIBlockContext.Provider value={{
                                            shouldShow: shouldShowBlock,
                                            setShouldShow: setShouldShowBlock
                                        }}>
                                            <Head>
                                                <title>Eco ID</title>
                                                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                                            </Head>
                                            <Component {...pageProps} />
                                            <ToastContainer position="bottom-right" />
                                            <HelpOverlay shouldShow={shouldShowHelp} />
                                            <UIBlock />
                                        </UIBlockContext.Provider>
                                    </HelpOverlayContext.Provider>
                                </MintContext.Provider>
                            </AccountContext.Provider>

                        </EcoIDProvider>
                    </ApolloProvider>
                </RainbowKitProvider>
            </WagmiConfig >
    );
}

export default App;
