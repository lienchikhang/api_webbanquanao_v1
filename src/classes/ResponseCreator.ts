import { Response } from "express";

class ConcreteResponse {
    constructor(private code: number, private mess?: string, private content?: any) { }

    send(res: Response) {
        return res.status(this.code).json({ status: this.code, mess: this.mess, content: this.content });
    }
}

class Success extends ConcreteResponse {
    constructor(code: number, mess?: string, content?: any) {
        super(code, mess, content);
    }
}

class Error extends ConcreteResponse {
    constructor(code: number, mess?: string, content?: any) {
        super(code, mess, content);
    }
}

class ResponseCreator {
    static create(code: number, mess?: string, content?: any) {
        switch (code) {
            case 500: {
                mess = 'Internal Server Error'
            }
            case 429:
            case 403:
            case 404:
            case 401:
            case 400: {
                return new Error(code, mess, content);
            }
            default:
                return new Success(code, mess, content);
        }
    }
}

export default ResponseCreator;