import { getConnection } from "./db.js";
const dayOFWeek = ["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"];

export class ModelStadistic{
  static getTotalSales = async()=>{
    let connection;
  
    try {
      connection = await getConnection(); 
      connection.beginTransaction();
     
      const  [stadisctic] = await connection.query(`
        SELECT DATE (dateStatistics) AS 'Fecha',
        SUM(totalIncome) AS 'Ingresos'
        
        FROM
          DailyStatistics
        GROUP BY 
          DATE(dateStatistics)
        ORDER BY
          DATE(dateStatistics) ASC
        `);
        if (!stadisctic || stadisctic.length === 0) {
          return { labels: [], datasets: [{ data: [] }] }; // Retorna un objeto vacío si no hay datos
        }
      const formtStadisctic = {
        labels :[],
        datasets :[
          {
            data:[]
          }
        ]
      }
      connection.commit();

      stadisctic.map(value=>{
        const date = new Date(value.Fecha);
        const day =date.getUTCDay();
        formtStadisctic.labels.push(dayOFWeek[day]);
        formtStadisctic.datasets[0].data.push(value.Ingresos)
      })
      
      return formtStadisctic;

    } catch (error) {
      if (connection) {
        connection.rollback();
      }
      console.log(error.message);
    }
  }

}