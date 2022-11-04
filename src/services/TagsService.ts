import axios from "axios";
import {backendURL} from "./APIService";
const API_URL = backendURL + "tags/";
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CodeIcon from '@mui/icons-material/Code';
import BookIcon from '@mui/icons-material/Book';

class TagsService {
    getTags() {
        return axios.get(API_URL + 'get/');
    }
    create(name: string, description: string, icon: ETagIcon) {
        const iconName = icon.getName();
        console.log('Create Tag: ', {name, description, iconName})
        return axios.post(API_URL + 'create/', {
            name,
            description,
            icon: iconName
        });
    }
    edit(id: string, name: string, description: string, icon: ETagIcon) {
        const iconName = icon.getName();
        console.log('Edit Tag: ', {id, name, description, iconName})
        return axios.post(API_URL + 'edit/', {
            id,
            name,
            description,
            icon: iconName
        });
    }
    delete(id: string) {
        return axios.post(API_URL + 'delete/', {
            id
        });
    }
}
export default new TagsService();
export class ETagIcon {
    static FOLDER = new ETagIcon(FolderIcon, 'FOLDER');
    static FILE = new ETagIcon(InsertDriveFileIcon, 'FILE');
    static CODE = new ETagIcon(CodeIcon, 'CODE');
    static BOOK = new ETagIcon(BookIcon, 'BOOK');
    static NONE = new ETagIcon(null, 'NONE');

    constructor(public icon: any, public name: string) {
        this.icon = icon;
        this.name = name;
    }

    getIcon() {
        return this.icon;
    }

    getName() {
        return this.name;
    }

    public static getIconByName(name: string) {
        switch (name) {
            case 'FOLDER':
                return ETagIcon.FOLDER;
            case 'FILE':
                return ETagIcon.FILE;
            case 'CODE':
                return ETagIcon.CODE;
            case 'BOOK':
                return ETagIcon.BOOK;
            default:
                return ETagIcon.NONE;
        }
    }
}