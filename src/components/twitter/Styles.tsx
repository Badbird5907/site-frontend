//import { css, Shadows, styled } from '@maximeheckel/design-system';

import React from "react";
import styles from "../../styles/components/Tweet.module.css"
// Rewrite this to use plain react and MUI
export const TweetWrapper = ({children}: any) => {
    return <div className={styles.tweetWrapper}>{children}</div>
}
export const Name = ({children, ...props}: any) => <a className={styles.name} {...props}>{children}</a>;

export const ImageGrid = ({children}: any) => {
    return <div className={styles.imageGrid}>{children}</div>
}

export const SingleImageWrapper = ({children}: any) => {
    return <div className={styles.singleImageWrapper}>{children}</div>
}


export const ActionIcons = ({children, ...props}: any) => {
    return <div className={styles.actionIcons} {...props}>{children}</div>
}

export const singleImage: any = styles.singleImage;
