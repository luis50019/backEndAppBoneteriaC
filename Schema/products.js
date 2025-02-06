import z, { object } from "zod";

// Esquema para productos generales

const SchemaProducts = z.object({
  category: z.string(),
  productName: z.string().min(3, {
    message: "Especifica con mayor precisión el nombre del producto",
  }),
  ImageUrl: z.array(
    z.string().url({ message: "Cada imagen debe ser un enlace válido" })
  ),
  purchasePrice: z
    .number({ invalid_type_error: "El precio de compra debe ser un número" })
    .positive({ message: "El precio de compra no es válido" }),
  unitPrice: z
    .number({invalid_type_error:"El precio por unidad debe ser un número"})
    .positive({ message: "El precio por unidad no es válido" }),
  dozenPrice: z
    .number({invalid_type_error:"El precio por docena deber ser un número"}).positive(),
  discount: z
    .number({ invalid_type_error: "El descuento debe ser un número" })
    .positive({ message: "El descuento no es válido" }),
  availableUnits: z
    .number({invalid_type_error:"Las unidades disponibles deben ser un número "})
    .positive({ message: "Las unidades disponibles no son válidas" })
    .int(),
  totalInventoryCost: z
    .number({
      invalid_type_error: "El costo total del inventario debe ser un número",
    })
    .positive({
      message: "El costo total del inventario debe ser un valor positivo",
    })
    .optional(),
  isSecondHand: z.boolean().optional(),
  size: z.string().optional(),
}).passthrough();

const SchemaEditProduct = z.object({
  "field": z.string().min(2),
  "value": z.number().min(0)
})


// Esquema para otros productos (llaveros, etc.)
const SchemaOtherProducts = z.object({
  material: z
    .string({invalid_type_error:"debe de ser un string"})
    .min(5, { message: "Especifica con mayor precisión con el material" }),
    description: z.string().optional(),
});

// Función de validación para productos
export const validateNewProducts = (object) => {
  return SchemaProducts.safeParse(object);
};

// Función de validación para prendas de ropa
export const validateItemOfClothing = (object) => {
  return SchemaItemOfClothing.safeParse(object)
};

// Función de validación para otros productos
export const validateOtherProducts = (object) => {
  return SchemaOtherProducts.safeParse(object);
};

export const validateNewInfo = (object)=>{
  return SchemaEditProduct.safeParse(object);
}

// {
//   "productType": "Ropa interior",
//   "category": "ropa",
//   "esSegundaMano":false,
//   "productName": "Playera Deportiva",
//   "imageUrl": "https://example.com/playera.jpg",
//   "purchasePrice": 150.5,
//   "unitPrice": 200.0,
//   "dozenPrice": 2200.0,
//   "discount": 10.0,
//   "availableUnits": 100,
//   "unitsSold": 25,
//   "totalInventoryCost": 15050.0,
//   "targetGender":"M",
//   "clothingType":"Blusa",
//   "targetAge":"infantil",
//   "size":"CH",
//   "minimumAge":-5,
//   "maximumAge":-10
// }

/*
ImageUrl: z
  .array(
    z.string().url({ message: "Cada imagen debe ser un enlace válido" })
  )

*/



