import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm'
import '../../css/ViewBlog.css';
//@ts-ignore
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
//@ts-ignore
//import {tomorrow} from 'react-syntax-highlighter/dist/esm/styles/prism'
import GHColorsPrism from "../../utils/GHColors.prism";
import {Button, Chip, Container, Fab} from "@mui/material";
import {WatchLater} from "@mui/icons-material";
import moment from "moment";
import {backendURL} from "../../services/APIService";
import Box from "@mui/material/Box";
import EditIcon from '@mui/icons-material/Edit';
import AuthService from "../../services/AuthService";

const ViewBlog = (props: any) => {
    const params = useParams();
    const id = params.id;
    const [data, setData]: any = useState(null);
    const [timestamp, setTimestamp]: any = useState(null);
    const [tags, setTags]: any = useState([]);
    const [error, setError]: any = useState(false);
    const [githubURL, setGithubURL]: any = useState(null);
    useEffect(() => {
        axios.get(backendURL + "blog/content/get/" + id).then((res) => {
            console.log(res.data);
            setData(res.data);
            if (res.data.githubURL) {
                setGithubURL(res.data.githubURL);
            }
            if (res.data.error) {
                return;
            }
            const timestamp = res.data.timestamp;
            var date = moment(timestamp).format("MM/DD/YYYY, h:mm A");
            setTimestamp(date);
            if (res.data.tags) {
                const resTags = res.data.tags;
                setTags(resTags);
            }
        })
            .catch((err) => {
                console.log(err);
                const data = err.response.data;
                setError(true);
                if (data.githubURL) {
                    setGithubURL(data.githubURL);
                }
            });
    }, [])
    if (error) {
        var ghUrl = null;
        if (githubURL) {
            ghUrl = <a href={githubURL} target="_blank" rel="noreferrer">View on GitHub</a>
        }
        return (
            <div className="centered">
                <h1>Error!</h1>
                {ghUrl ? <h2>{ghUrl}</h2> : null}
            </div>
        )
    }
    if (data != null) {
        return (
            <div>
                <Container fixed>
                    <div className={"markdown-header"}>
                        <div>
                            <h1 className={"centered markdown-title"}>
                                <Button variant={"outlined"} sx={{
                                    alignSelf: "flex-start",
                                    display: "inline-flex"
                                }} onClick={()=> {
                                    // go back
                                    history.back();
                                }}>Back</Button>
                                {data.title}
                            </h1>
                        </div>
                        <div>
                            <div className={"centered"}>
                                {tags && tags.map((tag: any) => {
                                        const urlEncoded = encodeURIComponent(tag);
                                        return (
                                            <div className={"tag"}>
                                                <Chip key={"tag-" + {urlEncoded}} label={tag}/>
                                            </div>
                                        )
                                    }
                                )}
                            </div>
                            <div className={"center-horizontal"}>
                                <WatchLater/>
                                <span>&nbsp;{timestamp}</span>
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
                                }
                            }}
                            children={data.content}
                            rehypePlugins={[remarkGfm, rehypeRaw]}/>
                    </div>
                </Container>

                {
                    AuthService.isLoggedIn() ? (
                        <Fab color="primary" aria-label="add" onClick={() => {
                            window.location.href = "/admin/blog/" + data.id;
                        }} sx={{
                            position: 'fixed',
                            bottom: 16,
                            right: 16,
                        }}>
                            <EditIcon/>
                        </Fab>
                    ) : null
                }
            </div>
        );
    } else {
        return (
            <h1>Loading...</h1>
        )
    }
};
export default ViewBlog;
