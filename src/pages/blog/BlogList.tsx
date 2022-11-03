import React from 'react';
import {
    Avatar,
    Paper,
    Grid,
    styled,
    Typography,
    Stack,
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    CardActions, IconButton
} from "@mui/material";
import moment from "moment/moment";
import '../../css/components/BlogList.css'
import {red} from "@mui/material/colors";
import CircleIcon from '@mui/icons-material/Circle';

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
});
const BlogList = (props: any) => {
    const data = props.data;
    if (data) {
        console.log('Data', data);
        return (
            <div className={"row"}>
                {data.map((item: any) => {
                    const id: string = item.id;
                    const title: string = item.title;
                    const timestamp: number = item.timestamp;
                    const authorId: string = item.authorId;
                    const author: string = item.author;
                    const authorImg: string = item.authorImg;
                    const safeName: string = item.safeName; // URLencoded title, also used to access blog
                    const location: any = item.location; // json object of where the markdown files are hosted, ignore
                    const imageURL: string = item.image;
                    const description: string = item.description;
                    const date = moment(timestamp).format("MM/DD/YYYY, h:mm A");
                    return (
                        <article key={id}>
                            <Card variant={'outlined'}
                                  sx={{
                                      backgroundColor: '#1e1e1e',

                                  }}
                                  key={id}
                                  className={"inner"}
                            >
                                {imageURL ? <CardMedia
                                    component="img"
                                    height="194"
                                    image={imageURL}
                                    alt="Image"
                                /> : null}
                                <h2 className={"wh-imp centered"}>{title}</h2>
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
                                <div className={"center-horizontal"}>
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
                Loading...
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
            <Avatar aria-label="User Profile" src={authorImg}></Avatar>
            <div style={{
                display: 'flex',
            }}>
                <h5 className={"wh-imp"}>{author}&nbsp;&bull;&nbsp;{date}</h5>
            </div>
        </>
    );
};
export default BlogList;
