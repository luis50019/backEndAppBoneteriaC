mongodb+srv://teddiazdiaz019:*****@inventarioboneteria.jiy1g.mongodb.net/inventario

[]crear server
[] crear router de productos
[] crear schema de productos
[] crear 

// peticiones
-> estadisticas
-> total del inventario y ganancia total

//modificaciones mas avanzadas
[] Crear nuestros propios errores
-- Cambiar el delimitador para crear los triggers
DELIMITER $$

-- Trigger para calcular la ganancia antes de insertar
CREATE TRIGGER calculate_ganancia_before_insert
BEFORE INSERT ON Productos
FOR EACH ROW
BEGIN
  -- Asegurarse de que unidades_vendidas no sea NULL y calcular la ganancia
  SET NEW.unidades_vendidas = IFNULL(NEW.unidades_vendidas, 0);
  SET NEW.ganancia = ((NEW.precio_pieza * (1 - NEW.descuento / 100)) - NEW.precio_compra) * NEW.unidades_vendidas;
END$$

-- Trigger para recalcular la ganancia antes de actualizar
CREATE TRIGGER calculate_ganancia_before_update
BEFORE UPDATE ON Productos
FOR EACH ROW
BEGIN
  -- Asegurarse de que unidades_vendidas no sea NULL y recalcular la ganancia
  SET NEW.unidades_vendidas = IFNULL(NEW.unidades_vendidas, 0);
  SET NEW.ganancia = ((NEW.precio_pieza * (1 - NEW.descuento / 100)) - NEW.precio_compra) * NEW.unidades_vendidas;
END$$

-- Trigger para calcular el costo total del inventario antes de insertar
CREATE TRIGGER update_costo_total_inventario
BEFORE INSERT ON Productos
FOR EACH ROW
BEGIN
  -- Asegurarse de que precio_compra y unidades_disponibles no sean NULL
  SET NEW.precio_compra = IFNULL(NEW.precio_compra, 0);
  SET NEW.unidades_disponibles = IFNULL(NEW.unidades_disponibles, 0);
  SET NEW.costo_total_inventario = NEW.precio_compra * NEW.unidades_disponibles;
END$$

-- Trigger para recalcular el costo total del inventario antes de actualizar
CREATE TRIGGER update_costo_total_inventario_on_update
BEFORE UPDATE ON Productos
FOR EACH ROW
BEGIN
  -- Asegurarse de que precio_compra y unidades_disponibles no sean NULL
  SET NEW.precio_compra = IFNULL(NEW.precio_compra, 0);
  SET NEW.unidades_disponibles = IFNULL(NEW.unidades_disponibles, 0);
  SET NEW.costo_total_inventario = NEW.precio_compra * NEW.unidades_disponibles;
END$$

-- Volver al delimitador por defecto
DELIMITER ;

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
  "productType": "falda",
  "isSecondHand": false,
  "category": "ropa",
  "productName": "Falda corta de verano",
  "imageUrl": ["https://example.com/falda-larga.jpg","https://example.com/falda-larga-2.jpg"],
  "purchasePrice": 100.0,
  "unitPrice": 300.0,
  "dozenPrice": 3000.0,
  "discount": 1.0,
  "availableUnits": 30,
  "soldUnits": 10,
  "totalInventoryCost": 3000.0,
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