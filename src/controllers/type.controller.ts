import { Request, Response } from "express";
import Prisma from "../classes/Prisma";
import ResponseCreator from "../classes/ResponseCreator";
import { MailChecker, NumberChecker, TextChecker } from "../classes/Checker";
import { Error, Logger } from "../classes/Logger";
import path from 'path';
import Data from "../classes/Data";

const model = Prisma.getInstance().create();
const textChecker = new TextChecker();
const numberChecker = new NumberChecker();


const getTypes = async (req: Request, res: Response) => {
    try {
        const types = await model.types.findMany({
            select: {
                type_id: true,
                type_name: true,
            },
            where: {
                is_deleted: false,
            }
        });

        //convert data before send it back
        const convertTypes = Data.convertTypes(types);

        return ResponseCreator.create(200, 'Successfully!', convertTypes).send(res);

    } catch (error) {
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

//::role::admin
const createType = async (req: Request, res: Response) => {
    try {
        const { typeName } = req.body;

        //checking syntax typeName
        if (!typeName || textChecker.ultiScan(typeName) || numberChecker.isNumber(typeName)) return ResponseCreator.create(400, 'Invalid Type Name', typeName).send(res);

        //checking is exist
        const isExist = await model.types.findFirst({
            where: {
                type_name: typeName,
            }
        })

        if (isExist) return ResponseCreator.create(400, 'Type has already existed!', typeName).send(res);

        const newType = await model.types.create({
            data: {
                type_name: typeName,
            }
        })

        const convertedType = Data.convertType(newType);


        return ResponseCreator.create(201, 'Create successfully!', convertedType).send(res);

    } catch (error) {
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }

}

//::role::admin
const updateType = async (req: Request, res: Response) => {
    try {
        const { typeId, newTypeName } = req.body;

        if (!newTypeName || !typeId) return ResponseCreator.create(400, 'Invalid type name or typeId!', { typeId, newTypeName }).send(res);

        //check type id
        if (!numberChecker.isNumber(typeId)) return ResponseCreator.create(400, 'Invalid typeId!', typeId).send(res);

        //checking syntax typeName
        if (textChecker.ultiScan(newTypeName)) return ResponseCreator.create(400, 'Invalid type name!', newTypeName).send(res);

        //checking is exist
        const isExist = await model.types.findFirst({
            where: {
                type_id: parseInt(typeId),
            }
        })

        if (!isExist) return ResponseCreator.create(404, 'Type not found!', typeId).send(res);

        const updatedType = await model.types.update({
            data: { type_name: newTypeName }, where: {
                type_id: parseInt(typeId),
            }
        })

        const convertedType = Data.convertType(updatedType)

        return ResponseCreator.create(200, 'Update successfully!', convertedType).send(res);

    } catch (error) {
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500)?.send(res);
    }

}

//::role::admin
const deleteType = async (req: Request, res: Response) => {
    try {
        const { typeId } = req.params;

        //check null
        if (!typeId) return ResponseCreator.create(400, 'Invalid typeId!', typeId).send(res);

        //check type id
        if (!numberChecker.isNumber(typeId) || textChecker.hasSpace(typeId) || textChecker.hasSpecialChar(typeId)) return ResponseCreator.create(400, 'Invalid typeId!', typeId).send(res);

        const isExist = await model.types.findUnique({
            where: {
                type_id: parseInt(typeId),
            }
        })

        //check exist
        if (!isExist) return ResponseCreator.create(404, 'Type not found!', typeId).send(res);

        //delete
        const deletedType = await model.types.update({
            data: { is_deleted: true },
            where: {
                type_id: parseInt(typeId),
            }
        })

        const convertedType = Data.convertType(deletedType);

        return ResponseCreator.create(200, 'Delete successfully!', convertedType).send(res);


    } catch (error) {
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

//::role::admin
const undoDeleteType = async (req: Request, res: Response) => {
    try {
        const { typeId } = req.params;

        //check null
        if (!typeId) return ResponseCreator.create(400, 'Invalid typeId!', typeId).send(res);

        //check type id
        if (!numberChecker.isNumber(typeId) || textChecker.hasSpace(typeId) || textChecker.hasSpecialChar(typeId)) return ResponseCreator.create(400, 'Invalid typeId!', typeId).send(res);

        const isExist = await model.types.findUnique({
            where: {
                type_id: parseInt(typeId),
            }
        })

        //check exist
        if (!isExist) return ResponseCreator.create(404, 'Type not found!', typeId).send(res);

        //undo
        const deletedType = await model.types.update({
            data: { is_deleted: false },
            where: {
                type_id: parseInt(typeId),
            }
        })

        const convertedType = Data.convertType(deletedType);

        return ResponseCreator.create(200, 'Undo successfully!', deletedType).send(res);

    } catch (error) {
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

export {
    getTypes,
    createType,
    updateType,
    deleteType,
    undoDeleteType
}