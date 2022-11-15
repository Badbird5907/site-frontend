import React, {useEffect, useState} from "react";
import BlogService from "../../services/BlogService";

const Index = (props: any) => {
    const data = props.data;
    return (
        <>

        </>
    );
};

export default Index;
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
            data
        }
    }
}
function getOrDefaultParam(param: string, defaultValue: any, context: any): any {
    const query = context.query;
    if (query[param] == null) {
        return defaultValue;
    }
    return query[param];
}
