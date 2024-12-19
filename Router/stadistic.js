import { Router } from "express";
import { ControllerStadistic } from "../Controller/Stadistic.js";
export const routerStadisctic = Router();

routerStadisctic.get("/",ControllerStadistic.getTotalSales);

