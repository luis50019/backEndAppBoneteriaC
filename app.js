import express, { json } from "express";
import { routerProducts } from "./Router/products.js";
import { routerSales } from "./Router/Sales.js";
import { corsMiddleware } from "./Middleware/cors.js";
import { routerStadisctic } from "./Router/stadistic.js";
import { connectDB } from "./Model/mongoDB/dbMongo.js";
import cors from 'cors'
const PORT = process.PORT || 4000;
const app = express();
connectDB()
app.use(cors({
  origin: "*"
}));
app.use(json());
app.use("/products", routerProducts);
app.use("/sales", routerSales);
app.use("/stadisctic",routerStadisctic);
app.options('*', corsMiddleware());
app.listen(PORT, () => {
  console.log("the server is live");
});
