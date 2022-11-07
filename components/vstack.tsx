import React, { ReactNode } from "react";
import styles from "css/modules/stacks.module.scss";
import classNames from "classnames";
import { gapSizeMap, StackGapSize } from "./hstack";

type StackType = {
    children: ReactNode;
    isFull?: boolean;
    centerAxis?: "main" | "all";
    gapSize?: StackGapSize
};

const centerMap = new Map<"main"|"all", string>([
    ["main", "vStack-centerMain"],
    ["all", "vStack-centered"]
]);

const VStack = ({ children, isFull, centerAxis, gapSize = StackGapSize.Medium }: StackType) => {
    return (
        <div className={classNames(
            styles.vStack,
            isFull ? styles['vStack-full'] : undefined,
            centerAxis ? styles[centerMap.get(centerAxis)] : undefined,
            styles[`vStack-${gapSizeMap.get(gapSize)}`]
        )}>
            {children}
        </div>
    );
};

export default VStack;