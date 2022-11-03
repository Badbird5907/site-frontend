import axios, {Axios, AxiosPromise} from "axios";
import {backendURL} from "./APIService";

const API_URL = backendURL + "blog/";

class BlogService {
    fetchPage(pages: number = 1, size: number = 15, order: string = 'asc', search: string, tags: string[] = [], author: string = ''): any {
        var url = API_URL + 'list?';
        if (pages != 1) {
            url += 'page=' + pages + '&';
        }
        if (size != 15) {
            url += 'size=' + size + '&';
        }
        if (order != 'asc') {
            url += 'order=' + order + '&';
        }
        if (search != '') {
            url += 'search=' + search + '&';
        }
        if (tags.length != 0) {
            url += 'tags=' + tags.join(',') + '&';
        }
        if (author != '') {
            url += 'author=' + author + '&';
        }

        return axios.get(url);
    }
}
export default new BlogService();
