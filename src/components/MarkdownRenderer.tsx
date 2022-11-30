import React from 'react';
//@ts-ignore
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {MDXRemote} from "next-mdx-remote";
import styles from "../styles/components/MarkdownRenderer.module.css";
import GHColorsPrism from "../utils/GHColors.prism";
import Link from "next/link";
import Tweet from "./twitter";

function code({className, ...props}: any) {
    const match = /language-(\w+)/.exec(className || '')
    {/* <SyntaxHighlighter language={match[1]} PreTag="div" {...props} /> */
    }
    return match
        ? <SyntaxHighlighter
            style={GHColorsPrism}
            language={match[1]}
            PreTag="div"
            className={styles.codeBlock}
            {...props}
        />
        : <code className={className} {...props} />
}

function h1({id, className, ...rest}: any) {
    if (id) {
        return (
            <Link href={`#${id}`} className={styles.headerBefore}>
                <h1 className={className + ` ${styles.blogHeader}`} id={id} {...rest} />
            </Link>
        );
    }
    return <h1 className={className + ` ${styles.blogHeader}`} id={id} {...rest} />;
}

const MarkdownRenderer = (props: any) => {
    const {source}: any = props;
    const StaticTweet = ({id}: { id: string }) => {
        if (props.tweets)
            return <Tweet tweet={props.tweets[id]}/>;
        else return <p>Failed to load tweet id {id}</p>
    };
    const components = {
        code, h1, StaticTweet
    }
    return (
        <>
            <MDXRemote {...source} components={components}/>
            {/*
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
                                className={styles.codeBlock}
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
                            <h1 className={className + ` ${styles.blogHeader} centered`} {...props}>
                                {children}
                            </h1>
                        )
                    }
                }}
                children={props.content}
                rehypePlugins={[remarkGfm, rehypeRaw]}/>
                */}

        </>
    );
};

export default MarkdownRenderer;
