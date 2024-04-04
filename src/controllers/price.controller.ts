import { Request, Response, text } from "express";
import Prisma from "../classes/Prisma";
import { NumberChecker, TextChecker } from "../classes/Checker";
import ResponseCreator from "../classes/ResponseCreator";
import { Error, Logger } from "../classes/Logger";
import Data from "../classes/Data";

const model = Prisma.getInstance().create();
const textChecker = new TextChecker();
const numberChecker = new NumberChecker();


//::role::client && admin
const getPrices = async (req: Request, res: Response) => {
    try {
        const prices = await model.prices.findMany({
            select: {
                price_id: true,
                price_num: true,
            },
            where: {
                is_deleted: false,
            }
        });

        const convertedPrices = Data.convertPrices(prices)

        return ResponseCreator.create(201, 'Successfully!', convertedPrices).send(res);
    } catch (error) {
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

//::role::client
const getPriceById = async (req: Request, res: Response) => {
    try {
        const { priceId } = req.params;

        if (!priceId) return ResponseCreator.create(400, 'Invalid priceId!', priceId).send(res);

        if (!numberChecker.isNumber(priceId) || textChecker.hasSpace(priceId) || textChecker.hasSpecialChar(priceId)) return ResponseCreator.create(400, 'Invalid priceId!', priceId).send(res);

        const price = await model.prices.findUnique({
            select: {
                price_id: true,
                price_num: true,
            },
            where: {
                price_id: parseInt(priceId)
            }
        });

        if (!price) return ResponseCreator.create(404, 'Price not found', priceId).send(res);

        const convertedPrice = Data.convertPrice(price);

        return ResponseCreator.create(200, 'Successfully!', convertedPrice).send(res);
    } catch (error) {

        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

//::role::admin
const createPrice = async (req: Request, res: Response) => {
    try {
        const { priceNum } = req.body;

        //checking syntax priceNum
        if (!priceNum || !numberChecker.isNumber(priceNum) || textChecker.hasSpace(priceNum) || textChecker.hasSpecialChar(priceNum)) return ResponseCreator.create(400, 'Invalid price!', priceNum).send(res);

        const newPrice = await model.prices.create({
            data: {
                price_num: priceNum,
            }
        })

        const convertedPrice = Data.convertPrice(newPrice);

        return ResponseCreator.create(201, 'Successfully!', convertedPrice).send(res);
    } catch (error) {
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

//::role::admin
const updatePrice = async (req: Request, res: Response) => {
    try {
        const { priceId, newPriceNum } = req.body;

        if (!newPriceNum || !priceId) return ResponseCreator.create(400, 'Invalid price or priceId!', { priceId, newPriceNum }).send(res);

        //check price id
        if (!numberChecker.isNumber(priceId) || textChecker.hasSpace(priceId) || textChecker.hasSpecialChar(priceId)) return ResponseCreator.create(400, 'Invalid priceId!', priceId).send(res);

        //check newPriceNum
        if (!numberChecker.isNumber(newPriceNum) || textChecker.hasSpace(newPriceNum) || textChecker.hasSpecialChar(newPriceNum)) return ResponseCreator.create(400, 'Invalid price!', newPriceNum).send(res);

        //checking is exist
        const isExist = await model.prices.findUnique({
            where: {
                price_id: parseInt(priceId),
            }
        })

        if (!isExist) return ResponseCreator.create(404, 'Price not found!', priceId).send(res);

        const updatedCate = await model.prices.update({
            data: { price_num: parseInt(newPriceNum) },
            where: {
                price_id: parseInt(priceId),
            }
        })

        return ResponseCreator.create(201, 'Update successfully!', updatedCate).send(res);

    } catch (error) {
        console.log('error:: ', error)
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

//::role::admin
const deletePrice = async (req: Request, res: Response) => {
    try {
        const { priceId } = req.params;

        //check null
        if (!priceId) return ResponseCreator.create(400, 'Invalid priceId!', priceId).send(res);

        //check cate id
        if (!numberChecker.isNumber(priceId) || textChecker.hasSpace(priceId) || textChecker.hasSpecialChar(priceId)) return ResponseCreator.create(400, 'Invalid priceId!', priceId).send(res);

        const isExist = await model.prices.findUnique({
            where: {
                price_id: parseInt(priceId),
            }
        })

        //check exist
        if (!isExist) return ResponseCreator.create(404, 'Price not found!', priceId).send(res);

        //delete
        const deletedPrice = await model.prices.update({
            data: { is_deleted: true },
            where: {
                price_id: parseInt(priceId),
            }
        })

        const convertedPrice = Data.convertPrice(deletedPrice);

        return ResponseCreator.create(200, 'Delete successfully!', convertedPrice).send(res);
    } catch (error) {
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

//::role::admin
const undoDeletePrice = async (req: Request, res: Response) => {
    try {
        const { priceId } = req.params;

        //check null
        if (!priceId) return ResponseCreator.create(400, 'Invalid priceId!', priceId).send(res);

        //check cate id
        if (!numberChecker.isNumber(priceId) || textChecker.hasSpace(priceId) || textChecker.hasSpecialChar(priceId)) return ResponseCreator.create(400, 'Invalid priceId!', priceId).send(res);

        const isExist = await model.prices.findUnique({
            where: {
                price_id: parseInt(priceId),
            }
        })

        //check exist
        if (!isExist) return ResponseCreator.create(404, 'Price not found!', priceId).send(res);

        //delete
        const deletedPrice = await model.prices.update({
            data: { is_deleted: false },
            where: {
                price_id: parseInt(priceId),
            }
        })

        const convertPrice = Data.convertPrice(deletedPrice)

        return ResponseCreator.create(200, 'Undo successfully!', convertPrice).send(res);
    } catch (error) {
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

export {
    getPrices,
    getPriceById,
    createPrice,
    updatePrice,
    deletePrice,
    undoDeletePrice
}