import z, { object } from "zod";

// Esquema para productos generales
const SchemaProducts = z.object({
  productType: z
    .string()
    .min(5, { message: "Especifica con mayor precisión el tipo de producto" }),
  category: z.string().min(4, {
    message: "Especifica con mayor precisión la categoría del producto",
  }),

  productName: z.string().min(3, {
    message: "Especifica con mayor precisión el nombre del producto",
  }),
  imageUrl: z.array(z.string()),
  purchasePrice: z
    .number({ invalid_type_error: "El precio de compra debe ser un número" })
    .positive({ message: "El precio de compra no es válido" }),
  unitPrice: z
    .number({invalid_type_error:"El precio por unidad debe ser un número"})
    .positive({ message: "El precio por unidad no es válido" }),
  dozenPrice: z
    .number({invalid_type_error:"El precio por docena deber ser un número"})
    .positive({ message: "El precio por docena no es válido" }),
  discount: z
    .number({ invalid_type_error: "El descuento debe ser un número" })
    .positive({ message: "El descuento no es válido" }),
  availableUnits: z
    .number({invalid_type_error:"Las unidades disponibles deben ser un número "})
    .positive({ message: "Las unidades disponibles no son válidas" })
    .int(),
  soldUnits: z
    .number({invalid_type_error:"Las unidades vendidas deben ser un número"})
    .positive({ message: "Las unidades vendidas no son válidas" })
    .int({
      message: "El número de unidades vendidas no puede contener punto decimal",
    })
    .optional(),
  totalInventoryCost: z
    .number({
      invalid_type_error: "El costo total del inventario debe ser un número",
    })
    .positive({
      message: "El costo total del inventario debe ser un valor positivo",
    })
    .optional(),
});

// Esquema para prendas de ropa
const SchemaItemOfClothing = z.object({
  targetGender: z
    .string({ required_error: "Indica el género destinado" })
    .min(4, { message: "Especifica con mayor precisión el género" }),

  clothingType: z
    .string({ required_error: "Indica el tipo de prenda" })
    .min(3, { message: "Especifica con mayor precisión el tipo de prenda" }),

  targetAge: z
    .string({ required_error: "Indica la edad destinada" })
    .min(5, { message: "Especifica con mayor precisión la edad destinada" }),

  size: z.string().optional(),
  minimumAge: z
    .number({ message: "La edad mínima debe ser un número" })
    .int({ message: "La edad mínima no puede tener punto decimal" })
    .positive({ message: "La edad mínima no es válida" })
    .optional(),
  maximumAge: z
    .number({ message: "La edad máxima debe ser un número" })
    .int({ message: "La edad máxima no puede tener punto decimal" })
    .positive({ message: "La edad máxima no es válida" })
    .optional(),
});

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
