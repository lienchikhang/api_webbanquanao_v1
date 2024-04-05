import { Router } from "express";
import { createCartDetail, updateAmountCartDetail, deleteCartDetail, createCart } from "../controllers/cart.controller";
import { verifyClient } from "../middlewares/auth.middleware";

const cartRoute = Router();

cartRoute.post('/create-detail', createCartDetail);
cartRoute.post('/create', verifyClient, createCart);
cartRoute.put('/update', updateAmountCartDetail);
cartRoute.delete('/delete', deleteCartDetail);

export default cartRoute;