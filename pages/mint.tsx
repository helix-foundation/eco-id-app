import type { NextPage } from "next";
import { useAccount } from "wagmi";

import pointsDB from "../utilities/pointsDB";

import classNames from "classnames";
import Button from "components/button";
import ConnectDiscordButton from "components/ConnectDiscordButton";
import ConnectTwitterButton from "components/ConnectTwitterButton";
import ConnectWalletButton from "components/ConnectWalletButton";
import Copy from "components/copy";
import HStack, { StackGapSize } from "components/hstack";
import HelixLayout from "components/layout";
import { AccountContext } from "components/LinkedAccountInfo";
import Mint, { MintContext } from "components/mint";
import Register, { RegistrationContext } from "components/register";
import Spacer from "components/spacer";
import Timeline, { TimelineBodyPlaceholder, TimelineHeader, TimelineItem } from "components/timeline";
import VStack from "components/vstack";
import styles from "css/modules/claim.module.scss";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { BigNumber, utils } from "ethers";
import { useVerifiedClaim } from "hooks/VerifiedClaim";
import { formatAddress } from "utilities";
import { toast } from "../utilities";
import { upperFirst } from "lodash";
import Link from "next/link";
import { UIBlockContext } from "components/UIBlock";

enum Stage {
    Connect,
    SelectAccount,
    Confirm,
    Mint,
    Complete
}

const Home: NextPage = () => {
    const router = useRouter();
    const [stage, setStage] = useState<Stage>(Stage.Connect);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [points, setPoints] = useState<BigNumber>(BigNumber.from(0));

    const stageRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);

    const account = useContext(AccountContext);
    const mintContext = useContext(MintContext);

    const { address } = useAccount();
    const verifiedClaim = useVerifiedClaim(`${account.app}:${account.userid}`, address);

    const scrollToActiveStage = () => {
        if (!timelineRef.current || !stageRef.current) { return }

        const el = stageRef.current;
        timelineRef.current.scrollTo({
            top: el.offsetTop,
            left: 0,
            behavior: 'smooth'
        });
    }

    useEffect(() => {
        scrollToActiveStage();
    }, [stage])

    useEffect(() => {
        if (account.app && account.userid) {
            setPoints(BigNumber.from(pointsDB[`${account.app}:${account.userid}`] || 0));
        }
    }, [account.app, account.userid])

    const { isConnected } = useAccount();
    const uiBlockContext = useContext(UIBlockContext);

    useEffect(() => {
        updateStage();
    }, [isConnected, isRegistered, mintContext.isMinted, account.userid]);

    const updateStage = () => {
        if (mintContext.isMinted && account.username && isConnected) {
            setStage(Stage.Complete)
        } else if (isRegistered && account.username && isConnected) {
            setStage(Stage.Mint)
        } else if (account.username && isConnected) {
            setStage(Stage.Confirm);
        } else if (isConnected) {
            setStage(Stage.SelectAccount);
        } else {
            setStage(Stage.Connect);
        }
    }

    useEffect(() => {
        window.addEventListener("resize", () => {
            scrollToActiveStage();
        })

        setIsLoaded(true);
    }, [])

    const connectedWalletIsRecipient = () => {
        // subgraph addresses are always in lowercase
        return address && verifiedClaim && address.toLowerCase() === verifiedClaim.recipient;
    }

    const [toastSent, setToastSent] = useState(false);

    useEffect(() => {
        if (address && verifiedClaim && !connectedWalletIsRecipient()) {
            mintContext.setShowOverlay(false);
            router.replace('/mint', undefined, { shallow: true });
            if (!toastSent) {
                setToastSent(true);
                toast({
                    title: "",
                    body: (<>
                        The {upperFirst(account.app)} ID <strong>{account.userid}</strong> ({account.app === "twitter" ? "@" : undefined}{account.username})
                        {" "}is already connected to wallet <strong>{formatAddress(verifiedClaim.recipient)}</strong>
                    </>),
                    intent: 'danger'
                })
            }
        }
    }, [address, verifiedClaim])

    return (
        <RegistrationContext.Provider value={{
            isRegistered,
            setIsRegistered
        }}>
            {router.query.fromIntro && <div className={classNames(
                styles.block,
                isLoaded ? styles.blockLoaded : undefined
            )} />
            }
            <HelixLayout>
                <Timeline innerRef={timelineRef}>
                    <TimelineItem isActive={stage === Stage.Connect} innerRef={stage === Stage.Connect ? stageRef : null}>
                        <VStack isFull centerAxis="main">
                            <p className="sectionSubtitle">Step 1 <span className="opacity-50">of 4</span></p>
                            <TimelineHeader title="Connect your wallet" />
                            <Copy large>
                                <p>Through this site, you can only link your Discord or Twitter with a single Ethereum wallet, and you cannot switch the address later, so please choose your wallet carefully.</p>
                            </Copy>
                            <Spacer />
                            <div>
                                <ConnectWalletButton />
                            </div>
                        </VStack>
                    </TimelineItem>

                    <TimelineItem isActive={stage === Stage.SelectAccount} innerRef={stage === Stage.SelectAccount ? stageRef : null}>
                        <VStack isFull centerAxis="main">
                            <p className="sectionSubtitle">Step 2 <span className="opacity-50">of 4</span></p>
                            <TimelineHeader title="Discord or Twitter?" />
                            <Copy large>
                                <p>Choose the account you want to validate. (You can return to validate the other one separately)</p>
                                <p className="text-size-small text-color-light">Note: This will redirect you to authorize your social account</p>
                            </Copy>

                            <Spacer />
                            <HStack gapSize={StackGapSize.XLarge} isFull justify="center">
                                {account.userid && account.username ?
                                    <>
                                        <Button secondary disabled title={`${account.username} connected`} />
                                    </>
                                    :
                                    <>
                                        <VStack centerAxis="all" gapSize={StackGapSize.XLarge} isFull>
                                            <img src="/discord-coin.png" style={{ width: 140 }} />
                                            <ConnectDiscordButton />
                                        </VStack>
                                        <VStack centerAxis="all" gapSize={StackGapSize.XLarge}>
                                            <img src="/twitter-coin.png" style={{ width: 140 }} />
                                            <ConnectTwitterButton />
                                        </VStack>
                                    </>}
                            </HStack>
                        </VStack>
                    </TimelineItem>

                    <TimelineItem isActive={stage === Stage.Confirm} innerRef={stage === Stage.Confirm ? stageRef : null}>
                        <Register isActive={stage === Stage.Confirm} />
                    </TimelineItem>

                    <TimelineItem isActive={stage === Stage.Mint} innerRef={stage === Stage.Mint ? stageRef : null}>
                        <Mint isActive={stage === Stage.Mint} />
                    </TimelineItem>

                    <TimelineItem isActive={stage === Stage.Complete} innerRef={stage === Stage.Complete ? stageRef : null} isLastItem>
                        <VStack isFull centerAxis="main">
                            <p className="sectionSubtitle" style={{ opacity: 0 }}></p>
                            <TimelineHeader title="NFT Mint Complete" placeholder={stage !== Stage.Complete} />
                            {stage === Stage.Complete ?
                                <Copy large>
                                    {!connectedWalletIsRecipient() ? (
                                        <p>This NFT was minted for wallet <strong>{formatAddress(verifiedClaim?.recipient)}</strong></p>
                                    ) : points.gt(0) ? (
                                        <p>You&apos;re all set. You have <strong>{utils.formatUnits(BigNumber.from(points)).toString()} Eco Points</strong> waiting to be claimed.</p>
                                    ) : (
                                        <p>You&apos;re all set. Learn more about the power of Eco by visiting us at eco.org.</p>
                                    )}
                                </Copy>
                                : <TimelineBodyPlaceholder />}
                            <Spacer />

                            <HStack>
                                {connectedWalletIsRecipient() && points.gt(0) ?
                                    <>
                                        <Button showArrow title="Start claim" onClick={() => {
                                            window.location.href = "https://claim.eco.id?ref=nftdapp"
                                        }} />
                                        <Button secondary title="View NFT" onClick={() => {
                                            mintContext.setShowOverlay(true);
                                        }} />
                                    </>
                                    :
                                    <>
                                        <Button showArrow title="Visit Eco.org" onClick={() => {
                                            window.location.href = "https://eco.org?ref=nftdapp"
                                        }} />
                                        {connectedWalletIsRecipient() && (
                                            <Button secondary title="View NFT" onClick={() => {
                                                mintContext.setShowOverlay(true);
                                            }} />
                                        )}
                                    </>
                                }
                            </HStack>
                            <Spacer size="small" />
                            <Link href="/mint" shallow={true} >Register another social</Link>

                        </VStack>
                    </TimelineItem>
                </Timeline>
            </HelixLayout>
        </RegistrationContext.Provider>
    );
};

export default Home;
