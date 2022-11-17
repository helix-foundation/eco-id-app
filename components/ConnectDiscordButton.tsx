import React from "react";
import Button from "./button";
import { stringify } from "querystring";
import { useAccount } from "wagmi";
import { ConnectedApp } from "./LinkedAccountInfo";

const ConnectDiscordButton: React.FC = () => {
  const { address } = useAccount();

    const verifyDiscord = async () => {
        const oAuthData = new URLSearchParams({
            scope: "identify",
            response_type: "code",
            client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID as string,
            redirect_uri: `${process.env.NEXT_PUBLIC_VERIFIER_URI}/api/v1/verify`, // endpoint must be added https://discord.com/developers/applications (see Oauth2 -> redirects)
            state: stringify({
                app: ConnectedApp.Discord,
                recipient: address,
                client_uri: window.location.origin,
            }),
        });

        window.location.href = `https://discordapp.com/oauth2/authorize?${oAuthData}`
    }

    return (
        <Button title="Connect Discord" secondary showArrow onClick={verifyDiscord} />
    );
};

export default ConnectDiscordButton;