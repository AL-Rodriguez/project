const errorGenerator  = require("../utils/errors.js");
const {getConnection} = require("../db/db");

async function requestExist(req, res, next) {

    let connection;

    try {

      connection = await getConnection();
      const { requestId } = req.params;
  
      const [currentRequest] = await connection.query(
        `
        SELECT id, status 
        FROM request
        WHERE id=?
  `,
        [requestId]
      );
  
      if (currentRequest.length === 0) {

        throw errorGenerator(
          `La petición con el id ${requestId} no existe.`,
          404
        );
      } else {
        next();
      }
    } catch (error) {
      next(error);
    } finally {
      if (connection) connection.release();
    }
  }
  
  module.exports = requestExist;