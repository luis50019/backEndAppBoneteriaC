import mongoose from 'mongoose';

import Product from '../../Schema/mongoDB/product.schema.js';
import Category from '../../Schema/mongoDB/category.schema.js';
import TypeProduct from '../../Schema/mongoDB/typeProduct.schema.js';
import TypeClothing from '../../Schema/mongoDB/typeClothing.schema.js';
import DesiredAge from '../../Schema/mongoDB/desiredAge.schema.js';
import SizeClothing from '../../Schema/mongoDB/sizeClothing.schema.js';
import SummaryInventory from '../../Schema/mongoDB/summaryInventory.schema.js';
import { encryptData,decryptData } from './utils/encrypData.js';

export class ModelProducts{
  static createProduct = async (dataProduct)=>{
    let session;
    try{
      session = await mongoose.startSession();
      session.startTransaction();
      let category = await Category.findOne({category:dataProduct.category});

      if (!category) {
        category = await new Category({ category: dataProduct.category }).save({session});
      }

      let typeProduct = await TypeProduct.findOne({typeProduct:dataProduct.productType});

      if (!typeProduct) {
        typeProduct = await new TypeProduct({ typeProduct: dataProduct.productType }).save({session});
      }
      
      let typeClothing = await TypeClothing.findOne({typeclothing:dataProduct.clothingType})

      if(!typeClothing){
        typeClothing = await new TypeClothing({typeclothing:dataProduct.clothingType}).save({session});
      }
      
      let desiredAge = await DesiredAge.findOne({
        desiredAge:dataProduct.targetAge,
        minimuAge:dataProduct.minimumAge,
        maximumAge:dataProduct.maximumAge
      });

      if (!desiredAge) {
        desiredAge = await new DesiredAge({
          desiredAge:dataProduct.targetAge,
          minimuAge:dataProduct.minimumAge,
          maximumAge:dataProduct.maximumAge
        }).save({session});
      }

      let size = await SizeClothing.findOne({size:dataProduct.size});
      
      if (!size) {
        size = await new SizeClothing({ size: dataProduct.size }).save({session});
      }

      const product = new Product({
        isSecondHand: dataProduct.isSecondHand,
        category: category._id,
        typeProduct: typeProduct._id,
        productName: dataProduct.productName,
        purchasePrice:dataProduct.purchasePrice,
        unitPrice: dataProduct.unitPrice,
        dozenPrice:dataProduct.dozenPrice,
        discount: dataProduct.discount,
        availableUnits: dataProduct.availableUnits,
        soldUnits: dataProduct.soldUnits,
        images: [...dataProduct.imageUrl],
        garment: {
          intendedGender: dataProduct.targetGender,
          typeClothing: typeClothing._id,
          desiredAge: desiredAge._id,
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
        availableUnits:1
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
      }).populate('garment.size','size -_id')
      .exec();

      return products
    }catch(e){
      console.log(e)
    }
  }

  static getProductById = async (id)=>{
    try{
      const productFind = await Product.findById(id).populate('category','category -_id') 
          .populate('typeProduct','typeProduct -_id') 
          .populate('garment.typeClothing','typeclothing -_id') 
          .populate('garment.desiredAge','desiredAge minimumAge maximumAge -_id') 
          .populate('garment.size','size -_id')
          .populate('otherProduct.material','material -_id')
          .exec();
      return productFind;
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
