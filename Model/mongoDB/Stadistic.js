import { object } from "zod";
import { ErrorQueries } from "../../Error/error.js";
import StadisticsSales from "../../Schema/mongoDB/stadisticsSales.js";
import summaryInventorySchema from "../../Schema/mongoDB/summaryInventory.schema.js";
import { InventaryData } from "./utils/valueReturn.js";
import categorySchema from "../../Schema/mongoDB/category.schema.js";
import sizeClothingSchema from "../../Schema/mongoDB/sizeClothing.schema.js";

const dayOfWeek = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
];

export default class ModelStadistic {
  static async getTotalSales() {
    const stadiscticSales = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: ["rgb(247,140,148)"],
          borderColor: ["rgb(247,140,148)"],
          borderWidth: 5,
        },
      ],
    };
    try {
      const dataStadisctic = await StadisticsSales.find();
      for (let stadidisctic of dataStadisctic) {
        const date = new Date(stadidisctic.lastSale);
        const day = date.getUTCDay();
        const dataSpecific =
          date.getFullYear() +
          "-" +
          (date.getMonth() + 1) +
          "-" +
          date.getDate();

        stadiscticSales.labels.push(dayOfWeek[day] + " " + dataSpecific);
        stadiscticSales.datasets[0].data.push(stadidisctic.incomeTotal);
      }
      return stadiscticSales;
    } catch (error) {
      console.log(error);
    }
  }

  static async getInfoInventary() {
    try {
      const infoInventary = await summaryInventorySchema.find();
      if (!infoInventary) {
        throw new ErrorQueries(
          "no se encontro informacion sobre el inventario",
          "error en stadistic"
        );
        return [];
      }
      const dataInfo = [];
      const pureObject = infoInventary[0].toObject();

      for (const key in pureObject) {
        if (key !== "_id" && key !== "__v" && key !== "lastFecha") {
          const data = {
            title: InventaryData[key],
            value: pureObject[key],
          };
          dataInfo.push(data);
        }
      }

      return dataInfo;
    } catch (e) {
      console.log(e);
    }
  }

  static async getInfoInventaryByCategoryAndSize() {
    try {
      const dataInfoInventary = { categoriesOfPruducts, sizesOfProducts };
      const categories = await categorySchema.find();
      const sizes = await sizeClothingSchema.find();
      dataInfoInventary.categoriesOfPruducts = categories;
      dataInfoInventary.sizesOfProducts = sizes;

      const dataInfo = [];
      const pureObject = dataInfoInventary.toObject();
      for (const key in pureObject) {
        if (key !== "_id" && key !== "__v" && key !== "lastFecha") {
          const data = {
            title: InventaryData[key],
            value: pureObject[key],
          };
          dataInfo.push(data);
        }
      }
      return dataInfo;
    } catch (e) {
      console.log(e);
    }
  }
}
