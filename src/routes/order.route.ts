import { Router } from "express";
import { cancelOrder, changeOrderPayingState, createOrder, getOrderById } from "../controllers/order.controller";
import { verifyClient } from "../middlewares/auth.middleware";

const orderRoute = Router();

//getOrders
orderRoute.get('/get-order-by-id', verifyClient, getOrderById);

//createOrder
orderRoute.post('/create-order', verifyClient, createOrder);

//cancelOrder
orderRoute.delete('/cancel-order', verifyClient, cancelOrder);

//changeOrderPayingState
orderRoute.put('/update-order-pay', verifyClient, changeOrderPayingState)


export default orderRoute;