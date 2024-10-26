import { Router } from "express";
import { productsController } from "../Controller/Products.js";
export const routerProducts = Router();

//get all products
routerProducts.get('/', productsController.getAllProducts);
routerProducts.post('/',productsController.createProduct);
routerProducts.patch('/',productsController.editProduct);
routerProducts.get('/:id',productsController.getProduct);
