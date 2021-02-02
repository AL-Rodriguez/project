const Joi = require("@hapi/joi");
const errorGenerator  = require("../utils/errors.js");

const newCategorieSchema = Joi.object().keys({
    categorie: Joi.string()
    .required()
    .error(errorGenerator(`Nombre obligatorio`, 400)),

  description: Joi.string()
    .min(25)
    .max(200)
    .required()
    .error(
      errorGenerator(
        `La descripcion es obligatoria, entre 25 y 200 caracteres`,
        400
      )
    ),
});

const editCategorieSchema = Joi.object().keys({
    categorie: Joi.string()

    .error(errorGenerator(`Nombre obligatorio`, 400)),

    description: Joi.string()
    .min(25)
    .max(200)
    .error(
      errorGenerator(
        `La descripcion es obligatoria, entre 25 y 200 caracteres`,
        400
      )
    ),
});

module.exports = { newCategorieSchema, editCategorieSchema };