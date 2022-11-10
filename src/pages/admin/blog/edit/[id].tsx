import React from 'react';
import {useRouter} from "next/router";
import EditOrCreateBlog from "../EditOrCreateBlog";

const Edit = () => {
    const router = useRouter();
    const {id} = router.query;
    return (
        <>
            <EditOrCreateBlog
                editing={true}
                id={id}/>
        </>
    );
};

export default Edit;
