import React, {useEffect, useState} from "react";
import BlogService from "../../services/BlogService";
import TagsService from "../../services/TagsService";
import {
    Button,
    Container,
    FormControl,
    MenuItem,
    Pagination,
    Popover,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import TagFilter from "./components/TagFilter";
import BlogList from "./components/BlogList";


export async function getServerSideProps(context: any) {
    const page = getOrDefaultParam("page", 1, context);
    const size = getOrDefaultParam('size', 15, context);
    const order = getOrDefaultParam('order', 'asc', context);
    const search = getOrDefaultParam('search', '', context);
    const tags = getOrDefaultParam('tags', [], context); // string[] of tag names/ids
    const author = getOrDefaultParam('author', '', context);

    const res = await BlogService.fetchPage(page, size, order, search, tags, author);
    const {data} = res;
    return {
        props: {
            data,
            page,
            size,
            order,
            search,
            tags,
            author
        }
    }
}

const Index = (props: any) => {
    const disableSearch = false;

    const [data, setData] = useState(props.data); // props.data is the data from getServerSideProps
    const [blogs, setBlogs] = useState(props.data.blogs);

    const [fetched, setFetched] = useState(true);
    const [error, setError] = useState(false);

    const [order, setOrder] = useState(props.order);
    const [search, setSearch] = useState(props.search);
    const [selectedTags, setSelectedTags] = useState([]);

    const [allTags, setAllTags] = useState([]);
    const [infoPopoverOpen, setInfoPopoverOpen] = useState(false);
    const [totalPages, setTotalPages] = useState(props.data.totalPages);
    const [defaultPage, setDefaultPage] = useState(1);
    const [page, setPage] = useState(1);

    const [noBlogs, setNoBlogs] = useState(false);

    useEffect(() => {
        TagsService.getTags().then((res) => {
            setAllTags(res.data.tags);
        })
    }, [])

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        // set page query
        updateParam('page', value);
        updatePage()
    };

    function updateParam(name: string, value: any) {
        if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            url.searchParams.set(name, value);
            window.history.pushState({}, '', url.toString());
        }
    }

    function getOrDefaultParam(name: string, defaultValue: any) {
        if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            return url.searchParams.get(name) || defaultValue;
        }
        return defaultValue;
    }
    return (
        <div>
            <Container fixed>
                <h1 className={"centered"}>Blog</h1>
                <Stack direction={"column"} spacing={2}>
                    {disableSearch ?
                        <span className={'centered'}>The search UI is currently disabled.</span> :
                        <FormControl>
                            <Stack direction="row" sx={{
                                alignItems: 'center',
                                justifyContent: 'center'
                            }} spacing={2}>
                                <Select
                                    id="order-select"
                                    value={order}
                                    label="Order"
                                    onChange={(e) => {
                                        const val = e.target.value as string;
                                        updateParam('order', val);
                                        setOrder(val);
                                        updatePage();

                                        //if (typeof window !== 'undefined')
                                        //    window.location.reload();
                                    }}
                                >
                                    <MenuItem value={'asc'}>Asc</MenuItem>
                                    <MenuItem value={'desc'}>Desc</MenuItem>
                                </Select>
                                <TextField id="search" label="Search" variant="outlined"
                                           value={search}
                                           autoComplete={"off"}
                                           onChange={(e) => {
                                               setSearch(e.target.value);
                                               updateParam('search', e.target.value);
                                           }}
                                           onClick={(e) => {
                                               setInfoPopoverOpen(true)
                                           }}
                                />
                                <Popover
                                    id={'info-popover'}
                                    open={infoPopoverOpen}
                                    anchorEl={typeof document !== 'undefined' ? document.getElementById('search') : null}
                                    onClose={(e) => {
                                        setInfoPopoverOpen(false);
                                    }}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    disableAutoFocus={true}
                                    disableEnforceFocus={true}
                                >
                                    <Typography sx={{p: 2}}>Search is currently very buggy.<br/>The code can be found <a
                                        target={"_blank"}
                                        href={'https://github.com/Badbird5907/site-backend/blob/master/src/main/java/dev/badbird/backend/controller/BlogController.java'}>here</a></Typography>
                                </Popover>
                                <TagFilter tags={allTags} onChange={(event: any) => {
                                    console.log('change: ', {event})
                                    // event is a array of tags
                                    setSelectedTags(event);
                                    updateParam('tags', event.join(','));
                                }}/>
                                <Button variant={"contained"} type={"submit"} onClick={() => {
                                    updatePage();
                                }}>Search</Button>
                            </Stack>
                        </FormControl>
                    }
                    {error ? <h2 className={"centered"}>Error fetching blog posts!</h2> : null}
                    {fetched ?
                        noBlogs ? <h2 className={"centered"}>No blog posts found!</h2> :
                            <>
                                {totalPages && totalPages > 1 ?
                                    <Pagination className={"centered"} count={totalPages}
                                                defaultPage={defaultPage as number} page={page as number}
                                                onChange={handleChange}/> : null}
                                <span className={"centered"}>Blog loading may be slow. This is being worked on.</span>
                                <BlogList data={blogs}/>
                                {totalPages && totalPages > 1 ?
                                    <Pagination className={"centered"} count={totalPages}
                                                defaultPage={defaultPage as number} page={page as number}
                                                onChange={handleChange}/> : null}
                            </>
                        : <h2>Fetching posts...</h2>}
                </Stack>


            </Container>
        </div>
    );

    function updatePage() {
        if (disableSearch) return;
        const page = getOrDefaultParam("page", 1);
        const size = getOrDefaultParam('size', 15);
        const order = getOrDefaultParam('order', 'asc');
        const search = getOrDefaultParam('search', '');
        const tags = getOrDefaultParam('tags', []); // string[] of tag names/ids
        const author = getOrDefaultParam('author', '');

        BlogService.fetchPage(page, size, order, search, tags, author).then((res) => {
            const {data} = res;
            setData(data);
            setBlogs(res.data.blogs);
            setFetched(true);
            setError(false);
            setNoBlogs(res.data.blogs.length === 0);
            setTotalPages(res.data.totalPages);
        }).catch(err => {
            setError(true);
            setFetched(true);
        });
    }

};

export default Index;

function getOrDefaultParam(param: string, defaultValue: any, context: any): any {
    const query = context.query;
    if (query[param] == null) {
        return defaultValue;
    }
    return query[param];
}
