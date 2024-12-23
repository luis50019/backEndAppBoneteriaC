import StatisticsSales from "../../Schema/mongoDB/statisticsSales.js";
const dayOfWeek = ["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"];

export default class ModelStadistic {
  static async getTotalSales() {
		const stadiscticSales = {
			labels:[],
			datasets:[
				{
					data:[],
					backgroundColor:["rgb(247,140,148)"],
					borderColor:["rgb(247,140,148)"],
					borderWidth:5,
				}
			]
		}
    try {
      const dataStadisctic = await StatisticsSales.find();
			for(let stadidisctic of dataStadisctic){
				const date = new Date(stadidisctic.lastSale);
				const day = date.getUTCDay();
				const dataSpecific = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
				
				stadiscticSales.labels.push(dayOfWeek[day]+" "+dataSpecific);
				stadiscticSales.datasets[0].data.push(stadidisctic.totalProfit);
			}
			return stadiscticSales;
    } catch (error) {
      console.log(error);
    }
  }
}
/*
export const barData = {
    labels : ["Lunes","Martes","Miercoles","Jueves","Viernes"],
    datasets :[
      {
        data:[1200,500,400,300,800],
        backgroundColor:["rgb(247,140,148)"],
        borderColor:["rgb(247,140,148)"],
        borderWidth:5,
      }
    ]
  }
		TRANSFORMAS LA FECHA EN UN FORMATO CLARO
		stadisctic.map(value=>{
        const date = new Date(value.Fecha);
        const day =date.getUTCDay();
        formtStadisctic.labels.push(dayOFWeek[day]);
        formtStadisctic.datasets[0].data.push(value.Ingresos)
      })
*/
