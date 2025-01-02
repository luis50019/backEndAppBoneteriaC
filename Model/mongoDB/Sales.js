import mongoose from "mongoose";
import { ErrorSales } from "../../Error/error.js";

import Product from "../../Schema/mongoDB/product.schema.js";
import MovementInventory from "../../Schema/mongoDB/movementInventory.schema.js";
import StatisticsSales from "../../Schema/mongoDB/stadisticsSales.js";
import Ticket from "../../Schema/mongoDB/ticket.schema.js";
import summaryInventorySchema from "../../Schema/mongoDB/summaryInventory.schema.js";
import SizeClothing from "../../Schema/mongoDB/sizeClothing.schema.js";
export class ModelSales {
  static newSale = async (saleData) => {
    let session;
    try {
      session = await mongoose.startSession();
      session.startTransaction();

      // primero generar el ticket
      const { typeSale, date, total, products } = saleData;

      let newTicket = await Ticket.findOne({
        saleDate: products[0].date,
      }).session(session);

      if (!newTicket) {
        newTicket = new Ticket({
          typeSale,
          total,
          details: [],
          saleData: date,
        });
      }
      const inventary = await summaryInventorySchema.findOne();
      if (!inventary) {
        throw new ErrorSales("Inventario no encontrado", "Error en ventas");
      }
      inventary.totalSales += total;
      for (const product of products) {
        const productFind = await Product.findById(product.productId).session(session)

        if (!productFind) {
          throw new ErrorSales("No se encontro el producto", "Error en ventas");
        }
        const {pieceQuantity,quantityDozens} = product;
        const {
          unitPrice,
          dozenPrice,
          discount,
          purchasePrice,
        } = productFind;

        // operations of the clothings
        const incomeTotal = (unitPrice * pieceQuantity + dozenPrice * quantityDozens) * (1 - discount / 100);
        const discountedUnitPrice = unitPrice * (1 - discount / 100);
        const discountedDozenPrice = dozenPrice * (1 - discount / 100);
        const totalProfit = (discountedUnitPrice - purchasePrice) * pieceQuantity + (discountedDozenPrice - purchasePrice * 12) * quantityDozens;
        const soldAmount = pieceQuantity + quantityDozens * 12;


        productFind.availableUnits -= soldAmount;
        productFind.soldUnits += soldAmount;
        productFind.incomeGenerated += incomeTotal;
        productFind.profitsGenerated += totalProfit;

        await productFind.save({ session });

        const motion = new MovementInventory({
          product: productFind._id,
          movementType: "salida",
          quantity: soldAmount,
          date: date,
        });

        await motion.save({ session });

        let stadistic = await StatisticsSales.findOne({
          lastSale: date,
        }).session(session);

        if (!stadistic) {
          stadistic = new StatisticsSales({ lastSale: date });
        }

        stadistic.quantitySold += soldAmount;
        stadistic.incomeTotal += incomeTotal
        stadistic.totalProfit +=totalProfit
        await stadistic.save({ session });

        inventary.totalInventory -= soldAmount;
        inventary.totalProfit +=totalProfit
        await inventary.save({ session });

        const detailProductSale = {
          product: productFind._id,
          pieceQuantity:pieceQuantity,
          quantityDozens,
          unitPrice,
          dozenPrice,
          discount,
          subTotal: incomeTotal,
          totalProfit,
          totalSoldAmount:soldAmount
        }
        newTicket.details.push(detailProductSale);
      }
      await newTicket.save({ session });
      await session.commitTransaction();
    } catch (error) {
      session.abortTransaction();
      console.log(error);
    } finally {
      session.endSession();
    }
  };

  static getTickets = async () => {
    try {
      const tickets = await Ticket.find();
      return tickets;
    } catch (error) {
      throw new ErrorSales("Error al obtener los tickets", "Error en ventas");
    }
  };

  static getSalesInfo = async () => {
    try {
      const salesInfo = await StatisticsSales.find();
      return salesInfo;
    } catch (error) {
      throw new ErrorSales("Error al obtener la informacion de ventas", "Error en ventas");
    }
  };
}
