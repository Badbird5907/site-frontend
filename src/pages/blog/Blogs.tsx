import {useEffect, useState} from "react";
import BlogService from "../../services/BlogService";
import BlogList from "./components/BlogList";
import {
    Button,
    Container,
    InputLabel,
    MenuItem,
    Pagination,
    Popover,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {useSearchParams} from "react-router-dom";
import TagsService from "../../services/TagsService";
import TagFilter from "./components/TagFilter";
import {SelectChangeEvent} from "@mui/material/Select";

function Blogs() {
    const [data, setData] = useState(null);
    const [fetched, setFetched] = useState(false);
    const [error, setError] = useState(false);
    const [blogs, setBlogs] = useState(null);
    const [noBlogs, setNoBlogs] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const [totalPages, setTotalPages] = useState(1);
    const [order, setOrder] = useState(searchParams.get("order") || "asc"); // FIXME not working well, page currently being reloaded as a workaround
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [allTags, setAllTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState(searchParams.getAll("tags") || []);

    const [page, setPage] = useState(1);
    const [defaultPage, setDefaultPage] = useState(1);
    const [firstRender, setFirstRender] = useState(true);

    const [infoPopoverOpen, setInfoPopoverOpen] = useState(false);

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        // set page query
        updateParam('page', value);
    };

    useEffect(() => {
        updatePage()
    }, [page])

    useEffect(() => {
        TagsService.getTags().then((res) => {
            setAllTags(res.data.tags);
        })
    }, [])

    function updatePage(orderIn: string = 'asc') {
        console.log('Updating page...')
        const page = getOrDefaultParam('page', 1);
        setPage(page);
        const size = getOrDefaultParam('size', 15);
        const order = getOrDefaultParam('order', orderIn);
        setOrder(order);
        const search = getOrDefaultParam('search', '');
        const tags = getOrDefaultParam('tags', []); // string[] of tag names/ids
        const author = getOrDefaultParam('author', '');

        BlogService.fetchPage(page, size, order, search, tags, author)
            // @ts-ignore
            .then((res) => {
                console.log(res.data);
                setDefaultPage(res.data.page as number)
                setPage(res.data.page as number)
                setData(res.data);
                setBlogs(res.data.blogs);
                setFetched(true);
                setTotalPages(res.data.totalPages);
                setNoBlogs(res.data.blogs.length === 0);

                if (page > 1 && noBlogs) {
                    console.log('No blogs on page ' + page + ', redirecting to page 1')
                    updateParam('page', 1);
                    setPage(1);
                    setDefaultPage(1)
                }

            }).catch((e: any) => {
            console.error(e);
            setError(true);
        });
    }

    const updateParam = (key: string, value: any) => {
        const currentParams = new URLSearchParams(searchParams.toString());
        currentParams.set(key, value);
        setSearchParams(currentParams);
    }

    function getOrDefaultParam(param: string, defaultValue: any): any {
        if (searchParams.has(param)) {
            return searchParams.get(param);
        } else {
            return defaultValue;
        }
    }

    return (
        <div className={"app"}>
            <Container fixed>
                <h1 className={"centered"}>Blog</h1>
                <Stack direction={"column"} spacing={2}>
                    <Stack direction="row" className={"centered"} spacing={2}>
                        <Select
                            id="order-select"
                            value={order}
                            label="Order"
                            onChange={(e) => {
                                const val = e.target.value as string;
                                updateParam('order', val);
                                setOrder(val);
                                updatePage(val);

                                window.location.reload();
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
                                   onClick={(e)=> {
                                       setInfoPopoverOpen(true)
                                   }}
                        />
                        <Popover
                            id={'info-popover'}
                            open={infoPopoverOpen}
                            anchorEl={document.getElementById('search')}
                            onClose={(e)=> {
                                setInfoPopoverOpen(false);
                            }}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            disableAutoFocus={true}
                            disableEnforceFocus={true}
                        >
                            <Typography sx={{ p: 2 }}>Search is currently very buggy.<br/>The code can be found <a target={"_blank"} href={'https://github.com/Badbird5907/site-backend/blob/master/src/main/java/dev/badbird/backend/controller/BlogController.java'}>here</a></Typography>
                        </Popover>
                        <TagFilter tags={allTags} onChange={(event: any)=> {
                            console.log('change: ', {event})
                            // event is a array of tags
                            setSelectedTags(event);
                            updateParam('tags', event.join(','));
                        }}/>
                        <Button variant={"contained"} onClick={() => {
                            updatePage();
                        }}>Search</Button>
                    </Stack>
                    {error ? <h2 className={"centered"}>Error fetching blog posts!</h2> : null}
                    {fetched ?
                        noBlogs ? <h2 className={"centered"}>No blog posts found!</h2> :
                            <>
                                {totalPages && totalPages > 1 ?
                                    <Pagination className={"centered"} count={totalPages}
                                                defaultPage={defaultPage as number} page={page as number}
                                                onChange={handleChange}/> : null}
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
    )
}

export default Blogs
