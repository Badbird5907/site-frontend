import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import BlogAdminService from "../../../services/BlogAdminService";
import {FormControl, InputLabel, Input, FormHelperText, TextField} from "@mui/material";

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

    useEffect(() => {
        BlogAdminService.getMetadata(id as string).then((res) => {
            console.log('Data: ', res.data);
            setData(res.data);
        });
    }, [])

    return (
        <div className={"centered"}>
            <h1>Edit blog</h1>
            <span><b>ID: &nbsp;</b> {id}</span>
            <hr/>
            {data ?
                <>
                    <FormControl>
                        <div className={""} id={"title"}>
                            <TextField sx={{
                                color: 'white'
                            }} id="title" label={"Title"} variant={"outlined"} defaultValue={data.title} />
                        </div>
                    </FormControl>
                </> : <span>Loading...</span>}
        </div>
    );
};

export default EditBlog;
