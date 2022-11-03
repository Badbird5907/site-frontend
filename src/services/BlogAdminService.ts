import {backendURL} from "./APIService";
import axios from "axios";

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

        return axios.post(API_URL + 'create/', data);
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
        if (title == null || title == '') throw new Error("Title is required");
        if (description == null || description == '') throw new Error("Description is required");
        if (location == null) throw new Error("Location is required");
        var data: any = {
            id: id,
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

        return axios.post(API_URL + 'create/', data);
    }

    getMetadata(id: string) {
        return axios.get(API_URL + 'meta/get/' + id);
    }
}

export default new BlogAdminService();

export interface Location {
    contents: string;
    directURL: string;
    githubURL: string;
}
