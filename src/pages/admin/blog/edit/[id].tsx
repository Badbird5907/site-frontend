import React, {useEffect} from 'react';
import {useRouter} from "next/router";
import EditOrCreateBlog from "../EditOrCreateBlog";
import {Button} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import {addAuthHeaders} from "../../../../services/APIService";
import BlogService from "../../../../services/BlogService";

const Edit = () => {
    const router = useRouter();
    const {id} = router.query;

    const [data, setData]: any = React.useState(null);
    useEffect(() => {
        console.log('ID: ', id);
        if (id) {
            BlogService.getBlogMeta(id as string).then((res) => {
                setData(res.data);
            });
        }
    }, [id]);
    return (
        <>
            {data ? <Button onClick={()=> {
                Swal.fire({
                    title: 'Revalidating Page...',
                    text: 'Please wait...',
                    showConfirmButton: false,
                    showCancelButton: false,
                    allowOutsideClick: false,
                    allowEnterKey: false,
                    allowEscapeKey: false,
                })
                const {safeName}: string = data;
                // post /admin/revalidate
                axios.post('/api/revalidate', {
                    id: safeName
                }, addAuthHeaders()).then((res) => {
                    if (res.data && res.data.success) {
                        Swal.fire({
                            title: 'Success',
                            text: 'Revalidation successful',
                            icon: 'success'
                        });
                    } else {
                        Swal.fire({
                            title: 'Error',
                            text: 'Revalidation failed',
                            icon: 'error'
                        });
                    }
                }).catch((err)=> {
                    Swal.fire({
                        title: 'Error',
                        text: 'Revalidation failed',
                        icon: 'error'
                    });
                })
            }}>Rebuild Page</Button> : null}
            <EditOrCreateBlog
                editing={true}
                id={id}/>
        </>
    );
};

export default Edit;
