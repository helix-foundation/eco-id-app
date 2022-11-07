import { createContext } from "react";
import styles from "css/modules/helpOverlay.module.scss";
import VStack from "./vstack";
import { StackGapSize } from "./hstack";
import classNames from "classnames";
import Spacer from "./spacer";

type HelpOverlayProps = {
    shouldShow: boolean;
}

const HelpOverlay = ({ shouldShow }: HelpOverlayProps) => {

    return (
        <HelpOverlayContext.Consumer>
            {context => (
                <div className={classNames(
                    styles.helpOverlay,
                    shouldShow ? styles["helpOverlay-isVisible"] : undefined)}>
                    <div className={styles.containerWrapper}>
                        <div className={styles.containerScroll}>
                            <div className={styles.container}>
                                <button className={styles.overlayClose} onClick={() => context.setShouldShow(false)}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18 6L12 12L18 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M6 6L12 12L6 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <div className={styles.title}>Help</div>
                                <VStack gapSize={StackGapSize.Large}>
                                    <div className={styles.question}>
                                        <div className={styles.questionBody}>
                                            Having trouble with the Eco ID claim flow? Here are a few common FAQs that might help.
                                        </div>
                                    </div>
                                    <div />
                                    <div className={styles.question}>
                                        <div className={styles.questionTitle}>What do I do with this Eco ID NFT?</div>
                                        <div className={styles.questionBody}>
                                            This Eco ID NFT is the first example of Eco&apos;s generalized ID system. It marks your membership in Eco&apos;s early community (via Discord or Twitter), as well as your ownership of the wallet address you prefer to associate with your account. This Eco ID NFT may then be used to gain access to certain Eco applications; or your verified wallet address may become eligible to claim other credentials as you gain reputation in the community. You can read more about the Eco ID and reputation system at <a href="https://eco.org/eco-id" target="_blank" rel="noreferrer">eco.org/eco-id</a>.
                                        </div>
                                    </div>

                                    <div className={styles.question}>
                                        <div className={styles.questionTitle}>I don&apos;t have an Ethereum wallet. How can I get one?</div>
                                        <div className={styles.questionBody}>
                                            If you&apos;re new to NFTs or to signing transactions on Ethereum, we recommend installing <a href="https://metamask.io/download/" target="_blank" rel="noreferrer">MetaMask</a> (browser extension and/or mobile app) to get started. This will give you an Ethereum wallet and address to use. But please note: This will be the wallet address forever associated with your Eco ID claim, so don&apos;t lose access to it! Please choose a secure password, write down your recovery phrase at least twice, and store it securely. You can find helpful suggestions for wallet setup under &apos;Getting started&apos; and &apos;Security&apos; <a href="https://metamask.io/faqs/" target="_blank" rel="noreferrer">here</a>.
                                        </div>
                                    </div>

                                    <div className={styles.question}>
                                        <div className={styles.questionTitle}>I don&apos;t have any Ethereum (ETH) in my wallet. Can I still claim?</div>
                                        <div className={styles.questionBody}>
                                            You do not need ETH to validate your social account ownership and connect your account with your wallet address. But you will need a small amount of ETH (&#60;0.05) to mint your NFT. For most users, the easiest way to purchase ETH is directly through MetaMask; you can use a debit or credit card. You can also find helpful information under ‘Getting started’ <a href="https://metamask.io/faqs/" target="_blank" rel="noreferrer">here</a>.
                                        </div>
                                    </div>

                                    <div className={styles.divider} />

                                    <div className={styles.question}>
                                        <div className={styles.questionBody}>
                                            Still need help? Drop into the <a href="http://discord.eco.org" target="_blank" rel="noreferrer" >Eco Discord</a> and post in <strong>#eco-support</strong> with your questions!
                                        </div>
                                    </div>

                                </VStack>
                                <Spacer size="large" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </HelpOverlayContext.Consumer>
    )
}

export const HelpOverlayContext = createContext<{
    shouldShow: boolean;
    setShouldShow: (_: boolean) => void;
}>({
    shouldShow: false,
    setShouldShow: () => { }
})

export default HelpOverlay;