import React, {useEffect, useState} from 'react';
import BlogAdminService, {Location} from "../../../services/BlogAdminService";
import {Button, Fab, FormControl, FormHelperText, Stack, TextField} from "@mui/material";
import {DateTimePicker} from "@mui/x-date-pickers";
import moment from "moment";
import SaveIcon from '@mui/icons-material/Save';
import TagsService, {ETagIcon} from "../../../services/TagsService";
import TagsList from "./components/TagsList";
import {useSnackbar} from "notistack";
import Swal from "sweetalert2";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor").then((mod) => mod.default),
    { ssr: false }
);
const EditOrCreateBlog = (props: any) => {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const editing = props.editing;
    const id = props.id;
    const [canRender, setCanRender] = useState(false);
    const [data, setData]: any = useState(null);
    const [timestamp, setTimestamp]: any = useState(null);
    const [title, setTitle]: any = useState(null);
    const [description, setDescription]: any = useState(null);
    const [error, setError]: any = useState(false);

    const [content, setContent]: any = useState('');
    const [url, setURL]: any = useState('');

    const [selectedTagsFromBlog, setSelectedTagsFromBlog]: any = useState(null); // An array of selected tags from the blog
    const [selectedTags, setSelectedTags]: any = useState(null); // An array of selected tags from the blog
    const [availableTags, setAvailableTags]: any = useState(null); // An array of available tags
    const [allTags, setAllTags]: any = useState(null); // An array of all tags (selected and available)

    const [customAuthor, setCustomAuthor] = useState('');
    const [customAuthorImg, setCustomAuthorImg] = useState('');

    const [canRenderTags, setCanRenderTags] = useState(false);

    useEffect(() => {
        if (editing) {
            if (id == undefined) return; // Wait for id to be set
            BlogAdminService.getMetadata(id as string).then((res) => {
                console.log('--------------------------------------------')
                console.log('Data: ', res.data);
                setTimestamp(moment(res.data.timestamp));
                setTitle(res.data.title);
                setDescription(res.data.description);
                if (res.data.location.contents) {
                    setContent(res.data.location.contents);
                }
                if (res.data.location.githubURL) {
                    setURL(res.data.location.githubURL);
                } else if (res.data.location.directURL) {
                    setURL(res.data.location.directURL);
                }
                if (res.data.customAuthor) {
                    setCustomAuthor(res.data.author);
                    if (res.data.authorImg) {
                        setCustomAuthorImg(res.data.authorImg);
                    }
                }

                const t = res.data.tags;
                if (t) {
                    setSelectedTagsFromBlog(t)
                    console.log('Selected tags: ', t);
                } else fetchTags()

                console.log('Data: ', res.data);

                setData(res.data);
            }).catch((err) => {
                console.log('Error: ', err);
                /*
                Swal.fire({
                    title: 'Error',
                    text: 'There was an error while fetching the blog metadata. Please try again later.',
                    icon: 'error',
                    confirmButtonText: 'Okay'
                });
                 */

                setError(true);
                setCanRender(false)
            });
        } else {
            setData({
                safeName: '',
                title: '',
                description: '',
                timestamp: moment().valueOf(),
                location: {
                    githubURL: ''
                },
                tags: []
            })
            setTimestamp(moment());
            setTitle('');
            setDescription('');
            setURL('');
            setSelectedTagsFromBlog([])
            setCanRender(true);
        }
    }, [id])

    useEffect(() => {
        fetchTags();
    }, [selectedTagsFromBlog])


    function save() {
        try {
            let location: any;
            if (url && url !== '') {
                location = new Location(url);
            } else if (content && content !== '') {
                location = new Location(content);
            } else location = null;
            let tags: string[]; // array of tag ids
            if (selectedTags && selectedTags.length > 0) {
                tags = selectedTags.map((tag: any) => tag.id);
            } else tags = [];
            const timestampNum: number = timestamp.valueOf();
            if (editing) {
                BlogAdminService.editBlog(
                    title as string,
                    description as string,
                    location,
                    tags,
                    customAuthor,
                    customAuthorImg,
                    timestampNum,
                    id as string
                ).then((res) => {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Blog post edited successfully!',
                        icon: 'success'
                    }).then(() => {
                        if (typeof window !== 'undefined')
                            window.location.reload();
                    });
                }).catch((err) => {
                    console.error(err);
                    if (err.response && err.response.data && err.response.data.error) {
                        Swal.fire({
                            title: 'Error!',
                            text: err.response.data.error,
                            icon: 'error'
                        });
                    } else {
                        Swal.fire({
                            title: 'Error!',
                            text: 'There was an error editing the blog post!',
                            icon: 'error'
                        });
                    }
                });
            } else {
                BlogAdminService.createBlog(
                    title as string,
                    description as string,
                    location,
                    tags,
                    customAuthor,
                    customAuthorImg,
                    timestampNum
                ).then((res) => {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Blog post created successfully!',
                        icon: 'success'
                    }).then(() => {
                        if (typeof window !== 'undefined')
                            window.location.href = '/blog/view/' + res.data.url;
                    });
                }).catch((err) => {
                    console.error(err);
                    if (err.response && err.response.data && err.response.data.error) {
                        Swal.fire({
                            title: 'Error!',
                            text: err.response.data.error,
                            icon: 'error'
                        });
                    } else {
                        Swal.fire({
                            title: 'Error!',
                            text: 'There was an error creating the blog post!',
                            icon: 'error'
                        });
                    }
                });
            }
        } catch (e) {
            enqueueSnackbar('Error: ' + e, {variant: 'error'});
        }
    }

    function fetchTags() {
        let t = selectedTagsFromBlog;
        if (!t) t = [];
        TagsService.getTags().then((res1) => {
            console.log('Tags: ', res1.data);
            setAllTags(res1.data.tags);
            // Let's sort the tags
            let selectedTags: any[] = [];
            let availableTags: any[] = [];
            let selectedTagIds: any[] = [];
            t.forEach((tag: any) => {
                selectedTagIds.push(tag.id);
            });
            res1.data.tags.forEach((tag: any) => {
                if (t && selectedTagIds.includes(tag.id)) {
                    selectedTags.push(tag);
                } else {
                    availableTags.push(tag);
                }
            });
            setSelectedTags(selectedTags);
            setAvailableTags(availableTags);
            console.log('new-Selected tags: ', selectedTags);
            console.log('new-Available tags: ', availableTags);
            setCanRender(true);
            setTimeout(()=> {
                setCanRenderTags(true)
            }, 1000) // This is to fix race condition
        });
    }

    function canSaveNew() {
        return title && title !== '' && description && description !== '' && ((url && url !== '') || (content && content !== ''));
    }

    // @ts-ignore
    return (
        <div className={"centered"}>
            <h1>Edit blog</h1>
            {editing ? <span><b>ID: &nbsp;</b> {id}</span> : null}
            {error ? <h3>Error!</h3> : null}
            {canRender && data && allTags ?
                <>
                    <br/>
                    {editing ? <Button href={"/blog/view/" + data.safeName} variant={"outlined"}>View blog</Button> : null}
                    <br/>
                    <FormControl>
                        {/* TODO: I'm hardcoding this with stack, too tired to mess with grid again */}
                        <Stack direction={"column"} spacing={2}>
                            <Stack direction={"row"} spacing={2}>
                                <div id={"title"}>
                                    <TextField id="title" label={"Title"} variant={"outlined"}
                                               defaultValue={data.title} onChange={(e) => {
                                        setTitle(e.target.value);
                                    }}/>
                                    <FormHelperText id="title-helper-text">Must be unique.</FormHelperText>
                                </div>
                                <div id={"description"}>
                                    <TextField id="description" label={"Description"} variant={"outlined"}
                                               defaultValue={data.description} onChange={(e) => {
                                        setDescription(e.target.value);
                                    }}/>
                                    <FormHelperText id="description-helper-text">A short description of the
                                        blog.</FormHelperText>
                                </div>
                                <div id={"date"}>
                                    <DateTimePicker
                                        label="Timestamp"
                                        value={timestamp}
                                        onChange={(newValue) => {
                                            setTimestamp(newValue);
                                            console.log('value: ', newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </div>
                            </Stack>
                            <div>
                                <MDEditor
                                    value={content}
                                    onChange={setContent}
                                />
                                <span style={{
                                    // grey
                                    color: '#b8b8b8'
                                }}>Note that the markdown renderer used for this is different than the one used for blogs.</span>
                                {/*
                                <MDEditor.Markdown source={content} style={{whiteSpace: 'pre-wrap'}}/>
                                */}
                            </div>
                            <div id={"url"}>
                                <TextField id="url" label={"URL"} variant={"outlined"}
                                           defaultValue={url} sx={{
                                    width: '100%'
                                }} onChange={(newValue) => {
                                    setURL(newValue.target.value);
                                }}/>
                                <FormHelperText id="description-helper-text">Direct URL to markdown
                                    file</FormHelperText>
                            </div>
                            <div id={"tags"}>
                                {
                                    canRenderTags ? <TagsList onListChange={
                                        /* @ts-ignore */
                                        (right, left) => {
                                            console.log('right: ', right);
                                            console.log('left: ', left);

                                            // right and left are arrays of tag names, we need to map them back
                                            // to the tag objects
                                            let rightTags: { id: any; name: any; description: any; icon: ETagIcon; }[] = [];
                                            right.forEach((tag: any) => {
                                                allTags.forEach((tagObj: any) => {
                                                    if (tagObj.name === tag) {
                                                        rightTags.push(tagObj);
                                                    }
                                                });
                                            });
                                            let leftTags: { id: any; name: any; description: any; icon: ETagIcon; }[] = [];
                                            left.forEach((tag: any) => {
                                                allTags.forEach((tagObj: any) => {
                                                    if (tagObj.name === tag) {
                                                        leftTags.push(tagObj);
                                                    }
                                                });
                                            });

                                            setSelectedTags(rightTags);
                                            setAvailableTags(leftTags);

                                        }} selectedTags={selectedTags} availableTags={availableTags}/> : null
                                }
                            </div>
                            <div id={"author"}>
                                <TextField id="author" sx={{
                                    width: '100%'
                                }} label={"Author"} variant={"outlined"}
                                           defaultValue={customAuthor} onChange={(e) => {
                                    setCustomAuthor(e.target.value);
                                }}
                                />
                                <FormHelperText id="author-helper-text">Custom author name</FormHelperText>
                            </div>
                            <div id={"author-img"}>
                                <TextField id="author-img" sx={{
                                    width: '100%'
                                }} label={"Author image"} variant={"outlined"}
                                           defaultValue={customAuthorImg} onChange={(e) => {
                                    setCustomAuthorImg(e.target.value);
                                }}/>
                                <FormHelperText id="author-img-helper-text">Custom author image</FormHelperText>
                            </div>
                        </Stack>
                    </FormControl>
                    <Fab color="primary" aria-label="add" disabled={(editing ? (!allTags || !data) : !canSaveNew())}
                         onClick={() => {
                             save()
                         }} sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                    }}>
                        <SaveIcon/>
                    </Fab>
                </> : <span>Loading...</span>}
        </div>
    );

};

export default EditOrCreateBlog;
