import cors from 'cors';

const ACCEPTED_ORIGINS = [
  "https://inventario-boneteria.onrender.com",
  "https://inventario-boneteria-2lq5q3tgl-luis-projects-7fa9a5dd.vercel.app",
  "https://192.168.1.75:5173",
  "http://192.168.1.75:5173",
  "https://localhost:5173",
  "http://localhost:5173"
];

export const corsMiddleware = ({ accepted_origins = ACCEPTED_ORIGINS } = {}) => {
  return cors({
    origin: (origin, callback) => {
      // Permitir solicitudes sin origen (útil para herramientas como Postman)
      if (!origin) {
        return callback(null, true);
      }

      // Verificar si el origen está permitido
      if (accepted_origins.includes(origin)) {
        return callback(null, true);
      }

      // Si el origen no está permitido, rechazar la solicitud
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'],  // Encabezados permitidos
  });
};



