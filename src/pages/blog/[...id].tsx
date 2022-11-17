import React, {useEffect, useState} from 'react';
import axios, {AxiosResponse} from "axios";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Fab from "@mui/material/Fab";
import Stack from "@mui/material/Stack";
import WatchLater from "@mui/icons-material/WatchLater";
import moment from "moment";
import {backendURL} from '../../services/APIService';
import EditIcon from '@mui/icons-material/Edit';
import AuthService from "../../services/AuthService";
import {ETagIcon} from "../../services/TagsService";
import {useRouter} from "next/router";
import styles from '../../styles/components/ViewBlog.module.css'
import MarkdownRenderer from "../../components/MarkdownRenderer";
import BlogService from "../../services/BlogService";
import Head from "next/head";
import { serialize } from 'next-mdx-remote/serialize'
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import rehypeCodeTitles from "rehype-code-titles";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import {getTweets} from "../../utils/tweets";

const TWEET_RE = /<StaticTweet\sid="[0-9]+"\s\/>/g;

const ViewBlog = (props: any) => { // TODO use MDX instead of react-markdown
    const router = useRouter();
    const {id} = router.query;
    const {data, timestamp, tags, error, githubURL, author, authorImg, errorData, tweets} = props;
    const {source} = props

    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        setLoggedIn(AuthService.isLoggedIn())
    }, [])

    if (error) {
        let ghUrl = null;
        if (githubURL) {
            ghUrl = <a href={githubURL} target="_blank" rel="noreferrer">View on GitHub</a>
        }
        return (
            <div className="centered">
                <h1>Error!</h1>
                {ghUrl ? <h2>{ghUrl}</h2> : null}
                {
                    loggedIn && errorData.data && errorData.data.id ? (
                        <Fab color="primary" aria-label="add" onClick={() => {
                            if (typeof window !== 'undefined')
                                window.location.href = "/admin/blog/edit/" + errorData.data.id;
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
            <>
                <Head>
                    <title>{data.title}</title>
                </Head>
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
                        <article className={styles.markdownBody}>
                            <MarkdownRenderer tweets={tweets} source={source}/>
                        </article>
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
            </>
        );
    } else {
        return (
            <h1>Loading Blog...</h1>
        )
    }
};
export default ViewBlog;

export async function getStaticProps(context: any) {
    let data = null,
        error = false,
        githubURL = null,
        timestamp = null,
        tags = null,
        author = null,
        authorImg = null,
        errorData = null,
        mdxSource = null,
        content: any = null;

    const
        id = context.params.id;

    // We don't need this now, since we're using static gen
    //const {req, res} = context;
    //res.setHeader(
    //    'Cache-Control',
    //    'public, s-maxage=20, stale-while-revalidate=59'
    //)

    if (id == null) return {props: {}};

    console.log("Fetching blog with id: " + id);
    console.log('Backend URL: ' + backendURL);
    let aRes: AxiosResponse<any>;
    await axios.get(backendURL + "blog/content/get/" + id).then((res) => {
        aRes = res;
        console.log("Got response: " + res.data);
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
        if (res.data.content) {
            content = res.data.content;
        } else content = 'Could not find content.';
        data = res.data;
    }).catch(
        (err) => {
            console.log("Error: " + err);
            error = true;
            if (err.response) {
                errorData = err.response.data;
                if (err.response.data.githubURL) {
                    githubURL = err.response.data.githubURL;
                }
            }
        }
    )
    // parse content for <Tweet id="1234567890" />
    let tweetIDs = null, tweets = null;
    if (content) {
        const tweetMatch = content.match(TWEET_RE);
        console.log("Tweet match: " + tweetMatch);
        tweetIDs = tweetMatch?.map((mdxTweet: any) => {
            const id = mdxTweet.match(/[0-9]+/g)![0];
            return id;
        });
        tweets = tweetIDs && tweetIDs.length > 0 ? await getTweets(tweetIDs) : {};
    }

    console.log('resolved tweets: ', tweets)
    mdxSource = await serialize(content, {
        mdxOptions: {
            rehypePlugins: [remarkGfm, rehypeSlug, rehypeKatex, rehypeCodeTitles],
            remarkPlugins: [remarkMath],
        }
    });

    return {
        props: {
            data,
            error,
            errorData,
            githubURL,
            timestamp,
            tags,
            author,
            authorImg,
            source: mdxSource,
            tweets
        }
    }
}

export async function getStaticPaths() {
    const res = await BlogService.fetchLatestPage(); // axios call to get latest 10 blog posts
    const data = res.data;
    const {blogs} = data;
    const basePath = "/blog/";
    let pathsObj = [];
    for (let i = 0; i < blogs.length; i++) {
        const blog = blogs[i];
        const safeName = blog.safeName;
        pathsObj.push(basePath + safeName);
    }
    return {
        fallback: 'blocking',
        paths: pathsObj
    }
}
