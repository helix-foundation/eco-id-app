import classNames from "classnames";
import styles from "css/modules/header.module.scss";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import ConnectWalletButton from "./ConnectWalletButton";
import { HelpOverlayContext } from "./HelpOverlay";

type HeaderType = {};

const Header = ({ }: HeaderType) => {
    const account = useAccount();
    const [showWalletButton, setShowWalletButton] = useState(false);

    useEffect(() => {
        if (account.address) {
            setShowWalletButton(true);
        }
    }, [account])

    return (
        <HelpOverlayContext.Consumer>
            {overlayContext => (
                <div className={classNames(styles.header)}>
                    <ul>
                        <li className={styles.link}>
                            <a onClick={() => {
                                overlayContext.setShouldShow(true);
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12.4034 14.017V13.8419C12.409 13.4968 12.4452 13.215 12.5093 12.9935C12.5727 12.7741 12.6736 12.5877 12.811 12.4322L12.8117 12.4314C12.9521 12.2698 13.1419 12.1127 13.384 11.9614C13.6431 11.8023 13.8657 11.6187 14.0506 11.41C14.2399 11.1995 14.3843 10.9603 14.4834 10.6932C14.5861 10.4242 14.6363 10.1263 14.6363 9.80114C14.6363 9.33807 14.5293 8.92094 14.3124 8.55327C14.0985 8.18584 13.7942 7.89735 13.403 7.68824C13.0123 7.47785 12.5565 7.375 12.0398 7.375C11.5626 7.375 11.1245 7.46953 10.7281 7.66025C10.3333 7.85167 10.0133 8.12981 9.77071 8.49214C9.52901 8.85771 9.39872 9.29375 9.37512 9.79526L9.36896 9.92614H10.6907L10.6986 9.80959C10.7202 9.48981 10.7995 9.2424 10.9277 9.0588C11.0606 8.86865 11.2237 8.73205 11.4175 8.64535C11.6176 8.55583 11.8247 8.51136 12.0398 8.51136C12.289 8.51136 12.5122 8.56291 12.712 8.66407C12.911 8.76487 13.0687 8.90737 13.1873 9.09287C13.3033 9.27449 13.3636 9.49185 13.3636 9.75C13.3636 9.95941 13.3266 10.1469 13.2545 10.3142L13.2539 10.3157C13.1829 10.4866 13.086 10.637 12.9633 10.7676C12.8376 10.8986 12.6957 11.0124 12.5374 11.109C12.2518 11.281 12.0049 11.4703 11.798 11.6772C11.5829 11.8923 11.4205 12.17 11.3076 12.5056C11.1938 12.8442 11.1364 13.2908 11.1307 13.8396V14.017H12.4034ZM11.8011 14.7557C11.5573 14.7557 11.3452 14.8445 11.1715 15.0181C10.9979 15.1918 10.9091 15.4039 10.9091 15.6477C10.9091 15.8916 10.9979 16.1036 11.1715 16.2773C11.3452 16.451 11.5573 16.5398 11.8011 16.5398C11.9641 16.5398 12.1152 16.4999 12.2497 16.4192C12.3833 16.3378 12.4902 16.2294 12.5689 16.0954C12.6518 15.9591 12.6932 15.809 12.6932 15.6477C12.6932 15.4039 12.6044 15.1918 12.4307 15.0181C12.257 14.8445 12.045 14.7557 11.8011 14.7557Z" fill="black" />
                                </svg>
                                Help
                            </a>
                        </li>
                        {showWalletButton && <li>
                            <ConnectWalletButton buttonType="secondary" showArrow={false} small />
                        </li>}
                    </ul>
                </div>
            )}
        </HelpOverlayContext.Consumer>
    );
};

export default Header;