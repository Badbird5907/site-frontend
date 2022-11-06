import axios, {Axios, AxiosPromise} from "axios";
import {backendURL} from "./APIService";

const API_URL = backendURL + "blog/";

class BlogService {
    fetchPage(page: number = 1, size: number = 15, order: string = 'desc', query: string, tags: any, author: string = '') {
        var url = API_URL + 'list?';
        if (page != 1) {
            url += 'page=' + page + '&';
        }
        if (size != 15) {
            url += 'size=' + size + '&';
        }
        if (order != 'asc') {
            url += 'order=' + order + '&';
        }
        if (query != '') {
            url += 'search=' + query + '&';
        }
        // Check if tags is an array, because it can be a string
        if (tags != null && Array.isArray(tags)) {
            if (tags.length != 0) {
                url += 'tags=' + tags.join(',') + '&';
            }
        } else {
            url += 'tags=' + tags + '&';
        }
        if (author != '') {
            url += 'author=' + author + '&';
        }

        return axios.get(url);
    }

}

export default new BlogService();
