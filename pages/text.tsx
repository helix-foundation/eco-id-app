import classNames from "classnames";
import Button from "components/button";
import { FullScreenLayout } from "components/layout";
import styles from "css/modules/text.module.scss";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const text = [
    "We all have identities —— our own individual identities, and our collective identities as part of the communities we belong to.",
    "Identities reflect who we are, and they entitle us to what we deserve.",
    "You could say that identity is the foundation for everything we do together.",
    "And identity enables something powerful —— reputation. Communities, societies, relationships... none of them would function without reputation.",
    "Communities are nothing without identities and reputations. Those identities need not give away all your personal details —— they only need to reflect what your community thinks is important. But without some form of identity and reputation, communities crumble.",
    "You’ve built an identity in the Eco Community. You’ve built up reputation.",
    "And now, we want to give you your first proof of identity, which you will need for your next steps.",
    "It is the first building block.",
    "We’re going to give you a non-fungible, non-transferable token —— one that represents your identity, in this early Eco era.",
    "It will store your Discord or Twitter ID, and it will forever prove that you are who you say you are, and that you were here.",
    "Choose your wallet address carefully —— you only get one of these, at least for now.",
    "Take this. It is your ticket to the next era, to this great new game we’re about to play..."
]

type ParagraphProps = {
    text: string;
    onComplete: () => void;
    isFocused: boolean;
    bold: boolean;
}

const Paragraph = ({ text, onComplete, isFocused, bold }: ParagraphProps) => {

    const [textIndex, setTextIndex] = useState(0);
    const splitText = text.split(" ");
    const duration = 1000;
    let interval;

    useEffect(() => {
        if (textIndex > splitText.length - 1) {
            setTimeout(() => {
                onComplete();
            }, duration);
            clearInterval(interval);
            return;
        }

        interval = setInterval(() => {
            setTextIndex(oldIndex => oldIndex + 1);
        }, 60);

        return () => {
            clearInterval(interval);
        }
    }, [textIndex])

    return (
        <div className={classNames(styles.paraOuter, isFocused ? styles.paraFocused : styles.paraMuted, bold ? styles.paraBold : undefined)}>
            <TransitionGroup className={styles.paraWrapper}>
                {[...Array(textIndex)].map((_, index) => {
                    return <Word key={`${splitText[index]}-${index}`} text={splitText[index]} />
                })}
            </TransitionGroup>
            <div className={styles.placeholder}>
                {splitText.map((text, index) => (
                    <span className={styles.textItem} key={text + index}>
                        <span>{`${text}`}&nbsp;</span>
                    </span>
                ))}
            </div>
        </div>
    )
}

type WordProps = {
    text: string
}

const Word = ({ text, ...restProps }: WordProps) => {
    const ref = useRef(null);
    return (
        <CSSTransition
            {...restProps}
            timeout={0}
            appear={true}
            nodeRef={ref}
            classNames={{
                enterActive: styles.textEntering,
                enterDone: styles.textEnterDone
            }}
        >
            <span className={styles.textItem} ref={ref}>
                <span>{text}&nbsp;</span>
            </span>
        </CSSTransition>
    )
}

type TextPageProps = {
    shouldPlay: boolean;
    onComplete: () => void;
}

const TextPage = ({ shouldPlay = false, onComplete }: TextPageProps) => {

    const [showText, setShowText] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [paragraphIndex, setParagraphIndex] = useState(1);
    const [readyForNext, setReadyForNext] = useState(false);
    const [shouldFocus, setShouldFocus] = useState(true);

    const textRef = useRef(null);

    const handleComplete = () => {
        setReadyForNext(true);

        if (paragraphIndex >= text.length) {
            setIsComplete(true);
        }
    }

    const advanceParagraph = () => {
        if (paragraphIndex >= text.length) {
            return;
        }
        setParagraphIndex(oldIndex => oldIndex + 1);
        setReadyForNext(false);
        textRef.current.scrollTo({
            top: document.body.scrollHeight,
            left: 0,
            behavior: "smooth"
        });
    }

    const handleKeyDown = (e) => {
        if (!readyForNext) { return }
        setShouldFocus(true);
        advanceParagraph()
    }

    const handleMouseWheel = (e) => {
        setShouldFocus(false)
    }

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        textRef.current.addEventListener("wheel", handleMouseWheel);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            if (textRef.current) {
                textRef.current.removeEventListener("wheel", handleMouseWheel);
            }
        }
    }, [readyForNext])

    useEffect(() => {
        if (shouldPlay && !showText) {
            setShowText(true);
        }
    }, [shouldPlay, showText])

    const handleContinueClick = () => {
        onComplete();
    }

    return (
        <FullScreenLayout>
            <div className={styles.scroll} ref={textRef}>
                <div className={classNames(
                    styles.text,
                )}>
                    {showText &&
                        <div className={styles.textWrapper}>
                            {[...Array(paragraphIndex)].map((_, index) => {
                                return (
                                    <React.Fragment key={index + text[index]}>
                                        <Paragraph bold={index === 0} isFocused={shouldFocus ? index === paragraphIndex - 1 : true} text={text[index]} onComplete={handleComplete} />
                                        {index === paragraphIndex - 1 && index !== text.length - 1 &&
                                            <>
                                                <div className={classNames(
                                                    styles.enter,
                                                    readyForNext ? styles.enterReady : undefined
                                                )}>
                                                    Press Any Key
                                                </div>
                                            </>
                                        }
                                        {index === text.length - 1 &&
                                            <div className={classNames(
                                                styles.continueButton,
                                                isComplete ? styles.continueButtonVisible : undefined
                                            )}>
                                                <Button title="Continue" showArrow onClick={handleContinueClick} />
                                            </div>
                                        }
                                    </React.Fragment>
                                )
                            })}
                        </div>
                    }
                </div>
            </div>
        </FullScreenLayout>

    );
}

export default TextPage;