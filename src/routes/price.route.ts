import { Router } from "express";
import { createPrice, deletePrice, getPriceById, getPrices, undoDeletePrice, updatePrice } from "../controllers/price.controller";

const priceRoute = Router();

priceRoute.get('/get-price-by-id/:priceId', getPriceById);
priceRoute.get('/get-prices', getPrices);
priceRoute.post('/add-price', createPrice);
priceRoute.put('/update-price', updatePrice);
priceRoute.delete('/delete-price/:priceId', deletePrice);
priceRoute.put('/recover-price/:priceId', undoDeletePrice);

export default priceRoute;