import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import axios from "axios";
import Settings from "../../../config/config-dev.json";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import '../../css/ViewBlog.css';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {tomorrow} from 'react-syntax-highlighter/dist/esm/styles/prism'
import {Container} from "@mui/material";
import {WatchLater} from "@mui/icons-material";
import moment from "moment";

const ViewBlog = (props: any) => {
    const params = useParams();
    const id = params.id;
    const [data, setData]: any = useState(null);
    const [timestamp, setTimestamp]: any = useState(null);
    useEffect(() => {
        const backendUrl = Settings["backend-url"];
        axios.get(backendUrl + "api/blog/content/get/" + id).then((res) => {
            console.log(res.data);
            setData(res.data);
            const timestamp = res.data.timestamp;
            var date = moment(timestamp).format("MM/DD/YYYY, h:mm A");
            setTimestamp(date);
        });
    }, [])
    if (data != null) {
        return (
            <div>
                <Container fixed>
                    <div className={"markdown-header"}>
                        <h1 className={"centered markdown-title"}>{data.title}</h1>
                        <div>
                            <div className={"center-horizontal"}>
                                <WatchLater/>
                                <span>{timestamp}</span>
                            </div>
                        </div>
                        <h1 className={"centered border-bottom"}></h1>
                    </div>
                    <div className={"markdown-body"}>
                        <ReactMarkdown
                            components={{
                                code({node, inline, className, children, ...props}) {
                                    const match = /language-(\w+)/.exec(className || '')
                                    return !inline && match ? (
                                        <SyntaxHighlighter
                                            children={String(children).replace(/\n$/, '')}
                                            style={tomorrow}
                                            language={match[1]}
                                            PreTag="div"
                                            {...props}
                                        />
                                    ) : (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    )
                                }
                            }}
                            children={data.content}
                            rehypePlugins={[remarkGfm]}/>
                    </div>
                </Container>
            </div>
        );
    } else {
        return (
            <h1>Loading...</h1>
        )
    }
};

export default ViewBlog;
