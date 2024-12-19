import mongoose from 'mongoose';
import { ErrorSales } from '../../Error/error.js';

import Product from '../../Schema/mongoDB/product.schema.js';
import MovementInventory from '../../Schema/mongoDB/movementInventory.schema.js';
import StatisticsSales from '../../Schema/mongoDB/statisticsSales.schema.js';
import ticketSchema from '../../Schema/mongoDB/ticket.schema.js';


export class ModelSales{
  static newSale =async(saleData)=>{
    let session;
    try {
      session = await mongoose.startSession();
      session.startTransaction()

      // primero generar el ticket
      const {typeSale,total,products} = saleData;
      
      let newTicket = await ticketSchema.find({saleDate:products[0].date});

      if(!newTicket){
        newTicket = new Ticket({
          typeSale,
          total,
          details:[],
          saleData:products[0].date
        })
      }

      for(const product of products){
        const {
          pieceQuantity,
          quantityDozens,
          productId,
          total: subtotal,
          unitPrice,
          dozenPrice,
          discount,
          purchasePrice,
          date
        } = product;

        const saleProduct = await Product.findById(productId).session(session);
        if(!saleProduct){
          throw new ErrorSales("producto no encontrado","Error en ventas")
        }
        const soldAmount =pieceQuantity + (quantityDozens*12);
        saleProduct.availableUnits -= soldAmount;
        saleProduct.soldUnits += soldAmount;
        
        await saleProduct.save({session});

        const motion = new MovementInventory({
          product: saleProduct._id,
          movementType: 'salida',
          quantity:soldAmount,
          date:date
        })

        await motion.save({session});

        let stadistic = await StatisticsSales.findOne({lastSale: date}).session(session);

        if(!stadistic){
          stadistic = new StatisticsSales({lastSale:date})
        }

        stadistic.quantitySold += soldAmount;
        stadistic.incomeTotal += subtotal;
        stadistic.totalProfit += subtotal -(purchasePrice * soldAmount);

        
      }
      
      await stadistic.save({session});

      await newTicket.save({session});
      await session.commitTransaction();

    } catch (error) { 
      session.abortTransaction()
    }finally{
      session.endSession()
    }
  }
}

// {
//   "typeSale":"Oficial",
//   "total":9700,
//   "products":[
//      {
//        "pieceQuantity":2,
//        "quantityDozens":0,
//        "productId":"27bf6a89-86bd-11ef-aeaa-809133f30242",
//        "total":800,
//        "unitPrice":400,
//        "dozenPrice":4800,
//        "discount":15,
//        "purchasePrice":200,
//        "date": "2024-10-03"
//      },
//      {
//        "pieceQuantity":2,
//        "quantityDozens":2,
//        "productId":"445bcb35-81e2-11ef-a677-809133f30242",
//        "total":5900,
//        "unitPrice":250,
//        "dozenPrice":2700,
//        "discount":5,
//        "purchasePrice":100,
//        "date": "2024-10-03"
//      },
//      {
//        "pieceQuantity":10,
//        "quantityDozens":0,
//        "productId":"0cc44d94-86bd-11ef-aeaa-809133f30242",
//        "total":3000,
//        "unitPrice":300,
//        "dozenPrice":3000,
//        "discount":1,
//        "purchasePrice":100,
//        "date": "2024-10-03"
//      }
//     ]
//  }
 

