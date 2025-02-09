import { ErrorProducts, ErrorQueries, Validation } from "../Error/error.js";
import { ModelProducts } from "../Model/mongoDB/Products.js";
import {
  validateNewInfo,
  validateNewProducts,
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
      const { id } = req.params;
      console.log(req.body)
      const resultValidate = validateNewProducts(req.body);

      if(!resultValidate.success){
        throw new Validation("Error de validacion de la nueva informacion",resultValidate.error);
      }

      const resultEdit = await ModelProducts.updateProduct(id,req.body);
      res.status(200).json(resultEdit);
      
    }catch (error) {
      console.log("Error: ",error);
      if(error instanceof Validation){
        res.status(406).json("Error de validacion");
      }
    }
  }

  static deleteProductByID = async(req,res)=>{
    try {
      const { id } = req.params;
      const resultDelete = await ModelProducts.deleteProduct(id);
      res.status(200).json({message:"Producto eliminado",producto:resultDelete});
    } catch (error) {
      if(error instanceof ErrorProducts){
        res.status(406).json("No se encontro el producto");
      }
    }
  }

  static createProduct = async (req, res) => {
    try {
      // Validación inicial
      const resultNewProduct = validateNewProducts(req.body);
      if (!resultNewProduct.success) {
        console.log(req.body)
        throw new Validation("Error de validación del Producto", resultNewProduct.error);
      }
  
      // Si todas las validaciones pasan, crea el producto
      const product = await ModelProducts.createProduct(req.body);
      res.status(201).json(product);
  
    } catch (error) {
      if (error instanceof Validation) {
        res.status(406).json({ message: error.message, errors: error.errors });
      }
      if(error instanceof ErrorQueries){
        res.status(409).json("Error de consulta");
      }
      if (error instanceof ErrorProducts) {
        res.status(406).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Error interno del servidor" });
      }
    }
  };

  static getGender = async (req, res) => {
    try{
      const genders = await ModelProducts.getGenders();
      res.status(201).json(genders);
    }catch(e){
      res.status(406).json("ddwdd"+e);
    }
  }
  
}
