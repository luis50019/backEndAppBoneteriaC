import { ErrorQueries } from "../Error/error.js";
import { getConnection } from "./db.js";
const idDefault = 1;
export class Queries {

  static getMaterial = async(material)=>{
    try {
      const connection = await getConnection();
      if(!material) return idDefault;

      const [idMaterial] = await connection.query(
        `SELECT id FROM typesMaterial
        WHERE LOWER(material) = ?`,
        [material]
      );
      if(!idMaterial.length){
        const [newMaterial] = await connection.query(
          `INSERT INTO typesMaterial (material)
          VALUES(?)`,
          [material]
        );
        return newMaterial.insertId
      }
      return idMaterial[0].id
    } catch (error) {
      throw new ErrorQueries("Error al obtener el del material","Error getMaterial")
    }
  }
  
  static getDescription = async (id)=>{
    try {
      const connection =  await getConnection();
      const [idDescription] = await connection.query(
        `SELECT id FROM Descripcion
        WHERE id = ?`,[id]
      );
      return idDescription;
    } catch (error) {
      throw new ErrorQueries("Erro al obtener la descripcion","Error getDescription");
    }
  }

  static getSize = async(size)=>{
    try {
      const connection = await getConnection()
      if(!size) return idDefault;
      
      const [idSize] = await connection.query(
        `SELECT id FROM sizesClothing 
        WHERE LOWER(size) = ?`,
        [size]
      );
      if(!idSize.length){
        const [id] = await connection.query(
          `INSERT INTO sizesClothing (size) VALUES (?)`,
          [size]
        );
        return id.insertId
      }
      return idSize[0].id
    } catch (error) {
      throw new ErrorQueries("Error al buscar la talla","Error getSize")
    }
  }

  static getTargetAge = async({targetAge, minimumAge,maximumAge})=>{
    try{
      const connection = await getConnection()
      const [idTargetAge] = await connection.query(
        `SELECT id FROM desiredAge
        WHERE LOWER(desiredAge) = ? OR ( minimumAge = ? OR maximumAge = ?)`,
        [targetAge, minimumAge, maximumAge]
      );
      if(!idTargetAge.length){
        const [id] = await connection.query(
          `INSERT INTO desiredAge (desiredAge,minimumAge,maximumAge) VALUES(?,?,?)`,
          [targetAge, minimumAge, maximumAge]
        );
        return id.insertId
      }
      return idTargetAge[0].id
    }catch(error){
      throw new ErrorQueries("Error al obtener la edad","Error getTargetAge");
    }
  }

  static getClothingType = async (clothingType) => {
    try {
      //first get id clothing
      const connection = await getConnection();
      const [idClothing] = await connection.query(
        `SELECT id FROM typeclothing 
        WHERE LOWER(typeClothing) = ?`,
        [clothingType]
      );
      //if not exist idClothing so create new clothing type
      if (!idClothing.length) {
        const [newIdClothing] = await connection.query(
          `INSERT INTO typeclothing (typeClothing)
          VALUES(?)`,
          [clothingType]
        );
        return newIdClothing.insertId;
      }
      return idClothing[0].id;
    } catch (error) {
      throw new ErrorQueries("Erro al obtener el tipo de prenda","Error getClothingType");
    }
  };

  static getUuID = async () => {
    try {
      const connection = await getConnection();
      const [uuIDResult] = await connection.query(`SELECT UUID() uuid`);
      const [{ uuid }] = uuIDResult;
      return uuid;
    } catch (e) {
      throw new ErrorQueries("Error al obtener un id","Error getUuID")
    }
  };

  static getTypeProduct = async (typeProduct) => {
    try {
      //create new type product
      const connection = await getConnection();
      const lowerTypeProduct = typeProduct.toLowerCase();
      const [type] = await connection.query(
        `SELECT id FROM typeProducts
        WHERE LOWER(typeProduct) = ?`,
        [lowerTypeProduct]
      );
      if (!type.length) {
        const [newTypeProduct] = await connection.query(
          `INSERT INTO typeProducts(typeProduct)
        VALUES (?)`,
          [typeProduct]
        );
        return newTypeProduct.insertId;
      }
      return type[0].id;
    } catch (error) {
      throw new ErrorQueries("Error al obtener el tipo de producto","Error getTypeProduct");
    }
  };
  static getTotalInventary = async (idProduct)=>{
    try {
      const connection = await getConnection();
      const [totalInventary] = await connection.query(`SELECT * FROM CostoInventario`);
      return totalInventary;
    } catch (error) {
        throw new ErrorQueries(
         "Error al obtener el costo total",
         "Error getTotalInventary"
       );
    }
  }

  static getCategory = async (nameCategory) => {
    try {
      const connection = await getConnection();
      const [category] = await connection.query(
        `SELECT id FROM categoriesProducts
        WHERE LOWER(category) = ?`,
        [nameCategory]
      );
      return category[0].id;
    } catch (error) {
      throw new ErrorQueries("Error al obtener las categorias","Error getCategory")
    }
  };
}
