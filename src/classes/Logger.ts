import { handleWriteError } from "../controllers/log.controller";
import path from 'path';

interface Type {
    write(): void;
}

export class Logger {
    constructor(private type: Type) {
    }

    public setType(type: Type) {
        this.type = type;
    }

    public write() {
        this.type.write();
    }
}

export class Error implements Type {
    constructor(private data: string, private fileName: string) {
        this.data = data + "::";
        this.fileName = path.basename(fileName)
    }
    public write() {
        handleWriteError(this.data + this.fileName);
    }
}

