import mongoose from "mongoose";
import { ErrorSales } from "../../Error/error.js";

import Product from "../../Schema/mongoDB/product.schema.js";
import MovementInventory from "../../Schema/mongoDB/movementInventory.schema.js";
import StatisticsSales from "../../Schema/mongoDB/stadisticsSales.js";
import Ticket from "../../Schema/mongoDB/ticket.schema.js";
import summaryInventorySchema from "../../Schema/mongoDB/summaryInventory.schema.js";
import movementInventorySchema from "../../Schema/mongoDB/movementInventory.schema.js";

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
        const lastTicket = await Ticket.findOne({}).sort({ _id: -1 });
        const nextTicket = lastTicket ? lastTicket.ticketNumber +1:1;
        newTicket = new Ticket({
          typeSale,
          ticketNumber:nextTicket,
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
          size: productFind.garment.size,
          targetGender: productFind.garment.intendedGender,
          totalSoldAmount:soldAmount
        }

        //register this movement in the schema movementInventory
        console.log("producto vendidos: ",productFind._id)
        const movement = new movementInventorySchema({
          product: productFind._id,
          movementType: "salida",
          quantity: soldAmount,
          dateSale: date,
        })
        await movement.save({session});

        newTicket.details.push(detailProductSale);
      }
      await newTicket.save({ session });
      await session.commitTransaction();
    } catch (error) {
      console.log(error);
      session.abortTransaction();
    } finally {
      session.endSession();
    }
  };

  static getTickets = async () => {
    try {
      const tickets = await Ticket.find({},{_id:1,total:1,typeSale:1,saleDate:1,ticketNumber:1});
      return tickets;
    } catch (error) {
      throw new ErrorSales("Error al obtener los tickets", "Error en ventas");
    }
  };

  static getTicketById = async (id) => {
    try {
      const ticket = await Ticket.findById(id)
      .populate("details.product","productName _id")
      .populate("details.size","size _id")
      .populate("details.targetGender","gender _id");

      return ticket;
    } catch (error) {
      throw new ErrorSales("Error al obtener el ticket", "Error en ventas");
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
