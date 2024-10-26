export class Validation extends Error {
  constructor(message, errors) {
    super(message);
    this.name = "ValidationError";
    this.errors = errors;
    this.stack = "";
  }

  errorsValidation() {
    return this.errors.map((element) => element.message);
  }
}
//Error for the insert productos

export class ErrorProducts extends Error{
  constructor(message,nameError){
    super(message)
    this.name = nameError
  }

}

export class ErrorQueries extends Error{
  constructor(message,nameError){
    super(message)
    this.name = nameError
  }
}
export class ErrorSales extends Error {
  constructor(message, nameError) {
    super(message);
    this.name = nameError;
  }
}
//Erro of conection

export class ErrorConnection extends Error{
  constructor(message,nameError){
    super(message)
    this.name = nameError;
  }
}

//error of sales