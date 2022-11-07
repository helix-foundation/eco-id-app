import React from "react";
import styles from "css/modules/spacer.module.scss";
import classNames from "classnames";

type SpacerType = {
    size?: "small" | "normal" | "large" | "xlarge";
};

const spacerSize = {
    small: 'spacer-small',
    normal: undefined,
    large: 'spacer-large',
    xlarge: 'spacer-xlarge'
}

const Spacer = ({ size }: SpacerType) => {
    return (
        <div className={classNames(styles.spacer, size && styles[spacerSize[size]])} />
    );
};

export default Spacer;