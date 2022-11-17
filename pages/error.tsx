import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type OauthError = {
    code: string;
    description: string;
}

const EcoErrors = {
    VerifierServiceError: "Verifier error",
    UserCancelled: "User cancelled verification",
    InvalidVerifyState: "Verification missing required information",
    UnsupportedAppType: "Unsupported Application to verify for",
    DiscordEmailNotVerified: "Discord email is not verified",
    RecipientSigningError: "Error generation verification signature",
    TwitterLoginError: "Could not log in to twitter",
    TwitterUserInfoError: "Could not fetch twitter user information",
    DiscordLoginError: "Could not log in to discord",
    DiscordUserInfoError: "Could not fetch discord user information",
    UserHasNoPoints: "Unauthorized: User does not have any points"
}

const Error: NextPage = () => {

    const router = useRouter();
    const [error, setError] = useState<OauthError | null>(null);

    useEffect(() => {
        if (router.query && router.query.errorCode) {
            const code = router.query.errorCode as string;

            // get description based on error code
            let description = EcoErrors[code];
            if (description) {
                setError({ 
                    code, 
                    description
                });
            }
        }
    }, [router.query]);


    return (
        <div>
            <br />
            <br />
            <div className="flex justify-center">
                <div className="w-7/12 max-w-4xl flex flex-col gap-6 text-lg text-center">
                    <div className="text-3xl font-medium mb-2" >Something went wrong while verifying your account</div>
                    <br/>
                    {error && (
                        <div className="text-xl font-small mb-2" >
                            {error.description}
                        </div>
                    )}
                    <br/>
                    <div className="align-center">
                        <Link href="/" >
                            <button>Back to Home</button>
                        </Link>
                    </div>

                </div>
            </div>
        </div>

    );
}

export default Error;