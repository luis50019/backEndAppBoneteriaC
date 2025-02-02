//validar que  en la base de datos no se agreguen valores repetidos
// eliminar el documento de tipo de producto
//eliminar el desiredage
//modificar lo siguiente:
  pasar el valor de talla_description en el documento de size
  y colocarlo en el documento de desiredAge
  y en el documento size
  solo debe de aparecer:
    talla
    al tipo de prenda al que te pertenece
    al desiredAge al que pertenece
    


//ventas
{
  "id":"dc0de2cf-8b38-11ef-bd88-809133f30242",
  "field":"unidad",
  "value":15
}

{
 "typeSale":"Oficial",
 "total":11809,
 "date":"2024-10-03",
 "products":[
    {
      "pieceQuantity":2,
      "quantityDozens":0,
      "productId":"676a89ee77920b315ab17756"
    },
    {
      "pieceQuantity":2,
      "quantityDozens":2,
      "productId":"676a89fb77920b315ab17762"
    },
    {
      "pieceQuantity":10,
      "quantityDozens":0,
      "productId":"676a8a0577920b315ab1776e"
    }
   ]
}
//productos

{
  "productType": "Ropa interior",
  "category": "otros",
  "isSecondHand":false,
  "productName": "llaveros",
  "imageUrl": ["https://example.com/llavero.jpg","https://example.com/llavero-2.jpg"],
  "purchasePrice": 150.5,
  "unitPrice": 200.0,
  "dozenPrice": 2200.0,
  "discount": 10.0,
  "availableUnits": 100,
  "soldUnits": 25,
  "totalInventoryCost": 15050.0,
  "material": "plastico",
  "descriptionProduct": "Es un producto"
}
2800

//objetos de prueba: 
//primer objeto
{
  "isSecondHand": false,
  --"category": "ropa",
  "productName": "Falda corta de verano",
  "imageUrl": ["https://example.com/falda-larga.jpg","https://example.com/falda-larga-2.jpg"],
  "purchasePrice": 100.0,
  "unitPrice": 300.0,
  "dozenPrice": 3000.0,
  "discount": 1.0,
  --"availableUnits": 30,
  "targetGender": "femenino",
  "clothingType": "falda",
  "targetAge": "adulto joven",
  "size": "S",
  "minimumAge": 15,
  "maximumAge": 20
}

{
  "productType": "sudadera",
  "isSecondHand": false,
  "category": "ropa",
  "productName": "Sudadera con capucha",
  "imageUrl": ["https://example.com/sudadera-capucha.jpg","https://example.com/sudadera-capucha-2.jpg"],
  "purchasePrice": 200.0,
  "unitPrice": 400.0,
  "dozenPrice": 4800.0,
  "discount": 15.0,
  "availableUnits": 75,
  "soldUnits": 20,
  "totalInventoryCost": 15000.0,
  "targetGender": "unisex",
  "clothingType": "sudadera",
  "targetAge": "adulto",
  "size": "L",
  "minimumAge": 20,
  "maximumAge": 25
}
//segundo objeto
{
  "productType": "falda",
  "isSecondHand": false,
  "category": "ropa",
  "productName": "Falda larga de verano",
  "imageUrl": ["https://example.com/falda-larga.jpg","https://example.com/falda-larga-2.jpg"],
  "purchasePrice": 100.0,
  "unitPrice": 250.0,
  "dozenPrice": 2700.0,
  "discount": 5.0,
  "availableUnits": 40,
  "soldUnits": 10,
  "totalInventoryCost": 4000.0,
  "targetGender": "femenino",
  "clothingType": "falda",
  "targetAge": "adulto joven",
  "size": "S",
  "minimumAge": 15,
  "maximumAge": 20
}
//tercer objeto
{
  "productType": "camisa",
  "esSegundaMano": true,
  "category": "ropa",
  "productName": "Camisa de mezclilla",
  "imageUrl": "https://example.com/camisa-mezclilla.jpg",
  "purchasePrice": 80.0,
  "unitPrice": 150.0,
  "dozenPrice": null,
  "discount": null,
  "availableUnits": 60,
  "soldUnits": null,
  "totalInventoryCost": null,
  "targetGender": "masculino",
  "clothingType": "camisa",
  "targetAge": "",
  "size": "",
  "minimumAge": null,
  "maximumAge": null
}
//cuarto objeto
{
    "productType":"pantalones cortos",
    "esSegundaMano":false,
    "category":"ropa",
    "productName":"Pantalones cortos de algodón",
    "imageUrl":"https://example.com/pantalones-cortos.jpg",
    "purchasePrice":120.0,
    "unitPrice":220.0,
    "dozenPrice":2400.0,
    "discount":8.0,
    "availableUnits":30,
    "soldUnits":15,
    "totalInventoryCost":3600.0,
    "targetGender":"femenino",
    "clothingType":"pantalones cortos",
    "targetAge":"joven adulto",
    "size":"M",
    "minimumAge":16,
    "maximumAge":30
}
//quinto objeto

{
   "productType":"chaqueta de cuero",
   "esSegundaMano":true,
   "category":"ropa",
   "productName":"Chaqueta de cuero vintage",
   "imageUrl":"https://example.com/chaqueta-cuero.jpg",
   "purchasePrice":300.0,
   "unitPrice":600.0,
   "dozenPrice":null,
   "discount":20.0,
   "availableUnits":20,
   "soldUnits":5,
   "totalInventoryCost":6000.0,
   "targetGender":"masculino",
   "clothingType":"chaqueta",
   "targetAge":"adulto maduro",
   "size":"L",
   "minimumAge":"","maximumAge":""
}