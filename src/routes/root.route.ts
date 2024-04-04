import { Request, Response, Router } from 'express';
import upload from '../configs/upload.config';
import typeRoute from './type.route';
import sizeRoute from './size.route';
import categoryRoute from './cate.route';
import colorRoute from './color.route';

const rootRoute = Router();

rootRoute.use('/type', typeRoute);
rootRoute.use('/size', sizeRoute);
rootRoute.use('/category', categoryRoute);
rootRoute.use('/color', colorRoute);

rootRoute.post('/upload', upload.array('images', 10), (req: Request, res: Response) => {
    const files = req.files;

    console.log('files:: ', files);
})

export default rootRoute;