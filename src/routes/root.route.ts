import { Request, Response, Router } from 'express';
import typeRoute from './type.route';
import sizeRoute from './size.route';
import categoryRoute from './cate.route';
import colorRoute from './color.route';
import authRoute from './auth.route';
import priceRoute from './price.route';
import productRoute from './product.route';

const rootRoute = Router();

rootRoute.use('/type', typeRoute);
rootRoute.use('/size', sizeRoute);
rootRoute.use('/category', categoryRoute);
rootRoute.use('/color', colorRoute);
rootRoute.use('/auth', authRoute);
rootRoute.use('/price', priceRoute);
rootRoute.use('/product', productRoute);


export default rootRoute;