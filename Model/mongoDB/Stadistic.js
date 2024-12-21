import StatisticsSales from "../../Schema/mongoDB/statisticsSales.js";

export default class ModelStadistic{
    static async getTotalSales(){
        try {
            const stadisctic = await StatisticsSales.find();
            return stadisctic;
        } catch (error) {
            console.log(error)
        }
    }

}