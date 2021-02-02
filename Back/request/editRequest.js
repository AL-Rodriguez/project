
const {getConnection} = require("../../db/db");
const {editRequestSchema} = require("../../validators/requestValidation");
const errorGenerator  = require("../../utils/errors.js");
///Falta imagen
async function editQuestion(req, res, next) {

    let connection;

    try {

      await editRequestSchema.validateAsync(req.body);
  
      connection = await getConnection();

      const { id } = req.params;

      const { title, textRequest } = req.body;

      const [currentRequest] = await connection.query(
        `SELECT 
          R.id,
          R.title,
          R.textRequest,
          R.date,
          R.user_id,
          M.username,
          M.profileImageUrl,
          R.categorie_id,
          C.categorie
      FROM request R
      INNER JOIN makers M ON R.user_id = M.id 
      INNER JOIN categories C ON R.categorie_id = C.id
      WHERE R.id=?`,
        [id]
      );
        console.log(currentRequest)
      if (
        currentRequest[0].user_id !== req.auth.id &&
        req.auth.role !== "admin"
      ) {
        throw errorGenerator(`No tienes permisos`, 403);
      } else {

        await connection.query(
          `
        UPDATE request
        SET title=?, textRequest=?, updateDate=UTC_TIMESTAMP
        WHERE id=?
        `,
          [title, textRequest, id]
        );
  
        res.send({
          status: "ok",
          message: `Has editado la petición ${id}`,
        });
      }
    } catch (error) {
      next(error);
    } finally {
      if (connection) connection.release();
    }
  }
  
  module.exports = editQuestion;