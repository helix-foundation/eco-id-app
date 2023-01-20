import { createContext, useContext, useEffect, useState } from "react";

import { BigNumber, ethers, utils } from "ethers";

import { useAccount, useProvider, useSigner } from "wagmi";


import { toast } from "../utilities";

import Button from "components/button";
import Copy from "components/copy";
import HStack, { StackGapSize } from "components/hstack";
import { AccountContext } from "components/LinkedAccountInfo";
import Spacer from "components/spacer";
import { TimelineHeader } from "components/timeline";
import VStack from "components/vstack";
import Eco from "../assets/abi/ECO.json";
import EcoID from "../assets/abi/EcoID.json";
import TextLoader from "./TextLoader";
import { useEcoID } from "providers/EcoID";
import { useVerifiedClaim } from "hooks/VerifiedClaim";
import { formatAddress, txError } from "utilities";
import { UIBlockContext } from "./UIBlock";

type MintProps = {
    isActive: boolean;
}

const Mint = ({ isActive }: MintProps) => {
    const { data: signer } = useSigner();
    const { address } = useAccount();
    const provider = useProvider();
    const ecoID = useEcoID();

    const { userid, fee, recipient, app } = useContext(AccountContext);
    const verifiedClaim = useVerifiedClaim(`${app}:${userid}`, address);

    const [approvedAmount, setApprovedAmount] = useState<BigNumber>(BigNumber.from(0));

    const { isMinted, setIsMinted, setShowOverlay } = useContext(MintContext);

    const [isLoading, setIsLoading] = useState(false);

    const uiBlockContext = useContext(UIBlockContext);

    useEffect(() => {
        if (isActive) {
            uiBlockContext.setShouldShow(isLoading);
        }
    }, [isLoading])

    const mint = async () => {
        setIsLoading(true);

        try {
            const nftContract = new ethers.Contract(ecoID.address, EcoID.abi, signer);

            const mintTx = await nftContract.mintNFT(recipient, `${app}:${userid}`, { gasLimit: 200_000 });

            const mintReceipt = await mintTx.wait();

            if (!mintReceipt.status) {
                throw new Error(mintReceipt);
            }

            toast({ title: "Succesful mint!", intent: 'success' });

            setIsMinted(true);
            setIsLoading(false);
        }
        catch (err) {
            console.log(err);
            txError("Mint failed", err);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (verifiedClaim && verifiedClaim.nft) {
            setIsMinted(true);
            setIsLoading(false);
        }
    }, [verifiedClaim]);

    useEffect(() => {
        if (isMinted) {
            setShowOverlay(true);
        }
    }, [isMinted])

    const checkApproval = async () => {
        setIsLoading(true);
        try {
            const ecoContract = new ethers.Contract(ecoID.ecoAddress, Eco.abi, provider);

            const allowedAmount = await ecoContract.allowance(address, ecoID.address);

            setApprovedAmount(allowedAmount);
            setIsLoading(false);
        }
        catch (err) {
            console.log(err);
            toast({ title: 'Error checking Eco Approval amount', intent: 'danger' });
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (address && ecoID.ecoAddress) {
            checkApproval();
        }
    }, [address, ecoID.ecoAddress]);

    const connectedWalletIsRecipient = () => {
        // subgraph addresses are always in lowercase
        return address && verifiedClaim && address.toLowerCase() === verifiedClaim.recipient;
    }

    return (
        <VStack isFull centerAxis="main">
            <p className="sectionSubtitle">Step 4 <span className="opacity-50">of 4</span></p>
            <TimelineHeader title="Mint Eco ID" />
            <Copy large>
                {verifiedClaim && !connectedWalletIsRecipient() ? (
                    <p>Connect with wallet <strong>{formatAddress(verifiedClaim.recipient)}</strong> to mint.</p>
                ) : (
                    <p>Welcome! You have successfully linked your wallet and account. Mark this milestone by minting your Eco ID NFT.</p>
                )}
            </Copy>
            <Spacer />
            <VStack>
                <VStack>
                    <HStack gapSize={StackGapSize.Large} centerContent>
                        <Button isLoading={isLoading} showArrow={!isMinted} title={approvedAmount.lt(fee) ? `Approve ${utils.formatUnits(fee)} ECO` : isMinted ? "Minted!" : "Mint"} disabled={isMinted || (verifiedClaim && !connectedWalletIsRecipient())} onClick={mint} />
                        {isLoading && <TextLoader />}
                    </HStack>
                </VStack>
            </VStack>
        </VStack>
    );
};

export const MintContext = createContext<
    {
        isMinted: boolean;
        setIsMinted: (_: boolean) => void;
        setShowOverlay: (_: boolean) => void;
        showOverlay: boolean;
    }
>({
    isMinted: false,
    setIsMinted: () => { },
    setShowOverlay: () => { },
    showOverlay: false
})

export default Mint;