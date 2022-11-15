import React, {useEffect, useState} from 'react';
import axios from "axios";
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

const ViewBlog = (props: any) => {
    const router = useRouter();
    const {id} = router.query;
    const {data, timestamp, tags, error, githubURL, author, authorImg, errorData} = props;

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
                        <MarkdownRenderer content={data.content}/>
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

export async function getStaticProps(context: any) {
    let data = null,
        error = false,
        githubURL = null,
        timestamp = null,
        tags = null,
        author = null,
        authorImg = null,
        errorData = null;

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
    await axios.get(backendURL + "blog/content/get/" + id).then((res) => {
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
