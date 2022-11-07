import React, { ReactNode, Dispatch } from "react";
import styles from "css/modules/accountBanner.module.scss";
import classNames from "classnames";
import { BigNumber } from "ethers";

type AccountBannerProps = {
    children: ReactNode;
    isVisible: boolean;
};

const AccountBanner = ({ children, isVisible }: AccountBannerProps) => {
    return (
        <div className={classNames(styles.accountBanner, isVisible ? styles["accountBanner-isVisible"] : undefined)}>
            {children}
        </div>
    );
};

export const AccountContext = React.createContext<
    {
        username?: string | string[],
        deadline?: number,
        nonce?: number,
        userid?: string,
        fee?: BigNumber,
        recipient?: string,
        app?: string,
        verifier?: string,
        verifySig?: string,
        setUsername: (_: string) => void,
        setDeadline: (_: number) => void,
        setNonce: (_: number) => void,
        setUserid: (_: string) => void,
        setFee: (_: BigNumber) => void,
        setRecipient: (_: string) => void,
        setApp: (_: string) => void,
        setVerifier: (_: string) => void,
        setVerifySig: (_: string) => void,
    }
>({
    username: null,
    deadline: null,
    nonce: null,
    userid: null,
    fee: null,
    recipient: null,
    app: null,
    verifier: null,
    verifySig: null,

    setUsername: () => { },
    setDeadline: () => { },
    setNonce: () => { },
    setUserid: () => { },
    setFee: () => { },
    setRecipient: () => { },
    setApp: () => { },
    setVerifier: () => { },
    setVerifySig: () => { }
})

export default AccountBanner;