import { Router } from 'express';
import { createSize, deleteSize, getSizes, undoDeleteSize } from '../controllers/size.controller';

const sizeRoute = Router();

sizeRoute.get('/get-sizes', getSizes);
sizeRoute.post('/add-size', createSize);
sizeRoute.delete('/delete-size/:sizeId', deleteSize);
sizeRoute.put('/recover-size/:sizeId', undoDeleteSize);

export default sizeRoute;