import express, { json } from "express";
import { routerProducts } from "./Router/products.js";
import { routerSales } from "./Router/Sales.js";

const PORT = process.PORT || 3030;
const app = express();

app.use(json());
app.use("/products", routerProducts);
app.use("/sales", routerSales);

app.listen(PORT, () => {
  console.log("the server is live");
});
