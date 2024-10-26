import { Validation} from '../Error/error.js';
import { ModelSales } from '../Model/Sales.js';
import {validateSaleHeader, validateProductsSale} from '../Schema/sales.js'

export class ControllerSales {
  static newSale = async (req, res) => {
    try {
      const { typeSale, total, products } = req.body;
      const saleHeader = {"typeSale":typeSale,"total":total};

      const resulValidateSaleHeader = validateSaleHeader(saleHeader);
      const resulProductsSale = validateProductsSale(products);
      
      if(!resulValidateSaleHeader.success){
        throw new Validation("Error validate sale header",resulValidateSaleHeader.error.errors);
      }
      if(!resulProductsSale.success){
        throw new Validation("Error validate product sale",resulProductsSale.error.errors)
      }

      //validar los datos del json()
      const newSale = await ModelSales.newSale(typeSale, total, products);
      res.status(202).json({ success: true, ticket: newSale });
    } catch (error) {
      if( error instanceof Validation){
        res.status(406).json(error.message);
      }
      if(error instanceof ErrorTransaction){
        res.status(409).send(error.message);
      }
    }
  };
}