const errorGenerator  = require("../utils/errors.js");
const {getConnection} = require("../db/db");

async function solutionExist(req, res, next) {

    let connection;

    try {

      connection = await getConnection();
      const { solutionId } = req.params;
  
      const [currentSolution] = await connection.query(
        `
        SELECT id 
        FROM solutions
        WHERE id=?
  `,
        [solutionId]
      );
  
      if (currentSolution.length === 0) {

        throw errorGenerator(
          `La solución con el id ${solutionId} no existe.`,
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
  
  module.exports = solutionExist;
