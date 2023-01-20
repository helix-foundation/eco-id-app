import React, { ReactNode, Dispatch, useState, useEffect, useContext, useRef } from "react";
import styles from "css/modules/nftViewer.module.scss";
import classNames from "classnames";
import VStack from "./vstack";
import HStack, { StackGapSize } from "./hstack";
import { AccountContext } from "./LinkedAccountInfo";
import { upperFirst } from "lodash";
import { useAccount, useConnect, useProvider } from "wagmi";
import Copy from "./copy";
import Button from "./button";
import Callout from "./callout";
import Spacer from "./spacer";
import { useRouter } from "next/router";
import { BigNumber, ethers, utils } from "ethers";
import { toast } from "../utilities";

import pointsDB from "../utilities/pointsDB";

import EcoID from "../assets/abi/EcoID.json";
import classnames from "classnames";
import { useEcoID } from "providers/EcoID";
import { useVerifiedClaim } from "hooks/VerifiedClaim";
import { MintContext } from "./mint";
import { formatAddress } from "utilities";


type NFTViewerProps = {
    isVisible: boolean;
};

type MetadataTrait = {
    trait_type: string;
    value: string;
}

type Metadata = {
    name: string;
    description: string;
    image: string;
    external_url: string;
    attributes: MetadataTrait[];
}

const IMAGE_HASH = 'QmWZFvb88KDos7BYyf52btxPuEEifZN7i5CA2YfC3azS8J';

const NFTViewer = ({ isVisible = false }: NFTViewerProps) => {
    const { address } = useAccount();
    const provider = useProvider();
    const ecoID = useEcoID();
    const router = useRouter();
    const [formattedAddress, setFormattedAddress] = useState("");
    const [points, setPoints] = useState<BigNumber>(BigNumber.from(0))

    const [claim, setClaim] = useState("");
    const verifiedClaim = useVerifiedClaim(claim, address);
    const [metadata, setMetadata] = useState<Metadata | null>(null);
    const [imageIsLoaded, setImageIsLoaded] = useState(false);

    const { app, userid, recipient } = useContext(AccountContext);

    const { setShowOverlay } = useContext(MintContext);

    useEffect(() => {
        if (claim) {
            setPoints(BigNumber.from(pointsDB[claim] || 0));
        }
    }, [claim])

    const getMetadata = (tokenURI: string) => {
        const base = 'data:application/json;base64,';
        const metadataURI = tokenURI;
        const metadataString = Buffer.from(metadataURI.slice(base.length), 'base64').toString();
        setMetadata(JSON.parse(metadataString));
    }

    const preloadNFT = async () => {
        try {
            const nftContract = new ethers.Contract(ecoID.address, EcoID.abi, provider);

            const registration = await nftContract._verifiedClaims(recipient, `${app}:${userid}`);

            if (registration.tokenID && registration.tokenID.gt(0)) {
                const tokenURI = await nftContract.tokenURI(registration.tokenID);
                getMetadata(tokenURI);
                setFormattedAddress(formatAddress(recipient));
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (app && userid && recipient && isVisible && (!verifiedClaim || !verifiedClaim.nft)) {
            preloadNFT();
        }
        else if (verifiedClaim && verifiedClaim.nft && isVisible) {
            getMetadata(verifiedClaim.nft.tokenURI);
            setFormattedAddress(formatAddress(verifiedClaim.recipient))
        }
    }, [app, userid, recipient, verifiedClaim?.nft, isVisible]);


    useEffect(() => {
        if (!app || !userid) { return }
        setClaim(`${app}:${userid}`);
    }, [app, userid]);

    const connectedWalletIsRecipient = () => {
        // subgraph addresses are always in lowercase
        return address && verifiedClaim && address.toLowerCase() === verifiedClaim.recipient;
    }

    const vid = useRef(null);
    useEffect(() => {

        if (vid.current && vid.current.readyState > 0) {
            setImageIsLoaded(true);
        }

        const tryPlay = async () => {
            if (metadata && metadata.image && vid.current) {
                try {
                    await vid.current.play();
                }
                catch (err) {
                    console.log(err);
                }
            }
        }

        tryPlay();

    }, [metadata?.image])

    return (
        <AccountContext.Consumer>
            {account => {
                return <div className={classNames(
                    styles.nftViewer,
                    isVisible ? styles["nftViewer-isVisible"] : undefined
                )}>
                    <div className={styles.overlay}>
                        <button className={styles.overlayClose} onClick={() => setShowOverlay(false)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L12 12L18 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6 6L12 12L6 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <VStack centerAxis="all" isFull gapSize={StackGapSize.XLarge}>
                            {verifiedClaim && connectedWalletIsRecipient() && (
                                <div className={classnames(styles.assetViewer, metadata ? styles["assetViewer-hasAsset"] : undefined)}>
                                    <div className={styles.videoWrapper}>
                                        <video src={metadata ? metadata.image : ''} controls={false} autoPlay playsInline loop muted ref={vid} onLoadedData={() => setImageIsLoaded(true)} />
                                        {!imageIsLoaded && ecoID.NFT_IMAGE_URL === `https://ipfs.io/ipfs/${IMAGE_HASH}` && (
                                            <video src={`/${IMAGE_HASH}.mp4`} playsInline loop muted autoPlay />
                                        )}
                                    </div>
                                </div>
                            )}
                            <div />
                            <VStack centerAxis="all">
                                {verifiedClaim && connectedWalletIsRecipient() ? (
                                    <>
                                        <h2 className="text-align-center">Congratulations! Welcome to the game.</h2>
                                        <Copy>
                                            <p className="text-align-center">
                                                Your ECO ID NFT is now linked with wallet <strong>{formattedAddress}</strong> and {upperFirst(account.app)} ID <strong>{account.userid}</strong> ({account.app === "twitter" ? "@" : ""}{account.username})
                                            </p>
                                        </Copy>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-align-center">Sorry, this one&apos;s already taken.</h2>
                                        <Copy>
                                            <p className="text-align-center">
                                                The {upperFirst(account.app)} ID <strong>{account.userid}</strong> ({account.app === "twitter" ? "@" : ""}{account.username})
                                                {" "}is already connected to wallet <strong>{formattedAddress}</strong>
                                            </p>
                                        </Copy>
                                    </>
                                )}
                                <Spacer />
                                {points.gt(0) && connectedWalletIsRecipient() ? (
                                    <div>
                                        <Callout>
                                            <HStack centerContent gapSize={StackGapSize.Large}>

                                                <HStack centerContent>
                                                    <svg width="20" className={styles.ecoPointsLogo} height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g>
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M3.4758 5.52868C5.16927 7.853 7.90963 9.35941 11.0003 9.35941C14.0909 9.35941 16.8313 7.85298 18.5248 5.52864C16.8313 3.20431 14.0909 1.6979 11.0003 1.6979C7.90964 1.6979 5.16926 3.20432 3.4758 5.52868ZM20.481 5.52864C18.5886 2.25718 15.0515 0.0561523 11.0003 0.0561523C6.9491 0.0561523 3.41197 2.2572 1.51953 5.52868C3.41198 8.80014 6.94909 11.0012 11.0003 11.0012C15.0515 11.0012 18.5886 8.80012 20.481 5.52864Z" fill="#924F35" />
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M4.43465 17.5911C6.12673 15.9051 7.17089 13.5753 7.17089 11.0012C7.17089 8.4271 6.12673 6.09724 4.43465 4.4113C2.74256 6.09724 1.69839 8.42711 1.69839 11.0012C1.69839 13.5753 2.74256 15.9051 4.43465 17.5911ZM4.43464 19.758C1.77622 17.7612 0.0566406 14.582 0.0566406 11.0012C0.0566406 7.42038 1.77622 4.24121 4.43464 2.24438C7.09307 4.24121 8.81264 7.42038 8.81264 11.0012C8.81264 14.582 7.09307 17.7612 4.43464 19.758Z" fill="#924F35" />
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M10.5999 20.296C10.7329 20.3016 10.8668 20.3045 11.0013 20.3045C15.5762 20.3045 19.3801 17.002 20.1587 12.6514C20.0257 12.6458 19.8919 12.643 19.7573 12.643C15.1824 12.643 11.3786 15.9454 10.5999 20.296ZM21.9442 11.2197C21.2376 11.0764 20.5062 11.0012 19.7573 11.0012C13.7856 11.0012 8.93085 15.7838 8.81445 21.7277C9.52108 21.871 10.2524 21.9462 11.0013 21.9462C16.9731 21.9462 21.8278 17.1636 21.9442 11.2197Z" fill="#924F35" />
                                                        </g>

                                                    </svg>
                                                    <p>You have <strong>{utils.formatUnits(points).toString()} Points</strong> eligible for claiming tokens.</p>

                                                </HStack>
                                                <Button title="Claim now" showArrow onClick={() => {
                                                    window.location.href = "https://claim.eco.id?ref=nftdapp"
                                                }} />
                                            </HStack>
                                        </Callout>
                                    </div>
                                ) : (
                                    <Callout>
                                        <Copy>
                                            <p>Learn more about the power of Eco by visiting us at <a href="https://eco.org?ref=nftdapp">eco.org</a></p>
                                        </Copy>
                                    </Callout>
                                )}
                            </VStack>
                        </VStack>
                    </div>
                </div>;
            }
            }
        </AccountContext.Consumer>
    );
};

export default NFTViewer;
