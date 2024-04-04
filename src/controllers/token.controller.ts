import jwt from 'jsonwebtoken';
import { IPayload } from '../interfaces/token.interface';

const secretTokenKey = '123-123-123-123'
const secretRefreshTokenKey = '456-456-456-456'


const verifyToken = (token: string): jwt.VerifyErrors | null => {
    try {
        jwt.verify(token, secretTokenKey);
        return null;
    } catch (error) {
        return error as jwt.VerifyErrors;
    }
}

const decodeToken = (token: string) => {
    return jwt.decode(token) as IPayload;
}

const createToken = (payload: IPayload, exp: string): string => {
    return jwt.sign(payload, secretTokenKey, {
        expiresIn: exp
    });
}

const createRefreshToken = (payload: IPayload): string => {
    return jwt.sign(payload, secretRefreshTokenKey, {
        expiresIn: '20s',
    });
}

const verifyRefreshToken = (token: string) => {
    try {
        jwt.verify(token, secretRefreshTokenKey);
        return null;
    } catch (error) {
        return error as jwt.VerifyErrors;
    }
}

export {
    verifyToken,
    createToken,
    decodeToken,
    createRefreshToken,
    verifyRefreshToken,
}