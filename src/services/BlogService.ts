import axios from "axios";
import {backendURL} from "./APIService";

const API_URL = backendURL + "blog/";

class BlogService {
    fetchPage(page: number = 1, size: number = 15, order: string = 'asc', query: string, tags: any, author: string = '') {
        //?order=desc&search=undefined&tags=undefined& 400
        var url = API_URL + 'list?';
        if (page != 1) {
            url += 'page=' + page + '&';
        }
        if (size != 15) {
            url += 'size=' + size + '&';
        }
        if (order != 'asc' && order != undefined) {
            url += 'order=' + order + '&';
        }
        if (query != '' && query != undefined) {
            url += 'search=' + query + '&';
        }
        // Check if tags is an array, because it can be a string
        if (tags !== null && tags !== undefined && Array.isArray(tags)) {
            if (tags.length != 0) {
                url += 'tags=' + tags.join(',') + '&';
            }
        } else {
            if (tags !== null && tags !== undefined && tags != '')
                url += 'tags=' + tags + '&';
        }
        if (author != '' && author != undefined) {
            url += 'author=' + author + '&';
        }

        return axios.get(url);
    }

    fetchLatestPage() {
        return this.fetchPage(1, 15, 'asc', '', [], '');
    }
}

export default new BlogService();
