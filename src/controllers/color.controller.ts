import { Request, Response } from "express";
import Prisma from "../classes/Prisma";
import { NumberChecker, TextChecker } from "../classes/Checker";
import ResponseCreator from "../classes/ResponseCreator";
import { Error, Logger } from "../classes/Logger";
import Data from "../classes/Data";

const model = Prisma.getInstance().create();
const textChecker = new TextChecker();
const numberChecker = new NumberChecker();

const getColors = async (req: Request, res: Response) => {
    try {
        const colors = await model.colors.findMany({
            select: {
                color_id: true,
                color_hex: true,
                color_name: true,
            },
            where: {
                is_deleted: false,
            }
        });

        const convertedColors = Data.convertColors(colors)

        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();

        return ResponseCreator.create(200, 'Successfully!', convertedColors).send(res);
    } catch (error) {
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

//::role::admin
const createColor = async (req: Request, res: Response) => {
    try {
        const { colorHex, colorName } = req.body;

        //checking syntax cateName
        if (!colorHex || !colorName) return ResponseCreator.create(400, 'Invalid color hex or color name!', { colorHex, colorName }).send(res);

        if (textChecker.hasSpace(colorHex) || textChecker.hasSpace(colorName) || textChecker.hasSpecialChar(colorName)) return ResponseCreator.create(400, 'Invalid color hex or color name!', { colorHex, colorName }).send(res);

        //checking is exist
        const isExist = await model.colors.findFirst({
            where: {
                color_hex: colorHex,
            }
        })

        if (isExist) return ResponseCreator.create(400, 'Color has already existed!', colorHex).send(res);

        const newColor = await model.colors.create({
            data: {
                color_hex: colorHex,
                color_name: colorName.toLowerCase()
            }
        })

        const convertedColor = Data.convertColor(newColor);

        return ResponseCreator.create(201, 'Create Successfully!', convertedColor).send(res);
    } catch (error) {
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

//::role::admin
const deleteColor = async (req: Request, res: Response) => {
    try {
        const { colorId } = req.params;

        //check null
        if (!colorId) return ResponseCreator.create(400, 'Invalid colorId!', colorId).send(res);

        //check cate id
        if (!numberChecker.isNumber(colorId) || textChecker.hasSpace(colorId) || textChecker.hasSpecialChar(colorId)) return ResponseCreator.create(400, 'Invalid colorId!', colorId).send(res);

        const isExist = await model.colors.findFirst({
            where: {
                color_id: parseInt(colorId),
            }
        })

        //check exist
        if (!isExist) return ResponseCreator.create(400, 'Color not found!', colorId).send(res);

        //delete
        const deletedColor = await model.colors.update({
            data: { is_deleted: true },
            where: {
                color_id: parseInt(colorId),
            }
        })

        const convertedColor = Data.convertColor(deletedColor);

        return ResponseCreator.create(200, 'Delete successfully!', convertedColor).send(res);
    } catch (error) {
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

//::role::admin
const undoDeleteColor = async (req: Request, res: Response) => {
    try {
        const { colorId } = req.params;

        //check null
        if (!colorId) return ResponseCreator.create(400, 'Invalid colorId!', colorId).send(res);

        //check cate id
        if (!numberChecker.isNumber(colorId) || textChecker.hasSpace(colorId) || textChecker.hasSpecialChar(colorId)) return ResponseCreator.create(400, 'Invalid colorId!', colorId).send(res);

        const isExist = await model.colors.findFirst({
            where: {
                color_id: parseInt(colorId),
            }
        })

        //check exist
        if (!isExist) return ResponseCreator.create(400, 'Color not found!', colorId).send(res);

        //delete
        const deletedColor = await model.colors.update({
            data: { is_deleted: false },
            where: {
                color_id: parseInt(colorId),
            }
        })

        const convertedColor = Data.convertColor(deletedColor);

        return ResponseCreator.create(200, 'Undo successfully!', convertedColor).send(res);
    } catch (error) {
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

export {
    getColors,
    createColor,
    deleteColor,
    undoDeleteColor
}