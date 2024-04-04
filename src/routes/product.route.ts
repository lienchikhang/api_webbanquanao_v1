import { Router } from "express";
import { createProduct, deleteProduct, getProductById, getProducts, undoDeleteProduct, updateProduct } from "../controllers/product.controller";
import { upload } from "../configs/upload.config";

const productRoute = Router();

productRoute.get('/get-product-by-id/:productId', getProductById);
productRoute.get('/get-products', getProducts);
productRoute.post('/add-product', upload.array('images', 7), createProduct);
productRoute.put('/update-product/:productId', updateProduct);
productRoute.delete('/delete-product/:productId', deleteProduct);
productRoute.put('/recover-product/:productId', undoDeleteProduct);

export default productRoute;