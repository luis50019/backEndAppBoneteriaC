

import cors from 'cors'

const ACCEPTED_ORIGINS = ["https://inventario-boneteria.onrender.com","https://inventario-boneteria.onrender.com/","https://inventario-boneteria-2lq5q3tgl-luis-projects-7fa9a5dd.vercel.app","http://192.168.1.75:5173","http://localhost:5173"];

export const corsMiddleware =({accepted_origins = ACCEPTED_ORIGINS} ={})=>{
  return cors({
    origin: (origin,callback)=>{
        if(accepted_origins.includes(origin)){
          return callback(null,true);
        }

        if(!origin){
          return callback(null,true);
        }
        return callback(new Error("Not allowed by cors"));
    }
  })
}


