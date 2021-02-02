const jwt = require('jsonwebtoken');
const {getConnection} = require("../db/db");
const errorGenerator  = require("../utils/errors.js");

async function isAuthenticated(req, res, next) {
    let connection;

    try {

      connection = await getConnection();
  
      const { authorization } = req.headers;
  
      if (!authorization) {
        throw errorGenerator(`Falta el codigo de autorizacion`, 401);
      }
  
      let decodedToken;

      try {
        decodedToken = jwt.verify(authorization, process.env.SECRET);
      } catch (error) {
        throw errorGenerator(`El token no es valido`, 401);
      }
  

      const [result] = await connection.query(
        `
      SELECT lastAuthDate
      FROM makers
      WHERE id=?
      `,
        [decodedToken.id]
      );
  
      if (result.length === 0) {
        throw errorGenerator(`EL usuario no existe en la base de datos`, 401);
      }
  

      const tokenCreationDate = new Date(decodedToken.iat * 1000);
      const userLastAuthUpdate = new Date(result[0].last_auth_date);
  
      if (userLastAuthUpdate > tokenCreationDate) {
        throw errorGenerator(
          `EL token ya no es valido. Haz login nuevamente`,
          401
        );
      }
  

      req.auth = decodedToken;
  
      next();
    } catch (error) {
      next(error);
    } finally {
      if (connection) connection.release();
    }
  }


  async function isAdmin(req, res, next) {
    if (!req.auth || !req.auth.isAdmin) {
      res.status(403).send()
      return
  }

  next();
  }

module.exports = {isAuthenticated,isAdmin};