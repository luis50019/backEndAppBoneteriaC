import mongoose, { ObjectId } from 'mongoose';

import Product from '../../Schema/mongoDB/product.schema.js';
import categories from '../../Schema/mongoDB/category.schema.js';
import sizeclothings from '../../Schema/mongoDB/sizeClothing.schema.js';
import SummaryInventory from '../../Schema/mongoDB/summaryInventory.schema.js';
import { ErrorProducts } from '../../Error/error.js';

export class ModelProducts{
  static createProduct = async (dataProduct)=>{
    let session;
    try{
      session = await mongoose.startSession();
      session.startTransaction();
      let category = await categories.findOne({_id:dataProduct.category});

      if (!category) {
        throw new ErrorProducts("La categoria no existe","foundCategory");
      }
          
      let size = await sizeclothings.findOne({_id:dataProduct.size,type_product:dataProduct.category});
      
      if (!size) {
        throw new ErrorProducts("No se encontro la talla de ropa","foundSize");
      }

      const product = new Product({
        isSecondHand: dataProduct.isSecondHand,
        category: category._id,
        productName: dataProduct.productName,
        purchasePrice:dataProduct.purchasePrice,
        unitPrice: dataProduct.unitPrice,
        dozenPrice:dataProduct.dozenPrice,
        discount: dataProduct.discount,
        availableUnits: dataProduct.availableUnits,
        soldUnits: 0,
        images: [...dataProduct.ImageUrl],
        garment: {
          intendedGender: dataProduct.targetGender,
          size: size._id,
        }
      });
      const newProduct = await product.save({session});
      await Product.findByIdAndUpdate(product._id, 
        { $set: { 'inventoryCost': (dataProduct.purchasePrice * dataProduct.availableUnits) } },
        { new: true, upsert: true,session }
      );
      // register the new value of the inventary
      const inventary = await SummaryInventory.findOne();

      let newInventary = null
      if(!inventary){
        newInventary = new SummaryInventory({
          totalInventory: parseInt(dataProduct.availableUnits),
          totalInventoryValue: parseFloat(dataProduct.purchasePrice * dataProduct.availableUnits),
          totalProfit: 0,
          lastFecha: Date.now()
        });
        await newInventary.save({session});
      }else{
        inventary.totalInventory += dataProduct.availableUnits;
        inventary.totalInventoryValue += dataProduct.purchasePrice * dataProduct.availableUnits;
        inventary.lastFecha = Date.now();
        await inventary.save({session});
      }
      await session.commitTransaction();
      return newProduct;

    }catch(e){
      await session.abortTransaction()
      console.log("Error: ",e)
    }finally{
      session.endSession();
    }
  }
  //methode for get all size and all category of the date base for return in the requeste of the front

  static getAllCategories = async()=>{
    try {
      const allCategory = await categories.find({}).exec();
      return allCategory;
    } catch (error) {
      console.log("Error al obtener las categorias"+error);
    }
  }
  static getAllSizeByCategories = async(idCategory)=>{
    try {
      const id = new mongoose.Types.ObjectId(idCategory);
      const allSizeCategory = await sizeclothings.find({type_product:id},{size:1, _id:1}).exec();
      console.log(allSizeCategory)
      return allSizeCategory;
    } catch (error) {
      console.log("Error al obtener los size: ",error)
    }
  };

  static getAllProducts = async()=>{
    try{
      const products = await Product.find({},{
        images:1,
        productName:1,
        soldUnits:1,
        incomeGenerated:1,
        profitsGenerated:1,
        availableUnits:1
      }).populate('garment.size','size -_id')
      .exec();

      return products
    }catch(e){
      console.log(e)
    }
  }

  static getTopProducts = async()=>{
    try{
      const topProducts = await Product.find({},{
        images:1,
        productName:1,
        soldUnits:1,
        incomeGenerated:1,
        profitsGenerated:1,
        availableUnits:1,
        sizeclothings:1,
      }).sort({soldUnits:-1}).limit(2).populate('garment.size','size -_id')
      .exec();

      return topProducts;
    }catch(e){
      console.log(e);
    }
  }

  static getProductsAboutToEnd = async()=>{
    try{
      const products = await Product.find({availableUnits:{$lte:5}},{
        images:1,
        productName:1,
        soldUnits:1,
        incomeGenerated:1,
        profitsGenerated:1,
        availableUnits:1
      }).populate('sizeclothings','size -_id')
      .exec();

      return products
    }catch(e){
      console.log(e)
    }
  }

  static getProductsById = async(idProduct)=>{
    try{
      
      const product = await Product.find({_id:idProduct},{
        productName:1,
        category:1,
        images:1,
        productName:1,
        soldUnits:1,
        purchasePrice:1,
        dozenPrice:1,
        incomeGenerated:1,
        profitsGenerated:1,
        unitPrice:1,
        availableUnits:1,
        discount:1,
        size:1
      }).populate('garment.size','size -_id').populate('category', 'category').exec();
      return product;
    }catch(e){
      console.log(e)
    }
  }


}


//const products = await Product.find()
//     .populate('category','category -_id') 
//      .populate('typeProduct','typeProduct -_id') 
//      .populate('garment.typeClothing','typeclothing -_id') 
//      .populate('garment.desiredAge','desiredAge minimumAge maximumAge -_id') 
//      
//      .populate('otherProduct.material','material -_id')
//      .exec();
