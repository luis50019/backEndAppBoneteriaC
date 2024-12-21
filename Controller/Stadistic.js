import ModelStadistic from '../Model/mongoDB/Stadistic.js';

export class ControllerStadistic{
  static getTotalSales = async (req,res)=>{
    try {
      //get total of sales of a date
      const stadisctic = await ModelStadistic.getTotalSales();

      res.status(200).json(stadisctic);
    } catch (error) {
      console.log(error);
    }
  }
}