const Joi = require("@hapi/joi");
const errorGenerator  = require("../utils/errors.js");

const solutionSchema = Joi.object().keys({
    answerText: Joi.string()
      .min(10)
      .required()
      .error(
        errorGenerator(
          `Debes ingresar un texto de minimo 10 caracteres para realizar tu respuesta`,
          400
        )
      ),
  });
  
  const editSolutionSchema = solutionSchema;
  
  const voteSolutionSchema = Joi.object().keys({
    score: Joi.number()
      .min(1)
      .max(10)
      .required()
      .error(errorGenerator(`Debe ser entre 1 y 10`, 400)),
  });
  
  module.exports = { solutionSchema, editSolutionSchema, voteSolutionSchema };
  