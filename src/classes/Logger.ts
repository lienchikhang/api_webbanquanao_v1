import { handleWriteError } from "../controllers/log.controller";

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
    constructor(private data: string) {
    }
    public write() {
        handleWriteError(this.data);
    }
}

