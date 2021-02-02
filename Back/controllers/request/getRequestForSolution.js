const {getConnection} = require("../../db/db");

async function getRequestForSolution(req, res, next) {

  let connection;

  try {

    connection = await getConnection();

    const categorie = req.params

    const [result] = await connection.query(

      ` SELECT 
        R.id,
        R.title,
        R.textRequest,
        R.date,
        C.categorie
    FROM request R
    INNER JOIN categories C ON R.categorie_id = C.id
    WHERE status = false
    AND C.id =?
    ORDER BY R.date DESC;
    `,
      [categorie.categorie]
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

module.exports = getRequestForSolution;