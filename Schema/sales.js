import z from "zod";

const schemaTypeSales = z.object({
  "typeSale": z.string().min(6),
  "total":z.number().positive()
})

const schemaArrayProducts = z.array(
  z.object({
    "pieceQuantity": z.number().min(0).optional(),
    "quantityDozens": z.number().min(0).optional(),
    "productId": z.string(),
    //"total": z.number().positive(),
    //"unitPrice": z.number().positive().min(1),
    //"dozenPrice": z.number().positive().min(1),
    //"discount": z.number().positive(),
    //"purchasePrice": z.number().positive(),
  })
)

export const validateSaleHeader = (object)=>{
  return schemaTypeSales.safeParse(object);
}

export const validateProductsSale = object =>{
  return schemaArrayProducts.safeParse(object);
}
