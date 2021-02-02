const errorGenerator  = require("../../utils/errors.js");
const {getConnection} = require("../../db/db");
const randomCodeString =require("../../utils/randomCodeString.js");
const {sendConfirmationMail} = require("../../utils/sendmail.js")
const { recoverPasswordSchema } = require("../../validators/userValidation");

async function recoverPassword(req, res, next) {

  let connection;

  try {
    await recoverPasswordSchema.validateAsync(req.body);

    connection = await getConnection();

    const { email } = req.body;

    const [currentUser] = await connection.query(
      `
       SELECT email
       FROM makers
       WHERE email=?`,
      [email]
    );

    if (currentUser.length === 0) {
      throw errorGenerator(`El usuario no existe`, 400);
    }

    const passwordCode = randomCodeString(40);

    await connection.query(
      `
      UPDATE makers
      SET passwordCode=?
      WHERE email=?      
      `,
      [passwordCode, email]
    );

    sendConfirmationMail(email, `http://${process.env.PUBLIC_DOMAIN}/user/validate/${passwordCode}`)

    res.send({
      status: "ok",
      message: "Hemos enviado el codigo a tu email.",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = recoverPassword;