import { createContext, useContext, useEffect, useState } from "react";

import { BigNumber, ethers, TypedDataDomain, TypedDataField, utils } from "ethers";

import { useRouter } from "next/router";
import { useAccount, useProvider, useSigner } from "wagmi";

import { download, toast, txError } from "../utilities";

import Button from "components/button";
import Copy from "components/copy";
import HStack, { StackGapSize } from "components/hstack";
import { AccountContext, ConnectedApp } from "components/LinkedAccountInfo";
import Spacer from "components/spacer";
import { TimelineHeader } from "components/timeline";
import VStack from "components/vstack";
import Eco from "../assets/abi/ECO.json";
import EcoID from "../assets/abi/EcoID.json";
import TextLoader from "components/TextLoader";
import { useEcoID } from "providers/EcoID";
import { useVerifiedClaim } from "hooks/VerifiedClaim";
import { UIBlockContext } from "./UIBlock";

type TypeData = {
    domain: TypedDataDomain
    types: Record<string, TypedDataField[]>
    value: Record<string, any>
}

type RegisterProps = {
    isActive: boolean;
}

const Register = ({ isActive }: RegisterProps) => {
    const router = useRouter();
    const { data: signer } = useSigner();
    const { address } = useAccount();
    const provider = useProvider();
    const ecoID = useEcoID();

    const { username, deadline, nonce, userid, fee, recipient, app, verifier, verifySig, setApp, setRecipient, setUserid, setUsername, setDeadline, setNonce, setVerifier, setVerifySig } = useContext(AccountContext);
    const verifiedClaim = useVerifiedClaim(`${app}:${userid}`, address);

    const [approvedAmount, setApprovedAmount] = useState<BigNumber>(BigNumber.from(0));

    const { isRegistered, setIsRegistered } = useContext(RegistrationContext);

    const [isLoading, setIsLoading] = useState(false);

    const uiBlockContext = useContext(UIBlockContext);

    useEffect(() => {
        uiBlockContext.setShouldShow(isLoading);
    }, [isLoading])

    const getApproveSig = async () => {
        // check for missing query pararms
        if (!signer || !username || deadline === null || nonce === null || !userid || !fee.toString() || fee.lt(0) || !recipient || !app || !verifier || !verifySig) {
            return;
        }

        try {
            const typeData: TypeData = {
                domain: {
                    name: ecoID.name,
                    version: "1",
                    chainId: await signer.getChainId(),
                    verifyingContract: ecoID.address,
                },
                types: {
                    Register: [
                        {
                            name: "claim",
                            type: "string",
                        },
                        {
                            name: "feeAmount",
                            type: "uint256",
                        },
                        {
                            name: "revocable",
                            type: "bool",
                        },
                        {
                            name: "recipient",
                            type: "address",
                        },
                        {
                            name: "verifier",
                            type: "address",
                        },
                        {
                            name: "deadline",
                            type: "uint256",
                        },
                        {
                            name: "nonce",
                            type: "uint256",
                        },
                    ],
                },
                value: {
                    claim: `${app}:${userid}`,
                    feeAmount: fee,
                    revocable: false,
                    recipient: recipient,
                    verifier: verifier,
                    deadline,
                    nonce,
                }
            }

            const approveSig = await (signer as any)._signTypedData(typeData.domain, typeData.types, typeData.value);

            return approveSig;
        }
        catch (err) {
            console.log(err);
            setIsLoading(false);
            toast({ title: "Failed to generate signature", body: err.code === "ACTION_REJECTED" ? 'User Rejected Signing' : null, intent: 'danger' })
        }
    }

    const downloadRegistrationInformataion = async () => {
        getApproveSig().then(async (sig) => {
            if (sig) {
                download(`registration-${app}-${userid}.txt`, JSON.stringify({ claim: `${app}:${userid}`, fee: fee, recipient: recipient, verifier: verifier, approveSig: sig, verifySig }, null, 4));
            }
        })
    }

    const register = () => {
        setIsLoading(true);

        getApproveSig().then(async (sig) => {
            if (sig) {
                // approve and register
                try {
                    if (approvedAmount.lt(fee)) {
                        // need to increase allowance
                        const ecoContract = new ethers.Contract(ecoID.ecoAddress, Eco.abi, signer);

                        const approveTx = await ecoContract.approve(address, ecoID.address, fee);

                        const approveReceipt = await approveTx.wait();

                        if (!approveReceipt.status) {
                            setIsLoading(false);
                            throw new Error(approveTx);
                        }

                        setApprovedAmount(fee);

                        toast({ title: "Approval successful", intent: 'success' });
                        setIsLoading(false);
                    } else {
                        // now approved
                        const nftContract = new ethers.Contract(ecoID.address, EcoID.abi, signer);

                        const registerTx = await nftContract.register(`${app}:${userid}`, fee, false, recipient, verifier, deadline, sig, verifySig, { gasLimit: 500_000 });

                        const registerReceipt = await registerTx.wait();

                        if (!registerReceipt.status) {
                            setIsLoading(false);
                            throw new Error(registerTx);
                        }

                        toast({ title: "Succesful registration!", intent: 'success' });

                        setIsRegistered(true);
                        setIsLoading(false);
                    }
                }
                catch (err) {
                    console.log(err.code);
                    setIsLoading(false);
                    txError("Registration failed", err);
                }
            }
        });

    }
    
    useEffect(() => {
        if (Object.keys(router.query).length <= (router.query.fromIntro ? 1 : 0)) {
            setUsername(null);
            setDeadline(null);
            setNonce(null);
            setUserid(null);
            setRecipient(null);
            setApp(null);
            setVerifier(null);
            setVerifySig(null);
            return;
        }

        const {
            username,
            deadline,
            nonce,
            userid,
            recipient,
            app,
            verifier,
            verifySig,
        } = router.query;

        const validDiscordUsername = /^.{3,32}$/;
        const validDiscordUserid = /^.{3,32}$/;

        const validTwitterUsername = /^[A-Za-z0-9_]{4,15}$/;

        if (
          ![ConnectedApp.Discord, ConnectedApp.Twitter].includes(
            app as ConnectedApp
          ) ||
          (app === ConnectedApp.Discord &&
            (!validDiscordUsername.test(username as string) ||
              !validDiscordUserid.test(userid as string))) ||
          (app === ConnectedApp.Twitter &&
            !validTwitterUsername.test(username as string))
        ) {
            console.warn('invalid query params');
            router.replace('/mint', undefined, { shallow: true});
        }
        else if (address !== recipient) {
            console.warn('connected wallet is not recipient');
            router.replace('/mint', undefined, { shallow: true});
        }
        else {
            setUsername(username as string);
            setDeadline(parseInt(deadline as string));
            setNonce(parseInt(nonce as string));
            setUserid(userid as string);
            setRecipient(recipient as string);
            setApp(app as ConnectedApp);
            setVerifier(verifier as string);
            setVerifySig(verifySig as string);
        }
    }, [router.query, address]);

    useEffect(() => {
        if (verifiedClaim) {
            setIsRegistered(true);
        } else {
            setIsRegistered(false);
        }
    }, [verifiedClaim]);

    useEffect(() => {
        if (!(verifiedClaim || isLoading || isRegistered) && deadline && Date.now() < deadline*1000) {
            const deadlineTimer = setTimeout(() => {
                router.replace('/mint', undefined, { shallow: true});
                toast({
                    title: "Verifier signature expired",
                    body: (<>
                        Please reconnect your discord or twitter
                    </>),
                    intent: 'danger'
                })
            }, deadline*1000 - Date.now());
            return () => clearTimeout(deadlineTimer);
        }
    }, [verifiedClaim, isLoading, isRegistered, deadline]);

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

    return (
        <RegistrationContext.Consumer>
            {regContext =>
                <VStack isFull centerAxis="main">
                    <p className="sectionSubtitle">Step 3 <span className="opacity-50">of 4</span></p>
                    <TimelineHeader title="Sign & Confirm" />
                    <Copy large>
                        <p>Link your connected wallet to the social account you’ve selected (this permanently associates your account with this wallet address).</p>
                    </Copy>
                    <Spacer />
                    <VStack>
                        <VStack>
                            <HStack gapSize={StackGapSize.Large} centerContent>
                                <Button isLoading={isLoading} showArrow title={approvedAmount.lt(fee) ? `Approve ${utils.formatUnits(fee)} ECO` : isRegistered ? "Registered!" : "Sign & Confirm"} disabled={isRegistered || address !== recipient} onClick={register} />
                                {isLoading && <TextLoader />}
                            </HStack>
                            <p className="text-size-small opacity-50">Fee: {utils.formatUnits(fee)} ECO</p>
                        </VStack>
                    </VStack>
                </VStack>
            }
        </RegistrationContext.Consumer>
    );
};

export const RegistrationContext = createContext<
    {
        isRegistered: boolean
        setIsRegistered: (_: boolean) => void
    }
>({
    isRegistered: false,
    setIsRegistered: () => { }
})

export default Register;