import { Router } from "express";
import { createColor, deleteColor, getColors, undoDeleteColor } from "../controllers/color.controller";

const colorRoute = Router();

colorRoute.get('/get-colors', getColors);
colorRoute.post('/add-color', createColor);
colorRoute.delete('/delete-color/:colorId', deleteColor);
colorRoute.put('/recover-color/:colorId', undoDeleteColor);

export default colorRoute;