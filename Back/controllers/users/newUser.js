const bcrypt = require('bcrypt');

const errorGenerator  = require("../../utils/errors.js");
const {getConnection} = require("../../db/db");
const randomCodeString =require("../../utils/randomCodeString.js");
const {sendConfirmationMail} = require("../../utils/sendmail.js");
const {newUserSchema} = require("../../validators/userValidation");

async function newUser(req, res, next) {


    let connection;

    try {

      const value = await newUserSchema.validateAsync(req.body);

      connection = await getConnection();

      const { username, email, password } = req.body;


      
  
      const [validEmail] = await connection.query(
        `
          SELECT id, username
          FROM makers
          WHERE email=?        
        `,
        [email]
      );

        console.log(validEmail, email)

      if (validEmail.length > 0) {

        throw errorGenerator(
          `Ya existe un usuario con este email, por favor ingresa un email distinto`,
          409
        );
      }
  
      const [validUsername] = await connection.query(
        `
          SELECT id 
          FROM makers
          WHERE username=?        
        `,
        [username]
      );
  
      if (validUsername.length > 0) {
        throw errorGenerator(
          `El nombre de usuario ya existe, por favor prueba uno distinto`,
          409
        );
      }

      const passwordBcrypt = await bcrypt.hash(password, 10);

      const validationCode = randomCodeString(40);

      sendConfirmationMail(email, `http://${process.env.PUBLIC_DOMAIN}/user/validate/${validationCode}`)
  
      const profileImageUrl = "profileImageUrl.png";
  
      await connection.query(

        `
        INSERT INTO makers(email, password , username, validationCode, role, profileImageUrl, updateDate, creationDate)
        VALUES(?,?,?,?, 'user',?, UTC_TIMESTAMP,UTC_TIMESTAMP)`,
        [email, passwordBcrypt, username, validationCode, profileImageUrl]
      );
  
      res.send({
        status: "ok",
        message: `Usuario registrado. Confirma tu email para activar tu cuenta.`,
      });

    } catch (error) {
      next(error);
    } finally {
      if (connection) connection.release();
    }
  }

  const validate = async (req, res) => {

    let connection;

    try {

    connection = await getConnection();

    const { code } = req.params;

    const [result] = await connection.query(
      `
        SELECT email
        FROM makers
        WHERE validationCode=?
      `,
      [code]
    );

    if (result.length === 0) {
      throw errorGenerator(`No hay código de registro`, 404);
    }

    await connection.query(
      `
      UPDATE makers
      SET active=1, validationCode=NULL
      WHERE validationCode=?
      `,
      [code]
    );
    
    res.status(401).send('Usuario validado')

    } catch(e) {
        res.status(401).send('Usuario no validado')
    }

} 
  
  module.exports = {newUser,validate};
