import { Request, Response, Router } from 'express';
import upload from '../configs/upload.config';
import typeRoute from './type.route';

const rootRoute = Router();

rootRoute.use('/type', typeRoute);

rootRoute.post('/upload', upload.array('images', 10), (req: Request, res: Response) => {
    const files = req.files;

    console.log('files:: ', files);
})

export default rootRoute;