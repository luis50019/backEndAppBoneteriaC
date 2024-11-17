import { ErrorSales, ErrorTransaction, incorrectAmounts } from "../Error/error.js";
import { getConnection } from "./db.js";
import { Queries } from "./Querys.js";

export class ModelSales{

  static getTickets = async ()=>{
    let connection;
    try {
      connection = await getConnection();

      const [tickets] = await connection.query(
        `SELECT * FROM Ticket`
      );

      return tickets
    } catch (error) {
      console.log(error);
    }
  }

  static newSale = async (typeSale, total, products) => {
    let connection;
    try {
      //primero crear un nuevo ticker y obtener el id
      const messagesErrors = new Array();
      connection = await getConnection();

      for(const product of products){
        const {pieceQuantity,quantityDozens, productId} = product;
        let quantitySold = pieceQuantity + quantityDozens * 12;

        const [[infoProduct]] = await connection.query(
          `SELECT availableUnits,productName FROM Products
          WHERE BIN_TO_UUID(id_product) = ?`,
          [productId]
        ); 

        if(infoProduct.availableUnits < quantitySold){
          messagesErrors.push({error:"cantidad no valida",productName:infoProduct.productName});
          continue;
        }
      }

      if(messagesErrors.length > 0){
        throw new incorrectAmounts("Error en las cantidadades",messagesErrors,"Error of Quantity Sold");
      }

      await connection.beginTransaction();
      //insert new ticket
      const [newTicket] = await connection.query(
        `INSERT INTO Ticket (typeSale,total)
        VALUES(?,?)`,
        [typeSale, total]
      );
      const idTicekt = newTicket.insertId;
      //insert info ticket
      for (const product of products) {
        const {
          pieceQuantity,
          quantityDozens,
          productId,
          total,
          unitPrice,
          dozenPrice,
          discount,
          purchasePrice,
        } = product;
        let totalProfit =
          (unitPrice - purchasePrice) * pieceQuantity + // Ganancia por unidades sueltas
          (dozenPrice - purchasePrice * 12) * quantityDozens; // Ganancia por docenas

        let quantitySold = pieceQuantity + quantityDozens * 12;
        //validation of available units 

        //create a new ticket
        const [detallesTicket] = await connection.query(
          `INSERT INTO 
          ticketDetails (
            ticket_id,pieceQuantity,quantityDozens,product_id,unitPrice,dozenPrice,discount
          )
          VALUES(?,?,?,UUID_TO_BIN(?),?,?,?)`,
          [
            idTicekt,
            pieceQuantity,
            quantityDozens,
            productId,
            unitPrice,
            dozenPrice,
            discount,
          ]
        );

        //insert information about ticket
        await connection.query(
          `INSERT INTO SubtotalDetailsTicket(detail_id,subTotal)
          VALUES(?,?)`,
          [detallesTicket.insertId, total]
        );
        //update from products available
        await connection.query(
          `UPDATE Products 
          SET availableUnits = availableUnits - ?,
          soldUnits = soldUnits + ?
          WHERE  BIN_TO_UUID(id_product) = ?`,
          [quantitySold, quantitySold, productId]
        );
        //registrar moviminetos del inventario
        await connection.query(
          `INSERT MovementsInventory (product_id,movementType,quantity)
          VALUES(UUID_TO_BIN(?),?,?);`,
          [productId, "salida", quantitySold]
        );

        //falta cambiar el registro de los datos del inventario
        //modificar estadisticas de ventas
        const [statistics] = await connection.query(
          `SELECT BIN_TO_UUID(id_product) FROM StatisticsSales 
          WHERE BIN_TO_UUID(id_product) = ? AND lastSale = CURRENT_TIMESTAMP `,
          [productId]
        );
        let idStatisticSales = 0;

        if (statistics.lenght > 0) {
          //si existe ya una venta ese mismo dia y el mismo producto
          //actualzamos los valores que ya contiene
          idStatisticSales = statistics[0].id;
          await connection.query(
            `UPDATE StatisticsSales
            SET lastSale = CURRENT_TIMESTAMP WHERE id_producto = ?`,
            [productId]
          );
        } else {
          idStatisticSales = await Queries.getUuID();
          await connection.query(
            `INSERT INTO StatisticsSales(sales_statistics_id,id_product,lastSale)
            VALUES(UUID_TO_BIN(?),UUID_TO_BIN(?),CURRENT_TIMESTAMP)`,
            [idStatisticSales, productId]
          );
        }

        const [totalStadistic] = await connection.query(
          `SELECT quantitySold FROM TotalsStatisticsSales
          WHERE BIN_TO_UUID(id_statistics) = ? `,
          [idStatisticSales]
        );

        //si existe debemos de actualizar el valor si no existe lo creamos
        if (!totalStadistic.length) {
          await connection.query(
            `INSERT INTO TotalsStatisticsSales (id_statistics,quantitySold,incomeTotal,totalProfit)
            VALUES(UUID_TO_BIN(?),?,?,?)`,
            [idStatisticSales, quantitySold, total, totalProfit]
          );
        } else {
          await connection.query(
            `UPDATE TotalsStatisticsSales 
            SET quantitySold = quantitySold + ?,
            incomeTotal = incomeTotal + ?,
            totalProfit = totalProfit + ?
            WHERE BIN_TO_UUID(id_estadistica) = ?`,
            [quantitySold, total, totalProfit, idStatisticSales]
          );
        }

        //rellenamos la tabla de EstadisticasDiarias
        const [dailyStatistics] = await connection.query(
          `SELECT id_statistics FROM DailyStatistics
          WHERE dateStatistics = CURRENT_TIMESTAMP `
        );
        if(!dailyStatistics.length){
          await connection.query(
            `INSERT INTO DailyStatistics(dateStatistics,totalIncome,totalProfit)
            VALUES(CURRENT_TIMESTAMP,?,?)
            `,
            [total, totalProfit]
          );
        }else{
          await connection.query(
            `UPDATE DailyStatistics 
            SET totalIncome = totalIncome + ?,
            totalProfit = totalProfit + ?
            WHERE dateStatistics = CURRENT_TIMESTAMP`,
            [total, totalProfit]
          );
        }


        await connection.query(
          `UPDATE SummaryInventory
          SET lastFecha = CURRENT_TIMESTAMP, 
          totalInventory = totalInventory - ?,
          totalProfit =  totalProfit + ?
          WHERE summary_id = 1`,
          [quantitySold, totalProfit]
        );
      }
      await connection.commit(1);
      await connection.end();
      return {id:idTicekt,message:messagesErrors};

    } catch (error) {
      console.log(error);
      await connection.rollback();
      await connection.end();
      if(error instanceof incorrectAmounts){
        throw new incorrectAmounts(
          error.message,
          error.incorrects,
          error.name
        );
      }
      throw new ErrorTransaction("Error durante la transaccion","Erro de venta");

    }
  };  
}