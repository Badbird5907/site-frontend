import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import BlogAdminService from "../../../services/BlogAdminService";
import {FormControl, FormHelperText, Stack, TextField} from "@mui/material";
import {DateTimePicker} from "@mui/x-date-pickers";
import moment from "moment";
import MDEditor from '@uiw/react-md-editor';

const EditBlog = (props: any) => {
    const params = useParams();
    const id = params.id;
    /*
    {
    "id": "53e1df16-518b-44ff-9012-c91009df2486",
    "title": "Test",
    "description": "Hello, World!",
    "timestamp": 1667500611990,
    "creator": "0483f165-a3fc-43c7-bc49-5ecd5c99ee6e",
    "author": "Test",
    "location": {
        "githubReference": {
            "owner": "Badbird5907",
            "repo": "blog",
            "branch": "master",
            "dir": "/content/test",
            "file": "Test.md"
        }
    },
    "success": true,
    "authorImg": "https://cdn.badbird.dev/assets/user.jpg",
    "safeName": "Test",
    "tags": []
}
     */
    const [data, setData]: any = useState(null);
    const [timestamp, setTimestamp]: any = useState(null);
    const [title, setTitle]: any = useState(null);
    const [description, setDescription]: any = useState(null);

    const [content, setContent]: any = useState('');
    const [url, setURL]: any = useState('');

    useEffect(() => {
        BlogAdminService.getMetadata(id as string).then((res) => {
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

            setData(res.data);
        });
    }, [])

    return (
        <div className={"centered"}>
            <h1>Edit blog</h1>
            <span><b>ID: &nbsp;</b> {id}</span>
            <br/>
            {data ?
                <>
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
                            <MDEditor
                                value={content}
                                onChange={setContent}
                            />
                            <MDEditor.Markdown source={content} style={{ whiteSpace: 'pre-wrap' }} />
                        </Stack>
                    </FormControl>
                </> : <span>Loading...</span>}
        </div>
    );
};

export default EditBlog;
