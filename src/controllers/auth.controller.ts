import { Request, Response } from "express";
import Prisma from "../classes/Prisma";
import { MailChecker, NumberChecker, TextChecker } from "../classes/Checker";
import ResponseCreator from "../classes/ResponseCreator";
import { Error, Logger } from "../classes/Logger";
import Data from "../classes/Data";
import { compareSync, hashSync } from "bcrypt";
import { createRefreshToken, createToken, decodeToken, verifyRefreshToken, verifyToken } from "./token.controller";

const model = Prisma.getInstance().create();
const textChecker = new TextChecker();
const numberChecker = new NumberChecker();
const mailChecker = new MailChecker();


const register = async (req: Request, res: Response) => {
    try {
        //get data
        const { email, password } = req.body;

        //check data is empty
        if (!email || !password) return ResponseCreator.create(400, 'Email or password cannot be empty', { email, password }).send(res);

        //check email type
        if (!mailChecker.isEmail(email)) return ResponseCreator.create(400, 'Invalid email!', email).send(res);

        //check isExist
        const isExist = await model.users.findFirst({
            where: {
                email,
            }
        })

        if (isExist) return ResponseCreator.create(400, 'Email has already existed!', email).send(res);

        //encrypt password
        const encryptPass = hashSync(password, 5);

        //create newUser
        await model.users.create({
            data: {
                email,
                pass_word: encryptPass,
            }
        })

        return ResponseCreator.create(201, 'Register successfully!', email).send(res);

    } catch (error) {
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

const login = async (req: Request, res: Response) => {
    try {
        //get data
        const { email, password } = req.body;

        //check data
        if (!email || !password) return ResponseCreator.create(400, 'Invalid email or password!', { email, password }).send(res);

        //check valid email
        if (!mailChecker.isEmail(email)) return ResponseCreator.create(400, 'Invalid email!', email).send(res);

        //check exist
        const isExist = await model.users.findFirst({
            where: {
                email,
            }
        })

        if (!isExist) return ResponseCreator.create(400, 'Email not found!', email).send(res);

        //check password
        if (isExist.pass_word) {
            const isValidPassword = compareSync(password, isExist.pass_word);
            if (!isValidPassword) return ResponseCreator.create(400, 'Email or password is not correct!', { email, password }).send(res);
        }


        //create accessToken & refreshToken
        if (isExist.user_id && isExist.user_role) {
            const accessToken = createToken({
                userId: isExist.user_id,
                role: isExist.user_role,
            }, '15s')

            const refreshToken = createRefreshToken({
                userId: isExist.user_id,
                role: isExist.user_role,
            })

            //save refreshToken into database
            await model.users.update({
                data: { refresh_token: refreshToken },
                where: {
                    user_id: isExist.user_id
                }
            })

            //return accessToken
            return ResponseCreator.create(200, 'Login successfully!', accessToken).send(res);
        }

    } catch (error) {
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

const loginFacebook = (req: Request, res: Response) => {
    try {

    } catch (error) {
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

const loginGoogle = (req: Request, res: Response) => {
    try {

    } catch (error) {
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

const test = (req: Request, res: Response) => {
    return res.status(200).send('successfully')
}

const refreshToken = async (req: Request, res: Response) => {
    try {
        //get token
        const token = req.headers.token?.toString().split(' ')[1].trim();

        //check token
        if (!token) return ResponseCreator.create(400, 'Invalid token!', token).send(res);

        //verify accessToken
        let hasError = verifyToken(token);
        console.log('hasError:: ', hasError);
        if (!hasError) return ResponseCreator.create(400, 'Token is still good', '').send(res);
        if (hasError && hasError.name == 'JsonWebTokenError') return ResponseCreator.create(400, 'Invalid token!', token).send(res);

        //decode accessToken
        const payload = decodeToken(token);

        //find user by id
        const isExistUser = await model.users.findUnique({
            where: {
                user_id: payload.userId
            }
        });

        //isExist => get refreshToken
        if (!isExistUser) return ResponseCreator.create(400, 'User not found!', token).send(res);
        const refreshToken = isExistUser.refresh_token;

        //verify refreshToken
        if (!refreshToken) return ResponseCreator.create(400, 'User has not logined yet!', token).send(res);
        hasError = verifyRefreshToken(refreshToken);

        //if refreshToken has expired => return something that force user must login again (delete refreshToken)
        if (hasError && hasError.name == 'TokenExpiredError') return ResponseCreator.create(400, 'Login expired', 'LoginExpired').send(res);

        //if there's nothing => create new accessToken and send it back
        const newAccessToken = createToken({ userId: payload.userId, role: payload.role }, '15s');

        return ResponseCreator.create(200, 'Refresh successfully!', newAccessToken).send(res);

    } catch (error) {
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

export {
    register,
    login,
    loginFacebook,
    loginGoogle,
    test,
    refreshToken
}