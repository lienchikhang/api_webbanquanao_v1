import { Router } from "express";
import { createType, deleteType, getTypes, undoDeleteType, updateType } from "../controllers/type.controller";

const typeRoute = Router();

typeRoute.get('/get-all-type', getTypes);
typeRoute.post('/create-type', createType);
typeRoute.put('/update-type', updateType);
typeRoute.delete('/delete-type/:typeId', deleteType);
typeRoute.put('/recover-type/:typeId', undoDeleteType);

export default typeRoute;