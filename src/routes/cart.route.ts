import { Router } from "express";
import { createCartDetail, updateAmountCartDetail, deleteCartDetail, createCart, getCartsByUserId } from "../controllers/cart.controller";
import { verifyClient } from "../middlewares/auth.middleware";

const cartRoute = Router();

cartRoute.get('/get-cart-by-id', verifyClient, getCartsByUserId);
cartRoute.post('/create-detail', createCartDetail);
cartRoute.post('/create', verifyClient, createCart);
cartRoute.put('/update', updateAmountCartDetail);
cartRoute.delete('/delete', deleteCartDetail);

export default cartRoute;