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

const getCates = async (req: Request, res: Response) => {
    try {
        const cates = await model.categories.findMany({
            select: {
                cate_id: true,
                cate_name: true,
            },
            where: {
                is_deleted: false,
            }
        });

        const convertedCates = Data.convertCates(cates)

        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();

        return ResponseCreator.create(200, 'Successfully!', convertedCates).send(res);
    } catch (error) {
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

//::role::admin
const createCate = async (req: Request, res: Response) => {
    try {
        const { cateName } = req.body;

        //checking syntax cateName
        if (!cateName || textChecker.ultiScan(cateName)) return ResponseCreator.create(400, 'Invalid cate name!', cateName).send(res);

        //checking is exist
        const isExist = await model.categories.findFirst({
            where: {
                cate_name: cateName,
            }
        })

        if (isExist) return ResponseCreator.create(400, 'Cate has already existed!', cateName).send(res);

        const newCate = await model.categories.create({
            data: {
                cate_name: cateName,
            }
        })

        const convertedCate = Data.convertCate(newCate)

        return ResponseCreator.create(201, 'Successfully!', convertedCate).send(res);
    } catch (error) {
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

//::role::admin
const updateCate = async (req: Request, res: Response) => {
    try {
        const { cateId, newCateName } = req.body;

        if (!newCateName || !cateId) return ResponseCreator.create(400, 'Invalid cate name or cateId!', { cateId, newCateName }).send(res);

        //check type id
        if (!numberChecker.isNumber(cateId)) return ResponseCreator.create(400, 'Invalid cateId!', cateId).send(res);

        //checking syntax typeName
        if (textChecker.ultiScan(newCateName)) return ResponseCreator.create(400, 'Invalid cate name!', newCateName).send(res);

        //checking is exist
        const isExist = await model.categories.findFirst({
            where: {
                cate_id: parseInt(cateId),
            }
        })

        if (!isExist) return ResponseCreator.create(404, 'Cate not found!', cateId).send(res);

        const updatedCate = await model.categories.update({
            data: { cate_name: newCateName },
            where: {
                cate_id: parseInt(cateId),
            }
        })

        const convertedCate = Data.convertCate(updatedCate)

        return ResponseCreator.create(200, 'Update successfully!', convertedCate).send(res);

    } catch (error) {
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

//::role::admin
const deleteCate = async (req: Request, res: Response) => {
    try {
        const { cateId } = req.params;

        //check null
        if (!cateId) return ResponseCreator.create(400, 'Invalid cateId!', cateId).send(res);

        //check cate id
        if (!numberChecker.isNumber(cateId) || textChecker.hasSpace(cateId) || textChecker.hasSpecialChar(cateId)) return ResponseCreator.create(400, 'Invalid cateId!', cateId).send(res);

        const isExist = await model.categories.findFirst({
            where: {
                cate_id: parseInt(cateId),
            }
        })

        //check exist
        if (!isExist) return ResponseCreator.create(404, 'Cate not found!', cateId).send(res);

        //delete
        const deletedType = await model.categories.update({
            data: { is_deleted: true },
            where: {
                cate_id: parseInt(cateId),
            }
        })

        const convertedCate = Data.convertCate(deletedType)

        return ResponseCreator.create(200, 'Delete successfully!', convertedCate).send(res);
    } catch (error) {
        return ResponseCreator.create(500);
    }
}

//::role::admin
const undoDeleteCate = async (req: Request, res: Response) => {
    try {
        const { cateId } = req.params;

        //check null
        if (!cateId) return ResponseCreator.create(400, 'Invalid cateId!', cateId).send(res);

        //check cate id
        if (!numberChecker.isNumber(cateId) || textChecker.hasSpace(cateId) || textChecker.hasSpecialChar(cateId)) return ResponseCreator.create(400, 'Invalid cateId!', cateId).send(res);

        const isExist = await model.categories.findFirst({
            where: {
                cate_id: parseInt(cateId),
            }
        })

        //check exist
        if (!isExist) return ResponseCreator.create(404, 'Cate not found!', cateId).send(res);

        //delete
        const deletedCate = await model.categories.update({
            data: { is_deleted: false },
            where: {
                cate_id: parseInt(cateId),
            }
        })

        const convertedCate = Data.convertCate(deletedCate);

        return ResponseCreator.create(200, 'Undo successfully!', convertedCate).send(res);
    } catch (error) {
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

export {
    getCates,
    createCate,
    updateCate,
    deleteCate,
    undoDeleteCate
}