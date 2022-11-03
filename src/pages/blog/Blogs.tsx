import {useEffect, useState} from "react";
import BlogService from "../../services/BlogService";
import BlogList from "./BlogList";
import {Container} from "@mui/material";

function Blogs() {
    const [data, setData] = useState(null);
    const [fetched, setFetched] = useState(false);
    const [error, setError] = useState(false);
    const [blogs, setBlogs] = useState(null)

    useEffect(() => {
        // @ts-ignore - Typescript being weird
        BlogService.fetchPage(1, 15, 'asc', '', [], '').then((res) => {
            console.log(res.data);
            setData(res.data);
            setBlogs(res.data.blogs);
            setFetched(true);
        }).catch((e: any) => {
            console.error(e);
            setError(true);
        });
    }, []);


    return (
        <div className={"app"}>
            <Container fixed>
                <h1 className={"centered"}>Blog</h1>
                {error ? <h2 className={"centered"}>Error fetching blog posts!</h2> : null}
                {fetched ? <BlogList data={blogs}/> : <h2>Fetching posts...</h2>}
            </Container>
        </div>
    )
}

export default Blogs
