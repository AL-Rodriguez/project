const {getConnection} = require("../../db/db");
const errorGenerator  = require("../../utils/errors.js");

async function deleteRequest(req, res, next) {

    let connection;

    try {

      connection = await getConnection();
      const { id } = req.params;
  
      const [currentRequest] = await connection.query(
        `
        SELECT id,
        status,
        user_id
        FROM request
        WHERE id=?
        `,
        [id]
      );
  
      if (
        currentRequest[0].id_user !== req.auth.id &&
        req.auth.role !== "admin"
      ) {
        throw errorGenerator(`No tienes permisos`, 403);
      }
  
      if (currentRequest.length === 0) {

        throw errorGenerator(
          `La pregunta no existe`,
          400
        );
      } else if (currentRequest[0].status === 1 && req.auth.role === "admin" ) {

        const [currentSolution] = await connection.query(
          `
          SELECT id
          FROM solutions
          WHERE request_id =?
          `,
          [id]
        );
  
        for (const solution of currentSolution) {

          await connection.query(
            `
              DELETE FROM rating
              WHERE solution_id=?
              `,
            [solution.id]
          );

          await connection.query(
            `
            DELETE FROM solutions
            WHERE id=?`,
            [solution.id]
          );
        }
      }else if(currentRequest[0].status === 1 && req.auth.role !== "admin" ) {
        throw errorGenerator(`No puedes borrarla, hay respuestas asociadas`, 403);
      }

      await connection.query(
        `
        DELETE FROM request
        WHERE id=?
        `,
        [id]
      );
  
      res.send({
        status: "ok",
        message: `Has borrado la pregunta ${id}`,
      });
    } catch (error) {
      next(error);
    } finally {
      if (connection) connection.release();
    }
  }
  
  module.exports = deleteRequest;