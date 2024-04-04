import { Router } from "express";
import { createCate, deleteCate, getCates, undoDeleteCate, updateCate } from "../controllers/cate.controller";

const categoryRoute = Router();

categoryRoute.get('/get-cates', getCates);
categoryRoute.post('/add-cate', createCate);
categoryRoute.put('/update-cate', updateCate);
categoryRoute.delete('/delete-cate/:cateId', deleteCate);
categoryRoute.put('/recover-cate/:cateId', undoDeleteCate);

export default categoryRoute;