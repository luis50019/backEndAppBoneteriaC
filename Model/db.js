import mysql from "mysql2/promise";
import { ErrorConnection } from "../Error/error.js";

export const getConnection = async()=>{
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      port: 3306,
      password: "Luis2010",
      database: "INVENTARIO_BONETERIA",
    });
    await connection.query(
      "SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ; "
    );
    return connection
  } catch (error) {
    throw new ErrorConnection("Error de conexion con la base de datos","Error connection")
  }
}