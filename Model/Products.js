import { Queries } from "./Querys.js";
import { getConnection } from "./db.js";
import {
  ErrorConnection,
  ErrorQueries,
  ErrorProducts,
} from "../Error/error.js";

const fieldValidates = [
  "unitPrice",
  "dozenPrice",
  "discount",
  "purchasePrice",
  "availableUnits",
];

const functiosGetProduct = {
  "otros": async (productId) => {
    try {
      const connection = await getConnection();
      const [[extraInfo]] = await connection.query(
        `SELECT typesMaterial.material,descriptionProduct.descriptionProduct
          FROM OtherProducts 
          INNER JOIN typesMaterial ON typesMaterial.id = OtherProducts.material
          INNER JOIN descriptionProduct ON descriptionProduct.id = OtherProducts.descriptionProduct
          WHERE BIN_TO_UUID(OtherProducts.id_product)= ?`,
          [productId]
      ); 

      return extraInfo;
    } catch (error) {
      throw new Error("Error al obtener la informacion extra");
    }
  },
  "ropa": async (productId)=>{
    try {
      const connection = await getConnection();
      const [[extraInfo]] = await connection.query(
        `SELECT sizesClothing.size,desiredAge.desiredAge,desiredAge.minimumAge,
        desiredAge.maximumAge,
        typeClothing.typeclothing, garments.intendedGender FROM garments
        INNER JOIN sizesClothing ON sizesClothing.id = garments.size
        INNER JOIN desiredAge ON desiredAge.id = garments.desired_age
        INNER JOIN typeClothing ON typeclothing.id = garments.type_clothing
        WHERE BIN_TO_UUID(garments.id_clothing) = ?`,
        [productId]
      );

      return extraInfo;
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener la informacion extra");
    }
  }
}

export class modelProducts {
  static getAll = async () => {
    let connection;
    try {
      connection = await getConnection();
      const [producto] = await connection.query(
        `SELECT BIN_TO_UUID(id_product),productName,decrypt_data(unitPrice),
        decrypt_data(dozenPrice),discount,decrypt_data(purchasePrice),
        availableUnits,soldUnits
        FROM Products`
      );

      return producto;
    } catch (error) {
      await connection.rollback();
      console.log(error);
    }
  };

  static getProduct = async (id)=>{
    try {
      const connection = await getConnection();
      //obtenemos la informacion
      const [[infoBasic]] = await connection.query(
        `SELECT BIN_TO_UUID(id_product) AS id_product,isSecondHand,
        productName,decrypt_data(unitPrice) as unitPrice,
        decrypt_data(dozenPrice) as dozenPrice,discount,decrypt_data(purchasePrice) as purchasePrice,
        soldUnits,availableUnits,categoriesProducts.category,typeProducts.typeProduct
        FROM Products
        INNER JOIN categoriesProducts ON  Products.category = categoriesProducts.id
        INNER JOIN typeProducts ON Products.typeProduct = typeProducts.id
        WHERE BIN_TO_UUID(Products.id_product) = ?`,
        [id]
      );
      const [images] = await connection.query(
        `SELECT url FROM Images 
        WHERE BIN_TO_UUID(id_product) = ?`,[id]
      )
      
      const extraInfo = await functiosGetProduct[infoBasic.category](id);


      return {infoBasic:{...infoBasic}, extra: {...extraInfo}, images:images};
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
          `UPDATE Products
          SET availableUnits = availableUnits + ? WHERE BIN_TO_UUID(id_product) = ?`,
          [value, id]
        );

      } else {
        await connection.query(
          `UPDATE Products
        SET ${field} = encrypt_data(?) WHERE BIN_TO_UUID(id_product) = ?`,
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
      soldUnits,
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
        `INSERT INTO Products (
        id_product,isSecondHand,category,typeProduct,productName,
        purchasePrice,unitPrice,dozenPrice,discount,availableUnits,soldUnits
      )
      VALUES (UUID_TO_BIN(?),?, ?, ?,?, encrypt_data(?), encrypt_data(?), encrypt_data(?), ?, ?, ?)`,
        [
          uuid,
          isSecondHand,
          idCategory,
          idTypeProduct,
          productName,
          purchasePrice,
          unitPrice,
          dozenPrice,
          discount,
          availableUnits,
          soldUnits,
        ]
      );

      imageUrl.map(url =>{
        connection.query(
          `INSERT INTO Images (id_product,url)
          VALUES(UUID_TO_BIN(?),?)`,[uuid,url]
        )
      })

      await connection.query(
        `INSERT INTO inventoryCost (id_product,totalInventoryCost)
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
          `INSERT INTO garments (id_clothing,intendedGender,type_clothing,desired_age,size)
        VALUES(UUID_TO_BIN(?),?,?,?,?)`,
          [uuid, targetGender, idClothingType, idTargetAge, idSize]
        );
      }
      if (idCategory == 2) {
        const { material, descriptionProduct } = product;

        //insert of description of product

        const [idDescription] = await connection.query(
          `INSERT INTO descriptionProduct(descriptionProduct)
          VALUES(?)`,
          [descriptionProduct]
        );
        const idMaterial = await Queries.getMaterial(material);
        const [materialInsert] = await connection.query(
          `INSERT INTO OtherProducts (id_product,material,descriptionProduct)
        VALUES (UUID_TO_BIN(?),?,?)`,
          [uuid, idMaterial, idDescription.insertId]
        );
      }

      // modificamos el resumen del inventario
      await connection.query(
        `UPDATE SummaryInventory
        SET lastFecha = CURRENT_TIMESTAMP, 
        totalInventory = totalInventory + ?,
        TotalInventoryValue = TotalInventoryValue + ?
        WHERE summary_id = 1`,
        [availableUnits, totalInventoryCost]
      );
      await connection.commit();

      return { succes: true, message: "succesful" };
    } catch (error) {
      await connection.rollback();
      console.log(error);
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
