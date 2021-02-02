const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const errorGenerator  = require("../../utils/errors.js");
const {getConnection} = require("../../db/db");
const {newUserSchema} = require("../../validators/userValidation");

async function loginUser(req, res, next) {

    let connection;

    try {

      await newUserSchema.validateAsync(req.body);

      connection = await getConnection();
  
      const { email, password } = req.body;
  
      const [loginUser] = await connection.query(
        `
        SELECT id, email, role, active, password
        FROM makers
        WHERE email=?       
        `,
        [email]
      );
  
      if (loginUser.length === 0) {
        throw errorGenerator(
          `Email o password incorrectos, por favor verifica tus datos`,
          401
        );
      } else if (!loginUser[0].active) {
        throw errorGenerator(
          `EL usuario esta registrado pero no activado. Verifica tu email y activa tu cuenta`,
          401
        );
      }
      const userPassword = loginUser[0].password

      const passwordIsvalid = await bcrypt.compare(password, userPassword);

    if (!passwordIsvalid) {
        res.status(401).send()
        return
    }

    const tokenPayload = {
        id: loginUser[0].id,
        isAdmin: loginUser[0].role === 'admin',
        role: loginUser[0].role,
        email: loginUser[0].email
    }

    const token = jwt.sign(tokenPayload, process.env.SECRET, {
        expiresIn: '1d'
    });

    res.json({
        token
      });
      
    } catch (error) {
      next(error);
    } finally {
      if (connection) connection.release();
    }
  }
  
  module.exports = loginUser;