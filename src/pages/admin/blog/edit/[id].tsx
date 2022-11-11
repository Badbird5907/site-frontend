import React, {useEffect} from 'react';
import {useRouter} from "next/router";
import EditOrCreateBlog from "../EditOrCreateBlog";

const Edit = () => {
    const router = useRouter();
    const {id} = router.query;
    useEffect(() => {
        console.log('ID: ', id);
    }, [id]);
    return (
        <>
            <EditOrCreateBlog
                editing={true}
                id={id}/>
        </>
    );
};

export default Edit;
