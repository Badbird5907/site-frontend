import React from 'react';
import {Link} from "react-router-dom";
import {Avatar} from "@mui/material";

const BlogList = (props: any) => {
    const data = props.data;
    if (data) {
        console.log('Data',data);
        return (
            <div>
                {data.map((item: any) => {
                    const id: string = item.id;
                    const title: string = item.title;
                    const timestamp: number = item.timestamp;
                    const authorId: string = item.authorId;
                    const author: string = item.author;
                    const authorImg: string = item.authorImg;
                    const safeName: string = item.safeName; // URLencoded title, also used to access blog
                    const location: any = item.location; // json object of where the markdown files are hosted, ignore
                    return (
                        <div className={"blog-list-item"} key={'blog-' + id}>
                            <div className={"blog-list-item-title"}>
                                <Link to={"/blog/" + safeName}>{title}</Link>
                            </div>
                            <div className={"blog-list-item-author"}>
                                <div className={"blog-list-item-author-img"}>
                                    <Avatar key={'author-' + authorId} src={authorImg} alt={author}/>
                                </div>
                                <div className={"blog-list-item-author-info"}>
                                    <div className={"blog-list-item-author-name"}>
                                        {author}
                                    </div>
                                </div>
                            </div>
                            <div className={"blog-list-item-timestamp"}>
                                {timestamp}
                            </div>
                        </div>
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

export default BlogList;
