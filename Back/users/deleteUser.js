const {getConnection} = require("../../db/db");
const errorGenerator  = require("../../utils/errors.js");

async function deleteUser(req, res, next) {
    let connection;

    try {

      connection = await getConnection();
  
      const { id } = req.params;

      const idGhostUser= 2;
  
      //Busco el id en la bbdd para verficar que si existe
      const [currentUser] = await connection.query(
        `
        SELECT id, role
        FROM makers
        WHERE id=?        
        `,
        [id]
      );
  
    if (currentUser.length === 0) {
        throw errorGenerator(`No existe el usuario`, 400);
      }
  
  
    if (currentUser[0].id === 2 || currentUser[0].id === 1) {
        throw errorGenerator(`Admin`, 403);
      }

    let sendMessaje;


    await connection.query(
          `
          DELETE FROM rating
          WHERE user_id=?`,
          [id]
        );
  
    await connection.query(
          `
        UPDATE request
        SET user_id=?
        WHERE user_id=?
        `,
          [idGhostUser, id]
        );

    await connection.query(
          `
        DELETE FROM makers
        WHERE id=?
        `,
          [id]
        );
  
    sendMessaje = `El usuario con el id ${id} ha sido eliminado.`;
      res.send({
        status: "ok",
        message: sendMessaje,
      });
    } catch (error) {
      next(error);
    } finally {
      if (connection) connection.release();
    }
  }
  
  module.exports = deleteUser;
