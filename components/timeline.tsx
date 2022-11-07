import React, { ReactNode } from "react";
import styles from "css/modules/timeline.module.scss";
import classNames from "classnames";
import Button from "./button";
import classnames from "classnames";

type TimelineType = {
    children: ReactNode
    innerRef: React.RefObject<HTMLDivElement>
};

type TimelineHeaderType = {
    title: string;
    placeholder?: boolean;
};

type TimelineItemProps = {
    isActive?: boolean;
    children: ReactNode;
    innerRef: React.RefObject<HTMLDivElement>;
    isLastItem?: boolean;
}

const Timeline = ({ children, innerRef }: TimelineType) => {
    return (
        <div ref={innerRef} className={classNames(styles.timeline)}>
            <div className={styles.timelineContainer}>
                <div className={styles.bar} />
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export const TimelineHeader = ({ title, placeholder = false }: TimelineHeaderType) => {
    return (
        <div className={styles.header}>
            <div className={styles.bubble}>
                <div className={styles.activeIndicator} />
            </div>
            {placeholder ? <div className={styles.headerPlaceholder} /> : <h2 className="sectionTitle">{title}</h2>}
        </div>
    )
}

export const TimelineBodyPlaceholder = () => {
    return (
        <div className={styles.bodyPlaceholder}>
            <div />
            <div />
        </div>
    )
}

export const TimelineItem = ({ isActive, children, innerRef, isLastItem }: TimelineItemProps) => {
    return (
        <div
            ref={innerRef}
            className={classnames(
                styles.item,
                isActive ? styles["item-isActive"] : styles["item-isInactive"],
                isLastItem ? styles["item-last"] : undefined
            )}>
            <div>{children}</div>
        </div>
    )
}

export default Timeline;