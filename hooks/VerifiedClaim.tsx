import { gql, useQuery } from "@apollo/client";

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

export const useVerifiedClaim = (claim: string): VerifiedClaim | null => {

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
    else if (data && data.verifiedClaim) {

        const [app, userid] = data.verifiedClaim.id.split(':');

        verifiedClaim = {
            ...data.verifiedClaim,
            app,
            userid,
        }
    }

    return verifiedClaim;
}

const VERIFIED_CLAIM = gql`
    query Globals($id: String) {
        verifiedClaim(id: $id) {
            id
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
`
