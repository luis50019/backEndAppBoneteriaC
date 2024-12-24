import StadisticsSales from "../../Schema/mongoDB/stadisticsSales.js";
import summaryInventorySchema from "../../Schema/mongoDB/summaryInventory.schema.js";
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
      const dataStadisctic = await StadisticsSales.find();
			for(let stadidisctic of dataStadisctic){
				const date = new Date(stadidisctic.lastSale);
				const day = date.getUTCDay();
				const dataSpecific = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
				
				stadiscticSales.labels.push(dayOfWeek[day]+" "+dataSpecific);
				stadiscticSales.datasets[0].data.push(stadidisctic.incomeTotal);
			}
			return stadiscticSales;
    } catch (error) {
      console.log(error);
    }
  }

	static async getInfoInventary(){
		try{
			const infoInvenrary = await summaryInventorySchema.find();
			return infoInvenrary

		}catch(e){
			console.log(e);
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
