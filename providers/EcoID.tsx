import { createContext, ReactNode, useContext } from "react";
import { gql, useQuery } from "@apollo/client";

export const EcoIDContext = createContext<{
    address: string;
    ecoAddress: string;
    ecoxAddress: string;
    NFT_IMAGE_URL: string;
    EXTERNAL_IMAGE_URL: string;
    META_LIMIT: number;
    name: string;
    symbol: string;
}>({
    address: "",
    ecoAddress: "",
    ecoxAddress: "",
    NFT_IMAGE_URL: "",
    EXTERNAL_IMAGE_URL: "",
    META_LIMIT: 0,
    name: "",
    symbol: ""
});

export const EcoIDProvider = ({ children }: { children: ReactNode }) => {

    let ecoID = {
        address: "",
        ecoAddress: "",
        ecoxAddress: "",
        NFT_IMAGE_URL: "",
        EXTERNAL_IMAGE_URL: "",
        META_LIMIT: 0,
        name: "",
        symbol: ""
    }

    const { data, loading, error } = useQuery(NFT_CONTRACT);

    if (error) {
        console.log(error);
    }
    else if (data) {
        ecoID = {
            ...data.globals.ecoID,
            META_LIMIT: parseInt(data.globals.ecoID.META_LIMIT),
            ecoAddress: data.globals.eco,
            ecoxAddress: data.globals.ecox,
        }
    }

    return (
        <EcoIDContext.Provider value={ecoID} >
            {children}
        </EcoIDContext.Provider>
    )
}

const NFT_CONTRACT = gql`
    query NFTContract {
        globals(id:"0") {
            eco
            ecox
            ecoID {
                address: id
                NFT_IMAGE_URL
                META_LIMIT
                EXTERNAL_IMAGE_URL
                name
                symbol
            }
        }
    }
`

export const useEcoID = () => useContext(EcoIDContext);