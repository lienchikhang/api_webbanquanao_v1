import { Request, Response } from "express";
import Prisma from "../classes/Prisma";
import { NumberChecker, TextChecker } from "../classes/Checker";
import ResponseCreator from "../classes/ResponseCreator";
import { Error, Logger } from "../classes/Logger";
import path from 'path';
import Data from "../classes/Data";

const model = Prisma.getInstance().create();
const textChecker = new TextChecker();
const numberChecker = new NumberChecker();

const getSizes = async (req: Request, res: Response) => {
    try {
        const sizes = await model.sizes.findMany({
            select: {
                size_id: true,
                size_key: true,
            },
            where: {
                is_deleted: false,
            }
        });

        const convertedSizes = Data.convertSizes(sizes);

        return ResponseCreator.create(201, 'Successfully!', convertedSizes).send(res);
    } catch (error) {
        const logger = new Logger(new Error(new Date().getTime().toString() + "::" + path.basename(__filename)));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

//::role::admin
const createSize = async (req: Request, res: Response) => {
    try {
        const { sizeKey } = req.body;

        //checking syntax cateName
        if (!sizeKey || numberChecker.isNumber(sizeKey) || textChecker.hasSpace(sizeKey) || textChecker.hasSpecialChar(sizeKey)) return ResponseCreator.create(400, 'Invalid size!', sizeKey).send(res);


        //checking is exist
        const isExist = await model.sizes.findFirst({
            where: {
                size_key: sizeKey.toUpperCase(),
            }
        })

        if (isExist) return ResponseCreator.create(400, 'Size has already existed!', sizeKey).send(res);

        const newSize = await model.sizes.create({
            data: {
                size_key: sizeKey.toUpperCase(),
            }
        })

        const convertedSize = Data.convertSize(newSize)

        return ResponseCreator.create(201, 'Successfully!', convertedSize).send(res);
    } catch (error) {
        const logger = new Logger(new Error(new Date().getTime().toString() + "::" + path.basename(__filename)));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

//::role::admin
const deleteSize = async (req: Request, res: Response) => {
    try {
        const { sizeId } = req.params;

        //check null
        if (!sizeId) return ResponseCreator.create(400, 'Invalid sizeId!', sizeId).send(res);

        //check cate id
        if (!numberChecker.isNumber(sizeId) || textChecker.hasSpace(sizeId) || textChecker.hasSpecialChar(sizeId)) return ResponseCreator.create(400, 'Invalid sizeId!', sizeId).send(res);

        const isExist = await model.sizes.findUnique({
            where: {
                size_id: parseInt(sizeId),
            }
        })

        //check exist
        if (!isExist) return ResponseCreator.create(404, 'Size not found!', sizeId).send(res);

        //delete
        const deletedSize = await model.sizes.update({
            data: { is_deleted: true }, where: {
                size_id: parseInt(sizeId),
            }
        })

        const convertedSize = Data.convertSize(deletedSize);

        return ResponseCreator.create(200, 'Delete successfully!', convertedSize).send(res);
    } catch (error) {
        const logger = new Logger(new Error(new Date().getTime().toString() + "::" + path.basename(__filename)));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

//::role::admin
const undoDeleteSize = async (req: Request, res: Response) => {
    try {
        const { sizeId } = req.params;

        //check null
        if (!sizeId) return ResponseCreator.create(400, 'Invalid sizeId!', sizeId).send(res);

        //check cate id
        if (!numberChecker.isNumber(sizeId) || textChecker.hasSpace(sizeId) || textChecker.hasSpecialChar(sizeId)) return ResponseCreator.create(400, 'Invalid sizeId!', sizeId).send(res);

        const isExist = await model.sizes.findUnique({
            where: {
                size_id: parseInt(sizeId),
            }
        })

        //check exist
        if (!isExist) return ResponseCreator.create(404, 'Size not found!', sizeId).send(res);

        //delete
        const deletedSize = await model.sizes.update({
            data: { is_deleted: false },
            where: {
                size_id: parseInt(sizeId),
            }
        })

        const convertedSize = Data.convertSize(deletedSize);

        return ResponseCreator.create(200, 'Undo successfully!', convertedSize).send(res);
    } catch (error) {
        const logger = new Logger(new Error(new Date().getTime().toString() + "::" + path.basename(__filename)));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

export {
    getSizes,
    createSize,
    deleteSize,
    undoDeleteSize
}