import { ErrorSales, ErrorTransaction, incorrectAmounts, Validation} from '../Error/error.js';
import { ModelSales } from '../Model/mongoDB/Sales.js';
import {validateSaleHeader, validateProductsSale} from '../Schema/sales.js'

export class ControllerSales {
  static newSale = async (req, res) => {
    try {
      const { typeSale, total, products } = req.body;
      const saleHeader = {"typeSale":typeSale,"total":total};

      const resulValidateSaleHeader = validateSaleHeader(saleHeader);
      const resulProductsSale = validateProductsSale(products);
      
      if(!resulValidateSaleHeader.success){
        throw new Validation("Error validate sale header",resulValidateSaleHeader.error.errors[0].path);
      }
      if(!resulProductsSale.success){
        throw new Validation("Error validate product sale",resulProductsSale.error.errors)
      }

      //validar los datos del json()
      const newSale = await ModelSales.newSale(req.body);
      res.status(202).json({ success: true, ticket: newSale });
    } catch (error) {
      console.log(error);
      if( error instanceof Validation){
        res.status(406).json({error:"Error de valdacion"});
      }
      if(error instanceof ErrorTransaction){
        res.status(409).send({error:"error en el proceso de registro de ventas"});
      }
      if(error instanceof incorrectAmounts){
        res.status(406).json({error:"valores incorrectos"});
      }
    }
  };

  static getTickets = async (req,res)=>{
    try {
      const tickets = await ModelSales.getTickets();
      res.status(200).json(tickets);
    } catch (error) {
      console.log(error);
      res.status(404).json({message:"error fd"});
    }
  }

  static getTicket = async (req,res)=>{
    try {
      const ticket = await ModelSales.getTicketById(req.params.id);
      res.status(200).json(ticket);
    } catch (error) {
      res.status(404).json({message:"error cd"});
    }
  }

  static getSalesInfo = async (req,res)=>{
    try {
      const salesInfo = await ModelSales.getSalesInfo();
      res.status(200).json(salesInfo);
    } catch (error) {
      console.log(error);
      res.status(404).json({message:"error al buscar informacion"});
    }
  }

  static searchSales = async(req,res)=>{
    try {
      const { ticketNumber, saleDate } = req.query;
      let tickets = [];
      if (ticketNumber) {
        tickets = await ModelSales.searchTicketsByNumber(ticketNumber);
      }
      if (saleDate) {
        tickets = await ModelSales.searchTicketsBySaleDate(saleDate);    
      }
      res.status(200).json(tickets);
    } catch (error) {
      console.log(error);
      res.status(500)
    }
  }

}