import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Button from "./button";
import HStack from "./hstack";
import pkceChallenge from "pkce-challenge";
import { stringify } from "querystring";
import { useAccount } from "wagmi";

type ConnectTwitterButtonProps = {
    buttonType?: 'primary' | 'secondary'
}

const ConnectTwitterButton = ({ buttonType = 'primary' }: ConnectTwitterButtonProps) => {
    const [isTwitterConnected, setTwitterConnected] = useState(false);

    const { address } = useAccount();
    
    const verifyTwitter = async () => {
        const pkce = pkceChallenge();

        const oAuthScope = ["users.read", "tweet.read"].join(" ");
        const oAuthData = new URLSearchParams({
            response_type: "code",
            client_id: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID as string,
            redirect_uri: `${process.env.NEXT_PUBLIC_VERIFIER_URI}/api/v1/verify`, // endpoint must be added https://developer.twitter.com/en/portal/projects (see Projects & apps -> User authentication settings)
            scope: oAuthScope,
            code_challenge: pkce.code_challenge,
            code_challenge_method: "plain",
            state: stringify({ recipient: address, app: 'twitter', client_uri: window.location.origin, code_verifier: pkce.code_challenge })
        });

        window.location.href = `https://twitter.com/i/oauth2/authorize?${oAuthData}`
    }

    return (
        <Button secondary title="Connect Twitter" showArrow onClick={verifyTwitter} />
    );
};

export default ConnectTwitterButton;