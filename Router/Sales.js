import { Router } from "express";
import { ControllerSales } from "../Controller/Sales.js";  

export const routerSales = Router();

routerSales.post("/",ControllerSales.newSale);
routerSales.get("/",ControllerSales.getTickets);
routerSales.get("Info",ControllerSales.getSalesInfo);
