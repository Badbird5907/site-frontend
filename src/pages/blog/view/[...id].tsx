import React, {useEffect, useState} from 'react';
import axios from "axios";
//import {tomorrow} from 'react-syntax-highlighter/dist/esm/styles/prism'
import {Avatar, Chip, Container, Fab, Stack} from "@mui/material";
import {WatchLater} from "@mui/icons-material";
import moment from "moment";
import {backendURL} from '../../../services/APIService';
import EditIcon from '@mui/icons-material/Edit';
import AuthService from "../../../services/AuthService";
import {ETagIcon} from "../../../services/TagsService";
import {useRouter} from "next/router";
import styles from '../../../styles/components/ViewBlog.module.css'
import MarkdownRenderer from "../../../components/MarkdownRenderer";
import cache from "memory-cache";

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

export async function getServerSideProps(context: any) {
    const id = context.params.id;

    const cachedResponse = cache.get(id);

    let data = null,
        error = false,
        errorData = null,
        githubURL = null,
        timestamp = null,
        tags = null,
        author = null,
        authorImg = null;


    const {req, res} = context;

    res.setHeader(
        'Cache-Control',
        'public, s-maxage=20, stale-while-revalidate=59'
    )

    if (id == null) return {props: {}};

    if (cachedResponse) {
        console.log("Using cached response for blog " + id);
        githubURL = cachedResponse.githubURL;
        timestamp = cachedResponse.timestamp;
        tags = cachedResponse.tags;
        author = cachedResponse.author;
        authorImg = cachedResponse.authorImg;
        data = cachedResponse.data;
    } else {
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
            const cacheHours = 10; // TODO: Get cache hours from config or backend or something
            cache.put(id, res.data, cacheHours * 60 * 60 * 1000);
        })
    }

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
