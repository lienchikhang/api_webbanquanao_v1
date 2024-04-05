import { NextFunction, Request, Response } from "express";
import ResponseCreator from "../classes/ResponseCreator";
import { decodeToken, verifyToken } from "../controllers/token.controller";
import { Error, Logger } from "../classes/Logger";

// Khai báo một interface mới cho đối tượng Request của Express
declare global {
    namespace Express {
        export interface Request {
            payload: any; // Hoặc kiểu dữ liệu của payload của bạn
        }
    }
}

const verifyClient = async (req: Request, res: Response, next: NextFunction) => {
    try {

        //get token
        const token = req.headers.token?.toString().split(' ')[1];

        //checking token isEmpty
        if (!token) return ResponseCreator.create(401, 'Invalid token!', token).send(res);

        //verify
        const error = verifyToken(token);

        if (error?.name == 'TokenExpiredError') {
            return ResponseCreator.create(401, 'Token has expired!', error?.name).send(res);
        }

        if (error?.name == 'JsonWebTokenError') {
            return ResponseCreator.create(401, 'Invalid token!', error?.name).send(res);
        }

        //decode
        const payload = decodeToken(token);

        req.payload = payload;
        return next();

    } catch (error) {
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        ResponseCreator.create(500).send(res);
    }
}

const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
    try {
        //get token
        const token = req.headers.token?.toString().split(' ')[1];

        //check token
        if (!token) return ResponseCreator.create(401, 'Invalid token!', '').send(res);

        //decode token
        const payload = decodeToken(token);

        //authorize
        if (payload.role != 'admin') return ResponseCreator.create(401, 'No permission', token).send(res);
        return next();

    } catch (error) {
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        ResponseCreator.create(500).send(res);
    }
}

export {
    verifyClient,
    verifyAdmin
}