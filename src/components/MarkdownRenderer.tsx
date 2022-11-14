import React from 'react';
import ReactMarkdown from "react-markdown";
import GHColorsPrism from "../utils/GHColors.prism";
import styles from '../styles/components/MarkdownRenderer.module.css'
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
//@ts-ignore
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'

const MarkdownRenderer = (props: any) => {
    return (
        <>
            <ReactMarkdown
                components={{
                    code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                            <SyntaxHighlighter
                                children={String(children).replace(/\n$/, '')}
                                style={GHColorsPrism}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                            />
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        )
                    },
                    a({node, className, children, ...props}) {
                        return (
                            <a className={className + ` ${styles.blogLink}`} {...props}>
                                {children}
                            </a>
                        )
                    },
                    h1({node, className, children, ...props}) {
                        return (
                            <h1 className={className + ` ${styles.blogHeader} centered`} {...props}> {/*TODO: Add a way to toggle header center, and bottom line. */}
                                {children}
                            </h1>
                        )
                    }
                }}
                children={props.content}
                rehypePlugins={[remarkGfm, rehypeRaw]}/>
        </>
    );
};

export default MarkdownRenderer;
