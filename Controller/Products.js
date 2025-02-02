import { ErrorProducts, ErrorQueries, Validation } from "../Error/error.js";
import { ModelProducts } from "../Model/mongoDB/Products.js";
import {
  validateItemOfClothing,
  validateNewInfo,
  validateNewProducts,
  validateOtherProducts,
} from "../Schema/products.js";

export class productsController {
  
  static getAllProducts = async (req, res) => {
    try {
      const products =await ModelProducts.getAllProducts()
      res.status(201).json(products);
    } catch (e) {
      console.log(e);
    }
  };

  static getAllCategories = async (req, res) => {
    try {
      const categories = await ModelProducts.getAllCategories();
      res.status(201).json(categories);
    } catch (e) {
      res.status(406).json("ddwdd"+e);
    }

  }
  
  static getAllSizeByCategory=async(req,res)=>{
    try {
      const {category} = req.params;
      console.log(category)
      const size = await ModelProducts.getAllSizeByCategories(category);
      res.status(201).json(size);
    } catch (error) {
      console.log("deudeduh7dsude7f: "+e);
    }
  }

  static getTopProduct = async (req, res) => {
    try {
      const topProducts = await ModelProducts.getTopProducts();
      res.status(201).json(topProducts);
    } catch (e) {
      console.log(e);
    }
  };

  static getProductsAboutToEnd = async (req, res) => {
    try {
      const products = await ModelProducts.getProductsAboutToEnd();
      res.status(201).json(products);
    } catch (e) {
      console.log(e);
    }

  }

  static getProductById = async(req,res)=>{
    try {
      const {id} = req.params;
      console.log(id)
      const infoProduct = await ModelProducts.getProductsById(id);
      res.status(200).json(infoProduct)
    } catch (error) {
      console.log(error);
    }
  }

  static editProduct = async(req,res)=>{
    try {
      //recibo el id, el atributo que va a cambiar
      const resultValidate = validateNewInfo(req.body);

      if(!resultValidate.success){
        throw new Validation("Error de validacion de la nueva informacion",resultValidate);
      }

      const resultEdit = await ModelProducts.editProduct(req.body);
      res.status(202).json(resultEdit);
      
    } catch (error) {
      if(error instanceof Validation){
        res.status(406).json(error.message);
      }
      if(error instanceof ErrorProducts){
        res.status(406).json(error.message)
      }
    }
  }

  static createProduct = async (req, res) => {
    try {
      const { category } = req.body;
      
      // Validación inicial
      const resultNewProduct = validateNewProducts(req.body);
      if (!resultNewProduct.success) {
        console.log(req.body)
        throw new Validation("Error de validación del Producto", resultNewProduct.error.errors[0],path);
      }
  
      // Si todas las validaciones pasan, crea el producto
      const product = await ModelProducts.createProduct(req.body);
      res.status(201).json(product);
  
    } catch (error) {
      console.log("Ocurrió un problema", error);
      if (error instanceof Validation) {
        res.status(406).json({ message: error.message, errors: error.errors });
      } else if (error instanceof ErrorProducts || error instanceof ErrorQueries) {
        res.status(406).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Error interno del servidor" });
      }
    }
  };

  /*static createProduct = async (req, res) => {
    try {
      const {category} = req.body
      const resultNewProduct = validateNewProducts(req.body);
      if(!resultNewProduct.success){
        throw new Validation("Error of validation Producto", resultNewProduct.error.errors)
      }
      let result = {}
      if(category == "ropa"){
        result = validateItemOfClothing(req.body)
      }
      if(category == "otros"){
        result = validateOtherProducts(req.body)
      }
      
      if(!result.success){
        throw new Validation("Error of validation item cloathing", result.error.errors);
      }

      const product = await ModelProducts.createProduct(req.body)
      res.status(201).json(product)

    } catch (error) {
      console.log("Ocurrio un problemon",error);
      if(error instanceof Validation){
        res.status(406).json(error.message)
      }
      if(error instanceof ErrorProducts){
        res.status(406).json(error.message)
      }
      if(error instanceof ErrorQueries){
        res.status(406).json(error.message)
      }
      
    }
  };
  */
}
