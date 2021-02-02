const {getConnection} = require("../../db/db");
const errorGenerator  = require("../../utils/errors.js");

async function getSingleRequest(req, res, next) {

  let connection;

  try {
      
    connection = await getConnection();

    const { id } = req.params;
    

    const [result] = await connection.query(

      `
        SELECT 
          R.title, 
          R.textRequest, 
          R.date, 
          R.status,
          R.categorie_id
          FROM request R
          WHERE R.id=?
          ORDER BY R.date DESC;
      `,
      [id]
    );

    if (result.length === 0) {
      throw errorGenerator(
        `No existe`,
        404
      );
    }


    if (result[0].status === 1) {

      const [solutions] = await connection.query(
        `
      SELECT COUNT(id) AS 'count'
      FROM solutions
      WHERE request_id=?
      `,
      [id]
      );
      result[0].solutions = solutions[0].count;
    } else {
      result[0].solutions = 0;
    }

    res.send({
      status: "ok",
      data: result[0],
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getSingleRequest;