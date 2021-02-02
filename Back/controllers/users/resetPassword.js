const bcrypt = require('bcrypt');

const errorGenerator  = require("../../utils/errors.js");
const {getConnection} = require("../../db/db");
const { resetPasswordSchema } = require("../../validators/userValidation");

async function resetPassword(req, res, next) {

  let connection;

  try {
      
    await resetPasswordSchema.validateAsync(req.body);

    connection = await getConnection();

    const { recoverCode, newPassword } = req.body;

    const [currentUser] = await connection.query(
      `
       SELECT id, password
       FROM makers
       WHERE passwordCode=?`,
      [recoverCode]
    );

    if (currentUser.length === 0) {
      throw errorGenerator(
        `Código no valido`
      );
    }
    const newPasswordBcrypt = await bcrypt.hash(newPassword, 10);

    await connection.query(
      `
    UPDATE makers
    SET password=?, passwordCode=NULL, lastAuthDate=UTC_TIMESTAMP, updateDate=UTC_TIMESTAMP
    WHERE id=?
    `,
      [newPasswordBcrypt, currentUser[0].id]
    );

    res.send({
      status: "ok",
      message: "Se ha cambiado tu contraseña",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = resetPassword;