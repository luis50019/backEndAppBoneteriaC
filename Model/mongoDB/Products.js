import mongoose, { ObjectId } from 'mongoose';
import movementInventorySchema from '../../Schema/mongoDB/movementInventory.schema.js';
import Product from '../../Schema/mongoDB/product.schema.js';
import categories from '../../Schema/mongoDB/category.schema.js';
import sizeclothings from '../../Schema/mongoDB/sizeClothing.schema.js';
import SummaryInventory from '../../Schema/mongoDB/summaryInventory.schema.js';
import genders from '../../Schema/mongoDB/gender.schema.js';
import { ErrorProducts } from '../../Error/error.js';
import { query } from 'express';

export class ModelProducts{
  static createProduct = async (dataProduct)=>{
    let session;
    try{
      session = await mongoose.startSession();
      session.startTransaction();
      let existProduct = await Product.findOne({productName:dataProduct.productName});

      if(existProduct){
        throw new ErrorProducts("El producto ya existe","foundProduct");
      }

      let category = await categories.findOne({_id:dataProduct.category});

      if (!category) {
        throw new ErrorProducts("La categoria no existe","foundCategory");
      }
      console.log(category)
          
      if(dataProduct.size){
        let size = await sizeclothings.findOne({_id:dataProduct.size,type_product:dataProduct.category});
        if (!size) {
          throw new ErrorProducts("No se encontro la talla de ropa","foundSize");
        } 
      }
      let gender = dataProduct.targetGender ? dataProduct.targetGender : "67c36138e8e9fe0e00b32917";
      let sizeData = dataProduct.size ? dataProduct.size : "67c36178e8e9fe0e00b32919";

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
          intendedGender: gender,
          size: sizeData,
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

      // register the movement of the inventary
      const movement = new movementInventorySchema({
        product: newProduct._id,
        movementType: "entrada",
        quantity: dataProduct.availableUnits,
        dateSale: Date.now()
      });
      await movement.save({session});

      await session.commitTransaction();
      return newProduct;

    }catch(e){
      await session.abortTransaction()
      if(e instanceof ErrorProducts){
        throw new ErrorProducts("El producto ya existe","foundProduct");
      }
    }finally{
      session.endSession();
    }
  }

  static updateProduct = async (idProduct, newInfoProduct)=>{
    try {
      let existProduct = await Product.findOne({productName:newInfoProduct.productName});
      if(existProduct._id != idProduct){
        throw new ErrorProducts("El nombre del producto ya existe","nameproduct alredy exist")
      }
      const productUpdate = await Product.findByIdAndUpdate(idProduct, { $set: { ...newInfoProduct, images: [...newInfoProduct.ImageUrl] } }, { new: true, upsert: true });
      //register the new value of the inventary
      if(existProduct.availableUnits != newInfoProduct.availableUnits){
        const movement = new movementInventorySchema({
          product: productUpdate._id,
          movementType: "entrada",
          quantity: newInfoProduct.availableUnits - existProduct.availableUnits, // value of input in the inventary
          dateSale: Date.now()
        })
        await movement.save();
      }
      
      return productUpdate;
    } catch (error) {
      if(error instanceof ErrorProducts){
        throw new ErrorProducts("El nombre del producto ya existe","nameProducto already existe");
      }
    }
  }

  static findProducts = async(nameProduct)=>{
    try{
      const products = await Product.aggregate([
        {
          $search:{
            index:"product",
            text:{
              query:`*${nameProduct}*`,
              path:"productName",
              fuzzy:{}
            }

          }
        },{
          $lookup:{
            from:"sizeclothings",
            localField:"garment.size",
            foreignField:"_id",
            as:"sizeclothings"
          },
          
        },{
          $lookup:{
            from:"genders",
            localField:"garment.intendedGender",
            foreignField:"_id",
            as:"intendedGender"
          }
        }
        ,{
          $unwind:"$sizeclothings",
          $unwind:"$intendedGender",
        },{
          $project:{
            _id:1,
            productName:1,
            size:"$sizeclothings.size",
            gender:"$intendedGender.gender",
            unitPrice:1,
            discount:1,
            dozenPrice:1,
            availableUnits:1,
            images:1
          }
          
        }
      ]);
      if(!products){
        throw new ErrorProducts("producto no encontrado","producto not found")
      }
      return products;
    }catch(error){
      if(error instanceof ErrorProducts){
        throw new ErrorProducts("producto no encontrado","producto not found")
      }
    }
    
  }

  static deleteProduct = async (idProduct)=>{
    try {
      const product = await Product.findByIdAndDelete(idProduct);
      if(!product){
        throw new ErrorProducts("No se encontro el producto","notFoundProduct");
      }

      //register this movement in the colecction of movementInventary

      const movement = new movementInventorySchema({
        product: idProduct,
        movementType: "eliminado",
        quantity: product.availableUnits,
        dateSale: Date.now()
      });
      await movement.save();

      return product;
    } catch (error) {
      if(error instanceof ErrorProducts){
        throw new ErrorProducts("No se encontro el producto","notFoundProduct");
      }
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
      }).sort({soldUnits:-1}).limit(3).populate('garment.size','size -_id')
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
      }).sort({availableUnits:1}).populate('garment.size','size -_id')
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
        size:1,
        intendedGender:1
      }).populate('garment.size','size').populate('category', 'category').populate('garment.intendedGender','gender').exec();
      return product;
    }catch(e){
      console.log(e)
    }
  }

  static getGenders = async()=>{
    try{
      const allGenders = await genders.find({},{
        gender:1,
        _id:1,
      }).exec();
      return allGenders;
    }catch(e){
      console.log(e)
    }

  }


}

