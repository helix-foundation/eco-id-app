import React from "react";
import Button from "./button";
import pkceChallenge from "pkce-challenge";
import { stringify } from "querystring";
import { useAccount } from "wagmi";
import { ConnectedApp } from "./LinkedAccountInfo";

const ConnectTwitterButton: React.FC = () => {
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
            state: stringify({ recipient: address, app: ConnectedApp.Twitter, client_uri: window.location.origin, code_verifier: pkce.code_challenge })
        });

        window.location.href = `https://twitter.com/i/oauth2/authorize?${oAuthData}`
    }

    return (
        <Button secondary title="Connect Twitter" showArrow onClick={verifyTwitter} />
    );
};

export default ConnectTwitterButton;