import { createContext } from "react";
import Loader from "./loader";
import TextLoader from "./TextLoader";

const UIBlock = () => {
    return (
        <UIBlockContext.Consumer>
            {context => (
                context.shouldShow &&
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 9999,
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }} />
            )}
        </UIBlockContext.Consumer>
    )
}


export const UIBlockContext = createContext<{
    shouldShow: boolean;
    setShouldShow: (_: boolean) => void;
}>({
    shouldShow: false,
    setShouldShow: () => { }
})

export default UIBlock;