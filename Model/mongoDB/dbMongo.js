import mongoose from 'mongoose';

export const connectDB = async()=>{
  try {
    await mongoose.connect("mongodb+srv://teddiazdiaz019:GUlaz0ozhsm4Ih7S@cluster0.tmn1r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log(">>>> DB is connect")
  } catch (error) {
    console.log(error)
  }
}


