import { Router } from "express";
import { createProduct, deleteProduct, getProductById, getProducts, undoDeleteProduct, updateProduct, uploadImageProduct } from "../controllers/product.controller";
import { upload } from "../configs/upload.config";

const productRoute = Router();

productRoute.get('/get-product-by-id/:productId', getProductById);
productRoute.get('/get-products', getProducts);
productRoute.post('/add-product', createProduct);
productRoute.post('/upload-images/:productId', upload.array('images', 7), uploadImageProduct);
productRoute.put('/update-product/:productId', updateProduct);
productRoute.delete('/delete-product/:productId', deleteProduct);
productRoute.put('/recover-product/:productId', undoDeleteProduct);

export default productRoute;