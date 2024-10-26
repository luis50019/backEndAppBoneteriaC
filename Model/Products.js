import { Queries } from "./Querys.js";
import { getConnection } from "./db.js";
import {
  ErrorConnection,
  ErrorQueries,
  ErrorProducts,
} from "../Error/error.js";

const fieldValidates = [
  "precio_pieza",
  "precio_docena",
  "descuento",
  "precio_compra",
  "unidades_disponibles",
];

export class modelProducts {
  static getAll = async () => {
    //por el momento lo ocuparemos para poder obtener la info
    let connection;
    try {
      connection = await getConnection();
      const [producto] = await connection.query(
        `SELECT BIN_TO_UUID(id_producto),nombre_producto,decrypt_data(precio_pieza),decrypt_data(precio_docena),descuento,decrypt_data(precio_compra),unidades_disponibles
        FROM Productos`
      );

      // const [producto] = await connection.query(
      //   `SELECT * FROM Productos`
      // )
      // const [producto] = await connection.query(`SELECT * FROM Ticket`);

      // const [producto] = await connection.query(
      //   `SELECT * FROM EstadisticasVentas`
      // );

      // const [producto] = await connection.query(
      //   `SELECT * FROM TotalesEstadisticasVentas`
      // );

      // const [producto] = await connection.query(
      //   `SELECT * FROM EstadisticasDiarias`
      // );

      // const [producto] = await connection.query(
      //   `SELECT * FROM ResumenInventario`
      // );

      // const [producto] = await connection.query(
      //   `SELECT * FROM CostoInventario`
      // );

      // const [producto] = await connection.query(
      //   `SELECT * FROM MovimientosInventario`
      // );

      // const [producto] = await connection.query(
      //   `SELECT * FROM detalles_ticket`
      // );

      // const [producto] = await connection.query(`SELECT * FROM Ticket`);

      return producto;
    } catch (error) {
      await connection.rollback();
      console.log(error);
    }
  };

  static getProduct = async (id)=>{
    try {
      const connection = await getConnection();
      //Tablas que ocupo
      //Productos
      //categoriasProducts
      //tipoDeProductos
      // ---------- para ropa
      //prendaRopa
      //edadDestinada
      //tipoPrenda
      // --------- para otros
      //tiposMaterial
      //Descripcion
      //otrosProductos
      //

      const [product] = await connection.query(
        `SELECT BIN_TO_UUID(id_producto),esSegundaMano,tipo_producto,
        nombre_producto,url_img,nombre_producto,decrypt_data(precio_pieza) as precio_pieza,
        decrypt_data(precio_docena) as precio_docena,descuento,decrypt_data(precio_compra) as precio_compra,
        unidades_disponibles,unidades_vendidas
        FROM Productos
        INNER JOIN categoriasProductos ON  Productos.categoria = categoriasProductos.id
        WHERE BIN_TO_UUID(Productos.id_producto) = ?`,
        [id]
      );
      //

      return product
    } catch (error) {
      console.log(error);
    }
  }

  static editProduct = async (product) => {
    let connection;
    try {
      const {value,field,id,} = product;
      connection = await getConnection();
      //validate if exists field
      if(!fieldValidates.includes(field)){
        throw new Error("Field not exists");
      }

      await connection.beginTransaction();
      if (field === "unidades_disponibles") {
        await connection.query(
          `UPDATE Productos
          SET unidades_disponibles = unidades_disponibles + ? WHERE BIN_TO_UUID(id_producto) = ?`,
          [value, id]
        );
        // encrypt_data(?);
        // decrypt_data(precio_docena);
      } else {
        await connection.query(
          `UPDATE Productos
        SET ${field} = encrypt_data(?) WHERE BIN_TO_UUID(id_producto) = ?`,
          [value, id]
        );
      }
      await connection.commit();
      return  {"state":"succesful!"}
    } catch (error) {
      await connection.rollback()
      if(error instanceof ErrorConnection){
        throw new ErrorConnection("Error de conexion","Error connection");
      }
      throw new ErrorProducts(error.message,"Error edit product");
    }
  };

  static createProduct = async (product) => {
    const {
      productType,
      isSecondHand,
      category,
      productName,
      imageUrl,
      purchasePrice,
      unitPrice,
      dozenPrice,
      discount,
      availableUnits,
      unitsSold,
      totalInventoryCost,
    } = product;
    let  connection;
    try {
      //first get all id need
      connection = await getConnection();

      await connection.beginTransaction();
      const [uuid, idCategory, idTypeProduct] = await Promise.all([
        Queries.getUuID(),
        Queries.getCategory(category),
        Queries.getTypeProduct(productType),
      ]);

      // create new product
      await connection.query(
        `INSERT INTO Productos (
        id_producto,esSegundaMano,categoria,tipo_producto,nombre_producto,url_img,
        precio_compra,precio_pieza,precio_docena,descuento,unidades_disponibles,unidades_vendidas
      )
      VALUES (UUID_TO_BIN(?),?, ?, ?, ?,?, encrypt_data(?), encrypt_data(?), encrypt_data(?), ?, ?, ?)`,
        [
          uuid,
          isSecondHand,
          idCategory,
          idTypeProduct,
          productName,
          imageUrl,
          purchasePrice,
          unitPrice,
          dozenPrice,
          discount,
          availableUnits,
          unitsSold,
        ]
      );
      await connection.query(
        `INSERT INTO CostoInventario (id_producto,costo_total_inventario)
        VALUES (UUID_TO_BIN(?),?) `,
        [uuid, totalInventoryCost]
      );

      if (idCategory == 1) {
        // await this.insertClothing(uuid, product);
        const {
          clothingType,
          targetAge,
          size,
          targetGender,
          minimumAge,
          maximumAge,
        } = product;
        const idClothingType = await Queries.getClothingType(clothingType);
        const idTargetAge = await Queries.getTargetAge({
          targetAge,
          minimumAge,
          maximumAge,
        });
        const idSize = await Queries.getSize(size);
        await connection.query(
          `INSERT INTO prendasRopa (id_prenda,genero_destinado,tipo_prenda,edad_destinada,talla)
        VALUES(UUID_TO_BIN(?),?,?,?,?)`,
          [uuid, targetGender, idClothingType, idTargetAge, idSize]
        );
      }
      if (idCategory == 2) {
        const { material, description } = product;

        //insert of description of product

        const [idDescription] = await connection.query(
          `INSERT INTO Descripcion(descripcion)
          VALUES(?)`,
          [description]
        );
        const idMaterial = await Queries.getMaterial(material);
        const [materialInsert] = await connection.query(
          `INSERT INTO OtrosProductos (id_producto,material,descripcion)
        VALUES (UUID_TO_BIN(?),?,?)`,
          [uuid, idMaterial, idDescription.insertId]
        );
      }

      // modificamos el resumen del inventario
      await connection.query(
        `UPDATE ResumenInventario
        SET fecha = CURRENT_TIMESTAMP, 
        total_inventario = total_inventario + ?,
        valor_total_inventario = valor_total_inventario + ?
        WHERE id_resumen = 1`,
        [availableUnits, totalInventoryCost]
      );
      await connection.commit();

      return { succes: true, message: "succesful" };
    } catch (error) {
      await connection.rollback();
      if (error instanceof ErrorConnection) {
        throw new ErrorProducts(error.message, error.name);
      }
      if (
        error instanceof ErrorProducts ||
        error instanceof ErrorQueries
      ) {
        throw new ErrorProducts(error.message, error.name);
      } else {
        throw new ErrorProducts(
          "Error al insertar el producto",
          "Error create Producto"
        );
      }
    }
  };
}
