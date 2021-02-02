const Joi = require("@hapi/joi");
const errorGenerator  = require("../utils/errors.js");

const requestSchema = Joi.object().keys({
  title: Joi.string()
    .min(10)
    .max(200)
    .required()
    .error(
      errorGenerator(`Debes ingresar un titulo minimo 10 caracteres`, 400)
    ),
    textRequest: Joi.string()
    .required()
    .min(25)
    .error(
      errorGenerator(
        `Debes ingresar un texto de minimo 25 caracteres para realizar la petición`,
        400
      )
    ),
  categorie: Joi.string()
    .required()
    .error(errorGenerator(`Debes escoger una categoria`, 400)),
});

const editRequestSchema = Joi.object().keys({
  title: Joi.string()
    .min(10)
    .max(200)
    .error(
      errorGenerator(
        `Debes ingresar un titulo minimo 10 caracteres`,
        400
      )
    ),
    textRequest: Joi.string()
    .min(25)
    .error(
      errorGenerator(
        `Debes ingresar un texto de minimo 25 caracteres para realizar la petición`,
        400
      )
    ),
});

const filterRequestSchema = Joi.object().keys({
  name: Joi.any(),
  search: Joi.any(),
  status: Joi.string()
    .valid("true", "false", "")
    .error(
      errorGenerator(
        `Debes ingresar "true" para ver peticiones sin respuesta`,
        400
      )
    ),
});

module.exports = {
  requestSchema,
  editRequestSchema,
  filterRequestSchema,
};