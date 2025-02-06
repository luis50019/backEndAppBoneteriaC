import { Router } from "express";
import { productsController } from "../Controller/Products.js";
export const routerProducts = Router();

//get all products
routerProducts.get('/', productsController.getAllProducts);
routerProducts.post('/',productsController.createProduct);
routerProducts.patch('/',productsController.editProduct);
routerProducts.get('/top',productsController.getTopProduct);
routerProducts.get('/aboutToEnd',productsController.getProductsAboutToEnd);
routerProducts.get('/categories',productsController.getAllCategories);
routerProducts.get('/genders',productsController.getAllCategories);
routerProducts.get('/size/:category',productsController.getAllSizeByCategory);
routerProducts.get('/:id',productsController.getProductById);
