import { Router } from "express";
import { ControllerSales } from "../Controller/Sales.js";  

export const routerSales = Router();

routerSales.post("/",ControllerSales.newSale);
routerSales.get("/",ControllerSales.getTickets);
routerSales.get("/:id",ControllerSales.getTicket);
routerSales.get("Info",ControllerSales.getSalesInfo);
