import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Button from "./button";
import HStack from "./hstack";
import pkceChallenge from "pkce-challenge";
import { stringify } from "querystring";
import { useAccount } from "wagmi";

type ConnectDiscordProps = {
}

const ConnectDiscordButton = ({ }: ConnectDiscordProps) => {
    const [isTwitterConnected, setTwitterConnected] = useState(false);

    const { address } = useAccount();

    const verifyDiscord = async () => {
        const oAuthScope = ["identify"].join(" ");
        const oAuthData = new URLSearchParams({
            response_type: "code",
            client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID as string,
            redirect_uri: `${process.env.NEXT_PUBLIC_VERIFIER_URI}/api/v1/verify`, // endpoint must be added https://discord.com/developers/applications (see Oauth2 -> redirects)
            scope: oAuthScope,
            state: stringify({ recipient: address, app: 'discord', client_uri: window.location.origin })
        });

        window.location.href = `https://discordapp.com/oauth2/authorize?${oAuthData}`
    }

    return (
        <Button title="Connect Discord" secondary showArrow onClick={verifyDiscord} />
    );
};

export default ConnectDiscordButton;