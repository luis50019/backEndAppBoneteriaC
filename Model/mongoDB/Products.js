import mongoose from 'mongoose';

import Product from '../../Schema/mongoDB/product.schema.js';
import Category from '../../Schema/mongoDB/category.schema.js';
import TypeProduct from '../../Schema/mongoDB/typeProduct.schema.js';
import TypeClothing from '../../Schema/mongoDB/typeClothing.schema.js';
import DesiredAge from '../../Schema/mongoDB/desiredAge.schema.js';
import SizeClothing from '../../Schema/mongoDB/sizeClothing.schema.js';
import { encryptData } from './utils/encrypData.js';

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

      
      let typeClothing = await TypeClothing.findOne({typeClothing:dataProduct.clothingType});
      if (!typeClothing) {
        typeClothing = await new TypeClothing({ typeclothing: dataProduct.clothingType }).save({session});
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
        purchasePrice: encryptData(dataProduct.purchasePrice),
        unitPrice: encryptData(dataProduct.unitPrice),
        dozenPrice: encryptData(dataProduct.dozenPrice),
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
      await session.commitTransaction();
      return newProduct;

    }catch(e){
      await session.abortTransaction()
      console.log("Error: ",e)
    }finally{
      session.endSession();
    }
  }

  static getAll = async()=>{
    try{
      const data = await Product.find();
      return data;  
    }catch(e){
      console.log(e)
    }
  }


}

