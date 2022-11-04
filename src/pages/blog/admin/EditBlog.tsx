import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import BlogAdminService from "../../../services/BlogAdminService";
import {Button, Fab, FormControl, FormHelperText, Stack, TextField} from "@mui/material";
import {DateTimePicker} from "@mui/x-date-pickers";
import moment from "moment";
import MDEditor from '@uiw/react-md-editor';
import SaveIcon from '@mui/icons-material/Save';
import TagsService, {ETagIcon} from "../../../services/TagsService";
import TagsList from "./components/TagsList";
import {Location} from "../../../services/BlogAdminService";
import {useSnackbar} from "notistack";
import Swal from "sweetalert2";

const EditBlog = (props: any) => {
    const params = useParams();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const id = params.id;
    const [canRender, setCanRender] = useState(false);
    const [data, setData]: any = useState(null);
    const [timestamp, setTimestamp]: any = useState(null);
    const [title, setTitle]: any = useState(null);
    const [description, setDescription]: any = useState(null);

    const [content, setContent]: any = useState('');
    const [url, setURL]: any = useState('');

    const [selectedTagsFromBlog, setSelectedTagsFromBlog]: any = useState(null); // An array of selected tags from the blog
    const [selectedTags, setSelectedTags]: any = useState(null); // An array of selected tags from the blog
    const [availableTags, setAvailableTags]: any = useState(null); // An array of available tags
    const [allTags, setAllTags]: any = useState(null); // An array of all tags (selected and available)

    const [customAuthor, setCustomAuthor] = useState('');
    const [customAuthorImg, setCustomAuthorImg] = useState('');

    useEffect(() => {
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
                setSelectedTagsFromBlog(t);
                console.log('Selected tags: ', t);
            }

            setData(res.data);
            TagsService.getTags().then((res1) => {
                console.log('Tags: ', res1.data);
                // convert icons
                /*
                var tagsNewData: { id: any; name: any; description: any; icon: ETagIcon; }[] = [];
                res.data.tags.forEach((tag: any) => {
                    const id = tag.id;
                    const name = tag.name;
                    const description = tag.description;
                    const iconName = tag.icon;
                    const icon = ETagIcon.getIconByName(iconName);
                    tagsNewData.push({
                        id: id,
                        name: name,
                        description: description,
                        icon: icon
                    });
                });
                setAllTags(tagsNewData);
                 */
                setAllTags(res1.data.tags);
                // Let's sort the tags
                var selectedTags: any[] = [];
                var availableTags: any[] = [];
                var selectedTagIds: any[] = [];
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
            });
        });
    }, [])


    function save() {
        try {
            var location: any;
            if (url && url !== '') {
                location = new Location(url);
            } else if (content && content !== '') {
                location = new Location(content);
            } else location = null;
            var tags: string[]; // array of tag ids
            if (selectedTags && selectedTags.length > 0) {
                tags = selectedTags.map((tag: any) => tag.id);
            } else tags = [];
            const timestampNum: number = timestamp.valueOf();
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
                    window.location.reload();
                });
            }).catch((err) => {
                console.error(err);
                Swal.fire({
                    title: 'Error!',
                    text: 'There was an error editing the blog post!',
                    icon: 'error'
                });
            });
        } catch (e) {
            enqueueSnackbar('Error: ' + e, {variant: 'error'});
        }
    }

    // @ts-ignore
    return (
        <div className={"centered"}>
            <h1>Edit blog</h1>
            <span><b>ID: &nbsp;</b> {id}</span>
            {canRender ?
                <>
                    <br/>
                    <Button href={"/blog/" + data.safeName} variant={"outlined"}>View blog</Button>
                    <br/>
                    <FormControl>
                        {/* TODO: I'm hardcoding this with stack, too tired to mess with grid again */}
                        <Stack direction={"column"} spacing={2}>
                            <Stack direction={"row"} spacing={2}>
                                <div id={"title"}>
                                    <TextField id="title" label={"Title"} variant={"outlined"}
                                               defaultValue={data.title}/>
                                    <FormHelperText id="title-helper-text">Must be unique.</FormHelperText>
                                </div>
                                <div id={"description"}>
                                    <TextField id="description" label={"Description"} variant={"outlined"}
                                               defaultValue={data.description}/>
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
                                <MDEditor.Markdown source={content} style={{whiteSpace: 'pre-wrap'}}/>
                            </div>
                            <div id={"url"}>
                                <TextField id="url" label={"URL"} variant={"outlined"}
                                           defaultValue={url} sx={{
                                    width: '100%'
                                }}/>
                                <FormHelperText id="description-helper-text">Direct URL to markdown
                                    file</FormHelperText>
                            </div>
                            <div id={"tags"}>
                                <TagsList onListChange={
                                    /* @ts-ignore */
                                    (right, left) => {
                                        console.log('right: ', right);
                                        console.log('left: ', left);

                                        // right and left are arrays of tag names, we need to map them back
                                        // to the tag objects
                                        var rightTags: { id: any; name: any; description: any; icon: ETagIcon; }[] = [];
                                        right.forEach((tag: any) => {
                                            allTags.forEach((tagObj: any) => {
                                                if (tagObj.name === tag) {
                                                    rightTags.push(tagObj);
                                                }
                                            });
                                        });
                                        var leftTags: { id: any; name: any; description: any; icon: ETagIcon; }[] = [];
                                        left.forEach((tag: any) => {
                                            allTags.forEach((tagObj: any) => {
                                                if (tagObj.name === tag) {
                                                    leftTags.push(tagObj);
                                                }
                                            });
                                        });

                                        setSelectedTags(rightTags);
                                        setAvailableTags(leftTags);

                                    }}
                                          selectedTags={selectedTags} availableTags={availableTags}/>
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
                    <Fab color="primary" aria-label="add" disabled={!allTags || !data} onClick={() => {
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

export default EditBlog;
