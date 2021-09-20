import { Service } from 'typedi';

@Service()
export class UserService {

    constructor() {
        //no-empty
    }

    async listAll(): Promise<string> {
        return "list from service";
    }

    public listById = () => {
        return "byid from service";
    }

    public add = () => {
        return "add from service";
    }

    public update = () => {
        return "update from service";
    }

    public delete = () => {
        return "delete from service";
    }
}