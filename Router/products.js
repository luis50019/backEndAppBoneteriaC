import { Router } from "express";
import { productsController } from "../Controller/Products.js";
export const routerProducts = Router();

//get all products
routerProducts.get('/', productsController.getAllProducts);
routerProducts.post('/',productsController.createProduct);
routerProducts.put('/:id',productsController.editProduct);
routerProducts.delete('/:id',productsController.deleteProductByID);
routerProducts.get('/top',productsController.getTopProduct);
routerProducts.get('/aboutToEnd',productsController.getProductsAboutToEnd);
routerProducts.get('/categories',productsController.getAllCategories);
routerProducts.get('/genders',productsController.getGender);
routerProducts.get('/size/:category',productsController.getAllSizeByCategory);
routerProducts.get('/:id',productsController.getProductById);
