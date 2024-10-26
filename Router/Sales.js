import { Router } from "express";
import { ControllerSales } from "../Controller/Sales.js";  

export const routerSales = Router();

routerSales.post("/",ControllerSales.newSale);
