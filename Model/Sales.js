import { ErrorSales } from "../Error/error.js";
import { getConnection } from "./db.js";
import { Queries } from "./Querys.js";

export class ModelSales{
  static newSale = async (typeSale, total, products) => {
    let connection;
    try {
      //primero crear un nuevo ticker y obtener el id
      connection = await getConnection();
      await connection.beginTransaction();
      //insert new ticket
      const [newTicket] = await connection.query(
        `INSERT INTO Ticket (tipo_venta,total)
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

        let amountSold = pieceQuantity + quantityDozens * 12;

        //create a new ticket
        const [detallesTicket] = await connection.query(
          `INSERT INTO 
          detalles_ticket (
            ticket_id,cantidad_pieza,cantidad_docena,producto_id,precio_pieza,precio_docena,descuento
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
          `INSERT INTO SubtotalDetallesTicket(detalle_id,sub_total)
          VALUES(?,?)`,
          [detallesTicket.insertId, total]
        );
        //update from products available
        await connection.query(
          `UPDATE Productos 
          SET unidades_disponibles = unidades_disponibles - ?,
          unidades_vendidas = unidades_vendidas + ?
          WHERE  id_producto = UUID_TO_BIN(?)`,
          [amountSold, amountSold, productId]
        );
        //registrar moviminetos del inventario
        await connection.query(
          `INSERT MovimientosInventario (producto_id,tipo_movimiento,cantidad)
          VALUES(UUID_TO_BIN(?),?,?);`,
          [productId, "salida", amountSold]
        );

        //falta cambiar el registro de los datos del inventario
        //modificar estadisticas de ventas
        const [statistics] = await connection.query(
          `SELECT BIN_TO_UUID(id_producto) FROM EstadisticasVentas 
          WHERE BIN_TO_UUID(id_producto) = ? AND ultima_venta = CURRENT_TIMESTAMP `,
          [productId]
        );
        let idStatisticSales = 0;

        if (statistics.lenght > 0) {
          //si existe ya una venta ese mismo dia y el mismo producto
          //actualzamos los valores que ya contiene
          idStatisticSales = statistics[0].id;
          await connection.query(
            `UPDATE EstadisticasVentas
            SET ultima_venta = CURRENT_TIMESTAMP WHERE id_producto = ?`,
            [productId]
          );
        } else {
          idStatisticSales = await Queries.getUuID();
          await connection.query(
            `INSERT INTO EstadisticasVentas(id_estadistica_venta,id_producto,ultima_venta)
            VALUES(UUID_TO_BIN(?),UUID_TO_BIN(?),CURRENT_TIMESTAMP)`,
            [idStatisticSales, productId]
          );
        }

        const [totalStadistic] = await connection.query(
          `SELECT cantidad_Vendida FROM TotalesEstadisticasVentas
          WHERE BIN_TO_UUID(id_estadistica) = ? `,
          [idStatisticSales]
        );

        //si existe debemos de actualizar el valor si no existe lo creamos
        if (!totalStadistic.length) {
          await connection.query(
            `INSERT INTO TotalesEstadisticasVentas (id_estadistica,cantidad_Vendida,ingreso_total,ganancia_total)
            VALUES(UUID_TO_BIN(?),?,?,?)`,
            [idStatisticSales, amountSold, total, totalProfit]
          );
        } else {
          await connection.query(
            `UPDATE TotalesEstadisticasVentas 
            SET cantidad_Vendida = cantidad_Vendida + ?,
            ingreso_total = ingreso_total + ?,
            ganancia_total = ganancia_total + ?`,
            [amountSold, total, totalProfit]
          );
        }


        //rellenamos la tabla de EstadisticasDiarias
        const [dailyStatistics] = await connection.query(
          `SELECT id_estadistica FROM EstadisticasDiarias
          WHERE fecha = CURRENT_TIMESTAMP `
        );
        if(!dailyStatistics.length){
          await connection.query(
            `INSERT INTO EstadisticasDiarias(fecha,ingreso_total,ganancia_total)
            VALUES(CURRENT_TIMESTAMP,?,?)
            `,[total,totalProfit]
          );
        }else{
          await connection.query(
            `UPDATE EstadisticasDiarias 
            SET ingreso_total = ingreso_total + ?,
            ganancia_total = ganancia_total + ?`,
            [total,totalProfit]
          )
        }


        await connection.query(
          `UPDATE ResumenInventario
          SET fecha = CURRENT_TIMESTAMP, 
          total_inventario = total_inventario - ?,
          ganancia_total =  ganancia_total + ?
          WHERE id_resumen = 1`,
          [amountSold, totalProfit]
        );
      }
      await connection.commit();
      return idTicekt;
    } catch (error) {
      await connection.rollback();
      throw new ErrorSales("hubo un error durante transaccion de la venta", "Error Transaction");
    }
  };  
}