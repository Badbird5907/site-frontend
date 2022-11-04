import {addAuthHeaders, backendURL} from "./APIService";
import axios from "axios";
import AuthService from "./AuthService";

const API_URL = backendURL + "blog/";

class BlogAdminService {
    createBlog(title: string,
               description: string,
               location: Location,
               tags: string[], // UUIDs
               customAuthor: string,
               customAuthorImg: string,
               timestamp: number = -1
    ) {
        if (title == null || title == '') throw new Error("Title is required");
        if (description == null || description == '') throw new Error("Description is required");
        if (location == null) throw new Error("Location is required");
        var data: any = {
            title: title,
            description: description,
            tags: tags
        }
        if (customAuthor) {
            data['customAuthor'] = customAuthor;
        }
        if (customAuthorImg) {
            data['customAuthorImg'] = customAuthorImg;
        }
        if (location.contents) {
            data['location'] = location.contents;
        }
        if (location.directURL) {
            data['directURL'] = location.directURL;
        }
        if (location.githubURL) {
            data['githubURL'] = location.githubURL;
        }
        if (timestamp != -1) {
            data['timestamp'] = timestamp;
        }

        return axios.post(API_URL + 'create/', data, addAuthHeaders());
    }

    editBlog(title: string,
             description: string,
             location: Location,
             tags: string[], // UUIDs
             customAuthor: string,
             customAuthorImg: string,
             timestamp: number = -1,
             id: string
    ) {
        const token = AuthService.getCurrentUser().token;
        if (title == null || title == '') throw new Error("Title is required");
        if (description == null || description == '') throw new Error("Description is required");
        if (location == null) throw new Error("Location is required");
        var data: any = {
            id: id,
            title: title,
            description: description,
            tags: tags
        }
        if (customAuthor && customAuthor != '') {
            data['customAuthor'] = customAuthor;
        }
        if (customAuthorImg && customAuthorImg != '') {
            data['customAuthorImg'] = customAuthorImg;
        }
        if (location.contents && location.contents != '') {
            data['location'] = location.contents;
        }
        if (location.directURL && location.directURL != '') {
            data['directURL'] = location.directURL;
        }
        if (location.githubURL && location.githubURL != '') {
            data['githubURL'] = location.githubURL;
        }
        if (timestamp != -1) {
            data['timestamp'] = timestamp;
        }
        console.log('sending data: ', data);
        return axios.post(API_URL + 'edit/' + id, data, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
    }

    getMetadata(id: string) {
        return axios.get(API_URL + 'meta/get/' + id);
    }
}

export default new BlogAdminService();

export class Location {
    // Either contents, directURL, or githubURL
    contents: string;
    directURL: string;
    githubURL: string;

    constructor(str: string) {
        if (str == null) {
            throw new Error("Location cannot be null");
        }
        if (str.startsWith("https://github.com/")) {
            this.githubURL = str;
            this.directURL = '';
            this.contents = '';
        } else if (str.startsWith("http://") || str.startsWith("https://")) {
            this.directURL = str;
            this.githubURL = '';
            this.contents = '';
        } else {
            this.contents = str;
            this.directURL = '';
            this.githubURL = '';
        }
    }
}
