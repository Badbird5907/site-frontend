import React from 'react';
import {Avatar, Card, CardActions, CardContent, CardMedia, Stack, styled} from "@mui/material";
import moment from "moment/moment";
import styles from '../../../styles/components/BlogList.module.css'
import AuthService from "../../../services/AuthService";
import {ETagIcon} from "../../../services/TagsService";
import Chip from "@mui/material/Chip";

const BlogList = (props: any) => {
    const data = props.data;
    const loggedIn = AuthService.isLoggedIn();
    console.log('logged in: ' + loggedIn);
    if (data) {
        //console.log('Data', data);
        return (
            <div className={styles.row}>
                {data.map((item: any) => {
                    const id: string = item.id;
                    const title: string = item.title;
                    const timestamp: number = item.timestamp;
                    const author: string = item.author;
                    const authorImg: string = item.authorImg;
                    const safeName: string = item.safeName; // URLEncoded title, also used to access blog
                    const location: any = item.location; // json object of where the markdown files are hosted, ignore
                    const imageURL: string = item.imageURL;
                    const description: string = item.description;
                    const tags: any[] = item.tags;
                    const date = moment(timestamp).format("MM/DD/YYYY, h:mm A");
                    return (
                        <article className={'card'} key={id}>
                            <Card variant={'outlined'}
                                  sx={{
                                      backgroundColor: '#1e1e1e',
                                      cursor: 'pointer',
                                      margin: '1rem'
                                  }}
                                  key={id}
                                  className={styles.inner}
                                  onClick={() => {
                                      if (typeof window !== 'undefined')
                                          window.location.href = "/blog/" + safeName;
                                  }}
                            >

                                <div>
                                    {imageURL ? <CardMedia
                                        component="img"
                                        height="194"
                                        image={imageURL}
                                        alt="Image"
                                    /> : null}
                                    <h2 className={"wh-imp centered"} style={{
                                        marginBottom: '0px',
                                        marginTop: '1rem',
                                        marginLeft: '1rem',
                                        marginRight: '1rem',
                                    }}>{title}</h2>
                                </div>
                                <CardContent sx={{
                                    marginBottom: '0px',
                                    marginTop: '0px',
                                    margin: '0px',
                                    //set inner padding
                                    padding: '1rem',
                                }}>
                                    <p style={{
                                        wordWrap: 'break-word',
                                        width: '500px',
                                        marginTop: '0px',
                                        margin: '0px',
                                        marginBottom: '0px',
                                    }} className={"centered wh-imp"}>{description}</p>
                                </CardContent>
                                <div className={"center-horizontal"} style={{
                                    marginBottom: '0px'
                                }} id={"tags"}>
                                    <Stack direction="row" spacing={1}>
                                        {tags && tags.map((tag: any) => {
                                                const id = tag.id;
                                                const name = tag.name;
                                                const eTagIcon = ETagIcon.getIconByName(tag.icon);
                                                let Icon = null;
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
                                <div className={"center-horizontal"} style={{
                                }}>
                                    <CardActions sx={{
                                        marginTop: '0px',
                                        padding: '0px'
                                    }}>
                                        <CardInfo style={{
                                            marginBottom: '0px',
                                            marginTop: '0px',
                                            padding: '0px'
                                        }} date={date} author={author} authorImg={authorImg}/>
                                    </CardActions>
                                </div>
                            </Card>
                        </article>
                    )
                })}
            </div>
        );
    } else {
        return (
            <div>
                Loading Blog Data...
            </div>
        )
    }
};
const CardInfo = (props: any) => {
    const author: string = props.author;
    const date: string = props.date;
    const authorImg: string = props.authorImg;
    return (
        <>
            <Avatar aria-label="User Profile" sx={{
                marginTop: '0px',
                marginBottom: '0px',
            }} src={authorImg}></Avatar>
            <div style={{
                display: 'flex',
            }}>
                <h5 className={"wh-imp"} style={{
                    marginTop: '1rem',
                    marginBottom: '1rem',
                }}>{author}&nbsp;&bull;&nbsp;{date}</h5>
            </div>
        </>
    );
};
export default BlogList;
