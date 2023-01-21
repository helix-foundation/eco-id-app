import { gql, useQuery } from "@apollo/client";
import { constants } from "ethers";

export type VerifiedClaim = {
    app: string;
    userid: string;
    recipient: string;
    verifiers: { address: string, revocable: boolean }[];
    nft: {
        tokenID: number;
        tokenURI: string;
    } | null;
}

export const useVerifiedClaim = (claim: string, recipient: string): VerifiedClaim | null => {

    const { data, loading, error, startPolling } = useQuery(VERIFIED_CLAIM, {
        variables: {
            id: claim
        },
        pollInterval: 5000
    });
    startPolling(5000);

    let verifiedClaim = null;

    if (error) {
        console.log(error);
    }
    else if (data && data.claim && data.claim.verifiedClaims.length) {
        const [app, userid] = data.claim.id.split(':');

        // prioritize the verifiedClaim for the current recipient but fallback to use any other
        const index = data.claim.verifiedClaims.findIndex((claim) => claim.recipient === recipient);
        verifiedClaim = {
            ...(data.claim.verifiedClaims[index > -1 ? index : 0]),
            app,
            userid,
        }
    }

    return verifiedClaim;
}

const VERIFIED_CLAIM = gql`
    query VerifiedClaim($id: String) {
        claim(id: $id) {
            id
            verifiedClaims {
                recipient
                verifiers {
                    address
                    revocable
                }
                nft {
                    tokenID
                    tokenURI
                }
            }
        }
    }
`
