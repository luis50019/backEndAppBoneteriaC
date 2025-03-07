import { Router } from "express";
import { ControllerSales } from "../Controller/Sales.js";  

export const routerSales = Router();

routerSales.get("/Info",ControllerSales.getSalesInfo);
routerSales.get("/search",ControllerSales.searchSales);
routerSales.post("/",ControllerSales.newSale);
routerSales.get("/",ControllerSales.getTickets);
routerSales.get("/:id",ControllerSales.getTicket);
