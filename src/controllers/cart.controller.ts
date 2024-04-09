import { Request, Response, text } from "express";
import Prisma from "../classes/Prisma";
import { NumberChecker, TextChecker } from "../classes/Checker";
import ResponseCreator from "../classes/ResponseCreator";
import { Error, Logger } from "../classes/Logger";
import path from 'path';
import Data from "../classes/Data";
import { decodeToken } from "./token.controller";

const model = Prisma.getInstance().create();
const textChecker = new TextChecker();
const numberChecker = new NumberChecker();

const createCart = async (req: Request, res: Response) => {
    try {
        //get token
        const { userId } = req.payload;

        //check userId
        if (!userId
            || !numberChecker.isNumber(userId)
            || textChecker.hasSpace(userId)
            || textChecker.hasSpecialChar(userId)
        ) return ResponseCreator.create(400, 'Invalid userId').send(res);

        //check isExist cart user
        const isExist = await model.carts.findFirst({
            where: {
                user_id: parseInt(userId),
            }
        })

        if (isExist) return ResponseCreator.create(400, 'Cart has already existed').send(res);

        //create new cart
        await model.carts.create({
            data: {
                user_id: parseInt(userId),
            }
        })

        return ResponseCreator.create(201, 'Create successfully!').send(res);
    } catch (error) {
        console.log('error:: ', error);
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }

}

const createCartDetail = async (req: Request, res: Response) => {
    try {
        //price: original price of product
        const { productId, cartId, amount, price } = req.body;

        //check productId
        if (!productId) return ResponseCreator.create(400, 'Invalid productId', productId).send(res);
        if (!cartId) return ResponseCreator.create(400, 'Invalid cartId', cartId).send(res);
        if (!amount) return ResponseCreator.create(400, 'Invalid amount', amount).send(res);
        if (!price) return ResponseCreator.create(400, 'Invalid price', price).send(res);

        //check is number and has special chars
        if (!numberChecker.isNumber(productId) || textChecker.hasSpace(productId) || textChecker.hasSpecialChar(productId)) return ResponseCreator.create(400, 'Invalid productId', productId).send(res);
        if (!numberChecker.isNumber(cartId) || textChecker.hasSpace(cartId) || textChecker.hasSpecialChar(cartId)) return ResponseCreator.create(400, 'Invalid cartId', cartId).send(res);
        if (!numberChecker.isNumber(amount) || textChecker.hasSpace(amount) || textChecker.hasSpecialChar(amount)) return ResponseCreator.create(400, 'Invalid amount', amount).send(res);
        if (!numberChecker.isNumber(price) || textChecker.hasSpace(price) || textChecker.hasSpecialChar(price)) return ResponseCreator.create(400, 'Invalid price', price).send(res);

        //check valid price & amount
        if (!numberChecker.scanPrice(price)) return ResponseCreator.create(400, 'Invalid price', price).send(res);
        if (!numberChecker.scanAmount(amount)) return ResponseCreator.create(400, 'Invalid amount', amount).send(res);

        //check isExistProduct
        const isExistProduct = await model.products.findUnique({
            where: {
                product_id: parseInt(productId),
            }
        })
        if (!isExistProduct) return ResponseCreator.create(404, 'Product not found', productId).send(res);


        //check isExistCart
        const isExistCart = await model.carts.findUnique({
            where: {
                cart_id: parseInt(cartId),
            }
        })
        if (!isExistCart) return ResponseCreator.create(404, 'Cart not found', cartId).send(res);

        //create cartDetail
        const newCartDetail = await model.cartDetail.create({
            data: { product_id: parseInt(productId), cart_id: parseInt(cartId), amount: parseInt(amount), price: parseInt(price) }
        })

        //update cart
        await model.carts.update({
            data: {
                total_price: isExistCart.total_price + (newCartDetail.amount * newCartDetail.price)
            },
            where: {
                cart_id: isExistCart.cart_id
            }
        })

        const convertedCartDetail = Data.convertCartDetail(newCartDetail);

        return ResponseCreator.create(201, 'Create successfully!', convertedCartDetail).send(res);
    } catch (error) {
        console.log('error:: ', error);
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }

}

const deleteCartDetail = async (req: Request, res: Response) => {
    try {
        const { productId, cartId } = req.body;

        //check productId
        if (!productId) return ResponseCreator.create(400, 'Invalid productId', productId).send(res);
        if (!cartId) return ResponseCreator.create(400, 'Invalid cartId', cartId).send(res);

        //check is number and has special chars
        if (!numberChecker.isNumber(productId) || textChecker.hasSpace(productId) || textChecker.hasSpecialChar(productId)) return ResponseCreator.create(400, 'Invalid productId', productId).send(res);
        if (!numberChecker.isNumber(cartId) || textChecker.hasSpace(cartId) || textChecker.hasSpecialChar(cartId)) return ResponseCreator.create(400, 'Invalid cartId', cartId).send(res);

        //check isExistProduct
        const isExistProduct = await model.products.findUnique({
            where: {
                product_id: parseInt(productId),
            }
        })
        if (!isExistProduct) return ResponseCreator.create(404, 'Product not found', productId).send(res);


        //check isExistCart
        const isExistCart = await model.carts.findUnique({
            where: {
                cart_id: parseInt(cartId),
            }
        })
        if (!isExistCart) return ResponseCreator.create(404, 'Cart not found', cartId).send(res);

        //create cartDetail
        const deletedCartDetail = await model.cartDetail.deleteMany({
            where: {
                cart_id: parseInt(cartId),
                product_id: parseInt(productId),
            }
        })

        return ResponseCreator.create(200, 'Delete successfully!', deletedCartDetail).send(res);
    } catch (error) {
        console.log('error::', error);
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }

}

const updateAmountCartDetail = async (req: Request, res: Response) => {
    try {
        const { productId, cartId, amount } = req.body;

        //check productId
        if (!productId) return ResponseCreator.create(400, 'Invalid productId', productId).send(res);
        if (!cartId) return ResponseCreator.create(400, 'Invalid cartId', cartId).send(res);
        if (!amount) return ResponseCreator.create(400, 'Invalid amount', amount).send(res);

        //check is number and has special chars
        if (!numberChecker.isNumber(productId) || textChecker.hasSpace(productId) || textChecker.hasSpecialChar(productId)) return ResponseCreator.create(400, 'Invalid productId', productId).send(res);
        if (!numberChecker.isNumber(cartId) || textChecker.hasSpace(productId) || textChecker.hasSpecialChar(productId)) return ResponseCreator.create(400, 'Invalid cartId', cartId).send(res);
        if (!numberChecker.isNumber(amount) || textChecker.hasSpace(productId) || textChecker.hasSpecialChar(productId)) return ResponseCreator.create(400, 'Invalid amount', amount).send(res);

        //check valid price & amount
        if (!numberChecker.scanAmount(amount)) return ResponseCreator.create(400, 'Invalid amount', amount).send(res);

        //check isExistProduct
        const isExistProduct = await model.products.findUnique({
            where: {
                product_id: parseInt(productId),
            }
        })
        if (!isExistProduct) return ResponseCreator.create(404, 'Product not found', productId).send(res);


        //check isExistCart
        const isExistCart = await model.carts.findUnique({
            where: {
                cart_id: parseInt(cartId),
            }
        })
        if (!isExistCart) return ResponseCreator.create(404, 'Cart not found', cartId).send(res);

        //check isExistCartDetail
        const isExistCartDetail = await model.cartDetail.findFirst({
            where: {
                cart_id: parseInt(cartId),
                product_id: parseInt(productId)
            }
        })
        if (!isExistCartDetail) return ResponseCreator.create(404, 'Cart detail not found', null).send(res);

        //update cartDetail
        const updateCartDetail = await model.cartDetail.updateMany({
            data: { amount },
            where: {
                cart_id: parseInt(cartId),
                product_id: parseInt(productId)
            }
        })

        return ResponseCreator.create(201, 'Update successfully!', updateCartDetail).send(res);
    } catch (error) {
        console.log('error:: ', error);
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }

}

const getCartsByUserId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.payload;

        //find cart
        const cart = await model.carts.findFirst({
            where: {
                user_id: parseInt(userId)
            }
        })

        //findCarts
        const cartDetails = await model.cartDetail.findMany({
            select: {
                cart_id: true,
                amount: true,
                price: true,
                Products: {
                    select: {
                        product_id: true,
                        product_name: true,
                        Images: {
                            select: {
                                img_url: true,
                            },
                            take: 1
                        }
                    }
                }
            },
            where: {
                cart_id: cart?.cart_id
            }
        })

        //convert data
        const convertedCarts = Data.convertGetCartDetails(cartDetails)

        return ResponseCreator.create(200, 'Successfully!', convertedCarts).send(res);


    } catch (error) {

    }
}

export {
    createCart,
    createCartDetail,
    deleteCartDetail,
    updateAmountCartDetail,
    getCartsByUserId
}