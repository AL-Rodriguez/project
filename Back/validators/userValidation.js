const Joi = require('joi');

const  errorGenerator  = require("../utils/errors");

const newUserSchema = Joi.object().keys({
  
    username: Joi.string()
      .min(4)
      .required()
      .error(
        errorGenerator(
          `You must enter a username that has a minimum of 4 characters`,
          400
        )
      ),
    email: Joi.string()
      .email()
      .required()
      .error(errorGenerator(`You must enter a valid email`, 400)),
    password: Joi.string()
      .min(8)
      .required()
      .error(
        errorGenerator(`You must enter a password that has a minimum of 8 characters`, 400)
      ),
  });


  const editUserSchema = Joi.object().keys({
    name: Joi.string()
    .min(3)
    .max(20)
    .error(errorGenerator(`Your name must have a maximum of 20 characters and a minimum of 3`, 400)),
    lastName: Joi.string()
    .min(3)
    .max(20)
    .error(errorGenerator(`Your lastName must have a maximum of 20 characters and a minimum of 3`, 400)),
    newUsername: Joi.string()
    .min(4)
    .max(20)
    .error(
      errorGenerator(`You must enter a username that has a minimum of 4 characters`, 400)
    ),
    aboutMe: Joi.string()
    .min(3)
    .max(250)
    .error(
      errorGenerator(`Your biography can have a maximum of 250 characters`, 400)
    ),

    newEmail: Joi.string()
    .email()
    .error(errorGenerator(`You must enter a valid email`, 400)),
  avatar: Joi.any(),
  });

  const editPasswordSchema = Joi.object().keys({
    currentPassword: Joi.string()
      .min(8)
      .required()
      .error(
        errorGenerator(
          `You must enter a password that has a minimum of 8 characters`,
          400
        )
      ),
     
    newPassword: Joi.string()
      .min(8)
      .invalid(Joi.ref("currentPassword"))
      .min(8)
      .required()
      .error(
        errorGenerator(
          `You must enter a password that has a minimum of 8 characters`,
          400
        )
      ),
  });
  
  const recoverPasswordSchema = Joi.object().keys({
    email: Joi.string()
      .email()
      .required()
      .error(errorGenerator(`You must enter a valid email`, 400)),
  });

module.exports = {newUserSchema,editUserSchema,editPasswordSchema,editPasswordSchema,recoverPasswordSchema};