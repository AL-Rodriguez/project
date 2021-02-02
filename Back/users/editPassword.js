const bcrypt = require('bcrypt');

const errorGenerator  = require("../../utils/errors.js");
const {getConnection} = require("../../db/db");
const { editPasswordSchema } = require("../../validators/userValidation");

async function editPassword(req, res, next) {

  let connection;
  console.log(req.body)

  try {
    await editPasswordSchema.validateAsync(req.body);

    connection = await getConnection();

    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (req.auth.id !== Number(id)) {
      throw errorGenerator(
        `No tienes permisos para cambiar la contraseña`,
        403
      );
    }

    if (currentPassword === newPassword) {
      throw errorGenerator(
        `Debe entrar una password distinta`,
        400
      );
    }

    const [currentUser] = await connection.query(
      `
      SELECT id, password 
      FROM makers
      WHERE id=?
        
      `,
      [id]
    );


    const passwordIsvalid = await bcrypt.compare(currentPassword, currentUser[0].password);

    if (!passwordIsvalid) {
      res.status(401).send()
      return
  }

    const newPasswordBcrypt = await bcrypt.hash(newPassword, 10);

    await connection.query(
      `
    UPDATE makers
    SET password=?, updateDate=UTC_TIMESTAMP, lastAuthDate= UTC_TIMESTAMP
    WHERE id=?
      `,
      [newPasswordBcrypt, id]
    );

    res.send({
      status: "ok",
      data: "Has actualizado tu nueva contaseña",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = editPassword;