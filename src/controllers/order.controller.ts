import { Request, Response, text } from "express";
import Prisma from "../classes/Prisma";
import { NumberChecker, TextChecker } from "../classes/Checker";
import ResponseCreator from "../classes/ResponseCreator";
import { Error, Logger } from "../classes/Logger";
import Data from "../classes/Data";

const model = Prisma.getInstance().create();
const textChecker = new TextChecker();
const numberChecker = new NumberChecker();

const getOrderById = async (req: Request, res: Response) => {
    try {
        const { userId } = req.payload;

        const order = await model.orders.findFirst({
            select: {
                order_date: true,
                total_price: true,
                OrderDetail: {
                    select: {
                        product_id: true,
                        amount: true,
                        price: true,
                    }
                }
            },
            where: {
                user_id: parseInt(userId)
            }
        })

        return ResponseCreator.create(200, 'successfully!', order).send(res);
    } catch (error) {
        console.log('error:: ', error);
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }

}

const createOrder = async (req: Request, res: Response) => {
    try {
        const { userId } = req.payload;

        //find cartId
        const cart = await model.carts.findFirst({
            where: {
                user_id: parseInt(userId),
            }
        })

        if (!cart) return ResponseCreator.create(400, 'Cart is empty', null).send(res);

        //find cartDetails base on cartId
        const cartDetails = await model.cartDetail.findMany({
            select: {
                product_id: true,
                amount: true,
                price: true,
            },
            where: {
                cart_id: cart?.cart_id,
            }
        })

        if (!cartDetails.length) return ResponseCreator.create(400, 'Cart is empty', null).send(res);


        //create order
        const newOrder = await model.orders.create({
            data: {
                user_id: parseInt(userId),
                order_date: new Date(),
                total_price: cartDetails.reduce((acc, curVar) => {
                    return acc + curVar.price * curVar.amount
                }, 0)
            }
        })

        //convert cartDetails to orderDetails
        const convertCartDetails = cartDetails.map((cart) => {
            return {
                order_id: newOrder.order_id,
                product_id: cart.product_id,
                amount: cart.amount,
                price: cart.price,
            }
        })

        //create orderDetails
        const orderDetails = await model.orderDetail.createMany({
            data: convertCartDetails
        })

        //delete cartDetail
        await model.cartDetail.deleteMany({
            where: {
                cart_id: cart?.cart_id,
            }
        })

        return ResponseCreator.create(200, 'successfully!', newOrder).send(res);
    } catch (error) {
        console.log('error:: ', error);
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

const cancelOrder = async (req: Request, res: Response) => {
    try {
        const { userId } = req.payload;
        const { orderId } = req.params;

        if (!orderId || !numberChecker.isNumber(orderId) || textChecker.hasSpace(orderId) || textChecker.hasSpecialChar(orderId)) return ResponseCreator.create(400, 'Invalid order id', orderId).send(res);

        const order = await model.orders.findUnique({
            where: {
                order_id: parseInt(orderId)
            }
        })

        if (!order) return ResponseCreator.create(404, 'Order not found!', orderId).send(res);

        //cancel order
        const cancel = await model.orders.update({
            data: {
                is_cancel: true,
            },
            where: {
                order_id: parseInt(orderId),
            }
        })

        return ResponseCreator.create(200, 'Cancel successfully!', cancel).send(res);
    } catch (error) {
        console.log('error:: ', error);
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}

const changeOrderPayingState = async (req: Request, res: Response) => {
    try {
        const { userId } = req.payload;
        const { orderId } = req.params;

        if (!orderId || !numberChecker.isNumber(orderId) || textChecker.hasSpace(orderId) || textChecker.hasSpecialChar(orderId)) return ResponseCreator.create(400, 'Invalid order id', orderId).send(res);

        const order = await model.orders.findUnique({
            where: {
                order_id: parseInt(orderId)
            }
        })

        if (!order) return ResponseCreator.create(404, 'Order not found!', orderId).send(res);

        //update paying state order
        const isPaid = await model.orders.update({
            data: {
                is_paid: true,
            },
            where: {
                order_id: parseInt(orderId),
            }
        })

        return ResponseCreator.create(200, 'Cancel successfully!', isPaid).send(res);
    } catch (error) {
        console.log('error:: ', error);
        const logger = new Logger(new Error(new Date().getTime().toString(), __filename));
        logger.write();
        return ResponseCreator.create(500).send(res);
    }
}


export {
    getOrderById,
    createOrder,
    cancelOrder,
    changeOrderPayingState
}