import axios, {Axios, AxiosPromise} from "axios";
import {backendURL} from "./APIService";

const API_URL = backendURL + "blog/";

class BlogService {
    /*
    localhost:8080/blog/list?page=1&size=15&order=asc&search=hello&tags=tag1,tag2&author=f0352a78-762b-4df1-a1eb-2978f6fc1034
    {
    "blogs": [
        {
            "id": "00000000-0000-0000-0000-000000000000",
            "title": "Test Blog",
            "description": "This is a test blog",
            "authorId": "f0352a78-762b-4df1-a1eb-2978f6fc1034",
            "timestamp": 1667426355737,
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
            "author": "Test",
            "authorImg": "https://cdn.badbird.dev/assets/user.jpg"
        }
    ],
    "success": true,
    "page": 1,
    "size": 15,
    "total": 1,
    "totalPages": 1
}
     */
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
