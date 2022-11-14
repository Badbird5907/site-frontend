import React, {useEffect, useState} from 'react';
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm'
//@ts-ignore
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
//@ts-ignore
//import {tomorrow} from 'react-syntax-highlighter/dist/esm/styles/prism'
import GHColorsPrism from "../../../utils/GHColors.prism";
import {Avatar, Chip, Container, Fab, Stack} from "@mui/material";
import {WatchLater} from "@mui/icons-material";
import moment from "moment";
import {backendURL} from '../../../services/APIService';
import EditIcon from '@mui/icons-material/Edit';
import AuthService from "../../../services/AuthService";
import {ETagIcon} from "../../../services/TagsService";
import {useRouter} from "next/router";
import styles from '../../../styles/components/ViewBlog.module.css'

const ViewBlog = (props: any) => { // TODO: Use getStaticProps for SSR - https://nextjs.org/learn/basics/data-fetching/implement-getstaticprops
    const router = useRouter();
    const {id} = router.query;
    const {data, timestamp, tags, error, githubURL, author, authorImg, errorData} = props;

    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        setLoggedIn(AuthService.isLoggedIn())
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
                {
                    AuthService.isLoggedIn() && errorData && errorData.id ? (
                        <Fab color="primary" aria-label="add" onClick={() => {
                            if (typeof window !== 'undefined')
                                window.location.href = "/admin/blog/" + errorData.id;
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
        )
    }
    if (data != null) {
        return (
            <div>
                <Container fixed>
                    <div className={styles.markdownHeader}>
                        <div>
                            <h1 className={"centered no-margin " + styles.markdownTitle}>
                                {/*
                                <Button variant={"outlined"} sx={{
                                    alignSelf: "flex-start",
                                    display: "inline-flex"
                                }} onClick={() => {
                                    // go back
                                    history.back();
                                }}>Back</Button>
                                */}
                                {data.title}
                            </h1>
                        </div>
                        <div>
                            <div className={"centered"}>
                                <Stack direction={"row"} spacing={1} sx={{
                                    marginBottom: '15px'
                                }}>
                                    {tags && tags.map((tag: any) => {
                                            const id = tag.id;
                                            const name = tag.name;
                                            const eTagIcon = ETagIcon.getIconByName(tag.icon);
                                            var Icon = null;
                                            if (eTagIcon) {
                                                Icon = eTagIcon.getIcon();
                                            } else Icon = null;
                                            if (Icon)
                                                return (
                                                    <Chip key={"tag-" + id} label={name} avatar={<Icon/>}/>
                                                )
                                            else return (
                                                <Chip key={"tag-" + id} label={name}/>
                                            )
                                        }
                                    )}
                                </Stack>
                            </div>
                            <Stack direction={"row"} spacing={1} className={"center-horizontal"}>
                                <Chip
                                    avatar={<WatchLater/>}
                                    label={timestamp}
                                    variant="outlined"
                                />
                                <Chip
                                    avatar={<Avatar alt={author} src={authorImg}/>}
                                    label={author}
                                    variant="outlined"
                                />
                            </Stack>
                        </div>
                        <h1 className={"centered border-bottom"}></h1>
                    </div>
                    <div className={styles.markdownBody}>
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
                            children={data.content}
                            rehypePlugins={[remarkGfm, rehypeRaw]}/>
                    </div>
                </Container>

                {
                    loggedIn ? (
                        <Fab color="primary" aria-label="add" onClick={() => {
                            if (typeof window !== 'undefined')
                                window.location.href = "/admin/blog/edit/" + data.id;
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
            <h1>Loading Blog...</h1>
        )
    }
};
export default ViewBlog;

export async function getServerSideProps(context: any) {
    /*
     useEffect(() => {
        if (id == null) return;
        console.log("Fetching blog data with id: " + id);
        axios.get(backendURL + "blog/content/get/" + id).then((res) => {
            console.log(res.data);
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
            if (res.data.author) {
                setAuthor(res.data.author);
            }
            if (res.data.authorImg) {
                setAuthorImg(res.data.authorImg);
            } else {
                setAuthorImg("https://cdn.badbird.dev/assets/user.jpg");
            }
            setData(res.data);
        })
            .catch((err) => {
                console.log(err);
                const data = err.response.data;
                setError(true);
                setErrorData(data);
                if (data.githubURL) {
                    setGithubURL(data.githubURL);
                }
            });
    }, [id])
     */
    let data = null,
        error = false,
        errorData = null,
        githubURL = null,
        timestamp = null,
        tags = null,
        author = null,
        authorImg = null;

    const id = context.params.id;

    const {req, res} = context;

    res.setHeader(
        'Cache-Control',
        'public, s-maxage=20, stale-while-revalidate=59'
    )

    if (id == null) return {props: {}};

    await axios.get(backendURL + "blog/content/get/" + id).then((res) => {
        if (res.data.githubURL) {
            githubURL = res.data.githubURL;
        }
        if (res.data.error) {
            error = true;
            errorData = res.data;
            return;
        }
        const timestampData = res.data.timestamp;
        timestamp = moment(timestampData).format("MM/DD/YYYY, h:mm A");
        if (res.data.tags) {
            tags = res.data.tags;
        }
        if (res.data.author) {
            author = res.data.author;
        }
        if (res.data.authorImg) {
            authorImg = res.data.authorImg;
        } else {
            authorImg = "https://cdn.badbird.dev/assets/user.jpg";
        }
        data = res.data;
    })

    return {
        props: {
            data,
            error,
            errorData,
            githubURL,
            timestamp,
            tags,
            author,
            authorImg
        }
    }
}