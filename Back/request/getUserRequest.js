const {getConnection} = require("../../db/db");


async function getUserRequest (req, res, next) {

    let connection;

    const { id } = req.params;

    try {

      connection = await getConnection();
  
      const [result] = await connection.query(
        `
      SELECT 
        R.id AS 'id', 
        R.title, 
        R.textRequest, 
        R.date, 
        R.status,
        COALESCE(M.name, M.username), 
        M.profileImageUrl, 
        C.id AS 'idCategories',
        COUNT(S.request_Id) AS 'solutions'
        FROM request R
        INNER JOIN makers M ON R.user_id=M.id 
        INNER JOIN categories C ON R.categorie_id=C.id
        LEFT JOIN solutions S ON R.categorie_id=R.id
        WHERE R.user_id=?
        GROUP BY R.id
        ORDER BY R.date DESC;;
        `,
        [id]
      );

      res.send({
        status: "ok",
        data: result,
      });
    } catch (error) {
      next(error);
    } finally {
      if (connection) connection.release();
    }
  }
  
  module.exports = getUserRequest;